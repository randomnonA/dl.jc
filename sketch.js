let x, y;
let bg, bg2;
let pSide, pBack;
let music, eSound;
let pButtons = [];
let scene;
let pSize = 160;

async function setup() {
  createCanvas(900, 900);
  bg = await loadImage('media/bgOne.jpg');
  bg2 = await loadImage('media/peng_bg.jpeg');
  music = await loadSound('media/peng_theme.mp3');
  pSide = await loadImage('media/Emperor.png');
  pBack = await loadImage('media/penguin_back.png');
  eSound = await loadSound('media/emperor_sound.mp3');
  scene = 1;
  x = 0;
  y = 290;
}

function draw() {
  if (scene === 1) {
    image(bg, 0, 0, 788, 525);
  }

  if (scene === 2) {
    image(bg2, 0, 0, 788, 525);
  }
  let gp = navigator.getGamepads()[0];
  if (gp) { //makes sure the gamepad actually exists
    handleButtons(gp);
    let deadzone = 0.15; //ignores tiny movements from the controller bc of stick drift
    let dx = abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
    let dy = abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;
    //if statement to make sure the music plays when moving
    if (dx !== 0 || dy !== 0) {
      if(!music.play()) { //needs fixing
        music.loop();
      }
    }
    let speed = 8;
    //this is for the movement
    //scene 1 keeps the same normal speed
    if (scene === 1) {
      x += dx * speed;
      y += dy * speed;
    }
    //scene 2 changes the y speed because its supposed to look like the penguin is getting farther 
    if (scene === 2) {
      x += dx * speed;
      y += dy * 1;
      if (dy < 0) {
        pSize -= 2;
      }
    } 
  }
  if (scene === 1) {
    image(pSide, x, y, 80, 160);
  }
  if (scene === 2) {
    //used a map here to make it so that the penguin gets smaller the closer it gets to y = 0 but it looks like vro is levitating; need to fix
    pSize = map(y, 0, 290, 10, 160);
    image(pBack, x, y, pSize / 2, pSize);
  }

}

function handleButtons(gp) {
  gp.buttons.forEach((button, index) => {
    let currentPressed = button.pressed;
    let previousPressed = pButtons[index] || false;
    
    //newly pressed
    if (currentPressed && !previousPressed) {
      switch(index) {
          //A
        case 0:
          scene = 2;
          break;
          
          //B
        case 1:
          eSound.play();
          break;
          
          //Y
        case 2:

          break;
          
          //X
        case 3:
          saveCanvas('etcha_gp', "png");
          break;
          
          
      }
    }
    
    pButtons[index] = currentPressed;
  });
}