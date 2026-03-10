document.addEventListener('DOMContentLoaded', function() {
  // === Code copy buttons + language labels ===
  var blocks = document.querySelectorAll('.highlight');
  blocks.forEach(function(block) {
    // Language label from Hugo's highlight class (e.g., language-bash)
    var codeEl = block.querySelector('code');
    if (codeEl) {
      var classes = codeEl.className.split(/\s+/);
      for (var i = 0; i < classes.length; i++) {
        var m = classes[i].match(/^language-(.+)$/);
        if (m && m[1]) {
          var label = document.createElement('span');
          label.className = 'code-lang-label';
          label.textContent = m[1];
          block.appendChild(label);
          break;
        }
      }
    }

    // Copy button
    var btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = '复制';
    btn.addEventListener('click', function() {
      var code = block.querySelector('code');
      if (!code) return;
      // Get text content but skip line number cells
      var lines = code.querySelectorAll('.cl');
      var text;
      if (lines.length > 0) {
        text = Array.prototype.map.call(lines, function(l) { return l.textContent; }).join('');
      } else {
        text = code.textContent;
      }
      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = '已复制 ✓';
        btn.classList.add('copied');
        setTimeout(function() {
          btn.textContent = '复制';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
    block.style.position = 'relative';
    block.appendChild(btn);
  });

  // === Back to top ===
  var topBtn = document.getElementById('back-to-top');
  if (topBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        topBtn.classList.add('visible');
      } else {
        topBtn.classList.remove('visible');
      }
    }, { passive: true });
    topBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === Reading progress bar ===
  var progressBar = document.getElementById('reading-progress');
  var article = document.querySelector('.article-body');
  if (progressBar && article) {
    window.addEventListener('scroll', function() {
      var rect = article.getBoundingClientRect();
      var total = article.scrollHeight;
      var scrolled = -rect.top;
      var pct = Math.min(100, Math.max(0, (scrolled / (total - window.innerHeight)) * 100));
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }
});
