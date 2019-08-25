class Morph {
    setup() {
        this.shapes = [];
        this.currentShape = 0;
        this.shapes.push({ points: Shapes.circle(100), color: color('#009CDF') });
        this.shapes.push({ points: Shapes.circle(150), color: color(255, 204, 0) });
        this.shapes.push({ points: Shapes.square(50), color: color(175, 100, 220) });
        this.morph = new Array();
        let highestCount = 0;
        for (var i = 0; i < this.shapes.length; i++) {
            highestCount = Math.max(highestCount, this.shapes[i].points.length);
        }
        for (var i = 0; i < highestCount; i++) {
            this.morph.push(new p5.Vector());
        }
    }
    recalc() {
        var totalDistance = 0;
        const points = this.shapes[this.currentShape].points;
        for (var i = 0; i < points.length; i++) {
            var v1 = points[i];
            var v2 = this.morph[i];
            v2.lerp(v1, 0.1);
            totalDistance += p5.Vector.dist(v1, v2);
        }
        if (totalDistance < 0.1) {
            this.currentShape++;
            if (this.currentShape >= this.shapes.length) {
                this.currentShape = 0;
            }
        }
    }
    draw() {
        this.recalc();
        const color = this.shapes[this.currentShape].color;
        const points = this.shapes[this.currentShape].points;
        translate(width / 2, height / 2);
        strokeWeight(4);
        beginShape();
        noFill();
        stroke(color);
        for (var i = 0; i < points.length; i++) {
            var v = this.morph[i];
            vertex(v.x, v.y);
        }
        endShape(CLOSE);
    }
}
class Neuron {
    constructor(size, weightFn) {
        this.learningRate = 0.01;
        this.weights = Array.from({ length: size }, weightFn);
    }
    activation(input) {
        return input >= 0 ? 1 : -1;
    }
    guess(inputs) {
        let sum = inputs.map((x, idx) => this.weights[idx] * x)
            .reduce((a, x) => a + x);
        return this.activation(sum);
    }
    train(inputs, target) {
        let guess = this.guess(inputs);
        let err = target - guess;
        this.weights = this.weights.map((w, idx) => w + inputs[idx] * err * this.learningRate);
    }
}
function yForX(x) {
    return 0.35 * x + -0.2;
}
function mapToScreen(p, x, y) {
    return {
        x: p.map(x, -1, 1, 0, p.width),
        y: p.map(y, -1, 1, p.height, 0),
    };
}
class Points {
    constructor(size, p) {
        this.p = p;
        this.size = size;
        this.randomize();
    }
    labelFor(x, y) {
        return y >= yForX(x) ? 1 : -1;
    }
    randomize() {
        this.cords = Array.from({ length: this.size }, () => {
            let x = this.p.random(-1, 1);
            let y = this.p.random(-1, 1);
            let label = this.labelFor(x, y);
            let bias = 1.0;
            return { x, y, bias, label };
        });
    }
    at(i) {
        return this.cords[i];
    }
    fill(label) {
        if (this.training) {
            if (label == 1) {
                this.p.fill(40, 40, 45);
            }
            else {
                this.p.fill(35, 35, 38);
            }
            return;
        }
        if (label == 1) {
            this.p.fill(200, 220, 255);
        }
        else {
            this.p.fill(100, 100, 187);
        }
    }
    draw() {
        this.p.stroke(0);
        this.cords.forEach(c => {
            this.fill(c.label);
            let p = mapToScreen(this.p, c.x, c.y);
            this.p.ellipse(p.x, p.y, 12, 12);
        });
    }
    highlight(i) {
        let c = this.cords[i];
        this.p.fill(200, 250, 220);
        let p = mapToScreen(this.p, c.x, c.y);
        this.p.ellipse(p.x, p.y, 18, 18);
    }
    markGuess(i, correct) {
        if (correct) {
            this.p.fill(0, 244, 122);
        }
        else {
            this.p.fill(244, 0, 0);
        }
        this.p.noStroke();
        let c = this.cords[i];
        let p = mapToScreen(this.p, c.x, c.y);
        this.p.ellipse(p.x, p.y, 5, 5);
    }
}
class Shapes {
    static circle(size) {
        const points = new Array();
        for (var angle = 0; angle < 360; angle += 9) {
            var v = p5.Vector.fromAngle(radians(angle - 135));
            v.mult(size);
            points.push(v);
        }
        return points;
    }
    static square(size) {
        const points = new Array();
        for (var x = -size; x < size; x += 10) {
            points.push(createVector(x, -size));
        }
        for (var y = -size; y < size; y += 10) {
            points.push(createVector(size, y));
        }
        for (var x = size; x > -size; x -= 10) {
            points.push(createVector(x, size));
        }
        for (var y = size; y > -size; y -= 10) {
            points.push(createVector(-size, y));
        }
        return points;
    }
    static star(x, y, radius1, radius2, npoints) {
        var angle = TWO_PI / npoints;
        var halfAngle = angle / 2.0;
        const points = new Array();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * radius2;
            var sy = y + sin(a) * radius2;
            points.push(createVector(sx, sy));
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            points.push(createVector(sx, sy));
        }
        return points;
    }
}
const linearSeperable = (p) => {
    let neuron;
    let size = 150;
    let training;
    let testSet;
    const toScreen = (x, y) => mapToScreen(p, x, y);
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        training = new Points(size * 8, p);
        training.training = true;
        testSet = new Points(size, p);
        neuron = new Neuron(3, () => p.random(-1, 1));
    };
    p.windowResized = () => {
        p.resizeCanvas(windowWidth, windowHeight);
    };
    let idx = 0;
    p.draw = () => {
        p.background(30);
        drawAxis();
        drawActualDivider();
        drawGuessLine();
        testSet.draw();
        let allCorrect = true;
        for (let i = 0; i < size; i++) {
            let c = testSet.at(i);
            let got = neuron.guess([c.x, c.y, c.bias]);
            let correct = got == c.label;
            allCorrect = allCorrect && correct;
            testSet.markGuess(i, correct);
        }
        if (idx == 0 && !allCorrect) {
            trainNext(10);
        }
        idx = (idx + 1) % 5;
    };
    p.mousePressed = () => {
        testSet.randomize();
        training.randomize();
    };
    let trainIndex = 0;
    function trainNext(n) {
        let end = p.min(trainIndex + n, training.size);
        console.log("training ", n);
        for (let i = trainIndex; i < end; i++) {
            let c = training.at(i);
            console.log(" ... training ", i);
            neuron.train([c.x, c.y, c.bias], c.label);
        }
        trainIndex = end == training.size ? 0 : end;
    }
    function drawAxis() {
        let yTop = toScreen(0, -1);
        let yBottom = toScreen(0, 1);
        let xLeft = toScreen(-1, 0);
        let xRight = toScreen(1, 0);
        p.stroke(120, 120, 140);
        p.strokeWeight(1);
        p.line(yTop.x, yTop.y, yBottom.x, yBottom.y);
        p.line(xLeft.x, xLeft.y, xRight.x, xRight.y);
    }
    function drawAxisWithoutMapping() {
        p.stroke(100, 100, 180);
        p.strokeWeight(2);
        p.line(width / 2, 0, width / 2, height);
        p.line(0, height / 2, width, height / 2);
    }
    function drawGuessLine() {
        let w = neuron.weights;
        let m = -w[0] / w[1];
        let b = -w[2] / w[1];
        let f = (x) => m * x + b;
        let p1 = toScreen(-1, f(-1));
        let p2 = toScreen(1, f(1));
        p.stroke(104, 184, 240);
        p.line(p1.x, p1.y, p2.x, p2.y);
    }
    function drawActualDivider() {
        let p1 = toScreen(-1, yForX(-1));
        let p2 = toScreen(1, yForX(1));
        p.stroke(204, 244, 0);
        p.line(p1.x, p1.y, p2.x, p2.y);
    }
};
let x = new p5(linearSeperable);
//# sourceMappingURL=build.js.map