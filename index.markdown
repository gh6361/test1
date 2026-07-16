---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Home
---

# Welcome!

This is my first Jekyll website.

I'm building a photography and travel portfolio from scratch.


<div class="row align-items-center py-5">
  <div class="col-lg-6">
    <h1 class="display-4 fw-bold">Photography and Travel</h1>
    <p class="lead">
      A portfolio of places, photos, and stories from the road.
    </p>
    <a class="btn btn-primary btn-lg me-2" href="{{ '/portfolio/' | relative_url }}">View Portfolio</a>
    <a class="btn btn-outline-secondary btn-lg" href="{{ '/map/' | relative_url }}">View Map</a>
  </div>

  <div class="col-lg-6 mt-4 mt-lg-0">
    <img
      src="{{ '/assets/images/moana-chicken.jpg' | relative_url }}"
      class="img-fluid rounded-4 shadow"
      alt="Featured travel photography">
  </div>
</div>