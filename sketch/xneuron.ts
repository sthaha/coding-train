type guessFn = (inputs: number[]) => number
type guessLineFn = () => Line

type Line = {
  slope: number
  yIntercept : number
}



class xNeuron {
  LR = 0.001
  weights : number[]

  constructor(size : number, weightFn : (i: number) => number ){
    this.weights = Array.from({length: size}, weightFn)
  }

  activation(res : number): number {
    return res > 0 ? 1 : -1
  }

  guess(inputs : number[]) : number {
    let res = [...inputs, 1.0] // 1.0 for bias
      .map((x :number, i : number) => this.weights[i] * x )
      .reduce((a: number, x: number) => a + x)
    return this.activation(res)
  }

  train(inputs : number[],  expected :number) {
    const err = expected - this.guess(inputs)
    const adj  = [...inputs, 1.0] // 1.0 for bias
    this.weights = this.weights.map( (w, i) => w + adj[i] * err * this.LR )
    console.log(this.weights)
  }

  get lineOfSeparation() : Line  {
    // line = ax + by + c = 0
    // by = -c -ax
    // y = -c/b -a/b x
    // y = mx + c
    // m = -a/b | c = -c/b
    const [a, b, c] = [...this.weights]
    const slope = -a/b
    const yIntercept = -c/b
    return {slope, yIntercept}
  }

}

