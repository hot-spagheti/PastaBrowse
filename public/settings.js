import {newTab, switchTab} from "./tabs.js";

export let settings = {};

export function openSettings(preloadPath) {
  const settings_tab = document.getElementById("tab_settings");

  if (settings_tab) {
    switchTab(settings_tab);
    return;
  }

  newTab(true);

  const view_container = document.getElementById("webview_container");
  const main_view = view_container.querySelector(".main_view");

  const tab_container = document.getElementById("tab_container");
  const main_tab = tab_container.querySelector(".main_tab");

  main_tab.querySelector("p").innerHTML = "Settings";
  
  main_view.setAttribute("preload", preloadPath);
  main_view.src = "./settings_page/settings.html";

  main_view.addEventListener("ipc-message", (event) => {
    if (event.channel === "theme-change") {
      const variant = event.args[0];
      settings["theme"] = variant;
      setTheme(variant);
    }
  })
}

export function setTheme(variant){
  try {
    document.documentElement.classList = variant;
  } catch (er){
    console.error(er);
  }
};