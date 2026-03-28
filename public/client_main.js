const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", loadURL);

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


function root_exit(){
  window.api.killApp();
}

let maximized = true;

const maximize_btn = document.getElementById("maximize_btn");
maximize_btn.addEventListener("click", () => {
  window.api.toggleMaximize();

  maximized = !maximized;

  if (!maximized){
    maximize_btn.querySelector("img").src = "../Icons/unmaximized.svg"
  } else{
    maximize_btn.querySelector("img").src = "../Icons/maximized.svg"
  }
})

minimize_btn = document.getElementById("minimize_btn");
minimize_btn.addEventListener("click", () => {
  window.api.minimize();
})


function loadURL(){
  const val = input.value;
  const view = document.getElementById("view");

  let url = val;

  if (!url.startsWith("http")) {
    url = "https://" + url
  }

  const id = tab_container.querySelector(".main_tab").id
  tab_list[id] = url;

  view.src = url;
  input.value = url;
}

const newTabBtn = document.getElementById("newTabBtn");
newTabBtn.addEventListener("click", newTab);

/*Will later move newTabHTML into own file (templates) and import*/


let id_count = 1

function newTab(){
  const newTabHTML = `
    <div class="tab main_tab" id="${id_count}">
      <img class="tab_icon" src="" alt="">
      <p>New Tab</p>
      <button class="tabXBtn" id="tabXBtn"></button>
    </div>`;

  tab_container.querySelector(".main_tab").classList.remove("main_tab");
  newTabBtn.insertAdjacentHTML("beforebegin", newTabHTML);

  tab_list[String(id_count)] = "";
  id_count += 1;

  input.value = "";

  reloadView();
}

const tab_container = document.getElementById("tab_container");
tab_container.addEventListener("click", onClickRouter);   


function onClickRouter(e){          /*Determines the function to be executed based on emitter of click*/
  el = e.target;
  parentEl = e.target.parentElement;
  
  if (el.classList.contains("tabXBtn")){
    removeTab(parentEl);
  } else if ((el.tagName === "IMG" && el.classList.contains("tab_icon")) || el.tagName === "P"){
    switchTab(parentEl);
  } else if (el.tagName === "DIV"){
    switchTab(el);
  }
}


function removeTab(tab){
  const previousEl = tab.previousElementSibling;
  let nextEl = tab.nextElementSibling;
  
  if (!nextEl.classList.contains("tab")){
    nextEl = null;
  }

  if (tab.classList.contains("main_tab")){
    if (previousEl !== null){
      previousEl.classList.add("main_tab")
      tab.remove();
    } else if (nextEl !== null){
      nextEl.classList.add("main_tab");
      tab.remove();
    } else {
      root_exit();
    }
  
  } else {
    if (previousEl !== null || nextEl !== null){
      tab.remove();
    } else {
      root_exit();
    }
  }

  const newTab = tab_container.querySelector(".main_tab");

  if (tab_list[newTab.id] !== ""){
    loadURLfromTabList(newTab);
  } else {
    reloadView();
  }
}

let tab_list = {
  "0": "",
}


function switchTab(tab){
  tab_container.querySelector(".main_tab").classList.remove("main_tab");
  tab.classList.add("main_tab");
  
  if (tab_list[tab.id] !== ""){
    loadURLfromTabList(tab);
  } else {
    reloadView();
  }
}

function loadURLfromTabList(tab){
  const view = document.getElementById("view");
  const id = tab.id;
  const url = tab_list[id];

  view.src = url;
  
  if (url !== "about:blank"){
    input.value = url;
  } else {
    input.value = "";
  }
}


function reloadView(){
  document.querySelector("webview").remove();

  const newView = document.createElement("webview");
  newView.src = "about:blank";
  newView.id = "view";
  newView.classList.add("view");

  newView.addEventListener("did-navigate", saveNav);
  newView.addEventListener("did-navigate-in-page", saveNav);

  document.body.appendChild(newView);
}

function saveNav(e){
  const id = tab_container.querySelector(".main_tab").id
  const view = document.getElementById("view");

  tab_list[id] = e.url;
  
  if (e.url !== "about:blank"){
    input.value = e.url;
  } else{
    input.value = "";
  }
}

const initalView = document.getElementById("view");
initalView.addEventListener("did-navigate", saveNav);
initalView.addEventListener("did-navigate-in-page", saveNav);