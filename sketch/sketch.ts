
function randomInRange(min : number, max : number) {
  return Math.random() * (max - min + 1) + min
}

class Neuron {
  weights : number[]
  learningRate = 0.01

  constructor(size : number) {
    this.weights = Array.from({length: size}, () => randomInRange(-1, 1))
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

    console.log("input", inputs, " got:", guess, "target:", target, this.weights)
    this.weights = this.weights.map((w, idx) => w + inputs[idx] * err * this.learningRate )
    console.log("weights: ", this.weights)

  }
}

type Cord = { x : number, y : number, label: number }

class Points {
  size : number
  cords : Cord[]

  constructor(size : number) {
    this.size = size;
    this.randomize()
  }

  randomize() {
    this.cords = Array.from({length: this.size}, () => {
      let x = Math.random() * width
      let y = Math.random() * height
      let label = x >= y ? 1 : -1

      return {x, y, label}
    })


  }

  at(i : number) {
    return  this.cords[i]
  }

  draw() {
    stroke(0)
    this.cords.forEach(c => {
      if (c.label == 1 ) {
        fill(255)
      } else {
        fill(0)
      }

      ellipse(c.x, c.y, 10, 10)
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
    ellipse(c.x, c.y, 5, 5)

  }
}

let points: Points;
let neuron: Neuron;
let size = 80

function setup() {
  createCanvas(800, 800)
  neuron = new Neuron(2)

  points = new Points(size)
  for (let i = 0; i < size; i++) {
    let c = points.at(i)
    neuron.train([c.x, c.y], c.label)
  }
  size *=2
  points = new Points(size)

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(80);
  stroke(0)
  line(0,0, width, height)
  points.draw()

  for (let i = 0; i < size; i++) {
    let c = points.at(i)
    let got = neuron.guess([c.x, c.y])
    points.markGuess(i, got == c.label)
  }
}

