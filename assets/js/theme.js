(function() {
  var key = 's1-theme';
  var html = document.documentElement;

  function apply(theme) {
    html.classList.remove('dark', 'light');
    if (theme) html.classList.add(theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = html.classList.contains('dark') ? '\u25D0' : '\u25D1';
  }

  function toggle() {
    var isDark = html.classList.contains('dark');
    var next = isDark ? 'light' : 'dark';
    localStorage.setItem(key, next);
    apply(next);
  }

  var saved = localStorage.getItem(key);
  if (saved) apply(saved);

  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = html.classList.contains('dark') ? '\u25D0' : '\u25D1';
      btn.addEventListener('click', toggle);
    }
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem(key)) apply(e.matches ? 'dark' : 'light');
  });
})();
