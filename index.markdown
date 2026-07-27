---
layout: default
title: Home
full_width: true
load_map_js: true
---

<!-- 1. HOME / HERO SECTION -->
<section id="home">
<div class="full-bleed-hero">
  <!-- The Background Image -->
  <img src="{{ '/assets/images/iceland.jpg' | relative_url }}" alt="Hero Background" class="full-bleed-bg">
  
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
<section>

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
