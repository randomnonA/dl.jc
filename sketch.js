let x, y;
let bg, bg2, snow, sEnd, ice;
let pSide, pBack;
let music, eSound, freeze, fSound;
let pButtons = [];
let scene;
let pSize = 160;

async function setup() {
  createCanvas(900, 900);
  bg = await loadImage('media/bgOne.jpg');
  bg2 = await loadImage('media/peng_bg_3.png');
  snow = await loadImage('media/snow.png');
  music = await loadSound('media/audiomass.mp3');
  pSide = await loadImage('media/Emperor.png');
  pBack = await loadImage('media/penguin_back.png');
  eSound = await loadSound('media/emperor_sound.mp3');
  freeze = await loadSound('media/freeze.mp3');
  sEnd = await loadImage('media/freeze_end.jpg');
  ice = await loadImage('media/ice.png');
  fSound = await loadSound('media/tuco-get-out.mp3');
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
  if (scene === 3) {
    image(bg2, 0, 0, 788, 525);
    image(snow, 0, 0, 788, 525);
  }
  if (scene === 4) {
    image(sEnd, 0, 0, 788, 525);
  }
  let gp = navigator.getGamepads()[0];
  if (gp) { //makes sure the gamepad actually exists
    handleButtons(gp);
    let deadzone = 0.15; //ignores tiny movements from the controller bc of stick drift
    //
    
    let dx = abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
    let dy = abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;
    //tests out if dx and dy show anything
    //console.log(dx);
    //console.log(dy);
    //if statement to make sure the music plays when moving
    if (dx !== 0 || dy !== 0) {
      //userStartAudio();
      if(!music.playing) { //needs fixing
        music.start();
        //console.log("start");
        music.loop();
      }
    }
    else {
        if (music.playing) {
          music.pause();
        }
    }
    let speed = 8;
    //this is for the movement
    //scene 1 keeps the same normal speed
    if (scene === 1) {
      x += dx * 1.5;
      y += dy * speed;
    }
    //scene 2 changes the y speed because its supposed to look like the penguin is getting farther 
    if (scene === 2 || scene === 3) {
      x += dx * speed;
      y += dy * 0.2;
      if (dy < 0) {
        pSize -= 3;
      }
    } 
  }
  if (scene === 1) {
    image(pSide, x, y, 80, 160);
  }
  if (scene === 2 || scene === 3) {
    //used a map here to make it so that the penguin gets smaller the closer it gets to y = 0 but it looks like vro is levitating; need to fix
    pSize = map(y, 0, 290, 10, 160);
    image(pBack, x - 300, y, pSize / 2, pSize);
  }
  if (scene === 4) {
    image(ice, 350, 150, 300, 300);
    image(pSide, 450, 220, 80, 160);
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
          
          //Y snowstorm that freezes the penguin
        case 2:
          scene = 3;
          freeze.play();
          break;
          
          //X 
        case 3:
          scene = 4;
          fSound.play();
          break;
          
          
      }
    }
    
    pButtons[index] = currentPressed;
  });
}