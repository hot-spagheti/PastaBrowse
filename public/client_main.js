searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", loadURL);

root_exit_btn = document.getElementById("root_exit_btn");
root_exit_btn.addEventListener("click", () => {
  window.api.killApp();
});

maximize_btn = document.getElementById("maximize_btn");
maximize_btn.addEventListener("click", () => {
  window.api.toggleMaximize();
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
