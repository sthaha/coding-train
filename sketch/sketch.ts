function utils (p: p5) {
  const generateRandomPoints = (n: number)  : xPoint[]  => {
    let points : xPoint[] =  []
    for (let i = 0; i < n; i++ ){
      points.push(new xPoint(p.random(-1,1), p.random(-1, 1) ))
    }
    return points
  }
  return {generateRandomPoints, random: p.random}
}


const perceptron = (p : p5) => {
  const util = utils(p)
  let graph : Plotter

  let pts = util.generateRandomPoints(100)
  let neuron: xNeuron


  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    graph = new Plotter(p)
    neuron = new xNeuron(3, (_) => p.random(-1, 1))
    graph.guess = (input: number[])  => neuron.guess(input)
    graph.guessLine = () => neuron.lineOfSeparation
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.draw = () => {
    graph.points = pts
    graph.draw()

    if (graph.wrongGuessCount > 0) {
      const train  = util.generateRandomPoints(10)
      train.forEach(pt => neuron.train(pt.raw, pt.label))
    }
  }

  p.mousePressed = () => {
    pts = util.generateRandomPoints(100)
  }
}


const p  = new p5(perceptron)
