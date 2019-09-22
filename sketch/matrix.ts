class Matrix {
  r : number
  c : number
  values : number[][]

  static fromValues(v : number[][]) : Matrix {
    let m = new Matrix(v.length, v[0].length)
    m.values = v
    return m
  }

  constructor(rows: number, columns: number) {
    this.r = rows
    this.c = columns
    this.values = []
    for (let i = 0;  i < rows; i++) {
     this.values[i]  = []
    }
  }

  get size() : {rows : number , columns: number} {
    return {rows: this.r, columns: this.c}
  }

  get rows() : number {
    return this.r
  }

  get columns() : number {
    return this.c
  }

  scale(n :number): Matrix {
    let res : number[][] = []
    for (let i = 0; i < this.r; i++) {
      res[i] = []
      for (let j = 0; j < this.c; j++) {
        res[i][j] = this.values[i][j] * n
      }
    }
    return Matrix.fromValues(res)
  }

  add(other : Matrix): Matrix {
    let res : number[][] = []

    for (let i = 0; i < this.r; i++) {
      res[i] = []
      for (let j = 0; j < this.c; j++) {
        res[i][j] = this.values[i][j] + other.values[i][j]
      }
    }
    return Matrix.fromValues(res)
  }

  multiply(other : Matrix): Matrix {
    let res : number[][] = []

    for (let i = 0; i < this.r; i++) {
      res[i] = []
      for (let j = 0; j < other.c; j++) {

        res[i][j] = 0
        for (let k = 0; k < this.c; k++) {
          res[i][j] += this.values[i][k] * other.values[k][j]
        }
      }
    }
    return Matrix.fromValues(res)
  }
}
