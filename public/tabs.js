import {tab_list, reloadView, loadURLfromTabList, refresh} from "./navigation.js";
import {root_exit} from "./ipc.js";

let id_count = 1

export function newTab(){
  const newTabHTML = `
    <div class="tab main_tab" id="${id_count}">
      <img id="tab_icon" class="tab_icon" src="" alt="">
      <p>New Tab</p>
      <button class="tabXBtn" id="tabXBtn"><img src="../Icons/close.svg" alt="x"></button>
    </div>`;

  const tab_container = document.getElementById("tab_container");
  const newTabBtn = document.getElementById("newTabBtn");
  const input = document.getElementById("url");

  tab_container.querySelector(".main_tab").classList.remove("main_tab");
  newTabBtn.insertAdjacentHTML("beforebegin", newTabHTML);

  tab_list[String(id_count)] = "";
  id_count += 1;

  input.value = "";

  reloadView();
}


export function removeTab(tab){
  const tab_container = document.getElementById("tab_container");
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

  refresh();
}


export function switchTab(tab){
  const tab_container = document.getElementById("tab_container");
  tab_container.querySelector(".main_tab").classList.remove("main_tab");
  tab.classList.add("main_tab");
  
  if (tab_list[tab.id] !== ""){
    loadURLfromTabList(tab);
  } else {
    reloadView();
  }
}


export async function setTitleAndFavIcon(){
  const webview = document.getElementById("view");
  const tab_container = document.getElementById("tab_container");
  const main_tab = tab_container.querySelector(".main_tab");
  const p = main_tab.querySelector("p");
  const img = main_tab.querySelector(".tab_icon");
  
  const title = handleTitle(await webview.executeJavaScript("document.title"));

  if (title){
    p.innerHTML = title;
  }
}

function handleTitle(title){
  if (!title){
    return ""
  }
  
  let newTitle = title.split(" ")

  return newTitle[0];
}