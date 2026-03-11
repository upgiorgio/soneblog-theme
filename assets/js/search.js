(function() {
  var overlay = document.getElementById('search-overlay');
  var input = document.getElementById('search-overlay-input');
  var results = document.getElementById('search-overlay-results');
  var hint = document.getElementById('search-overlay-hint');
  var toggleBtn = document.getElementById('search-toggle');
  if (!overlay || !input) return;

  var fuse = null;
  var loaded = false;

  function loadIndex() {
    if (loaded) return;
    loaded = true;
    fetch('/index.json')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var script = document.createElement('script');
        script.src = '/js/vendor/fuse.min.js';
        script.onload = function() {
          fuse = new Fuse(d, {
            keys: [
              { name: 'title', weight: 0.4 },
              { name: 'content', weight: 0.3 },
              { name: 'tags', weight: 0.2 },
              { name: 'categories', weight: 0.1 }
            ],
            threshold: 0.3,
            includeMatches: true,
            minMatchCharLength: 2
          });
        };
        document.head.appendChild(script);
      });
  }

  function openSearch() {
    loadIndex();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { input.focus(); }, 100);
  }

  function closeSearch() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
    if (hint) hint.style.display = '';
  }

  function doSearch() {
    var query = input.value.trim();
    if (!query || !fuse) {
      results.innerHTML = '';
      if (hint) hint.style.display = '';
      return;
    }
    if (hint) hint.style.display = 'none';

    var found = fuse.search(query).slice(0, 8);
    if (found.length === 0) {
      results.innerHTML = '<div class="search-empty">未找到相关内容</div>';
      return;
    }

    results.innerHTML = found.map(function(r) {
      var item = r.item;
      return '<a href="' + item.url + '" class="search-result-item">' +
        '<span class="search-result-title">' + escapeHtml(item.title) + '</span>' +
        '<span class="search-result-summary">' + escapeHtml(item.summary || '').substring(0, 60) + '</span>' +
        '</a>';
    }).join('');
  }

  // Toggle button
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      openSearch();
    });
  }

  // Click backdrop to close
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeSearch();
  });

  // Enter to search, Escape to close
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
    if (e.key === 'Escape') closeSearch();
  });

  // Global Ctrl/Cmd+K shortcut
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('active')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeSearch();
    }
  });

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
