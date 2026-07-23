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
      <p class="map-panel-note">Use the popups to open the gallery pages.</p>
    </div>
  </aside>

  <div id="map"></div>
</div>

<script>
  window.siteBaseUrl = "{{ site.baseurl }}";
</script>
<script src="{{ '/assets/js/map.js' | relative_url }}"></script>