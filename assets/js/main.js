document.addEventListener('DOMContentLoaded', onContentLoaded);

function onContentLoaded() {
    const theme = localStorage.getItem('theme');

    updateTheme(theme);
    addThemeToggle();

    fixRougeHightlighter();
    addActiveToggleToNavbarBurgers();
}

function addThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    toggle.onclick = swapTheme;
}

function updateTheme(theme) {
    loadUtterances(theme)

    const toggle = document.getElementById('theme-toggle');
    const toggleIcon = toggle.getElementsByTagName('i')[0];

    if (theme == 'dark') {
        document.body.removeAttribute('theme')
        toggleIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill')
    }
    else {
        document.body.setAttribute('theme', theme)
        toggleIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill')
    }

    localStorage.setItem('theme', theme);
}

function swapTheme() {
    const theme = localStorage.getItem('theme') == 'dark' ? 'light' : 'dark';

    updateTheme(theme);
}

function addActiveToggleToNavbarBurgers() {
    const activeClass = 'is-active';
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    navbarBurgers.forEach(element => {
        element.addEventListener('click', () => {
            const targetId = element.dataset.target;
            const target = document.getElementById(targetId);

            target.classList.toggle(activeClass);
            element.classList.toggle(activeClass);
        });
    });
}

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

function loadUtterances(theme) {
    const container = document.getElementById("utterances");
    if (container !== null) {
        container.innerHTML = '';

        const script = document.createElement("script");
        script.setAttribute("src", "https://utteranc.es/client.js");
        script.setAttribute("repo", "Ursanon/ursanon.github.io");
        script.setAttribute("issue-term", "pathname");
        script.setAttribute("theme", theme == 'dark' ? "dark-blue" : "github-light");
        script.setAttribute("crossorigin", "anonymous");
        script.setAttribute("async", "true");

        container.appendChild(script);
    }
}