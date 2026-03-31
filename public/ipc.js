export function root_exit(){
  window.api.killApp();
};


let maximized = true;

export function toggleMaximize(){
  window.api.toggleMaximize();

  maximized = !maximized;

  if (!maximized){
    maximize_btn.querySelector("img").src = "../Icons/unmaximized.svg"
  } else{
    maximize_btn.querySelector("img").src = "../Icons/maximized.svg"
  }
};


export function minimize(){
  window.api.minimize();
};


export function onCtrlT(callback){
  window.api.onCtrlT(callback);
}