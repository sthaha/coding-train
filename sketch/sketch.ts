
const matrix = (p :p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    let m = new Matrix(3 ,3)
    console.log("m size:", m.size)
    console.log("m values:", m.values)

    let v = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    let m1 = Matrix.fromValues(v)

    console.log("m1")
    console.log(m1.size)
    console.table(m1.values)

    let s = m1.scale(10)
    console.log("scaled ...")
    console.log(s.size)
    console.table(s.values)

    let sum = m1.add(s)
    console.log("sum ...")
    console.log(sum.size)
    console.table(sum.values)

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

    console.log("product ...")
    console.log(prod.size)
    console.table(prod.values)



    let add5 = (x:number) => x+5
    console.log("eached ...")
    console.log(prod.size)
    let eached = m2x2.each(add5)
    console.table(eached.values)

    let zero3x3 = new  Matrix(3, 3)
    let indexedFn = () => {
      let index = 1
      let one = () =>  index++
      return zero3x3.each(one)
    }
    let indexed = indexedFn()

    console.log("indexed ...")
    console.log(indexed.size)
    console.table(indexed.values)


    console.log("initialized to ... 5")
    let init5 = Matrix.initialize(2, 2, 5)
    console.log(init5.size)
    console.table(init5.values)

    console.log("initialized to ... fn")
    let initFn = Matrix.initialize(2, 2, (x, i, j) => (i+1) * 100 + (j+1) * 10 + x)
    console.log(initFn.size)
    console.table(initFn.values)

  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.draw = () => {
  }
}

new p5(matrix)
