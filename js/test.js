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
    return { x: mouse.x, y: mouse.y };
  }

  return { getMouse, setMouse };
})();

const rootStyle = getComputedStyle(document.body);
rootStyle.getProp = rootStyle.getPropertyValue;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // init();
});

class Particle {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;

    this.hVel = Math.random() * 3 - 1.5;
    this.vVel = Math.random() * 3 - 1.5;
    this.size = Math.random() * 15 + 1;
  }

  update() {
    this.x += this.hVel;
    this.y += this.vVel;

    this.size -= 0.1;

    return this;
  }

  draw() {
    const { x, y, size } = this;
    ctx.fillStyle = `hsl(${hue},100%,50%)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 360);
    ctx.fill();

    return this;
  }
}

let particles = [];
let hue = 40;

canvas.addEventListener('mousemove', e => {
  Mouse.setMouse(e);
  const { x, y } = Mouse.getMouse();

  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(ctx, x, y));
  }
});

function handleParticles() {
  for (let idx = 0; idx < particles.length; idx++) {
    particles[idx].update().draw();

    if (particles[idx].size <= 0.1) {
      particles.splice(idx, 1);
      idx--;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  // hue++;
  requestAnimationFrame(animate);
}

animate();
