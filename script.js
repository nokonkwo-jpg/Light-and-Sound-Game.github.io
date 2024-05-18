//Add your global variables here
let pattern = [2, 2, 1, 4, 3, 1, 4, 2];
let progress = 0; 
let gamePlaying = false;
let tonePlaying = false;
let volume = 0.5;
let clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
let guessCounter = 0;

// store the start and stop buttons
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const backGroundMusic = new Audio("video/music.mp3");


// Add your functions here
function startGame(){
  progress = 0;
  gamePlaying = true;
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  playClueSequence();
  backGroundMusic.pause();
}

function stopGame(){
  gamePlaying = false;
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
  backGroundMusic.play();
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  context.resume()
  let delay = nextClueWaitTime;
  guessCounter = 0;
  for(let i=0;i<=progress;i++){
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i])
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  loseVideo.style.display = "block";
  loseVideo.play();
  setTimeout(function(){
    loseVideo.style.display = "none";
    loseVideo.pause();
    loseVideo.currentTime = 0;
  }, 10000);
}

function winGame(){
  stopGame();
  winVideo.innerHTML = '<div style="width:480px"><iframe allow="fullscreen" frameBorder="0" height="270" src="https://giphy.com/embed/v5hOTLNwu2jPbuJqw2/video" width="480"></iframe></div>';
  winVideo.style.display = "block";
  setTimeout(function(){
    winVideo.style.display = "none";
    winVideo.currentTime = 0;
  }, 10000);
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }
      else{
        progress++;
        playClueSequence();
      }
    }
    else{
      guessCounter++;
    }
  }
  else{
    loseGame();
  }
}    

// Sound Synthesis Functions for Steps 6-8
// You do not need to edit the below code
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext 
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)