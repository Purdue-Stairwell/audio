import './style.css'
import io from 'socket.io-client';
import {Howl, Howler} from 'howler';

const socket = io("wss://navinate.com", { secure: true });
console.log("connected to websocket");


socket.on("backend to visual", (points, who5, sprite, colorVar, base) => {
	
});

let baseSound;

function loadFiles() {
  baseSound = new Howl({
    src: ['./public/base.mp3']
  });
}

function play() {
  baseSound.play();
}

document.getElementById("play").addEventListener("click", play);
