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

<section id="home">
  <div class="full-bleed-hero" style="height: calc(100vh - 80px); position: relative; overflow: hidden;">
    
   <img src="{{ '/assets/images/car4.jpg' | relative_url }}" alt="Hero Background" style="width: 100%; height: 100%; object-fit: cover;">
    
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0);"></div>
    
    <div style="position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); width: 100%; text-align: center;">
      <h1 style="font-family: var(--font-sans); text-transform: uppercase; font-weight: 700; font-size: 1.8rem; letter-spacing: 0.03em;">
        <span style="color: #ffffff;">a photo journal </span>
        <span style="color: #1c1c1c;">from many places</span>
      </h1>
    </div>

    <div id="scroll-arrow" style="position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 10; cursor: pointer; text-align: center; opacity: 1 !important; transition: opacity 0.3s ease;">
      <i class="bi bi-chevron-down" style="font-size: 2rem; color: #ffffff; text-shadow: 0px 2px 4px rgba(0,0,0,0.3);"></i>
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

      // 2. FORCE the initial state so the global CSS doesn't confuse it
      header.style.position = "relative";
      header.style.top = "auto";

      // 3. Track the scrolling to lock it at the top
      window.addEventListener("scroll", function() {
        if (window.scrollY >= hero.offsetHeight) {
          header.style.position = "fixed";
          header.style.top = "0";
          header.style.width = "100%";
          header.style.zIndex = "9999";
          document.body.style.paddingTop = header.offsetHeight + "px"; 
        } else {
          header.style.position = "relative";
          header.style.top = "auto";
          document.body.style.paddingTop = "0px";
        }
      });
    }

    // --- THE CINEMATIC SCROLL ARROW ---
    if (scrollArrow && header) {
      function smoothScrollTo(targetElement, duration) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

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
            window.scrollTo(0, targetPosition);
          }
        }
        requestAnimationFrame(animation);
      }

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
