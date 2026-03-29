export let tab_list = {
  "0": "",
}

export function loadURL(){
  const input = document.getElementById("url");
  const val = input.value;
  const tab_container = document.getElementById("tab_container");
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


export function loadURLfromTabList(tab){
  const input = document.getElementById("url");
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


export function reloadView(){
  document.querySelector("webview").remove();

  const newView = document.createElement("webview");
  newView.src = "about:blank";
  newView.id = "view";
  newView.classList.add("view");

  newView.addEventListener("did-navigate", saveNav);
  newView.addEventListener("did-navigate-in-page", saveNav);

  document.body.appendChild(newView);
}


export function saveNav(e){
  const tab_container = document.getElementById("tab_container");
  const id = tab_container.querySelector(".main_tab").id;
  const input = document.getElementById("url");
  const view = document.getElementById("view");

  tab_list[id] = e.url;
  
  if (e.url !== "about:blank"){
    input.value = e.url;
  } else{
    input.value = "";
  }
}