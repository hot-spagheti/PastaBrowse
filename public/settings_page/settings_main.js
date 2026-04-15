import {setTheme} from "./settings_ipc.js"

const redBtn = document.getElementById("redBtn");
redBtn.addEventListener("click", () => {setTheme("red")});

const greenBtn = document.getElementById("greenBtn");
greenBtn.addEventListener("click", () => {setTheme("green")});


const blueBtn = document.getElementById("blueBtn");
blueBtn.addEventListener("click", () => {setTheme("blue")});