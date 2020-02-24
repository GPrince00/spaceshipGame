const ENEMIES_STORE = [];
const ENEMIES_SIZE = 50;
const ENEMIES_ASTEROID = [
  '../assets/asteroid.png', '../assets/asteroid1.png',
  '../assets/asteroid2.png', '../assets/asteroid3.png',
  '../assets/asteroid4.png', '../assets/asteroid5.png',
  '../assets/asteroid6.png', '../assets/asteroid7.png',
  '../assets/asteroid8.png', '../assets/asteroid9.png',
  '../assets/asteroid10.png', '../assets/asteroid11.png'
];
const ENEMIES_COLORS = [
  'red', 'blue', 'yellow', 'white',
  'green', 'purple', 'navy', 'silver', 'olive',
  'lime', 'fuchsia', 'teal', 'aqua', 'maroon'
];
const WORLD_SCORE = [{}];
const HERO_SIZE = ENEMIES_SIZE;
const HERO_COLOR = 'grey';
const GAME_OVER_FONT = '50px Roboto Slab';
const GAME_OVER_COLOR = 'white';
const GAME_OVER_TEXT = 'GAME OVER';
const GAME_OVER_X = 90;
const GAME_OVER_Y = 220;

const PAUSE_FONT = '40px Roboto Slab';
const PAUSE_COLOR = 'white';
const PAUSE_TEXT = 'PAUSE';
const PAUSE_X = 170;
const PAUSE_Y = 220;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreCanvas = document.getElementById('scoreCanvas');
const scoreCtx = scoreCanvas.getContext('2d');
const worldScoreCanvas = document.getElementById('worldScoreCanvas');
const worldScoreCtx = worldScoreCanvas.getContext('2d');

let running = false;
let frames = 0;
let lose = true;
let stop = false;
let score = 0;
let name = "";
let counter = 0;

class Enemy {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.width = ENEMIES_SIZE;
    this.height = ENEMIES_SIZE;
    this.color = ENEMIES_COLORS[Math.floor(Math.random() * ENEMIES_COLORS.length)];
    this.asteroid = ENEMIES_ASTEROID[Math.floor(Math.random() * ENEMIES_ASTEROID.length)];
  }

  draw() {
    this.y += 10;

    //new form
    const img = new Image()
    img.src = this.asteroid;    
    ctx.drawImage(img, this.x, this.y, ENEMIES_SIZE, ENEMIES_SIZE)

    // old form
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.x, this.y, ENEMIES_SIZE, ENEMIES_SIZE);  
  }
}

const createEnemy = () => {
  if (frames % 5 === 0) {
    const x = Math.floor(Math.random() * 10) * ENEMIES_SIZE;
    ENEMIES_STORE.push(new Enemy(x));
    score = score + 1;
  }
}

const drawEnemies = () => {
  ENEMIES_STORE.forEach(enemy => enemy.draw());
}

const collisionChecker = () => {
  ENEMIES_STORE.forEach(enemy => {
    if (ourHero.checkCollision(enemy)) {
      gameOver();
    }
  })
}

const pauseChecker = () => {
  if (stop){
    pause();
  }
}

class Hero {
  constructor() {
    this.x = 0;
    this.y = canvas.height - HERO_SIZE;
    this.width = HERO_SIZE;
    this.height = HERO_SIZE;
    this.color = HERO_COLOR;
  }

  draw() {
    if (this.x < 0) this.x = 0;
    if (this.x > canvas.width - HERO_SIZE) this.x = canvas.width - HERO_SIZE;
    
    // new form
    const img = new Image()
    img.src = "./assets/spaceship1.png"    
    ctx.drawImage(img, this.x, this.y, HERO_SIZE, HERO_SIZE)
    
    // old form
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.x, this.y, HERO_SIZE, HERO_SIZE);  
  }

  checkCollision(enemy) {
    return (this.x < enemy.x + enemy.width) && (this.x + this.width > enemy.x) && (this.y < enemy.y + enemy.height) && (this.y + this.height > enemy.y);
  }  
}

const ourHero = new Hero();

const resetCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scoreCtx.clearRect(0, 0, canvas.width, canvas.height);
}

