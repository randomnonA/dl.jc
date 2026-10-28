let x, y; //movement variables
let bg, bg2, snow, sEnd, ice; //background and other images
let pSide, pBack; //penguin images
let music, eSound, freeze, fSound; //sound effects
let pButtons = []; //renamed version of previousButtons from the demo; used to check button presses once
let scene; //type of scene, there are 4 for the switch statement
let pSize = 160; //size of penguin in scene 2 due to using map

async function setup() {
  createCanvas(900, 900);
  bg = await loadImage('media/bgOne.jpg');
  bg2 = await loadImage('media/peng_bg.jpeg');
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

// I will be using strictly equals and strictly not equals which to me just means that it HAS to be that exact value or something.
function draw() {
  //if variable scene strictly equals to 1, change the background to this at x = 0, y = 0 and make the image 788x525 pixels; this applies to all of the other scenes
  if (scene === 1) {
    //Im pretty sure we learned image in class but essentially it uses an image(the image you want, x, y, width, height)
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
  //Used during the demo; basically detects if the controller is connected
  let gp = navigator.getGamepads()[0];
  if (gp) { //makes sure the gamepad actually exists
    handleButtons(gp);
    let deadzone = 0.15; //ignores tiny movements from the controller bc of stick drift
    //Used during the demo
    let dx = abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
    let dy = abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;
    //tests out if dx and dy show anything
    //console.log(dx);
    //console.log(dy);
    //if dx does not equal to 0 or dy doesn't equal to 0, it checks the if statement on whether the music is playing or not. If the music isn't playing, it returns true and then starts the music and loops it. The loop doesn't do much here since the music track is long but is here if you wanted to toy with this for 5 mins+ (for some reason). 
    if (dx !== 0 || dy !== 0) {
      if(!music.playing) { //needs fixing
        music.start();
        //console.log("start");
        music.loop();
      }
    }
    //if the requirements of dx not equaling to 0 or dy not equaling to 0 (basically if the requirement is false), it will go to this else statement where it checks if the music is playing. if the music is playing, it will pause the music. Originally had it to music.stop() but that would just reset the music
    else {
        if (music.playing) {
          music.pause();
        }
    }
    //basically used during the demo
    let speed = 8;
    //this is for the movement
    //if the scene is strictly equal to 1, x is added to dx times 1.5 while y is added to dy times speed which is 8
    if (scene === 1) {
      x += dx * 1.5;
      y += dy * speed;
    }
    //scene 2 and 3 changes the y speed because its supposed to look like the penguin is getting farther 
    //I used an or statement for this because scenes 2 and 3 basically do the same thing but 3 adds another background. if variable scene strictly equals 2 or strictly equals 3, variables x and y change based on the multipliers
    if (scene === 2 || scene === 3) {
      x += dx * speed;
      y += dy * 0.2;
      if (dy < 0) {
        pSize -= 3;
      }
    } 
  }
  //This is essentially the same as the intital background setup but instead for my "sprites" (penguins)
  if (scene === 1) {
    image(pSide, x, y, 80, 160);
  }
  if (scene === 2 || scene === 3) {
    //used a map here to make it so that the penguin gets smaller the closer it gets to y = 0 but it looks like he is levitating; need to fix
    //pSize is updated by a map which takes the value you want to edit (y) and then has a y range of 0 to 290 and from that range, will get smaller from 160 to 10
    pSize = map(y, 0, 290, 10, 160);
    image(pBack, x - 300, y, (pSize + 40) / 2, pSize);
  }
  //Same things apply to scene strictly equals to 4
  if (scene === 4) {
    image(ice, 350, 150, 300, 300);
    image(pSide, 450, 220, 80, 160);
  }
}

//This is the switch function that we went over in class
function handleButtons(gp) {
  gp.buttons.forEach((button, index) => {
    let currentPressed = button.pressed;
    let previousPressed = pButtons[index] || false;
    
    //newly pressed
    if (currentPressed && !previousPressed) {
      switch(index) {
          //A plays scene 2
        case 0:
          scene = 2;
          break;
          
          //B plays a penguin sound
        case 1:
          eSound.play();
          break;
          
          //Y snowstorm that freezes the penguin
        case 2:
          scene = 3;
          freeze.play();
          break;
          
          //X the final scene of the penguin in ice
        case 3:
          scene = 4;
          fSound.play();
          break;
          
      }
    }
    
    pButtons[index] = currentPressed;
  });
}