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
class Plotter {
    constructor(p) {
        this.p = p;
    }
    set points(pts) {
        this.pts = pts;
    }
    set guess(fn) {
        this.guessFn = fn;
    }
    set guessLine(fn) {
        this.guessLineFn = fn;
    }
    draw() {
        this.p.background(17, 17, 17);
        this.drawAxis();
        this.drawLineOfSeparation();
        this.drawGuessLine();
        this.plotPoints();
        this.plotGuesses();
    }
    drawLineOfSeparation() {
        let left = this.toScreen({ x: -1, y: yForX(-1) });
        let right = this.toScreen({ x: 1, y: yForX(1) });
        this.p.stroke(104, 144, 0);
        this.p.strokeWeight(2);
        this.p.line(left.x, left.y, right.x, right.y);
    }
    drawGuessLine() {
        const line = this.guessLineFn();
        let left = this.toScreen({ x: -1, y: -line.slope + line.yIntercept });
        let right = this.toScreen({ x: 1, y: line.slope + line.yIntercept });
        this.p.stroke(204, 244, 0);
        this.p.strokeWeight(2);
        this.p.line(left.x, left.y, right.x, right.y);
    }
    drawAxis() {
        let yTop = this.toScreen({ x: 0, y: -1 });
        let yBottom = this.toScreen({ x: 0, y: 1 });
        let xLeft = this.toScreen({ x: -1, y: 0 });
        let xRight = this.toScreen({ x: 1, y: 0 });
        this.p.stroke(120, 120, 140);
        this.p.strokeWeight(1);
        this.p.line(yTop.x, yTop.y, yBottom.x, yBottom.y);
        this.p.line(xLeft.x, xLeft.y, xRight.x, xRight.y);
    }
    plotPoints() {
        this.pts.forEach(pt => this.plot(pt));
    }
    plot(pt) {
        const cords = this.toScreen(pt.cords);
        this.p.stroke(0);
        this.fill(pt.label);
        this.p.ellipse(cords.x, cords.y, 20, 20);
    }
    get wrongGuessCount() {
        return this.wrongGuesses;
    }
    plotGuesses() {
        this.wrongGuesses = 0;
        this.pts.forEach(pt => this.plotGuess(pt));
    }
    plotGuess(pt) {
        const guess = this.guessFn(pt.raw);
        const correct = guess == pt.label;
        if (!correct) {
            this.wrongGuesses += 1;
            return;
        }
        this.p.strokeWeight(0);
        this.fillRightGuess(pt.label);
        const scr = this.toScreen(pt.cords);
        this.p.ellipse(scr.x, scr.y, 16, 16);
    }
    fill(label) {
        if (label == 1) {
            this.p.fill(244, 185, 7);
        }
        else {
            this.p.fill(25, 118, 222);
        }
    }
    fillRightGuess(label) {
        if (label == 1) {
            this.p.fill(184, 145, 7);
        }
        else {
            this.p.fill(5, 58, 162);
        }
    }
    toScreen(c) {
        const x = this.p.map(c.x, -1, 1, 0, this.p.width);
        const y = this.p.map(c.y, -1, 1, this.p.height, 0);
        return { x, y };
    }
}
function labelFor(x, y) {
    return y > yForX(x) ? 1 : -1;
}
class xPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get raw() {
        return [this.x, this.y];
    }
    get cords() {
        return {
            x: this.x,
            y: this.y,
        };
    }
    get label() {
        return labelFor(this.x, this.y);
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
function utils(p) {
    const generateRandomPoints = (n) => {
        let points = [];
        for (let i = 0; i < n; i++) {
            points.push(new xPoint(p.random(-1, 1), p.random(-1, 1)));
        }
        return points;
    };
    return { generateRandomPoints, random: p.random };
}
const perceptron = (p) => {
    const util = utils(p);
    let graph;
    let pts = util.generateRandomPoints(100);
    let neuron;
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        graph = new Plotter(p);
        neuron = new xNeuron(3, (_) => p.random(-1, 1));
        graph.guess = (input) => neuron.guess(input);
        graph.guessLine = () => neuron.lineOfSeparation;
    };
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = () => {
        graph.points = pts;
        graph.draw();
        if (graph.wrongGuessCount > 0) {
            const train = util.generateRandomPoints(10);
            train.forEach(pt => neuron.train(pt.raw, pt.label));
        }
    };
    p.mousePressed = () => {
        pts = util.generateRandomPoints(100);
    };
};
const p = new p5(perceptron);
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
        training.draw();
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
            training.highlight(i);
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
class xNeuron {
    constructor(size, weightFn) {
        this.LR = 0.001;
        this.weights = Array.from({ length: size }, weightFn);
    }
    activation(res) {
        return res > 0 ? 1 : -1;
    }
    guess(inputs) {
        let res = [...inputs, 1.0]
            .map((x, i) => this.weights[i] * x)
            .reduce((a, x) => a + x);
        return this.activation(res);
    }
    train(inputs, expected) {
        const err = expected - this.guess(inputs);
        const adj = [...inputs, 1.0];
        this.weights = this.weights.map((w, i) => w + adj[i] * err * this.LR);
        console.log(this.weights);
    }
    get lineOfSeparation() {
        const [a, b, c] = [...this.weights];
        const slope = -a / b;
        const yIntercept = -c / b;
        return { slope, yIntercept };
    }
}
//# sourceMappingURL=build.js.map