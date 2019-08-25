function yForX(x : number) {
  return 0.35 * x + -0.2
}

function mapToScreen(x : number , y  : number) {
  //console.log("  mapping: ", x, y)
  return {
    x : map(x, -1, 1, 0, width),
    y : map(y, -1, 1, height, 0),
  }
}


type Point = { x : number, y : number, bias: number, label: number }

class Points {
  size : number
  cords : Point[]
  training: boolean

  constructor(size : number) {
    this.size = size;
    this.randomize()
  }

  labelFor(x : number, y : number) : number {
    return y >= yForX(x) ? 1 : -1
  }

  randomize() {
    this.cords = Array.from({length: this.size}, () => {
      let x = random(-1, 1)
      let y = random(-1, 1)
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
        fill(40, 40, 45)
      } else {
        fill(35, 35, 38)
      }
      return
    }

    if (label == 1) {
      fill(200, 220, 255)
    } else {
      fill(100, 100, 187)
    }
  }

  draw() {
    stroke(0)

    this.cords.forEach(c => {
      this.fill(c.label)

      let p = mapToScreen(c.x, c.y)
      ellipse(p.x, p.y, 12, 12)
    })
  }

  highlight(i : number) {
    let c  = this.cords[i]
    fill(200, 250, 220)
    let p = mapToScreen(c.x, c.y)
    ellipse(p.x, p.y, 18, 18)

  }

  markGuess(i : number, correct :  boolean) {
    if (correct) {
      fill(0, 244, 122)
    } else {
      fill(244, 0, 0)
    }

    noStroke()
    let c = this.cords[i]
    let p = mapToScreen(c.x, c.y)
    ellipse(p.x, p.y, 5, 5)
  }
}

