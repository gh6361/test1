---
layout: default
title: Home
full_width: true
---

<!-- 1. HOME / HERO SECTION -->
<section id="home">
  <div class="full-bleed-hero" style="height: 320px; position: relative; overflow: hidden;">
    
   <img src="{{ '/assets/images/rainbow.jpg' | relative_url }}" alt="Hero Background" style="width: 100%; height: 100%; object-fit: cover; object-position: center 58%; display: block;">
    
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0);"></div>
    
    <!-- Hero Text Wrapper (Matches the portfolio width perfectly) -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
      <div style="max-width: 1000px; margin: 0 auto; padding: 4rem 2rem;">
        <h1 style="font-family: var(--font-sans); text-transform: none; font-weight: 700; font-size: 2.5rem; letter-spacing: 0.01m; text-align: left; margin: 0;">
          <span style="color: #ffffff;">A Photo Journal. </span>
        </h1>
      </div>
    </div>

  </div>
</section>

<!-- 3. STACKED MAP & CAROUSEL SECTION -->
<section id="stacked-layout" style="max-width: 1000px; margin: 0 auto; padding: 2rem 2rem 6rem 2rem;">
  
  <h2 style="font-family: var(--font-serif); font-size: 1.5rem; letter-spacing: 0.05em; border-bottom: 1px solid #e5e5e5; padding-bottom: 1rem; margin-bottom: 1rem;">RECENT</h2>

  <!-- HORIZONTAL CARD CAROUSEL -->
  <div style="position: relative; display: flex; align-items: center; width: 100%;">
    
    <!-- Left Arrow Button -->
    <button id="carousel-prev" style="position: absolute; left: -3rem; z-index: 10; background: none; border: none; font-size: 2.5rem; color: #1c1c1c; cursor: pointer; padding: 0; transition: opacity 0.2s ease;">‹</button>

    <!-- The Track (Hidden Scrollbars) -->
    <div id="carousel-track" style="display: flex; gap: 1.5rem; overflow-x: auto; scroll-behavior: smooth; width: 100%; padding: 0.5rem 0;">
      <!-- JavaScript will inject your custom cards here -->
    </div>

    <!-- Right Arrow Button -->
    <button id="carousel-next" style="position: absolute; right: -3rem; z-index: 10; background: none; border: none; font-size: 2.5rem; color: #1c1c1c; cursor: pointer; padding: 0; transition: opacity 0.2s ease;">›</button>

  </div>

  <!-- CSS to hide scrollbars and size the cards -->
  <style>
    /* Hides the default scrollbar */
    #carousel-track::-webkit-scrollbar { display: none; }
    #carousel-track { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Forces cards to fit 4 across (25% each minus the gap), minimum width 200px */
    .carousel-card { flex: 0 0 calc(25% - 1.125rem); min-width: 200px; }
  </style>

  <!-- WIDE MINI MAP -->
  <div style="position: relative; width: 100%; aspect-ratio: 1.8 / 1; background: #e0e0e0; overflow: hidden; margin-top: 1rem; margin-bottom: 2rem; border: 1px solid #e5e5e5;">
    <div id="bottom-map" style="width: 100%; height: 100%; z-index: 1;"></div>
  </div>

</section>

