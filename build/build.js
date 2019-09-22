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
class Matrix {
    static fromValues(v) {
        let m = new Matrix(v.length, v[0].length);
        m.values = v;
        return m;
    }
    constructor(rows, columns) {
        this.r = rows;
        this.c = columns;
        this.values = [];
        for (let i = 0; i < rows; i++) {
            this.values[i] = [];
        }
    }
    get size() {
        return { rows: this.r, columns: this.c };
    }
    get rows() {
        return this.r;
    }
    get columns() {
        return this.c;
    }
    scale(n) {
        let res = [];
        for (let i = 0; i < this.r; i++) {
            res[i] = [];
            for (let j = 0; j < this.c; j++) {
                res[i][j] = this.values[i][j] * n;
            }
        }
        return Matrix.fromValues(res);
    }
    add(other) {
        let res = [];
        for (let i = 0; i < this.r; i++) {
            res[i] = [];
            for (let j = 0; j < this.c; j++) {
                res[i][j] = this.values[i][j] + other.values[i][j];
            }
        }
        return Matrix.fromValues(res);
    }
    multiply(other) {
        let res = [];
        for (let i = 0; i < this.r; i++) {
            res[i] = [];
            for (let j = 0; j < other.c; j++) {
                res[i][j] = 0;
                for (let k = 0; k < this.c; k++) {
                    res[i][j] += this.values[i][k] * other.values[k][j];
                }
            }
        }
        return Matrix.fromValues(res);
    }
}
class Neuron {
    constructor(size, weightFn) {
        this.learningRate = 0.001;
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
const matrix = (p) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        let m = new Matrix(3, 3);
        console.log("m size:", m.size);
        console.log("m values:", m.values);
        let v = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ];
        let m1 = Matrix.fromValues(v);
        console.log("m1");
        console.log(m1.size);
        console.table(m1.values);
        let s = m1.scale(10);
        console.log("scaled ...");
        console.log(s.size);
        console.table(s.values);
        let sum = m1.add(s);
        console.log("sum ...");
        console.log(sum.size);
        console.table(sum.values);
        const v3x2 = [
            [1, 3],
            [2, 2],
            [3, 1],
        ];
        const v2x2 = [
            [1, 0],
            [0, 1],
        ];
        let m3x2 = Matrix.fromValues(v3x2);
        let m2x3 = Matrix.fromValues(v2x2);
        let prod = m3x2.multiply(m2x3);
        console.log("product ...");
        console.log(prod.size);
        console.table(prod.values);
    };
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = () => {
    };
};
new p5(matrix);
//# sourceMappingURL=build.js.map