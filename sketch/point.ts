

function labelFor(x : number, y : number)  {
  return y > yForX(x) ? 1 : -1
}

type Cord = {x : number, y:number}
type translateFn = (c : Cord) => Cord

class xPoint {
  x: number
  y: number

  private p :p5

  constructor(x : number,y:  number)  {
    this.x = x
    this.y = y
  }

  get raw() : number[] {
    return [ this.x, this.y ]
  }

  get cords() : Cord {
    return {
      x : this.x,
      y : this.y,
    }
  }

  get label(): number {
    return labelFor(this.x, this.y)
  }
}

