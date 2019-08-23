
class Neuron {
  size : number
  weights : number[]
  learningRate = 0.01

  constructor(size : number) {
    this.size = size;
    this.weights = Array.from({length: size}, () => random(-1, 1))
  }

  activation(input: number) {
    return input >= 0 ? 1 : -1 ;
  }

  guess(inputs : number[] ): number {
    let sum = inputs.map( (x, idx) => this.weights[idx] * x )
              .reduce( (a, x) => a + x)
    return this.activation(sum)
  }

  train(inputs : number[], target : number) {
    let guess = this.guess(inputs);
    let err = target - guess;

    //console.log("input", inputs, " got:", guess, "target:", target, this.weights)
    this.weights = this.weights.map((w, idx) => w + inputs[idx] * err * this.learningRate )
    //console.log("weights: ", this.weights)

  }
}

function yPoint(x) {
  return 0.75 * x + 8
}
type Cord = { x : number, y : number, label: number }

class Points {
  size : number
  cords : Cord[]

  constructor(size : number) {
    this.size = size;
    this.randomize()
  }

  labelFor(x : number, y : number) : number {
    //return y >= yPoint(x) ? 1 : -1
    return y >= x ? 1 : -1
  }

  randomize() {
    this.cords = Array.from({length: this.size}, () => {
      let x = random(-1, 1)
      let y = random(-1, 1)
      let label = this.labelFor(x, y)
      return {x, y, label}
    })


  }

  at(i : number) {
    return this.cords[i]
  }

  draw() {
    stroke(0)
    this.cords.forEach(c => {
      if (c.label == 1 ) {
        fill(255)
      } else {
        fill(0)
      }

      let px = map(c.x, -1, 1, 0, width)
      let py = map(c.y, -1, 1, height, 0)

      ellipse(px, py, 10, 10)
    })
  }

  markGuess(i : number, correct :  boolean) {
    if (correct) {
      fill(0, 244, 0)
    } else {
      fill(244, 0, 0)
    }

    noStroke()
    let c = this.cords[i]

    let px = map(c.x, -1, 1, 0, width)
    let py = map(c.y, -1, 1, height, 0)

    ellipse(px, py, 5, 5)
  }
}

let points: Points;
let neuron: Neuron;
let size = 80
let training : Points;

function setup() {
  createCanvas(windowWidth, windowHeight)
  neuron = new Neuron(2)
  training = new Points(size * 2)
  points = new Points(size)
}

let trainIndex = 0;
function trainNext(n : number) {
  let end = min(trainIndex + n, training.size)

  console.log("training ", n)
  for (let i = trainIndex; i < end; i++) {
    let c = training.at(i)
    console.log(" ... training ", i)
    neuron.train([c.x, c.y], c.label)
  }
  trainIndex = end == training.size ? 0 : end
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(80);
  stroke(0)
  line(0, height, width, 0)
  points.draw()

  for (let i = 0; i < size; i++) {
    let c = points.at(i)
    let got = neuron.guess([c.x, c.y])
    let correct = got == c.label
    points.markGuess(i, got == c.label)
    if (!correct) {
      trainNext(15)
      neuron.train([c.x, c.y], c.label)
    }
  }
}

function mousePressed() {
  points.randomize()
}
