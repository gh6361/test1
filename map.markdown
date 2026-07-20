---
layout: default
title: Travel Map
permalink: /map/
load_map_js: true
---

# Travel Map

This map will show every place I've photographed.

<div id="map"></div>

<script>
  window.siteBaseUrl = "{{ site.baseurl }}";
</script>
<script src="{{ '/assets/js/map.js' | relative_url }}"></script>