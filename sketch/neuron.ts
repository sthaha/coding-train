class Neuron {
  size : number
  weights : number[]
  learningRate = 0.01

  constructor(size : number) {
    this.weights = Array.from({length: size}, () => random(-1, 1))
  }

  activation(input: number) {
    return input >= 0 ? 1 : -1 ;
  }

  guess(inputs : number[] ): number {
    let sum = inputs.map( (x, idx) => this.weights[idx] * x )
                    .reduce((a, x) => a + x)
    return this.activation(sum)
  }

  train(inputs : number[], target : number) {
    let guess = this.guess(inputs);
    let err = target - guess;

    //console.log("input", inputs, " got:", guess, "target:", target, this.weights)
    this.weights = this.weights.map((w, idx) => w + inputs[idx] * err * this.learningRate )
    //console.log("weights: ", this.weights)

  }
}
// Observation at this point
// As the accuracy improves the learning rate should start decreasing
