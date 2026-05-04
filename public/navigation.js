import {setTitleAndFavIcon} from "./tabs.js"; 

let isProgrammaticNav = false;
let isRestoringSession = false;


export function setIsProgrammaticNav(val){
  isProgrammaticNav = val;
}


export function setIsRestoringSession(val){
  isRestoringSession = val;
}


export let tab_list = {
  "main_tab_id": 0,
  "tabs": [
    {
      "tab_id": 0,
      "history_url_id": 0,
      "tab_history": []
    }
  ]
}

export function loadURL(){
  const input = document.getElementById("url");
  let trimmed_input = input.value.trim();

  const tab_container = document.getElementById("tab_container");

  const webview_container = document.getElementById("webview_container");
  const view = webview_container.querySelector(".main_view");

  const search_engines = [
    "https://www.google.com/search?q=",
    "https://www.duckduckgo.com/?q=",
    "https://www.bing.com/?q="
  ];

  if (isURL(trimmed_input)){
    const url = ensureProtocol(trimmed_input);

    view.src = url;
    input.value = url;
    const id = tab_container.querySelector(".main_tab").id

  } else {
    const search_engine_select = document.getElementById("search_engine_select");
    const s_e = Number(search_engine_select.value);

    const url = search_engines[s_e] + encodeURIComponent(trimmed_input);

    view.src = url;
    input.value = url;
    const id = tab_container.querySelector(".main_tab").id
  }
}


function isURL(input){
  if (/^https?:\/\//i.test(input)){return true};    /* starts with http | https | HTTP | HTTPS*/
  if (/^([\w-]+\.)+[\w-]{2,}(:\d+)?(\/\S*)?$/.test(input)){return true};    /*common TLDs without protocol*/
  if (/^localhost(:\d+)?(\/\S*)?$/.test(input)){return true};    /*localhost*/
  if (/^\d{1,3}(\.\d{1,3}){3}(:\d+)?(\/\S*)?$/.test(input)){return true};    /*IP adress*/

  return false
}


function ensureProtocol(url){
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}


export function loadURLfromTabList(tab, h = 0){
  const input = document.getElementById("url");
  const webview_container = document.getElementById("webview_container");
  const view = webview_container.querySelector(".main_view");

  const tab_id = tab["tab_id"];
  const newTab = tab_list["tabs"].find(obj => obj["tab_id"] === Number(tab_id));

  if (newTab["tab_history"][newTab["history_url_id"] + h] !== undefined){
    newTab["history_url_id"] += h;
    const url = newTab["tab_history"][newTab["history_url_id"]];
    
    view.src = url;
  
    if (url !== "about:blank"){
      input.value = url;
    } else {
      input.value = "";
    }
  } else {
    console.error("Tab History index out of range");
  }
}


export function saveNav(e, tab_id){          /*refactor to support settings behavior*/
  if (isRestoringSession){
    return;
  }

  if (e.url === "about:blank"){
    return;
  }

  const id = tab_id !== undefined
    ? tab_id
    : Number(document.getElementById("tab_container").querySelector(".main_tab").id.slice(4));

  const isActiveTab = (id === tab_list["main_tab_id"]);
  const input = document.getElementById("url");

  if (isProgrammaticNav && isActiveTab){
    isProgrammaticNav = false;

    if (e.url !== "about:blank"){
      input.value = e.url;
    } else{
      input.value = "";
    }

    setTitleAndFavIcon(e.url);
    return;
  }

  const tab = tab_list["tabs"].find(obj => obj["tab_id"] === Number(id));
  if (!tab){
    return;
  }

  if (e.url !== tab["tab_history"][tab["history_url_id"]]){
    tab["tab_history"].push(e.url);
    tab["history_url_id"] = tab["tab_history"].length - 1;
  }

  if (isActiveTab){
    if (e.url !== "about:blank"){
      input.value = e.url;
    } else{
      input.value = "";
    }
    
    setTitleAndFavIcon(e.url);
  }
}


export function refresh(){
  const tab_container = document.getElementById("tab_container");
  const newTabId = tab_container.querySelector(".main_tab").id.slice(4);
  const newTab = tab_list["tabs"].find(obj => obj["tab_id"] === Number(newTabId));

  if (newTab["tab_history"][newTab["history_url_id"]] !== ""){
    loadURLfromTabList(newTab);
  }
}


export function history_backward(){
  const tab_container = document.getElementById("tab_container");
  const tab_id = tab_container.querySelector(".main_tab").id.slice(4);
  const tab = tab_list["tabs"].find(obj => obj["tab_id"] === Number(tab_id))

  isProgrammaticNav = true;
  loadURLfromTabList(tab, -1);
}

export function history_forward(){
  const tab_container = document.getElementById("tab_container");
  const tab_id = tab_container.querySelector(".main_tab").id.slice(4);
  const tab = tab_list["tabs"].find(obj => obj["tab_id"] === Number(tab_id))

  isProgrammaticNav = true;
  loadURLfromTabList(tab, 1);
}
