function yForX(x : number) {
  return 0.35 * x + -0.2
}

function mapToScreen(p: p5, x : number , y  : number) {
  //console.log("  mapping: ", x, y)
  return {
    x : p.map(x, -1, 1, 0, p.width),
    y : p.map(y, -1, 1, p.height, 0),
  }
}


type Point = { x : number, y : number, bias: number, label: number }

class Points {
  size : number
  cords : Point[]
  training: boolean
  p : any

  constructor(size : number, p : p5) {
    this.p = p
    this.size = size;
    this.randomize()
  }

  labelFor(x : number, y : number) : number {
    return y >= yForX(x) ? 1 : -1
  }

  randomize() {
    this.cords = Array.from({length: this.size}, () => {
      let x = this.p.random(-1, 1)
      let y = this.p.random(-1, 1)
      let label = this.labelFor(x, y)
      // bias is always 1.0 and its weight needs to be learned
      let bias = 1.0
      return {x, y, bias, label}
    })


  }

  at(i : number) {
    return this.cords[i]
  }

  fill(label : number) {
    if (this.training) {
      if (label == 1) {
        this.p.fill(40, 40, 45)
      } else {
        this.p.fill(35, 35, 38)
      }
      return
    }

    if (label == 1) {
      this.p.fill(200, 220, 255)
    } else {
      this.p.fill(100, 100, 187)
    }
  }

  draw() {
    this.p.stroke(0)

    this.cords.forEach(c => {
      this.fill(c.label)

      let p = mapToScreen(this.p, c.x, c.y)
      this.p.ellipse(p.x, p.y, 12, 12)
    })
  }

  highlight(i : number) {
    let c  = this.cords[i]
    this.p.fill(200, 250, 220)
    let p = mapToScreen(this.p, c.x, c.y)
    this.p.ellipse(p.x, p.y, 18, 18)

  }

  markGuess(i : number, correct :  boolean) {
    if (correct) {
      this.p.fill(0, 244, 122)
    } else {
      this.p.fill(244, 0, 0)
    }

    this.p.noStroke()
    let c = this.cords[i]
    let p = mapToScreen(this.p, c.x, c.y)
    this.p.ellipse(p.x, p.y, 5, 5)
  }
}

