
function randomInRange(min : number, max : number) {
  return Math.random() * (max - min + 1) + min
}

class Neuron {
  weights : number[]
  learningRate = 0.1

  constructor(size : number) {
    this.weights = Array.from({length: size}, () => randomInRange(-1, 1))
  }


  activation(input: number) {
    return input >= 0  ? 1 : -1 ;
  }

  guess(inputs : number[] ): number {
    let sum = inputs.map( (x, idx) => this.weights[idx] * x )
              .reduce( (a, x) => a + x)
    return this.activation(sum)
  }

  train(inputs : number[], target : number) {
    let guess = this.guess(inputs);
    let err = target - guess;
    console.log("input", inputs, " got:", guess, "target:", target)
    this.weights = this.weights.map( w => w * err )

  }
}

type Cord = { x : number, y : number, label: number }

class Points {
  size : number
  cords : Cord[]
  labels : number[]

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

      ellipse(c.x, c.y, 8, 8)
    })
  }
}

let points: Points;
let neuron: Neuron;
function setup() {
  createCanvas(800, 800)
  neuron = new Neuron(2)

  points = new Points(10)
  for (let i = 0, len = 10; i < len; i++) {
    let c = points.at(i)
    neuron.train([c.x, c.y], c.label)
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(80);
  stroke(0)
  line(0,0, width, height)
  points.draw()
}


// // const s = ( sketch : any ) => {
//
//   let x = 100;
//   let y = 100;
//   let morph: Morph;
//
//   sketch.setup = () => {
//     console.log("window width:", sketch.windowWidth);
//     sketch.createCanvas(sketch.windowWidth, 200);
//     morph = new Morph();
//     morph.setup();
//
//   };
//
//   sketch.draw = () => {
//     sketch.background(0);
//     sketch.fill(255);
//     sketch.rect(x,y,50,50);
//     morph.draw();
//   };
// };
//
// let myp5 = new p5(s, document.getElementById("d1"));
//
// // let myp52 = new p5(s, "d2");
//
