import {tab_list, reloadView, loadURLfromTabList} from "./navigation.js";
import {root_exit} from "./window-controls.js";

let id_count = 1

export function newTab(){
  const newTabHTML = `
    <div class="tab main_tab" id="${id_count}">
      <img class="tab_icon" src="" alt="">
      <p>New Tab</p>
      <button class="tabXBtn" id="tabXBtn"></button>
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

  const newTab = tab_container.querySelector(".main_tab");

  if (tab_list[newTab.id] !== ""){
    loadURLfromTabList(newTab);
  } else {
    reloadView();
  }
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