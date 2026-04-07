import {tab_list, loadURLfromTabList, refresh, history_backward, saveNav, setIsProgrammaticNav} from "./navigation.js";
import {root_exit, getHistory} from "./ipc.js";

let id_count = 1

export function newTab(){
  const newTabHTML = `
    <div class="tab main_tab" id="tab_${id_count}">
      <img id="tab_icon" class="tab_icon" src="" alt="">
      <p class="tab_title">New Tab</p>
      <button class="tabXBtn" id="tabXBtn"><img src="../Icons/close.svg" alt="x"></button>
    </div>`;

  const tab_container = document.getElementById("tab_container");
  const newTabBtn = document.getElementById("newTabBtn");
  const input = document.getElementById("url");

  tab_container.querySelector(".main_tab").classList.remove("main_tab");
  newTabBtn.insertAdjacentHTML("beforebegin", newTabHTML);

  tab_list["tabs"].push(
    {
      "tab_id": id_count,
      "history_url_id": 0, 
      "tab_history": [""]
    }
  ) 
  
  tab_list["main_tab_id"] = id_count;

  newWebview();

  id_count += 1;

  input.value = "";
}


export function removeTab(tab){
  const tab_container = document.getElementById("tab_container");

  const previousEl = tab.previousElementSibling;
  let nextEl = tab.nextElementSibling;
  
  if (!nextEl.classList.contains("tab")){
    nextEl = null;
  }

  if (tab.classList.contains("main_tab")){
    if (nextEl !== null){
      switchTab(nextEl);
      tab.remove();
    } else if (previousEl !== null){
      switchTab(previousEl);
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
}


export function switchTab(tab){
  const tab_container = document.getElementById("tab_container");
  tab_container.querySelector(".main_tab").classList.remove("main_tab");
  tab.classList.add("main_tab");

  tab_list["main_tab_id"] = tab.id.slice(4);
  
  const view_container = document.getElementById("webview_container");
  const oldView = view_container.querySelector(".main_view");

  oldView.classList.remove("main_view");
  oldView.classList.add("bg_view");

  const newView = document.getElementById(`view_${tab.id.slice(4)}`);

  newView.classList.remove("bg_view");
  newView.classList.add("main_view");
}


export async function setTitleAndFavIcon(){
  const webview_container = document.getElementById("webview_container");
  const webview = webview_container.querySelector(".main_view");

  const tab_container = document.getElementById("tab_container");
  const main_tab = tab_container.querySelector(".main_tab");

  const p = main_tab.querySelector("p");
  const img = main_tab.querySelector(".tab_icon");
  
  const title = await webview.executeJavaScript("document.title");

  if (title){
    p.innerHTML = title;
  }
}


export function loadLastSesh(data){
  for (let tab_obj of data["tabs"]){
    newTab();

    const tab_container = document.getElementById("tab_container");
    const tab_id = tab_container.querySelector(".main_tab").id.slice(4);

    const tab_in_tabList = tab_list["tabs"].find(obj => obj["tab_id"] === Number(tab_id));

    tab_in_tabList["history_url_id"] = tab_obj["history_url_id"];
    tab_in_tabList["tab_history"] = tab_obj["tab_history"];
    
    setIsProgrammaticNav(true);
    loadURLfromTabList(tab_in_tabList);
  }
}

function newWebview(){
  const webview_container = document.getElementById("webview_container");
  const oldMainView = webview_container.querySelector(".main_view");

  oldMainView.classList.remove("main_view");
  oldMainView.classList.add("bg_view");

  const newView = document.createElement("webview");
  newView.id = `view_${id_count}`;

  newView.classList.add("view");
  newView.classList.add("main_view");

  newView.addEventListener("did-navigate", saveNav);
  newView.addEventListener("did-navigate-in-page", saveNav);

  webview_container.appendChild(newView);
}