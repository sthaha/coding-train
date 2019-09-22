
const matrix = (p :p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)

    let m = new Matrix(3 ,3)
    m.dump()

    let v = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    let m1 = Matrix.fromValues(v)
    m1.dump()

    let s = m1.scale(10)
    s.dump("m1 x 10")

    let sum = m1.add(s)
    s.dump("m1 + scaled")

    const v3x2 = [
      [1, 3],
      [2, 2],
      [3, 1],
    ]

    const v2x2 = [
      [1,0],
      [0,1],
    ]

    let m3x2 = Matrix.fromValues(v3x2)
    let m2x2 = Matrix.fromValues(v2x2)
    let prod = m3x2.multiply(m2x2)
    prod.dump("3x2 X 2x2")


    let add5 = (x:number) => x+5
    console.log(prod.size)
    let eached = m2x2.each(add5)
    eached.dump("eached ...")

    let zero3x3 = new  Matrix(3, 3)
    let indexedFn = () => {
      let index = 1
      let one = () =>  index++
      return zero3x3.each(one)
    }
    let indexed = indexedFn()
    indexed.dump("indexed")

    let init5 = Matrix.initialize(2, 2, 5)
    init5.dump("intialized to : number 5")

    let initedByFn = Matrix.initialize(2, 2, (x, i, j) => (i+1) * 100 + (j+1) * 10 + x)
    initedByFn.dump("intiailized by Fn")


    Matrix.fromValues([[1, 2 , 3]]).transpose().dump("1x3 transposed")
    Matrix.fromValues([[1], [2], [3]]).transpose().dump("3x1 transposed")

  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.draw = () => {
  }
}

new p5(matrix)
