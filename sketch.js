let sun;
let planets = [];
let stars = [];
let starSpeed = 0.1;
let G = 9.81;
let numPlanets = 5;
let stabilité = 0.5;
let play = false;
let planetPosition;

function setup() {
  createCanvas(windowWidth - 12, windowHeight - 45);
  createStars();
  sun = new Body(100, createVector(0, 0), createVector(0, 0));
  createPlanets();
}

function createPlanets() {
  for (let i = 0; i < numPlanets; i++) {
    //*planet position
    let r = random(sun.r, min(windowWidth / 2, windowHeight / 2));
    let theta = random(TWO_PI);
    let planetPos = createVector(r * cos(theta), r * sin(theta));
    //*planet velocity
    let planetVel = planetPos.copy();
    planetVel.rotate(HALF_PI);
    planetVel.setMag(sqrt((G * sun.mass) / planetPos.mag()));
    planetVel.mult(random(1 - stabilité, 1 + stabilité));
    planets.push(new Body(random(5, 30), planetPos, planetVel));
  }
}

function createStars() {
  for (let i = 0; i < 333; i++) {
    let x = random(windowWidth);
    let y = random(windowHeight);
    let s = random(0.5, 2.5);
    stars.push({ x, y, s });
  }
}
function drawStars() {
  noStroke();
  fill(255, 255, 255);
  for (let star of stars) {
    ellipse(star.x, star.y, star.s, star.s);
    star.x += starSpeed;
    star.y += starSpeed;
    //* Bords
    if (star.x > windowWidth - 12) star.x = 0;
    if (star.y > windowHeight - 45) star.y = 0;
  }
}

function draw() {
  background("#070019");
  drawStars();
  translate(width / 2, height / 2);

  sun.show();
  if (!play) {
    return;
  } else {
    for (let i = 0; i < planets.length; i++) {
      planets[i].show();
      planets[i].update();
      sun.attract(planets[i]);
    }
  }
}

function Body(mass, pos, vel) {
  this.mass = mass;
  this.pos = pos;
  this.vel = vel;
  this.r = this.mass;
  this.path = [];

  this.show = function () {
    //* vitesse de la planete
    let speed = this.vel.mag();
    let maxSpeed = 5;
    let colorRatio = constrain(speed / maxSpeed, 0, 1);
    let red = lerp(255, 0, colorRatio);
    let green = lerp(0, 255, colorRatio);
    if (this === sun) {
      //* Sun effect
      for (let i = 10; i > 0; i--) {
        let alpha = map(i, 4, 0, 30, 255);
        noStroke();
        fill(255, 25, 20, alpha);
        ellipse(this.pos.x, this.pos.y, this.r + i * 10, this.r + i * 10);
      }
    }
    noStroke();
    fill(red, green, 0);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);

    stroke(30);
    for (let i = 0; i < this.path.length - 2; i++) {
      line(
        this.path[i].x,
        this.path[i].y,
        this.path[i + 1].x,
        this.path[i + 1].y
      );
    }
  };

  this.update = function () {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.path.push(this.pos.copy());
    if (this.path.length > 206) {
      this.path.splice(0, 1);
    }
  };

  this.applyForce = function (f) {
    this.vel.x += f.x / this.mass;
    this.vel.y += f.y / this.mass;
  };

  this.attract = function (child) {
    let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y);
    let f = this.pos.copy().sub(child.pos);
    f.setMag((G * this.mass * child.mass) / (r * r));
    child.applyForce(f);
  };
}

//*Autres fonctions
function setPlay() {
  play = !play;
}
function reset() {
  planets = [];
  createPlanets();
}
