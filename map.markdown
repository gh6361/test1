---
layout: default
title: Travel Map
permalink: /map/
load_map_js: true
full_width: true
header: solid
---

<!-- DYNAMIC PAGE STYLES -->
<style>
  /* Kill all scrolling and margins on the body */
  html, body { overflow: hidden !important; width: 100%; height: 100%; margin: 0 !important; padding: 0 !important; }
  
  /* Force hide your default footer if it tries to render on this page */
  footer, .editorial-footer { display: none !important; }
</style>

<!-- THE MAP CONTAINER -->
<!-- Explicitly set to calc(100vh - 50px) to guarantee it hits the absolute bottom of the monitor -->
<div class="map-page" style="position: fixed !important; top: 62px !important; left: 0 !important; right: 0 !important; height: calc(100vh - 50px) !important; z-index: 10 !important; background-color: #3f464d;">
  
  <!-- Sidebar (Now uses height: 100% to perfectly fill the container) -->
  <!-- Sidebar (Now uses height: 100% to perfectly fill the container) -->
<aside class="map-sidebar" style="position: absolute !important; top: 0 !important; left: 0 !important; height: 100% !important; width: 385px !important; margin: 0 !important; background-color: #f2f1ea !important; z-index: 1000 !important; overflow-y: auto !important;">
  
  <!-- TEXT COLOR UPDATE: Changed color to #1c1c1c -->
  <div id="location-panel" style="padding: 2rem 0.5rem; color: #1c1c1c;">
    
    <!-- HEADER COLOR UPDATE: Changed color to #1c1c1c -->
    <h2 style="color: #1c1c1c; margin-top: 0 !important; margin-bottom: 1rem;">Travel Map</h2>
    
    <p style="font-family: var(--font-sans); line-height: 1.6;">Click a marker to see details about each place.</p>
    
    <!-- BORDER UPDATE: Changed the border-top to transparent black -->
    <p class="map-panel-note" style="opacity: 0.7; font-size: 0.85em; margin-top: 2rem; border-top: 1px solid rgba(28, 28, 28, 0.2); padding-top: 1rem;">Use the buttons to open a gallery or a single photo.</p>
    
  </div>
</aside>

  <!-- The Map (Also uses height: 100% to perfectly fill the container) -->
  <div id="map" style="position: absolute !important; top: 0 !important; left: 385px !important; right: 0 !important; height: 100% !important; z-index: 1 !important;"></div>
  
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
