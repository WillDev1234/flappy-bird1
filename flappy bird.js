import * as gameinput from "../flappybird/game-input.js";
const app = new PIXI.Application({
  width: 1280,
  height: 720,
});
document.getElementById("game").appendChild(app.view);
//start of loader
app.loader
  .add("bird", "Untitled-1.png")
  .add("background", "flappy_background.png")
  .add("pipe", "flappy_pipe.png")
  .load((loader, resources) => {
    var background = new PIXI.Sprite(resources.background.texture);
    app.stage.addChild(background);
    //creating pixi spirtes
    var bird = new PIXI.Sprite(resources.bird.texture);
    var pipe1 = new PIXI.Sprite(resources.pipe.texture);
    var pipe2 = new PIXI.Sprite(resources.pipe.texture);
    var pipe3 = new PIXI.Sprite(resources.pipe.texture);
    var Toppipe1 = new PIXI.Sprite(resources.pipe.texture);
    var Toppipe2 = new PIXI.Sprite(resources.pipe.texture);
    var Toppipe3 = new PIXI.Sprite(resources.pipe.texture);

    pipe1.width = 150;
    pipe2.width = 150;
    pipe3.width = 150;
    Toppipe1.width = 150;
    Toppipe2.width = 150;
    Toppipe3.width = 150;
    Toppipe1.height = -720;
    Toppipe2.height = -720;
    Toppipe3.height = -720;
    Toppipe1.y = 0;
    Toppipe2.y = 0;
    Toppipe3.y = 0;
    pipe1.height = Math.random() * 640;
    pipe2.height = Math.random() * 640;
    pipe3.height = Math.random() * 640;
    pipeSprites.push(pipe1);
    pipeSprites.push(pipe2);
    pipeSprites.push(pipe3);
    toppipeSprites.push(Toppipe1);
    toppipeSprites.push(Toppipe2);
    toppipeSprites.push(Toppipe3);
    app.stage.addChild(pipe1);
    app.stage.addChild(pipe2);
    app.stage.addChild(pipe3);
    app.stage.addChild(Toppipe1);
    app.stage.addChild(Toppipe2);
    app.stage.addChild(Toppipe3);
    pipe1.x = 1707;
    pipe2.x = 2233;
    pipe3.x = 2760;
    const pipe1Obj = new Pipe(pipe1, pipe1.x, pipe1.y, pipe1.height);
    const pipe2Obj = new Pipe(pipe2, pipe2.x, pipe2.y, pipe2.height);
    const pipe3Obj = new Pipe(pipe3, pipe3.x, pipe3.y, pipe3.height);
    var circle = new PIXI.Graphics();
    circle.beginFill(0x000000);
    circle.lineStyle(0);
    circle.drawCircle(200, 70, 5);
    circle.y = 600;
    app.stage.addChild(bird);
    bird.scale.set(0.08);
    bird.x = 150;
    //creating objects for the sprites
    const circleObj = new Bird(bird, circle.x, circle.y, 0);
    let Acceleration = 0.4;
    let lastMove = 0;
    let isGameOver = false;
    function detectCollision() {
      var i;
      for (i = 0; i < 3; i++) {
        if (
          ((circleObj.y >= pipeSprites[i].y - 75 + 35 ||
            circleObj.y <= pipeSprites[i].y - 200) &&
            (Math.abs(circleObj.x - pipeSprites[i].x) <= 65 ||
              (circleObj.x - pipeSprites[i].x <= 120 &&
                circleObj.x - pipeSprites[i].x >= 0)) &&
            isGameOver === false) ||
          bird.y >= 730
        ) {
          isGameOver = true;
        }
      }
    }
    let score = 0;
    let lastPipe = 0;
    function keepScore() {
      var i;
      for (i = 0; i < 3; i++) {
        if (
          circleObj.x - pipeSprites[i].x >= 110 &&
          circleObj.x - pipeSprites[i].x <= 120 &&
          lastPipe != pipeSprites[i]
        ) {
          score += 1;
          lastPipe = pipeSprites[i];
        }
      }
    }
    app.ticker.maxFPS = 60;
    app.ticker.add(() => {
      if (Date.now() - lastMove >= 10 && isGameOver != true) {
        if (gameinput.isKeyPressed(" ")) {
          circleObj.birdUp();
        }
        circleObj.vel += Acceleration;
        circleObj.birdMove();
        lastMove = Date.now();
        movePipes();
        moveTopPipes();
      }
      bird.y = circleObj.y;
      detectCollision();
      circle.y = bird.y;
      keepScore();
      textScore.text = `${score}`;
      stopGame();
      circle.x = bird.x;
      if (isGameOver === true && gameinput.isKeyPressed(" ")) {
        pipe1Obj.x = 1707;
        pipe2Obj.x = 2233;
        pipe3Obj.x = 2760;
        isGameOver = false;
        score = 0;
        circleObj.y = 0;
        circleObj.vel = 0;
        bird.rotation = 0;
      }
    });
    let textScore = new PIXI.Text(`${score}`, {
      fontFamily: "Brush Script MT",
      fontSize: 100,
      fill: 0xfffdd9,
      align: "center",
    });
    textScore.x = app.renderer.width / 2;
    textScore.y = 200;
    app.stage.addChild(textScore);
    function stopGame() {
      if (isGameOver) {
        circleObj.y += 3 * 4.5;
        bird.rotation += 0.009 * 4.5;
      }
    }
  });
class Bird {
  constructor(circle, x, y, vel) {
    this.circle = circle;

    this.x = circle.x;
    this.y = circle.y;
    this.vel = vel;
  }
  birdMove() {
    this.y += this.vel;
  }
  birdUp() {
    this.vel = -10;
  }
  birdPos() {
    return [this.y];
  }
}
class Pipe {
  constructor(pipe, x, y, height) {
    this.pipe = pipe;
    Pipe.PipeList.push(this);
    this.height = height;
    this.x = pipe.x;
    this.y = pipe.y;
  }
  pipeMove() {
    this.x -= 4.5;
  }
  pipeRestart() {
    for (const pipe of Pipe.PipeList) {
      if (this.x <= -267 && this.pipe.x < 0) {
        this.x = 1375.5;
        this.height = Math.random() * 640;
      }
    }
  }
}
function movePipes() {
  var i;
  for (i = 0; i < 3; i++) {
    Pipe.PipeList[i].pipeMove();
    Pipe.PipeList[i].pipeRestart();
    pipeSprites[i].height = Pipe.PipeList[i].height;
    pipeSprites[i].x = Pipe.PipeList[i].x;
    pipeSprites[i].y = 720 - pipeSprites[i].height;
  }
}
function moveTopPipes() {
  var i;
  for (i = 0; i < 3; i++) {
    toppipeSprites[i].x = pipeSprites[i].x;
    toppipeSprites[i].y = pipeSprites[i].y - 200;
  }
}
Pipe.PipeList = [];
var pipeSprites = [];
var toppipeSprites = [];
