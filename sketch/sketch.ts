let neuron: Neuron;
let size = 150
let training : Points;
let testSet: Points;

function setup() {
  createCanvas(windowWidth, windowHeight)

  training = new Points(size * 8)
  training.training = true

  testSet = new Points(size)
  neuron = new Neuron(3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let idx = 0
function draw() {
  background(30);
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

function mousePressed() {
  testSet.randomize()
  training.randomize()
}

let trainIndex = 0;
function trainNext(n : number) {
  let end = min(trainIndex + n, training.size)

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
  let yTop = mapToScreen(0,-1)
  let yBottom = mapToScreen(0,1)

  // --- line
  let xLeft = mapToScreen(-1,0)
  let xRight = mapToScreen(1,0)

  stroke(120,120,140)
  strokeWeight(1)
  line(yTop.x, yTop.y, yBottom.x, yBottom.y)
  line(xLeft.x, xLeft.y, xRight.x, xRight.y)
}

function drawAxisWithoutMapping() {
  // easy way of drawing axis
  stroke(100,100,180)
  strokeWeight(2)
  line(width/2, 0, width/2, height)
  line(0, height/2, width, height/2)
}

function drawGuessLine() {
  stroke(104,184,240)

  // ax + by + c = 0 is the line that neuron is building
  // thus a = w0, b = w1, c = w2
  // so y = -w0/w1 x - w2/w1
  let w = neuron.weights;

  let m = -w[0]/w[1];
  let b = -w[2]/w[1];
  let f = (x : number) => m * x + b;

  let p1 = mapToScreen(-1, f(-1));
  let p2 = mapToScreen(1, f(1));
  line(p1.x, p1.y, p2.x, p2.y)
  //console.log("guess: m: ", m, "b: ", b)
}

function drawActualDivider() {
  stroke(204,244,0)

  let p1 = mapToScreen(-1, yForX(-1));
  let p2 = mapToScreen(1, yForX(1));
  line(p1.x, p1.y, p2.x, p2.y)
}

