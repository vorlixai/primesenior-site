(function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* Gallery controls. Without JS the strip still scrolls by swipe or trackpad. */
(function () {
  var gallery = document.querySelector('.gallery');
  if (!gallery) return;

  var track = gallery.querySelector('.gallery-track');
  var items = [].slice.call(gallery.querySelectorAll('.gallery-item'));
  if (!track || items.length < 2) return;

  var controls = document.createElement('div');
  controls.className = 'gallery-controls';
  controls.innerHTML =
    '<button class="gallery-btn" type="button" data-dir="-1" aria-label="이전 사진">‹</button>' +
    '<ol class="gallery-dots"></ol>' +
    '<button class="gallery-btn" type="button" data-dir="1" aria-label="다음 사진">›</button>';
  gallery.appendChild(controls);

  var dotList = controls.querySelector('.gallery-dots');
  var dots = items.map(function (item, i) {
    var li = document.createElement('li');
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', i + 1 + '번째 사진 보기');
    dot.addEventListener('click', function () {
      scrollToIndex(i);
    });
    li.appendChild(dot);
    dotList.appendChild(li);
    return dot;
  });

  var prev = controls.querySelector('[data-dir="-1"]');
  var next = controls.querySelector('[data-dir="1"]');

  function currentIndex() {
    var mid = track.scrollLeft + track.clientWidth / 2;
    var best = 0;
    var bestDistance = Infinity;
    items.forEach(function (item, i) {
      var distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    return best;
  }

  function scrollToIndex(i) {
    var item = items[Math.max(0, Math.min(items.length - 1, i))];
    track.scrollTo({
      left: item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2
    });
  }

  [prev, next].forEach(function (btn) {
    btn.addEventListener('click', function () {
      scrollToIndex(currentIndex() + Number(btn.dataset.dir));
    });
  });

  function sync() {
    var current = currentIndex();
    dots.forEach(function (dot, i) {
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    prev.disabled = current === 0;
    next.disabled = current === items.length - 1;
  }

  var frame;
  track.addEventListener('scroll', function () {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(sync);
  });
  window.addEventListener('resize', sync);
  sync();
})();
