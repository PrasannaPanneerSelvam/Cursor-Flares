console.log('Hello world!');

const Mouse = (function () {
  const mouse = {
      x: undefined,
      y: undefined,
    },
    xOffset = 100;

  function setMouse({ x, y }) {
    mouse.x = x + xOffset;
    mouse.y = y;
  }

  function getMouse() {
    return { x: mouse.x, y: mouse.y };
  }

  return { getMouse, setMouse };
})();

const rootStyle = getComputedStyle(document.body);
rootStyle.getProp = rootStyle.getPropertyValue;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

function adjustCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

adjustCanvasSize();

window.addEventListener('resize', adjustCanvasSize);

class Particle {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;

    this.hVel = 0.5;
    this.vVel = 0.5;
    this.size = 1;

    this.light = 70;

    this.color = `hsl(${hue},100%,${this.light}%)`;

    this.id = Symbol();
  }

  update() {
    // this.x += this.hVel;
    // this.y += this.vVel;

    this.size -= 0.04;
    this.color = `hsl(${hue},100%,${this.light--}%)`;

    return this;
  }

  draw() {
    const { x, y, size } = this;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 360);
    ctx.fill();

    return this;
  }

  drawPointsWithCurvedCorners(particles) {
    const numberOfParticles = particles.length;
    if (numberOfParticles == 0 || numberOfParticles == 1) return;

    ctx.strokeStyle = this.color;

    ctx.beginPath();
    const radii = 300;
    for (let idx = 0; idx < numberOfParticles - 2; idx++) {
      let pointOne = particles[idx],
        pointTwo = particles[idx + 1],
        pointThree = particles[idx + 2];

      // Caching va;ues to get a consistent curve on each frame
      if (curveCache[pointOne.id] === undefined) {
        const res = {};

        res.curveStart = {
          x: pointOne.x + (pointTwo.x - pointOne.x) / 2,
          y: pointOne.y + (pointTwo.y - pointOne.y) / 2,
        };

        res.curveEnd = {
          x: pointTwo.x + (pointThree.x - pointTwo.x) / 2,
          y: pointTwo.y + (pointThree.y - pointTwo.y) / 2,
        };

        curveCache[pointOne.id] = res;
      }

      ctx.moveTo(
        curveCache[pointOne.id].curveStart.x,
        curveCache[pointOne.id].curveStart.y
      );
      ctx.arcTo(
        pointTwo.x,
        pointTwo.y,
        curveCache[pointOne.id].curveEnd.x,
        curveCache[pointOne.id].curveEnd.y,
        radii[pointTwo.r]
      );
      ctx.lineTo(
        curveCache[pointOne.id].curveEnd.x,
        curveCache[pointOne.id].curveEnd.y
      );
    }
    ctx.stroke();
  }
}

const particles = [],
  curveCache = {};
let hue = 200;
hue = 30;

canvas.addEventListener('mousemove', e => {
  Mouse.setMouse(e);
  const { x, y } = Mouse.getMouse();

  // for (let i = 0; i < 10; i++) {
  particles.push(new Particle(ctx, x, y));
  // }
});

function handleParticles() {
  for (let idx = particles.length - 1; idx >= 0; idx--) {
    if (particles[idx].size <= 0.1) {
      delete curveCache[particles[idx].id];
      particles.splice(idx, 1);
      idx--;
      continue;
    }

    particles[idx].update();
    // particles[idx].draw();
  }

  particles[0]?.drawPointsWithCurvedCorners(particles, curveCache);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  requestAnimationFrame(animate);
}

animate();
