import {tab_list, saveNav, setIsRestoringSession} from "./navigation.js";
import {root_exit} from "./ipc.js";
import {setTheme} from "./themes.js"

let id_count = 1

export function newTab(isSettings = false){
  const newTabHTML = `
    <div class="tab main_tab" id="tab_${isSettings ? "settings" : id_count}">
      <img src="" alt="">
      <p class="tab_title">New Tab</p>
      <button class="tabXBtn" id="tabXBtn"><img src="../Icons/close.svg" alt="x"></button>
    </div>`;

  const tab_container = document.getElementById("tab_container");
  const newTabBtn = document.getElementById("newTabBtn");
  const input = document.getElementById("url");

  const oldTab = tab_container.querySelector(".main_tab");

  oldTab.classList.add("side_tab");
  oldTab.querySelector(".tabXBtn").classList.add("side_tabXBtn");
  oldTab.classList.remove("main_tab");
  
  newTabBtn.insertAdjacentHTML("beforebegin", newTabHTML);

  newWebview(isSettings);
  input.value = "";

  if (!isSettings){
    tab_list["tabs"].push(
      {
        "tab_id": id_count,
        "title": "New Tab",
        "favicon_url": null,
        "history_url_id": 0, 
        "tab_history": []
      }
    ) 
  
    tab_list["main_tab_id"] = id_count;
    id_count += 1;
  }
}


export function removeTab(tab){
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
  const oldTab = tab_container.querySelector(".main_tab");


  oldTab.classList.add("side_tab");
  oldTab.querySelector(".tabXBtn").classList.add("side_tabXBtn");
  oldTab.classList.remove("main_tab");

  tab.classList.remove("side_tab");
  tab.querySelector(".tabXBtn").classList.remove("side_tabXBtn");
  tab.classList.add("main_tab");

  const tab_id = Number(tab.id.slice(4));

  if (tab_id || tab_id === 0){
    tab_list["main_tab_id"] = tab_id;
    
    const input = document.getElementById("url");
    const tab_obj = tab_list["tabs"].find(obj => obj["tab_id"] === tab_id);
    const url = tab_obj["tab_history"][tab_obj["history_url_id"]];

    if (url !== undefined){
      input.value = url;
    } else {
      input.value = "";
    }
  }
  
  const view_container = document.getElementById("webview_container");
  const oldView = view_container.querySelector(".main_view");

  oldView.classList.remove("main_view");
  oldView.classList.add("bg_view");

  const newView = document.getElementById(`view_${tab.id.slice(4)}`);

  newView.classList.remove("bg_view");
  newView.classList.add("main_view");
}


export async function setTitleAndFavIcon(url){
  const webview_container = document.getElementById("webview_container");
  const webview = webview_container.querySelector(".main_view");

  const tab_container = document.getElementById("tab_container");
  const main_tab = tab_container.querySelector(".main_tab");
  const tab_id = main_tab.id.slice(4);
  const tab_obj = tab_list["tabs"].find(obj => obj["tab_id"] === Number(tab_id));

  const p = main_tab.querySelector("p");
  const img = main_tab.firstElementChild;
  
  const title = await webview.executeJavaScript("document.title");
  
  if (title){
    p.innerHTML = title;
    tab_obj["title"] = title;
  }

  const favIconSize = 64;

  if (!img.classList.contains("tab_icon")){
    img.classList.add("tab_icon")
  }

  const favicon_url = `https://www.google.com/s2/favicons?domain=${url}&sz=${String(favIconSize)}`; 

  img.src = favicon_url;
  tab_obj["favicon_url"] = favicon_url;
}


export function loadLastSesh(data){
  setIsRestoringSession(true);

  const promises = [];

  for (let tab_obj of data["tabs"]){
    newTab();

    const tab_container = document.getElementById("tab_container");
    const main_tab = tab_container.querySelector(".main_tab");
    const tab_id = main_tab.id.slice(4);

    const tab_in_tabList = tab_list["tabs"].find(obj => obj["tab_id"] === Number(tab_id));

    tab_in_tabList["history_url_id"] = tab_obj["history_url_id"];
    tab_in_tabList["tab_history"] = tab_obj["tab_history"];
    
    if (tab_obj["title"]){
      main_tab.querySelector("p").innerHTML = tab_obj["title"];
      tab_in_tabList["title"] = tab_obj["title"];
    }

    if (tab_obj["favicon_url"]){
      main_tab.querySelector("img").src = tab_obj["favicon_url"];
      main_tab.querySelector("img").classList.add("tab_icon");
      tab_in_tabList["favicon_url"] = tab_obj["favicon_url"];
    }

    const input = document.getElementById("url");
    const view = document.getElementById(`view_${tab_id}`);
    const tab = document.getElementById(`tab_${tab_id}`);

    const target_url = tab_in_tabList["tab_history"][tab_in_tabList["history_url_id"]];

    const p = new Promise((resolve) => {
      view.addEventListener("did-navigate", resolve, {once: true});
      view.addEventListener("did-navigate-in-page", resolve, {once: true});
    });

    promises.push(p)

    view.src = target_url;

    if (target_url && target_url !== "about:blank"){
      input.value = target_url;
    }
  }

  Promise.all(promises).then(() => {
    setIsRestoringSession(false);
  })
}


function newWebview(isSettings = false){
  const webview_container = document.getElementById("webview_container");
  const oldMainView = webview_container.querySelector(".main_view");

  oldMainView.classList.remove("main_view");
  oldMainView.classList.add("bg_view");

  const newView = document.createElement("webview");

  newView.classList.add("view");
  newView.classList.add("main_view");

  newView.id = `view_${isSettings ? "settings" : id_count}`;

  if (!isSettings){
    const captured_id = id_count;

    newView.addEventListener("did-navigate", (e) => saveNav(e, captured_id));
    newView.addEventListener("did-navigate-in-page", (e) => saveNav(e, captured_id));
  }

  webview_container.appendChild(newView);
}


export function openSettings(settingsPreloadPath){
  const settings_tab = document.getElementById("tab_settings"); 
  
  if (settings_tab){
    switchTab(settings_tab);
    return;
  }

  newTab(true);

  const view_container = document.getElementById("webview_container");
  const main_view = view_container.querySelector(".main_view");

  const tab_container = document.getElementById("tab_container");
  const main_tab = tab_container.querySelector(".main_tab");

  main_tab.querySelector("p").innerHTML = "Settings";

  main_view.setAttribute("preload", settingsPreloadPath);
  main_view.src = "./settings_page/settings.html";

  main_view.addEventListener("ipc-message", (event) => {

    if (event.channel === "theme-change"){
      const variant = event.args[0];
      setTheme(variant);
    }
  })
}
