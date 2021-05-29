(() => {
  // Theme switch
  const body = document.body;
  const lamp = document.getElementById("mode");

  const toggleTheme = (state) => {
    if (state === "dark") {
      localStorage.setItem("theme", "light");
      body.removeAttribute("data-theme");
    } else if (state === "light") {
      localStorage.setItem("theme", "dark");
      body.setAttribute("data-theme", "dark");
    } else {
      initTheme(state);
    }
  };

  lamp.addEventListener("click", () =>
    toggleTheme(localStorage.getItem("theme"))
  );

  // Blur the content when the menu is open
  const cbox = document.getElementById("menu-trigger");

  cbox.addEventListener("change", function () {
    const area = document.querySelector(".wrapper");
    this.checked
      ? area.classList.add("blurry")
      : area.classList.remove("blurry");
  });
})();

document.addEventListener('DOMContentLoaded', onContentLoaded);

function onContentLoaded() {
  fixRougeHightlighter();
  // addActiveToggleToNavbarBurgers();
}

// function addActiveToggleToNavbarBurgers() {
//   const activeClass = 'is-active';
//   const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

//   navbarBurgers.forEach(element => {
//     element.addEventListener('click', () => {
//       const targetId = element.dataset.target;
//       const target = document.getElementById(targetId);

//       target.classList.toggle(activeClass);
//       element.classList.toggle(activeClass);
//     });
//   });
// }

function fixRougeHightlighter() {
  const codeLangKey = 'data-lang';
  const allHighlightedCode = document.getElementsByClassName('highlighter-rouge');

  for (var i = 0; i < allHighlightedCode.length; ++i) {
    const highlightedCode = allHighlightedCode[i];
    const langName = highlightedCode.classList[0].replace('language-', '');
    const codeElements = highlightedCode.getElementsByTagName('code');

    for (var j = 0; j < codeElements.length; ++j) {
      codeElements[j].setAttribute(codeLangKey, langName);
    }
  }
}