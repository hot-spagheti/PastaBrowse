import {setTheme} from "./settings_ipc.js"

const redBtn = document.getElementById("redBtn");
redBtn.addEventListener("click", () => {setTheme("red")});

const greenBtn = document.getElementById("greenBtn");
greenBtn.addEventListener("click", () => {setTheme("green")});


const blueBtn = document.getElementById("blueBtn");
blueBtn.addEventListener("click", () => {setTheme("blue")});

const orangeBtn = document.getElementById("orangeBtn");
orangeBtn.addEventListener("click", () => {setTheme("orange")});

const amberBtn = document.getElementById("amberBtn");
amberBtn.addEventListener("click", () => {setTheme("amber")});

const tealBtn = document.getElementById("tealBtn");
tealBtn.addEventListener("click", () => {setTheme("teal")});

const indigoBtn = document.getElementById("indigoBtn");
indigoBtn.addEventListener("click", () => {setTheme("indigo")});

const purpleBtn = document.getElementById("purpleBtn");
purpleBtn.addEventListener("click", () => {setTheme("purple")});

const pinkBtn = document.getElementById("pinkBtn");
pinkBtn.addEventListener("click", () => {setTheme("pink")});

const greyBtn = document.getElementById("greyBtn");
greyBtn.addEventListener("click", () => {setTheme("grey")});
