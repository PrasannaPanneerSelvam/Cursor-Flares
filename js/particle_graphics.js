console.log('Hello world!');

const rootStyle = getComputedStyle(document.body);
rootStyle.getProp = rootStyle.getPropertyValue;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function hexToRGB(str) {
  const result = [],
    error = new Error('Incorrect hex color code');

  if (!str || str[0] !== '#' || ![4, 7].includes(str.length)) {
    throw error;
  }

  str = str.toUpperCase().slice(1);

  const mapArr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ];

  const arr = [];
  [...str].forEach(i => {
    if (str.length === 3) arr.push(i);
    arr.push(i);
  });

  for (let idx = 0; idx < 3; idx++) {
    const fstValue = mapArr.indexOf(arr[idx]),
      secValue = mapArr.indexOf(arr[idx * 2 + 1]);

    if (fstValue === -1 || secValue === -1) throw error;

    result.push(fstValue * 16 + secValue);
  }

  return result;
}

class Particle {
  constructor(context, x = 0, y = 0) {
    if (!context) {
      throw new Error('No context provided to create a particle');
    }

    this.ctx = context;
    this.initialPoint = { x, y };
    this.x = x;
    this.y = y;
    this.size = 10;
    this.weight = 2;
    this.direction = [1, 1];
    this.backgroundColor = '#fff';

    this.totalArea = { height: 0, width: 0 };
  }

  update() {
    // Reset y axis
    if (this.totalArea.height <= this.y) {
      this.y = this.initialPoint.y;
      this.weight = 2;
      return this;
    }

    this.weight += 0.01;
    this.y += this.weight;
    return this;
  }

  draw() {
    const { ctx, x, y, size } = this;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    return this;
  }

  setTotalAreaDimensions({ height, width }) {
    this.totalArea = { height, width };
    return this;
  }

  clear() {
    const { ctx, x, y, size } = this;

    ctx.fillStyle = `rgb(${hexToRGB(this.backgroundColor).join(',')}, 0.075)`;
    ctx.fillRect(x - size, 0, size * 2, this.totalArea.height);

    // ctx.fillStyle = this.backgroundColor;
    // ctx.fillRect(x - size, y - 200, size * 2, size * 2);

    // ctx.beginPath();
    // ctx.arc(x, y, size + 1, 0, Math.PI * 2);
    // ctx.closePath();
    // ctx.fill();

    return this;
  }
}

const particle = new Particle(ctx, 100, 10);
particle.setTotalAreaDimensions(canvas);
particle.backgroundColor = rootStyle.getProp('--canvas-bg').trim();

function animate() {
  particle.clear().update().draw();
  requestAnimationFrame(animate);
}

animate();
