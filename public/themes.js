const root = document.documentElement;

export function setTheme(variant){
  try {
    root.classList = variant;
  } catch (er){
    console.error(er);
  }
};
