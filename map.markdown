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


<!-- Standard Gallery Lightbox -->
<div id="lightbox" class="lightbox hidden panel-open">
  <div class="lightbox-main">
    <div id="lightbox-stage" class="lightbox-stage">
      <img id="lightbox-image-a" class="lightbox-image active" src="" alt="">
      <img id="lightbox-image-b" class="lightbox-image" src="" alt="">
      
      <div class="lightbox-ui">
        <button id="lightbox-left-zone" class="lightbox-zone"></button>
        <button id="lightbox-right-zone" class="lightbox-zone"></button>
        <button id="lightbox-prev" class="lightbox-arrow">‹</button>
        <button id="lightbox-next" class="lightbox-arrow">›</button>
      </div>
    </div>
    
    <div class="lightbox-controls lightbox-ui">
      <button id="lightbox-close" class="lightbox-control">&times;</button>
    </div>
    <button id="lightbox-panel-toggle" class="lightbox-control lightbox-ui">i</button>
  </div>
  
  <div class="lightbox-panel">
    <div class="lightbox-panel-content">
      <p id="lightbox-caption"></p>
    </div>
  </div>
</div>

<script>
  window.siteBaseUrl = "{{ site.baseurl }}";
</script>
<script src="{{ '/assets/js/map.js' | relative_url }}"></script>