<!-- 2. MAIN CONTENT SPLIT -->
<section id="content-split" style="max-width: 1000px; margin: 0 auto; padding: 4rem 2rem;">
  <div style="display: grid; grid-template-columns: 25% 75%; gap: 3rem; align-items: stretch;">

    <!-- LEFT COLUMN: LATEST -->
    <div style="display: flex; flex-direction: column;">
      <h2 style="font-family: var(--font-serif); font-size: 1.5rem; letter-spacing: 0.05em; border-bottom: 1px solid #e5e5e5; padding-bottom: 0.5rem; margin-bottom: 1.5rem;">RECENT</h2>

      <!-- Flex-grow forces this box to stretch to the exact bottom of the right column -->
      <div id="latest-feed" style="flex-grow: 1; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto;">
        <!-- Javascript will inject your latest thumbnails here -->
      </div>
    </div>

    <!-- RIGHT COLUMN -->
    <div style="display: flex; flex-direction: column; gap: 2rem;">

      <!-- THE MINI MAP -->
      <!-- CHANGED: Swapped rigid height for aspect-ratio so it dynamically scales to a perfect map rectangle -->
      <div style="position: relative; width: 100%; aspect-ratio: 1.57 / 1; background: #e0e0e0; overflow: hidden;">
        <div id="homepage-map" style="width: 100%; height: 100%; z-index: 1;"></div>

        <a href="{{ '/map' | relative_url }}" style="position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: #ffffff; color: #1c1c1c; padding: 0.5rem 1.5rem; font-family: var(--font-sans); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; text-decoration: none; border: 1px solid #e5e5e5; z-index: 1000; transition: background 0.3s ease;">
          Open Map
        </a>
      </div>

      <!-- FEATURED SLIDESHOW -->
      <div id="featured-slideshow" style="width: 100%; height: 400px; background: #1c1c1c; position: relative; overflow: hidden;">
        <div class="slide active" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
          <img src="{{ '/assets/images/car4.jpg' | relative_url }}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;">
          <h3 style="position: absolute; bottom: 2rem; left: 2rem; color: #fff; font-family: var(--font-serif); margin: 0; font-size: 2rem;">Featured Story One</h3>
        </div>
        <div class="slide" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: none;">
          <img src="{{ '/assets/images/car2.jpg' | relative_url }}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;">
          <h3 style="position: absolute; bottom: 2rem; left: 2rem; color: #fff; font-family: var(--font-serif); margin: 0; font-size: 2rem;">Featured Story Two</h3>
        </div>

        <!-- Controls -->
        <button id="slide-prev" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; z-index: 10;">‹</button>
        <button id="slide-next" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; z-index: 10;">›</button>
      </div>

    </div>

  </div>
</section>


