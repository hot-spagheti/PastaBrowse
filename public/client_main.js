import {loadURL, saveNav, refresh, history_backward, history_forward, tab_list} from "./navigation.js";
import {newTab, removeTab, setTitleAndFavIcon, switchTab, loadLastSesh} from "./tabs.js";
import {root_exit, toggleMaximize, minimize, onCtrlT, onCtrlW, getHistory, onResHistory} from "./ipc.js";

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {console.log(tab_list)});

const input = document.getElementById("url");
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter"){
    loadURL();
  }
})

input.addEventListener("focus", () => {
  input.select();
})


const root_exit_btn = document.getElementById("root_exit_btn");
root_exit_btn.addEventListener("click", root_exit);


const maximize_btn = document.getElementById("maximize_btn");
maximize_btn.addEventListener("click", toggleMaximize);


const minimize_btn = document.getElementById("minimize_btn");
minimize_btn.addEventListener("click", minimize);


const newTabBtn = document.getElementById("newTabBtn");
newTabBtn.addEventListener("click", newTab);


const tab_container = document.getElementById("tab_container");
tab_container.addEventListener("click", onClickRouter);   


function onClickRouter(e){          /*Determines the function to be executed based on emitter of click*/
  const el = e.target;
  const parentEl = e.target.parentElement;
  
  if (el.classList.contains("tabXBtn")){
    removeTab(parentEl);
  } else if ((el.tagName === "IMG" && el.classList.contains("tab_icon")) || el.tagName === "P"){
    switchTab(parentEl);
  } else if (el.tagName === "DIV"){
    switchTab(el);
  }
}


const initalView = document.getElementById("view_0");
initalView.addEventListener("did-navigate", saveNav);
initalView.addEventListener("did-navigate-in-page", saveNav);


const refreshBtn = document.getElementById("refreshBtn");
refreshBtn.addEventListener("click", refresh);


onCtrlT(() => {
  newTab();
})


onCtrlW(() => {
  const tab_container = document.getElementById("tab_container");
  const tab = tab_container.querySelector(".main_tab");

  removeTab(tab);
})


const history_backward_btn = document.getElementById("backwardBtn")
history_backward_btn.addEventListener("click", history_backward);

const history_forward_btn = document.getElementById("forwardBtn");
history_forward_btn.addEventListener("click", history_forward);

const loadLastSeshBtn = document.getElementById("loadLastSeshBtn");
loadLastSeshBtn.addEventListener("click", getHistory);

onResHistory((data) => {
  loadLastSesh(data);
})