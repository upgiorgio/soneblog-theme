(function() {
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  if (!searchInput || !searchResults) return;

  var fuse = null;
  var data = null;

  // Load search index
  fetch('/index.json')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      data = d;
      // Load Fuse.js
      var script = document.createElement('script');
      script.src = '/js/vendor/fuse.min.js';
      script.onload = function() {
        fuse = new Fuse(data, {
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

  searchInput.addEventListener('input', function() {
    var query = this.value.trim();
    if (!query || !fuse) {
      searchResults.innerHTML = '';
      return;
    }

    var results = fuse.search(query).slice(0, 10);

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="text-neutral-400 dark:text-neutral-500 text-center py-8">未找到相关内容</p>';
      return;
    }

    searchResults.innerHTML = results.map(function(r) {
      var item = r.item;
      return '<a href="' + item.url + '" class="block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-teal-500/50 transition-colors">' +
        '<h3 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">' + escapeHtml(item.title) + '</h3>' +
        '<p class="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">' + escapeHtml(item.summary || '') + '</p>' +
        '<span class="text-xs text-neutral-400 dark:text-neutral-500 mt-2 inline-block">' + item.date + '</span>' +
        '</a>';
    }).join('');
  });

  // Keyboard shortcut
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
