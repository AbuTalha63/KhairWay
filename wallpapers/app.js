// Wallpapers gallery.
// The page is just a *view* of wallpapers.json: to add wallpaper #31,
// add one entry to the JSON and drop its two image files in place. No HTML edits.

(function () {
  'use strict';

  var BASE = '/wallpapers/';                 // root-relative, same convention as the rest of the site
  var grid = document.getElementById('grid');
  var statusEl = document.getElementById('status');
  var viewer = document.getElementById('viewer');
  var viewerImg = document.getElementById('viewer-img');
  var viewerTitle = document.getElementById('viewer-title');
  var downloadLink = document.getElementById('download');
  var lockDate = document.getElementById('lock-date');
  var closeBtn = document.getElementById('close');

  // ---- Load the data, then build the grid ----

  fetch(BASE + 'wallpapers.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (items) {
      items.forEach(function (item) { grid.appendChild(buildTile(item)); });
      statusEl.textContent = '';
    })
    .catch(function () {
      statusEl.textContent = 'Could not load the wallpapers. Please refresh the page.';
    });

  function buildTile(item) {
    // Build with DOM methods + textContent (not innerHTML) so titles from the JSON
    // can never be interpreted as HTML.
    var li = document.createElement('li');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tile';

    var img = document.createElement('img');
    img.src = BASE + item.thumb;             // small thumbnail only; the big file loads on tap
    img.alt = item.title;
    img.width = 400;
    img.height = 533;
    img.loading = 'lazy';                    // don't fetch thumbnails that are off-screen

    var label = document.createElement('span');
    label.className = 'tile-label';
    label.textContent = item.title;

    btn.appendChild(img);
    btn.appendChild(label);
    btn.addEventListener('click', function () { openViewer(item); });
    li.appendChild(btn);
    return li;
  }

  // ---- Preview dialog ----

  function openViewer(item) {
    var fullUrl = BASE + item.file;

    viewerTitle.textContent = item.title;
    viewerImg.alt = item.title + ' wallpaper preview';
    lockDate.textContent = new Date().toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric'
    });

    // Show the (already cached) thumbnail instantly, then swap in the full image
    // once it has loaded, so the dialog never opens blank.
    viewerImg.src = BASE + item.thumb;
    var full = new Image();
    full.onload = function () {
      if (viewer.open && downloadLink.getAttribute('href') === fullUrl) viewerImg.src = fullUrl;
    };
    full.src = fullUrl;

    // `download` only works for same-origin files, which is why the images live on our own site.
    downloadLink.href = fullUrl;
    downloadLink.setAttribute('download', 'khairway-' + item.id + '.jpg');

    viewer.showModal();
  }

  closeBtn.addEventListener('click', function () { viewer.close(); });

  // Click on the dark backdrop (the <dialog> element itself, not its contents) closes it.
  viewer.addEventListener('click', function (e) {
    if (e.target === viewer) viewer.close();
  });
})();