const gameOver = () => {
  lose = false;
  running = false;
  ctx.font = GAME_OVER_FONT;
  ctx.fillStyle = GAME_OVER_COLOR;
  ctx.fillText(GAME_OVER_TEXT, GAME_OVER_X, GAME_OVER_Y);
  getName();
  counter++;

  // checkScore();
}

const pause = () => {
  running = false;
  ctx.font = PAUSE_FONT;
  ctx.fillStyle = PAUSE_COLOR;
  ctx.fillText(PAUSE_TEXT, PAUSE_X, PAUSE_Y);
}

const fixLeak = () => {
  if(ENEMIES_STORE.length == 11){
    ENEMIES_STORE.shift();
  }
}

const socoreWindow = () => {
  scoreCtx.font = '30px Roboto Slab';
  scoreCtx.fillStyle = "white";
  scoreCtx.fillText(score, 5, 24);
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let Names = ["Prince", "Sofia", "Caricho", "Massaroto", "Junior", "Brunão", "MG", "Vinut", "Rao", "Mateus"];
const worldSocoreWindow = async () => {
  await sleep(3000);
  worldScoreCtx.font = '30px Roboto Slab';
  worldScoreCtx.fillStyle = "white";
  function compare(a, b) {
    let comparison = 0;
    if (a.score < b.score) comparison = 1;
    if (a.score > b.score) comparison = -1;
    return comparison;
  }
  WORLD_SCORE.sort(compare);
  console.log(WORLD_SCORE);
  let Y = 25;
  for (var i = 1; i < 11; i++) {
    worldScoreCtx.fillText(WORLD_SCORE[i].score + ": " + WORLD_SCORE[i].name, 5, Y);
    Y += 33;    
  }  
};

const checkScore = () => {
  for (var i = 0; i < 3; i++) {

  firebase.database().ref('/' + i +'/score').once('value').then(function(snapshot) {
    var score = (snapshot.val() && snapshot.val().score) || 'Anonymous';
    console.log(score)
  });
}
  // if(score > WORLD_SCORE[8]){
  //   alert("escreva o seu nome");
  // }
};

const getName = () => {
  var name = prompt("Please enter your name", "Harry Potter");
  if (name != null) {
    console.log(name);
    writeScoreData(score, name);
  }
}
const writeScoreData = (score, name) => {
  firebase.database().ref('/' + counter).set({
    score: score,
    name: name,
  }, function(error) {
    if (error) {
      console.log('Something wrong happend:' + error)
    } else {
      console.log('Works')
    }
  });
}

const readScoreData = () => {
  for (var i = 0; i < 10; i++) {
     firebase.database().ref('/' + i).once('value').then(function(snapshot) {
      WORLD_SCORE.push({ 
        score: (snapshot.val() && snapshot.val().score) || 'Anonymous',
        name: (snapshot.val() && snapshot.val().name) || 'Anonymous'
      });
      console.log({ 
        score: (snapshot.val() && snapshot.val().score) || 'Anonymous',
        name: (snapshot.val() && snapshot.val().name) || 'Anonymous'
      });
    });
  }
  console.log(WORLD_SCORE);
worldSocoreWindow();
}

const render = () => {
  resetCanvas();
  frames += 1;
  ourHero.draw();
  createEnemy();
  drawEnemies();
  collisionChecker();
  pauseChecker();
  fixLeak();
  socoreWindow();
  if (running) {
    window.requestAnimationFrame(render);
  }
}

readScoreData();
running = true;
render();

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 37) {
    if (ourHero.x <= 0) return;
    ourHero.x -= HERO_SIZE;
  }
  
  if (e.keyCode === 39) {
    if (ourHero.x >= canvas.width - HERO_SIZE) return;
    ourHero.x += HERO_SIZE;
  }

  if (e.keyCode === 32) {
    if (running === false && lose){
      running = true;
      stop = false;
      render();
    }else{
      stop = true;
    }
  }

  if (e.keyCode === 82){
    if (running === false){
      for (var i = 0; i < 12; i++) {
        ENEMIES_STORE.pop(i);
      }
      score = 0;
      running = true;
      render();
    } 
  }
});
