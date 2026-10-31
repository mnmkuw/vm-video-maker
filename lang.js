/* VM site language switcher. Without JS the English block shows. */
(function () {
  var KEY = 'vm-lang';
  var SUPPORTED = ['en', 'ar', 'zh', 'ru', 'fr', 'es'];
  var blocks = document.querySelectorAll('[data-lang]');
  var buttons = document.querySelectorAll('[data-set-lang]');
  var nav = document.querySelector('.langs');

  function stored() {
    try {
      var v = window.localStorage.getItem(KEY);
      return SUPPORTED.indexOf(v) > -1 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function save(code) {
    try {
      window.localStorage.setItem(KEY, code);
    } catch (e) { /* storage unavailable: ignore */ }
  }

  function fromBrowser() {
    var list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).toLowerCase().split('-')[0];
      if (SUPPORTED.indexOf(code) > -1) return code;
    }
    return 'en';
  }

  function apply(code) {
    var active = null;
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      var on = b.getAttribute('data-lang') === code;
      b.hidden = !on;
      if (on) active = b;
    }
    if (!active) return;
    var root = document.documentElement;
    root.lang = active.getAttribute('lang') || code;
    root.dir = active.getAttribute('dir') || 'ltr';
    var title = active.getAttribute('data-title');
    if (title) document.title = title;
    for (var j = 0; j < buttons.length; j++) {
      var btn = buttons[j];
      btn.setAttribute('aria-pressed', btn.getAttribute('data-set-lang') === code ? 'true' : 'false');
    }
  }

  for (var k = 0; k < buttons.length; k++) {
    buttons[k].addEventListener('click', function () {
      var code = this.getAttribute('data-set-lang');
      save(code);
      apply(code);
    });
  }

  if (nav) nav.hidden = false;
  apply(stored() || fromBrowser());
})();
