
const linearSeperable = (p : p5) => {

  let neuron: Neuron;
  let size = 150
  let training : Points;
  let testSet: Points;
  const toScreen = (x : number, y :number) => mapToScreen(p, x, y);

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)

    training = new Points(size * 8, p)
    training.training = true

    testSet = new Points(size, p)
    neuron = new Neuron(3, () => p.random(-1, 1));
  }

  p.windowResized = () => {
    p.resizeCanvas(windowWidth, windowHeight);
  }

  let idx = 0
  p.draw = () => {
    p.background(30);
    drawAxis()
    //training.draw()

    drawActualDivider()
    drawGuessLine()
    testSet.draw()

    let allCorrect = true
    for (let i = 0; i < size; i++) {
      let c = testSet.at(i)
      let got = neuron.guess([c.x, c.y, c.bias])
      let correct = got == c.label
      allCorrect  =  allCorrect && correct;
      testSet.markGuess(i, correct)
    }

    if ( idx == 0 && !allCorrect) {
      trainNext(10)
    }

    idx = (idx +1) % 5;
  }

  p.mousePressed = () => {
    testSet.randomize()
    training.randomize()
  }

  let trainIndex = 0;
  function trainNext(n : number) {
    let end = p.min(trainIndex + n, training.size)

    console.log("training ", n)
    for (let i = trainIndex; i < end; i++) {
      let c = training.at(i)
      //training.highlight(i)
      console.log(" ... training ", i)
      neuron.train([c.x, c.y, c.bias], c.label)
    }
    trainIndex = end == training.size ? 0 : end
  }

  function drawAxis() {
    // | line

    let yTop = toScreen(0,-1)
    let yBottom = toScreen(0,1)

    // --- line
    let xLeft = toScreen(-1,0)
    let xRight = toScreen(1,0)

    p.stroke(120,120,140)
    p.strokeWeight(1)
    p.line(yTop.x, yTop.y, yBottom.x, yBottom.y)
    p.line(xLeft.x, xLeft.y, xRight.x, xRight.y)
  }

  function drawAxisWithoutMapping() {
    // easy way of drawing axis
    p.stroke(100,100,180)
    p.strokeWeight(2)
    p.line(width/2, 0, width/2, height)
    p.line(0, height/2, width, height/2)
  }

  function drawGuessLine() {

    // ax + by + c = 0 is the line that neuron is building
    // thus a = w0, b = w1, c = w2
    // so y = -w0/w1 x - w2/w1 :: mx + b
    let w = neuron.weights;

    let m = -w[0]/w[1];
    let b = -w[2]/w[1];
    let f = (x : number) => m * x + b;

    let p1 = toScreen(-1, f(-1));
    let p2 = toScreen(1, f(1));

    p.stroke(104,184,240)
    p.line(p1.x, p1.y, p2.x, p2.y)
    //console.log("guess: m: ", m, "b: ", b)
  }

  function drawActualDivider() {

    let p1 = toScreen(-1, yForX(-1));
    let p2 = toScreen(1, yForX(1));
    p.stroke(204,244,0)
    p.line(p1.x, p1.y, p2.x, p2.y)
  }

}

let x = new p5(linearSeperable)
