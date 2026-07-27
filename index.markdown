---
layout: default
title: Home
---

<div class="full-bleed-hero">
  <!-- The Background Image -->
  <img src="{{ '/assets/images/moana-chicken.jpg' | relative_url }}" alt="Hero Background" class="full-bleed-bg">
  
  <!-- The Tint Overlay (Essential for text readability) -->
  <div class="full-bleed-overlay"></div>
  
  <!-- The Text Overlay -->
  <div class="full-bleed-content">
    <p class="meta-text text-light">Photography · Places · Field Notes</p>
    <h1 class="hero-title text-light">Stories and collections from the road.</h1>
    
    <div class="hero-links justify-center mt-4">
      <a class="link-editorial text-light border-light" href="{{ '/map/' | relative_url }}">Open Atlas</a>
      <a class="link-editorial text-light border-light" href="{{ '/collections/' | relative_url }}">Collections</a>
    </div>
  </div>
</div>

<div class="home-hero py-5">
  <div class="row align-items-center g-5">
    <div class="col-lg-6">
      <p class="text-uppercase tracking-wide mb-2">Photography · Places · Field Notes</p>
      <h1 class="display-4 mb-3">A travel archive with stories, maps, and collections.</h1>
      <p class="lead mb-4">
        Explore photographs by place on the atlas, browse curated collections, or read the journal.
      </p>

      <div class="d-flex flex-wrap gap-2">
        <a class="btn btn-primary btn-lg" href="{{ '/map/' | relative_url }}">Open Atlas</a>
        <a class="btn btn-outline-secondary btn-lg" href="{{ '/collections/' | relative_url }}">Browse Collections</a>
        <a class="btn btn-outline-secondary btn-lg" href="{{ '/blog/' | relative_url }}">Read Field Notes</a>
      </div>
    </div>

    <div class="col-lg-6">
      <img
        src="{{ '/assets/images/moana-chicken.jpg' | relative_url }}"
        class="img-fluid home-feature-image"
        alt="Featured travel photograph">
    </div>
  </div>
</div>

<div class="home-sections mt-5">
  <div class="row g-4">
    <div class="col-md-4">
      <a class="home-card" href="{{ '/map/' | relative_url }}">
        <h2>Atlas</h2>
        <p>Find places through the map and open a photo preview from each marker.</p>
      </a>
    </div>

    <div class="col-md-4">
      <a class="home-card" href="{{ '/collections/' | relative_url }}">
        <h2>Collections</h2>
        <p>Browse themed galleries and more complete photo sets.</p>
      </a>
    </div>

    <div class="col-md-4">
      <a class="home-card" href="{{ '/blog/' | relative_url }}">
        <h2>Field Notes</h2>
        <p>Read short entries, observations, and travel writing in a quieter space.</p>
      </a>
    </div>
  </div>
</div>