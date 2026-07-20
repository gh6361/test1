---
layout: default
title: Helsinki Gallery
coordinates:
  lat: 60.1699
  lng: 24.9384

visited: 2025-05

cover: moana-chicken.jpg
---

# {{ page.title }}

**Visited:** {{ page.visited }}

**Latitude:** {{ page.coordinates.lat }}

**Longitude:** {{ page.coordinates.lng }}

---

Photos from Helsinki will go here.

<img
    src="{{ '/assets/images/' | append: page.cover | relative_url }}"
    class="img-fluid rounded shadow"
    alt="{{ page.title }}">