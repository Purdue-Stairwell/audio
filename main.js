import './style.css'
import io from 'socket.io-client';
import {Howl} from 'howler';


const socket = io("wss://navinate.com", { secure: true });
console.log("connected to websocket");

socket.on("backend to visual", (points, who5, sprite, colorVar, base) => {
  handleData();
});


let isgoldenHour = false;

let base;
let spawn_pitches = [];
let nonGoldenHourTracks = [];
let goldenHourLoud = [];
let goldenHourQuiet = [];

let playButton = document.getElementById("play");
let dummyButton = document.getElementById("dummy");
let time = document.getElementById("time");
let progress = document.getElementById("loading");
let dataContainer = document.getElementById("data-container");

playButton.addEventListener("click", () => {toggleMode(!isgoldenHour)});  
dummyButton.addEventListener("click", handleData);


function loadFiles() {
  //load base
  base = new Howl({
    src: ['/sounds/base.mp3'],
    autoplay: true,
    loop: true,
  });
  progress.value +=10;

  //load spawn_pitches
  for(let i = 1; i <= 8; i++) {
    spawn_pitches.push(new Howl({
      src: ['/sounds/spawn_pitches/spawn_pitches_' + i + '.mp3']
    }));
  }
  progress.value +=10;   

  //load nonGoldenHourTracks
  nonGoldenHourTracks.push(new Howl({
    src: ['/sounds/cello.mp3']
  }));
  nonGoldenHourTracks.push(new Howl({
    src: ['/sounds/glacier.mp3']
  }));
  nonGoldenHourTracks.push(new Howl({
    src: ['/sounds/plucks.mp3']
  }));
  progress.value +=10;

  //load goldenHourLoud tracks
  goldenHourLoud.push(new Howl({
    src: ['/sounds/barum.mp3'],
    loop: true,
  }));
  goldenHourLoud.push(new Howl({
    src: ['/sounds/cello.mp3'],
    loop: true,
  }));
  goldenHourLoud.push(new Howl({
    src: ['/sounds/glacier.mp3'],
    loop: true,
  }));
  progress.value +=10;

  //load goldenHourQuiet tracks
  goldenHourQuiet.push(new Howl({
    src: ['/sounds/irack.mp3'],
    loop: true,
  }));
  goldenHourQuiet.push(new Howl({
    src: ['/sounds/plucks.mp3'],
    loop: true,
  }));
  progress.value +=10;

  console.log("loaded all files");
  timeLoop();
  console.log("playing");
  
}

function timeLoop() {
  let isSixPM = new Date().getHours() === 18 ? true : false;
  let isSevenPM = new Date().getHours() === 19 ? true : false;
  time.innerHTML = new Date().getHours() + " : " + new Date().getMinutes() + " : " + new Date().getSeconds();
  
  if (isSixPM) {
    toggleMode(true);
  } else if (isSevenPM) {
    toggleMode(false);
  }
  setTimeout(timeLoop, 1000);
}

function handleData() {
  // play spawn noise
  spawn_pitches[Math.random() * spawn_pitches.length | 0].play();

  //check if golden hour
  if (isgoldenHour) {

    let tempArray = [];

    //make two tracks louder and two tracks quieter
    popRandomTwoValues(goldenHourQuiet).forEach(track => {
      track.volume(1);
      tempArray.push(track);
    });
    popRandomTwoValues(goldenHourLoud).forEach(track => {
      track.volume(0.5);
      goldenHourQuiet.push(track);
    });
    goldenHourLoud.push(...tempArray);
  } else {
    let soundIndexToPlay = Math.random() * nonGoldenHourTracks.length | 0;
    nonGoldenHourTracks[soundIndexToPlay].play();
    nonGoldenHourTracks[soundIndexToPlay].fade(0, 1, 1000);
  }
}

/**
 * handles the entering and exiting logic of golden hour
 * @param {boolean} mode the vale to set isgoldenHour to 
 */
function toggleMode(mode) {
  isgoldenHour = mode
  time.style.color = isgoldenHour ? "gold" : "black";
  if (isgoldenHour) {
    for(let track of goldenHourLoud) {
      track.play();
      track.fade(0,1,3000);
    }
    for(let track of goldenHourQuiet) {
      track.play();
      track.fade(0,1,3000);
    }
  } else {
    for(let track of goldenHourLoud) {
      track.fade(1,0,3000);
      track.on('fade', ()=> {
        if (track.volume() === 0) track.stop();
      });
    }
    for(let track of goldenHourQuiet) {
      track.fade(1,0,3000);
      track.on('fade', ()=> {
        if (track.volume() === 0) track.stop();
      });
    }
  }
}

function popRandomTwoValues(arr) {
  // Make sure the array has at least 2 elements
  if (arr.length < 2) {
    throw new Error("Array should have at least 2 elements");
  }

  // Get the first random index and remove the element from the array
  const index1 = Math.floor(Math.random() * arr.length);
  const value1 = arr.splice(index1, 1)[0];

  // Get the second random index and remove the element from the array
  const index2 = Math.floor(Math.random() * arr.length);
  const value2 = arr.splice(index2, 1)[0];

  return [value1, value2];
}

loadFiles();


