---
layout: default
title: Home
full_width: true
---

<!-- PAGE-SPECIFIC OVERRIDES -->
<style>
  /* The arrow hover animation */
  #scroll-arrow {
    transition: transform 0.3s ease;
  }
  #scroll-arrow:hover {
    transform: translate(-50%, 5px) !important; /* Adds a tiny bounce downward when hovered */
  }
  #scroll-arrow i {
    color: rgba(255, 255, 255, 0.6); /* Slightly dimmed white */
    transition: color 0.3s ease;
  }
  #scroll-arrow:hover i {
    color: #ffffff; /* Brightens on hover */
  }
</style>

<!-- 1. HOME / HERO SECTION -->
<section id="home">
  <!-- CHANGED: height is now exactly 100vh minus the ~72px height of your navbar -->
  <div class="full-bleed-hero" style="height: calc(100vh - 90px); position: relative; overflow: hidden;">
    
    <img src="{{ '/assets/images/rainbow.jpg' | relative_url }}" alt="Hero Background" style="width: 100%; height: 100%; object-fit: cover;">
    
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.1);"></div>
    
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; text-align: center;">
      <h1 style="font-size: 4rem; font-weight: normal; color: #ffffff; font-family: var(--font-serif);">Archives & Journals</h1>
    </div>

    <!-- THE SCROLL ARROW -->
    <div id="scroll-arrow" style="position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 10; cursor: pointer; text-align: center;">
      <!-- Using Bootstrap Icons which you already have loaded in your default.html -->
      <i class="bi bi-chevron-down" style="font-size: 2rem; font-weight: 300;"></i>
    </div>

  </div>
</section>

<!-- THE MAGIC REORDERING & SCROLL SCRIPT -->
<script>
  document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('.editorial-header');
    const hero = document.getElementById('home');
    const scrollArrow = document.getElementById('scroll-arrow');
    
    if (header && hero) {
      // 1. Physically move the navigation bar directly under the hero image
      hero.parentNode.insertBefore(header, hero.nextSibling);
    }

    if (scrollArrow && header) {
      
      // 2. The Custom Cinematic Scroll Function
      function smoothScrollTo(targetElement, duration) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        // Mathematical easing function (starts slow, speeds up, slows down smoothly)
        function easeInOutQuad(time, start, distance, duration) {
          time /= duration / 2;
          if (time < 1) return distance / 2 * time * time + start;
          time--;
          return -distance / 2 * (time * (time - 2) - 1) + start;
        }

        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
          
          window.scrollTo(0, run);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          } else {
            // THE LANDING GEAR: Guarantees it stops exactly on the pixel without snapping short
            window.scrollTo(0, targetPosition);
          }
        }

        requestAnimationFrame(animation);
      }

      // 3. Trigger the slow scroll when the arrow is clicked
      scrollArrow.addEventListener('click', function() {
        smoothScrollTo(header, 1200); 
      });
    }
  });
</script>

<!-- 2. PORTFOLIO SECTION -->
<section id="portfolio" class="editorial-section">
  <div class="section-header">
    <h2 class="section-title">page needs attention</h2>
  </div>
  
  <div class="editorial-grid">
    <a class="editorial-card" href="#map">
      <h3>Atlas</h3>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
      <p>don't mind all this.</p>
    </a>
    <a class="editorial-card" href="#portfolio">
      <h3>Collections</h3>
      <p>Browse complete galleries and themed sets.</p>
    </a>
  </div>
</section>