<script type="module">
  import { locations } from "{{ '/assets/data/index.js' | relative_url }}";

  // --- NEW: Grab Jekyll's exact URL paths to prevent 404s and broken images ---
  const siteBaseUrl = "{{ site.baseurl | default: '' }}";
  const mapPageUrl = siteBaseUrl + "/map/";

  document.addEventListener("DOMContentLoaded", () => {
    
    /* --- SLIDESHOW LOGIC --- */
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const nextBtn = document.getElementById('slide-next');
    const prevBtn = document.getElementById('slide-prev');

    if (nextBtn && prevBtn && slides.length > 0) {
      nextBtn.addEventListener('click', () => {
        slides[currentSlide].style.display = 'none';
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.display = 'block';
      });

      prevBtn.addEventListener('click', () => {
        slides[currentSlide].style.display = 'none';
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].style.display = 'block';
      });
    }

    /* --- MINI MAP LOGIC --- */
    const miniMapEl = document.getElementById("homepage-map");
    if (!miniMapEl || typeof L === "undefined") return;

    // CHANGED: Removed the rigid .setView() and added fractional zoomSnap
    const miniMap = L.map(miniMapEl, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomSnap: 0.1 // MAGIC: Allows the map to calculate exact decimals to fit the box perfectly
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      className: 'dark-map-layer' 
    }).addTo(miniMap);

    const miniMarkers = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      zoomToBoundsOnClick: false, 
      iconCreateFunction: function (cluster) {
        let totalImages = 0;
        let firstImgSrc = "";
        
        const children = cluster.getAllChildMarkers();
        children.forEach((child, index) => {
          totalImages += child.options.imgCount;
          if (index === 0) firstImgSrc = child.options.firstImg;
        });

        return L.divIcon({
          html: `
            <div class="mini-map-thumb">
              <img src="${firstImgSrc}">
              <div class="thumb-badge">${totalImages}</div>
            </div>
          `,
          className: "",
          iconSize: L.point(40, 40)
        });
      }
    });

    const latestFeed = document.getElementById('latest-feed');
    let feedHtml = '';

    locations.forEach((loc, index) => {
      const imgCount = loc.images ? loc.images.length : 0;
      let firstImg = imgCount > 0 ? loc.images[0].src : "";

      // --- THE IMAGE FIX ---
      // We strip out the relative '../' and force an absolute path from your site root!
      if (firstImg) {
        firstImg = firstImg.replace(/^(\.\.\/|\.\/)+/, ""); 
        firstImg = siteBaseUrl + "/" + firstImg;            
        firstImg = firstImg.replace(/\/\//g, "/"); // Safety check to prevent //assets
      }

      if (firstImg) {
        // --- THE 404 FIX ---
        // We use mapPageUrl (/map/) to guarantee the strict trailing slash
        const customIcon = L.divIcon({
          html: `
            <div class="mini-map-thumb" onclick="window.location.href='${mapPageUrl}?loc=${index}'">
              <img src="${firstImg}">
              <div class="thumb-badge">${imgCount}</div>
            </div>
          `,
          className: "",
          iconSize: L.point(40, 40)
        });

        const marker = L.marker(loc.coords, { 
          icon: customIcon,
          imgCount: imgCount,
          firstImg: firstImg,
          locIndex: index
        });
        miniMarkers.addLayer(marker);
      }

      // Sidebar Feed (Card Layout matching Index styling)
      if (index < 4 && firstImg) {
        const title = loc.name.split(":")[0].trim();
        const country = loc.country || "Other"; // Extract the country from your data
        
        feedHtml += `
          <a href="${mapPageUrl}?loc=${index}" style="display: flex; flex-direction: column; text-decoration: none; color: inherit; border: 1px solid #e5e5e5; padding: none; background-color: #ffffff; transition: opacity 0.2s ease;">
            <img src="${firstImg}" style="width: 100%; height: 120px; object-fit: cover; margin-bottom: 0rem; display: block;">
            <div style="text-align: left;">
              
              <!-- EXACT copy of your Country subtitle style -->
              <div style="
                font-family: var(--font-sans); 
                font-size: 0.7rem;
                color: var(--text-body); 
                text-transform: uppercase; 
                letter-spacing: 0.15em; 
                margin-top: 0.8rem;
                margin-bottom: 0.3rem;
                margin-left: 0.5rem; 
                line-height: 1.2;
              ">${country}</div>

              <!-- EXACT copy of your sidebar-loc-link style for the title -->
              <div style="font-size: 1rem; font-weight: 550;color: #1c1c1c; margin-left: 0.5rem; margin-bottom: 0.4rem">
                ${title}
              </div>
              
            </div>
          </a>
        `;
      }
    });

    if (latestFeed) {
      latestFeed.innerHTML = feedHtml;
    }

    // Handle Cluster Clicks
    miniMarkers.on('clusterclick', function (a) {
      const center = a.layer.getLatLng();
      window.location.href = `${mapPageUrl}?lat=${center.lat}&lng=${center.lng}&zoom=6`;
    });

    miniMap.addLayer(miniMarkers);

    miniMap.addLayer(miniMarkers);

    // CHANGED: Force the map to fit a full world view, but with invisible padding
    // so the large thumbnails near the edge of the world (like Iceland/Finland) never clip.
    miniMap.fitBounds([
      [-55, -100], // South-West boundary
      [75, 120]    // North-East boundary
    ], {
      paddingTopLeft: [0, 60],    // Adds 60px of breathing room to the ceiling
      paddingBottomRight: [0, 20] // Adds 20px to the floor
    });
/* =========================================
       NEW: STACKED BOTTOM MAP & CAROUSEL LOGIC
       ========================================= */
    const bottomMapEl = document.getElementById("bottom-map");
    const carouselTrack = document.getElementById('carousel-track');
    
    if (bottomMapEl && carouselTrack) {
      
      // 1. Initialize Bottom Map
      const bottomMap = L.map(bottomMapEl, {
        zoomControl: false, dragging: false, scrollWheelZoom: false, 
        doubleClickZoom: false, boxZoom: false, keyboard: false, zoomSnap: 0.1 
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        className: 'dark-map-layer' 
      }).addTo(bottomMap);

      // 2. Setup Bottom Map Clusters
      const bottomMarkers = L.markerClusterGroup({
        showCoverageOnHover: false, maxClusterRadius: 40, zoomToBoundsOnClick: false, 
        iconCreateFunction: function (cluster) {
          let totalImages = 0; let firstImgSrc = "";
          const children = cluster.getAllChildMarkers();
          children.forEach((child, index) => {
            totalImages += child.options.imgCount;
            if (index === 0) firstImgSrc = child.options.firstImg;
          });
          return L.divIcon({
            html: `<div class="mini-map-thumb"><img src="${firstImgSrc}"><div class="thumb-badge">${totalImages}</div></div>`,
            className: "", iconSize: L.point(40, 40)
          });
        }
      });

      // 3. Loop Locations to populate Bottom Map & Carousel
      let carouselHtml = '';
      locations.forEach((loc, index) => {
        const imgCount = loc.images ? loc.images.length : 0;
        let firstImg = imgCount > 0 ? loc.images[0].src : "";

        if (firstImg) {
          firstImg = firstImg.replace(/^(\.\.\/|\.\/)+/, ""); 
          firstImg = siteBaseUrl + "/" + firstImg;            
          firstImg = firstImg.replace(/\/\//g, "/"); 
        }

        if (firstImg) {
          // Add Marker
          const customIcon = L.divIcon({
            html: `<div class="mini-map-thumb" onclick="window.location.href='${mapPageUrl}?loc=${index}'"><img src="${firstImg}"><div class="thumb-badge">${imgCount}</div></div>`,
            className: "", iconSize: L.point(40, 40)
          });
          const marker = L.marker(loc.coords, { icon: customIcon, imgCount: imgCount, firstImg: firstImg, locIndex: index });
          bottomMarkers.addLayer(marker);

          // Add Carousel Card (using your exact styling rules)
          const title = loc.name.split(":")[0].trim();
          const country = loc.country || "Other";
          
          carouselHtml += `
            <a href="${mapPageUrl}?loc=${index}" class="carousel-card" style="display: flex; flex-direction: column; text-decoration: none; color: inherit; border: 1px solid #e5e5e5; padding: 0; background-color: #ffffff; transition: opacity 0.2s ease;">
              <img src="${firstImg}" style="width: 100%; height: 120px; object-fit: cover; margin-bottom: 0rem; display: block;">
              <div style="text-align: left;">
                <div style="
                  font-family: var(--font-sans); font-size: 0.7rem; color: var(--text-body); 
                  text-transform: uppercase; letter-spacing: 0.15em; margin-top: 0.8rem;
                  margin-bottom: 0.3rem; margin-left: 0.5rem; line-height: 1.2;
                ">${country}</div>
                <div style="font-size: 1rem; font-weight: 550; color: #1c1c1c; margin-left: 0.5rem; margin-bottom: 0.4rem">
                  ${title}
                </div>
              </div>
            </a>
          `;
        }
      });

      // 4. Render HTML and Map Bounds
      carouselTrack.innerHTML = carouselHtml;
      
      bottomMarkers.on('clusterclick', function (a) {
        const center = a.layer.getLatLng();
        window.location.href = `${mapPageUrl}?lat=${center.lat}&lng=${center.lng}&zoom=6`;
      });
      
      bottomMap.addLayer(bottomMarkers);
      bottomMap.fitBounds([[-55, -100], [75, 120]], { paddingTopLeft: [0, 60], paddingBottomRight: [0, 20] });

      // 5. Carousel Arrow Button Logic
      const btnNextC = document.getElementById('carousel-next');
      const btnPrevC = document.getElementById('carousel-prev');

      if (btnNextC && btnPrevC) {
        const getScrollDistance = () => {
          const card = carouselTrack.querySelector('.carousel-card');
          return card ? card.offsetWidth + 24 : 250; // 24px is roughly 1.5rem gap
        };
        btnNextC.addEventListener('click', () => { carouselTrack.scrollBy({ left: getScrollDistance(), behavior: 'smooth' }); });
        btnPrevC.addEventListener('click', () => { carouselTrack.scrollBy({ left: -getScrollDistance(), behavior: 'smooth' }); });
      }
    }
  });
</script>
