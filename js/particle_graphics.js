console.log('Hello world!');

const Mouse = (function () {
  const mouse = {
    x: undefined,
    y: undefined,
  };

  function setMouse({ x, y }) {
    mouse.x = x;
    mouse.y = y;
  }

  function getMouse() {
    return { x: mouse.x + 100, y: mouse.y };
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
  }

  update() {
    // this.x += this.hVel;
    // this.y += this.vVel;

    this.size -= 0.05;
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
}

let particles = [];
let hue = 200;

canvas.addEventListener('mousemove', e => {
  Mouse.setMouse(e);
  const { x, y } = Mouse.getMouse();

  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(ctx, x, y));
  }
});

function handleParticles() {
  let nextObj = null;
  for (let idx = particles.length - 1; idx >= 0; idx--) {
    if (particles[idx].size <= 0.1) {
      particles.splice(idx, 1);
      idx--;
      continue;
    }

    particles[idx].update().draw();

    if (nextObj === null) {
      nextObj = particles[idx];
      continue;
    }

    ctx.lineWidth = '2';
    ctx.strokeStyle = particles[idx].color;
    ctx.beginPath();
    ctx.moveTo(particles[idx].x, particles[idx].y);
    ctx.lineTo(nextObj.x, nextObj.y);
    ctx.stroke();
    nextObj = particles[idx];
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  requestAnimationFrame(animate);
}

animate();
