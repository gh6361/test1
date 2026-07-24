---
layout: default
title: Travel Map
permalink: /map/
load_map_js: true
full_width: true
---

<div class="map-page">
  <aside class="map-sidebar">
    <div id="location-panel">
      <h2>Travel Map</h2>
      <p>Click a marker to see details about each place.</p>
      <p class="map-panel-note">Use the buttons to open a gallery or a single photo.</p>
    </div>
  </aside>

  <div id="map"></div>
</div>

<!-- Simple Single Photo Lightbox -->
<div id="single-photo-lightbox" class="single-lightbox hidden">
  <button id="single-photo-close" class="single-lightbox-close" aria-label="Close lightbox">&times;</button>
  <img id="single-photo-image" class="single-lightbox-image" src="" alt="">
</div>

<script>
  window.siteBaseUrl = "{{ site.baseurl }}";
</script>
<script src="{{ '/assets/js/map.js' | relative_url }}"></script>