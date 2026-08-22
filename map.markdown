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
<!-- CHANGED: Added display: flex !important; to enable flexible layouts -->
<div class="map-page" style="position: fixed !important; top: 68px !important; left: 0 !important; right: 0 !important; height: calc(100vh - 68px) !important; z-index: 10 !important; background-color: #3f464d; display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important;">
  
  <!-- Sidebar -->
  <!-- CHANGED: Replaced absolute positioning with flex: 0 0 40%. Added min/max widths so it doesn't get awkwardly small or huge. -->
  <aside class="map-sidebar" style="flex: 0 0 38.2% !important; min-width: 280px !important; max-width: 800px !important; height: 100% !important; margin: 0 !important; background-color: #f7f7f7 !important; z-index: 1000 !important; overflow-y: auto !important;">
    
    <div id="location-panel" style="padding: 1rem 0.5rem; color: #1c1c1c;">
      <h2 style="color: #1c1c1c; margin-top: 0 !important; margin-bottom: 1rem;">Travel Map</h2>
      <p style="font-family: var(--font-sans); line-height: 1.6;">Click a marker to see details about each place.</p>
      <p class="map-panel-note" style="opacity: 0.7; font-size: 0.85em; margin-top: 2rem; border-top: 1px solid rgba(28, 28, 28, 0.2); padding-top: 1rem;">Use the buttons to open a gallery or a single photo.</p>
    </div>
  </aside>

  <!-- The Map -->
  <!-- CHANGED: Removed absolute positioning. flex: 1 automatically fills the remaining 60% of the screen perfectly. -->
  <div id="map" style="flex: 1 !important; height: 100% !important; z-index: 1 !important;"></div>
  
</div>

<!-- Standard Gallery Lightbox (New 38.2% Layout) -->
<div id="lightbox" class="lightbox hidden">
  <div class="lightbox-main">
    
    <!-- Permanent UI Controls -->
    <button id="lightbox-close" class="lightbox-control">&times;</button>
    <button id="lightbox-prev" class="lightbox-arrow">‹</button>
    <button id="lightbox-next" class="lightbox-arrow">›</button>

    <!-- Centered Content Group -->
    <div class="lightbox-center-group">
      
      <!-- The Image -->
      <div class="lightbox-img-wrapper">
        <img id="lightbox-image-a" class="lightbox-image active" src="" alt="">
        <img id="lightbox-image-b" class="lightbox-image" src="" alt="">
      </div>
      
      <!-- The Description Box -->
      <div class="lightbox-desc-wrapper">
        <p id="lightbox-caption"></p>
      </div>
      
    </div>
  </div>

  <!-- NEW: Thumbnail Bar (Sits at the very bottom of the screen) -->
  <div id="lightbox-thumbnails" class="lightbox-thumbnails"></div>

</div>

<script>
  window.siteBaseUrl = "{{ site.baseurl }}";
</script>
<script type="module" src="{{ '/assets/js/map.js' | relative_url }}?v=3"></script>