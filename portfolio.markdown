---
layout: default
title: Collections
full_width: true
---

<!-- 1. HERO SECTION -->
<section id="collections-hero">
  <!-- Force the height to 100vh for a dramatic entrance -->
  <div class="full-bleed-hero" style="height: 61.8vh !important; position: relative !important; overflow: hidden !important;">
    
    <!-- The Background Image -->
    <img src="{{ '/assets/images/yosemite.jpg' | relative_url }}" alt="Collections Hero" class="full-bleed-bg" style="width: 100% !important; height: 100% !important; object-fit: cover !important;">
    
    <!-- The Tint Overlay -->
    <div class="full-bleed-overlay"></div>
    
    <!-- The Text Overlay -->
    <div class="full-bleed-content" style="position: absolute !important; top: auto !important; bottom: 40% !important; transform: none !important; width: 100%; text-align: center;">
      <h1 class="hero-title text-light" style="font-size: 4rem !important; font-weight: bold !important; font-family: var(--font-serif, serif);">Collections</h1>
    </div>
  </div>
</section>

<!-- 2. COLLECTIONS GRID SECTION -->
<section class="collections-wrapper">
  
  <div class="collections-grid">
    
    <!-- COLLECTION ITEM 1 -->
    <a href="{{ '/collections/nordic.html' | relative_url }}" class="collection-item">
      <div class="collection-img-box">
        <img src="{{ '/assets/images/finland/oodi/reduced--2.jpg' | relative_url }}" alt="The Nordic Archive">
        
        <!-- NEW: The dark gradient overlay -->
        <div class="collection-overlay"></div>
        
        <!-- TEXT MOVED INSIDE THE IMAGE BOX -->
        <div class="collection-text">
          <h2 class="collection-title">The Nordic Archive</h2>
        </div>
      </div>
    </a>

    <!-- COLLECTION ITEM 2 -->
    <a href="{{ '/collections/nature.html' | relative_url }}" class="collection-item">
      <div class="collection-img-box">
        <img src="{{ '/assets/images/rainbow.jpg' | relative_url }}" alt="Wilderness">
        <div class="collection-overlay"></div>
        <div class="collection-text">
          <h2 class="collection-title">Wilderness</h2>
        </div>
      </div>
    </a>

    <!-- COLLECTION ITEM 3 -->
    <a href="{{ '/collections/urban.html' | relative_url }}" class="collection-item">
      <div class="collection-img-box">
        <img src="{{ '/assets/images/moana-chicken.jpg' | relative_url }}" alt="Urban Architecture">
        <div class="collection-overlay"></div>
        <div class="collection-text">
          <h2 class="collection-title">Chickens</h2>
        </div>
      </div>
    </a>

    <!-- COLLECTION ITEM 3 -->
    <a href="{{ '/collections/urban.html' | relative_url }}" class="collection-item">
      <div class="collection-img-box">
        <img src="{{ '/assets/images/snowman.jpg' | relative_url }}" alt="Urban Architecture">
        <div class="collection-overlay"></div>
        <div class="collection-text">
          <h2 class="collection-title">snowman</h2>
        </div>
      </div>
    </a>

    <!-- COLLECTION ITEM 3 -->
    <a href="{{ '/collections/urban.html' | relative_url }}" class="collection-item">
      <div class="collection-img-box">
        <img src="{{ '/assets/images/iceland.jpg' | relative_url }}" alt="Urban Architecture">
        <div class="collection-overlay"></div>
        <div class="collection-text">
          <h2 class="collection-title">rainbow</h2>
        </div>
      </div>
    </a>

    <!-- COLLECTION ITEM 3 -->
    <a href="{{ '/collections/urban.html' | relative_url }}" class="collection-item">
      <div class="collection-img-box">
        <img src="{{ '/assets/images/bread.jpg' | relative_url }}" alt="Urban Architecture">
        <div class="collection-overlay"></div>
        <div class="collection-text">
          <h2 class="collection-title">bread</h2>
        </div>
      </div>
    </a>

  </div>
</section>