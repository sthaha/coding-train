
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
    let m2x3 = Matrix.fromValues(v2x2)
    let prod = m3x2.multiply(m2x3)

    console.log("product ...")
    console.log(prod.size)
    console.table(prod.values)


  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.draw = () => {
  }
}

new p5(matrix)
