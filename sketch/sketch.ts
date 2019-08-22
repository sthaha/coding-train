let morph: Morph;
function setup() {
  createCanvas(windowWidth, windowHeight)
  morph = new Morph()
  morph.setup()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(80);
  morph.draw()
}

// // const s = ( sketch : any ) => {
//
//   let x = 100;
//   let y = 100;
//   let morph: Morph;
//
//   sketch.setup = () => {
//     console.log("window width:", sketch.windowWidth);
//     sketch.createCanvas(sketch.windowWidth, 200);
//     morph = new Morph();
//     morph.setup();
//
//   };
//
//   sketch.draw = () => {
//     sketch.background(0);
//     sketch.fill(255);
//     sketch.rect(x,y,50,50);
//     morph.draw();
//   };
// };
//
// let myp5 = new p5(s, document.getElementById("d1"));
//
// // let myp52 = new p5(s, "d2");
//
