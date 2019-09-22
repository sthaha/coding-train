class Plotter {
  p :p5

  pts : xPoint[]
  guessFn : guessFn
  guessLineFn : guessLineFn
  wrongGuesses : number

  constructor(p : p5) {
    this.p = p
  }

  set points(pts :xPoint[]) {
    this.pts = pts
  }

  set guess(fn : (inputs: number[]) => number ) {
    this.guessFn = fn
  }

  set guessLine(fn : guessLineFn) {
    this.guessLineFn = fn
  }

  draw() {
    this.p.background(17, 17, 17)
    this.drawAxis()
    this.drawLineOfSeparation()
    this.drawGuessLine()
    this.plotPoints()
    this.plotGuesses()

  }

  drawLineOfSeparation() {
    let left = this.toScreen({x: -1, y: yForX(-1)})
    let right = this.toScreen({ x: 1, y: yForX(1)})

    this.p.stroke(104,144,0)
    this.p.strokeWeight(2)
    this.p.line(left.x, left.y, right.x, right.y)
  }

  drawGuessLine() {
    const line = this.guessLineFn()

    let left = this.toScreen({x: -1, y: -line.slope + line.yIntercept})
    let right = this.toScreen({ x: 1, y: line.slope + line.yIntercept})

    this.p.stroke(204,244,0)
    this.p.strokeWeight(2)
    this.p.line(left.x, left.y, right.x, right.y)
  }

  drawAxis() {
    // | line

    let yTop = this.toScreen({x: 0, y: -1})
    let yBottom = this.toScreen({ x: 0, y: 1})

    // --- line
    let xLeft = this.toScreen({x: -1, y: 0})
    let xRight = this.toScreen({x: 1, y: 0})

    this.p.stroke(120,120,140)
    this.p.strokeWeight(1)
    this.p.line(yTop.x, yTop.y, yBottom.x, yBottom.y)
    this.p.line(xLeft.x, xLeft.y, xRight.x, xRight.y)
  }


  plotPoints() {
    this.pts.forEach(pt => this.plot(pt))
  }


  plot(pt: xPoint) {
    //console.log("pt: ", pt.cords())
    const cords = this.toScreen(pt.cords)

    //console.log("translated: pt: ", cords)

    this.p.stroke(0)
    this.fill(pt.label)
    this.p.ellipse(cords.x, cords.y, 20, 20)
  }

  get wrongGuessCount() :number {
    return this.wrongGuesses
  }

  plotGuesses() {
    this.wrongGuesses = 0
    this.pts.forEach(pt => this.plotGuess(pt))
  }

  plotGuess(pt: xPoint) {
    const guess = this.guessFn(pt.raw)

    const correct = guess == pt.label
    if (!correct) {
      this.wrongGuesses +=1
      return
    }

    this.p.strokeWeight(0)
    this.fillRightGuess(pt.label)

    const scr = this.toScreen(pt.cords)
    this.p.ellipse(scr.x, scr.y, 16, 16)
  }

  fill(label : number) {
    if (label == 1) {
      this.p.fill(244, 185, 7)
    } else {
      this.p.fill(25, 118, 222)
    }
  }

  fillRightGuess(label: number) {
    if (label == 1) {
      this.p.fill(184, 145, 7)
    } else {
      this.p.fill(5, 58, 162)
    }
  }

  toScreen(c:  Cord): Cord {
    const x = this.p.map(c.x, -1, 1, 0, this.p.width)
    const y = this.p.map(c.y, -1, 1, this.p.height, 0)
    return {x, y }
  }
}

