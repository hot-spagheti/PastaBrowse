searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", loadURL);

root_exit_btn = document.getElementById("root_exit_btn");
root_exit_btn.addEventListener("click", root_exit);

function root_exit(){
  window.api.killApp();
}

let maximized = true;

maximize_btn = document.getElementById("maximize_btn");
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
  const input = document.getElementById("url").value;
  const view = document.getElementById("view");

  let url = input;

  if (!url.startsWith("http")) {
    url = "https://" + url
  }

  view.src = url;
}

const newTabBtn = document.getElementById("newTabBtn");
newTabBtn.addEventListener("click", newTab);

/*Will later move newTabHTML into own file (templates) and import*/

const newTabHTML = `
  <div class="tab main_tab">
		<img class="tab_icon" src="" alt="">
		<p>New Tab</p>
		<button class="tabXBtn" id="tabXBtn"></button>
	</div>`

function newTab(){
  newTabBtn.previousElementSibling.classList.remove("main_tab");
  newTabBtn.insertAdjacentHTML("beforebegin", newTabHTML);
}

const tab_container = document.getElementById("tab_container");
tab_container.addEventListener("click", onClickRouter);   /*Determines the function to be executed based on emitter of click*/

function onClickRouter(e){
  if (e.target.parentElement.classList.contains("tab")){
    removeTab(e.target.parentElement);
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
}
