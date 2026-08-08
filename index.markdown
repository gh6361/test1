---
layout: default
title: Home
full_width: true
load_map_js: true
---

<!-- 1. HOME / HERO SECTION -->
<!-- 1. HOME / HERO SECTION -->
<section id="home">
<!-- Force the height to 85vh (adjust this up or down as needed) -->
<div class="full-bleed-hero" style="height: 100vh !important; position: relative !important; overflow: hidden !important;">
  
  <!-- The Background Image: Forced to cover the entire new height perfectly -->
  <img src="{{ '/assets/images/rainbow.jpg' | relative_url }}" alt="Hero Background" class="full-bleed-bg" style="width: 100% !important; height: 100% !important; object-fit: cover !important;">
  
  <!-- The Tint Overlay (Essential for text readability) -->
  <div class="full-bleed-overlay"></div>
  
  <!-- The Text Overlay -->
  <div class="full-bleed-content" style="position: absolute !important; top: auto !important; bottom: 40% !important; transform: none !important; width: 100%; text-align: center;">
    <h1 class="hero-title text-light" style="font-size: 4rem !important; font-weight: bold !important;">Stories and collections from the road.</h1>
  </div>
</div>
</section>

<!-- 2. PORTFOLIO SECTION -->
<section id="portfolio" class="editorial-section">
  <div class="section-header">
    <h2 class="section-title">Latest works</h2>
  </div>
  
  <div class="editorial-grid">
    <a class="editorial-card" href="#map">
      <h3>Atlas</h3>
      <p>Find photographs by place and open previews from the map.</p>
    </a>
    <a class="editorial-card" href="#portfolio">
      <h3>Collections</h3>
      <p>Browse complete galleries and themed sets.</p>
    </a>
  </div>
</section>


<!-- 4. ABOUT SECTION -->
<section id="about" class="editorial-footer-statement">
  <h2>A travel archive built around real places</h2>
  <p>
    I focus on natural settings, everyday details, and the feeling of being somewhere specific. 
    The site is designed to let you explore by map, by collection, or by story.
  </p>
</section>

