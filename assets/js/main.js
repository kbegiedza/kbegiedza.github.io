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
    const toggle = document.getElementById('theme-toggle');
    const toggleIcon = toggle.getElementsByTagName('i')[0];

    if (theme == 'dark') {
        document.body.removeAttribute('theme')
        toggleIcon.classList.replace('fas', 'far')
    }
    else {
        document.body.setAttribute('theme', theme)
        toggleIcon.classList.replace('far', 'fas')
    }

    localStorage.setItem('theme', theme);
}

function swapTheme() {
    let theme = localStorage.getItem('theme');

    if (theme == 'dark') {
        theme = 'light';
    }
    else {
        theme = 'dark';
    }

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