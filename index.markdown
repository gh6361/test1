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

<!-- 2. RECENT: MAP & CAROUSEL SECTION -->
<section id="stacked-layout" style="max-width: 1000px; margin: 0 auto; padding: 2rem;">
  
  <!-- Centered, sans-serif "RECENT" heading -->
  <h2 style="font-family: var(--font-sans) !important; font-weight: 600; font-size: 2rem; letter-spacing: 0.05em; text-align: center; margin-top: 1rem; margin-bottom: 2.5rem; color: #1c1c1c;">RECENT</h2>

  <!-- HORIZONTAL CARD CAROUSEL -->
  <div style="position: relative; width: 100%;">
    
    <!-- Left Arrow -->
    <button id="carousel-prev" style="position: absolute; left: -1.7rem; top: 75px; transform: translateY(-50%); z-index: 10; background: none; border: none; font-size: 2.5rem; color: #1c1c1c; cursor: pointer; padding: 0; transition: opacity 0.2s ease;">‹</button>

    <!-- The Track (Padding/Margin removed to align perfectly with the map) -->
    <div id="carousel-track" style="display: flex; gap: 1.5rem; overflow-x: auto; scroll-behavior: smooth; width: 100%; padding: 0; margin: 0;">
      <!-- JavaScript will inject your custom cards here -->
    </div>

    <!-- Right Arrow -->
    <button id="carousel-next" style="position: absolute; right: -1.7rem; top: 75px; transform: translateY(-50%); z-index: 10; background: none; border: none; font-size: 2.5rem; color: #1c1c1c; cursor: pointer; padding: 0; transition: opacity 0.2s ease;">›</button>

  </div>

  <!-- CSS to hide scrollbars, size cards, and manage arrows -->
  <style>
    #carousel-track::-webkit-scrollbar { display: none; }
    #carousel-track { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* 1. FLUID CARD SCALING */
    .carousel-card { flex: 0 0 calc(25% - 1.125rem); min-width: 0; }
    .carousel-card img { height: auto !important; aspect-ratio: 3 / 2; }
    /* --- 4. ARROW HOVER & CLICK EFFECTS --- */
    #carousel-prev, #carousel-next {
      transition: color 0.2s ease !important;
    }
    
    /* Slightly lighter grey when hovering */
    #carousel-prev:hover, #carousel-next:hover {
      color: #737373 !important; 
    }
    
    /* Even lighter grey when physically clicking down */
    #carousel-prev:active, #carousel-next:active {
      color: #a6a6a6 !important; 
    }
    /* --- 5. IMAGE HOVER ZOOM EFFECT --- */
    
    /* Ensure the card clips the expanding image on the sides and top */
    .carousel-card {
      overflow: hidden; 
    }

    /* Set up the smooth animation for the image */
    .carousel-card img {
      transition: transform 0.2s ease !important;
    }

    /* Scale the image up by 5% when hovering over the card */
    .carousel-card:hover img {
      transform: scale(1.05);
    }

    /* Protect the text box so the zooming image doesn't bleed down into the words */
    .carousel-card > div {
      position: relative;
      z-index: 2;
      background-color: #ffffff;
    }
    @media (max-width: 850px) { .carousel-card { flex: 0 0 calc(33.333% - 1rem); } }
    @media (max-width: 550px) { .carousel-card { flex: 0 0 calc(50% - 0.75rem); } }

    /* 2. RESPONSIVE ARROWS */
    @media (max-width: 1120px) {
      #carousel-prev { left: -1.5rem !important; }
      #carousel-next { right: -1.5rem !important; }
    }
    @media (max-width: 850px) {
      #carousel-prev { left: -1.5rem !important; }
      #carousel-next { right: -1.5rem !important; }
    }
    @media (max-width: 550px) {
      #carousel-prev { left: -1.5rem !important; }
      #carousel-next { right: -1.5rem !important; }
    }

    /* 3. Ctrl + Hover Overlay Logic */
    .ctrl-active .cluster-thumb:hover .ctrl-zoom-overlay { opacity: 1 !important; }
    .ctrl-active .cluster-thumb:hover .cluster-nav { opacity: 0 !important; pointer-events: none; }
  </style>

  <!-- WIDE MINI MAP -->
  <div style="position: relative; width: 100%; aspect-ratio: 1.8 / 1; background: #e0e0e0; overflow: hidden; margin-top: 2.5rem; margin-bottom: 0rem; border: 1px solid #e5e5e5;">
    <div style="position: absolute; top: 0px; left: 0px; z-index: 1000; background: rgba(62, 62, 62, 0.75); padding: 0.4rem 0.8rem; font-family: var(--font-sans); font-size: 0.7rem; font-weight: 600; color: #ffffff; letter-spacing: 0.05em; pointer-events: none;">Ctrl + click/scroll to move/zoom</div>
    <div id="bottom-map" style="width: 100%; height: 100%; z-index: 1;"></div>
  </div>

</section>

{% include collections-grid.html %}

<!-- 3. FEATURED EDITORIAL SLIDESHOW -->
<section style="background-color: #f4f4f5; width: 100%; padding-top: 2rem;">
  <div id="featured-editorial" style="max-width: 1000px; margin: 0 auto; padding: 0 2rem 6rem 2rem;">
  
  <!-- Centered, sans-serif "FEATURED" heading without the bottom line -->
  <h2 style="font-family: var(--font-sans) !important; font-weight: 700 !important; font-size: 2rem; letter-spacing: 0.05em; text-align: center; margin-top: 1rem; margin-bottom: 2rem; color: #1c1c1c;">FEATURED ** beware ** from here down lie broken links </h2>

  <!-- Increased height to 700px, added white background and a subtle border -->
  <div style="position: relative; width: 100%; height: 700px; background: #ffffff; border: 1px solid #e5e5e5; overflow: hidden;">
    
    <!-- SLIDE 1 -->
    <div class="featured-slide" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block;">
      <img src="{{ '/assets/images/rainbow.jpg' | relative_url }}" style="width: 100%; height: 420px; object-fit: cover; display: block;">
      
      <div style="width: 100%; padding: 2rem; box-sizing: border-box; text-align: left;">
        <h3 style="font-family: var(--font-sans); font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: #1c1c1c; margin: 0 0 1rem 0; letter-spacing: 0.03em; text-transform: none;">
          In The Tropics
        </h3>
        <p style="font-family: var(--font-sans); font-size: 0.95rem; color: #4a4a4a; line-height: 1.6; max-width: 750px; margin: 0 0 2rem 0;">
          A scarlet macaw (Ara macao) hangs from a tree in Tikal National Park, Guatemala. The bird is native to subtropical rainforests across Central and South America and is classified as endangered due to various threats, including the illegal wildlife trade.
        </p>
        <a href="/map" style="display: inline-block; padding: 0.8rem 1.5rem; border: 2px solid #1c1c1c; color: #1c1c1c; text-decoration: none; font-family: var(--font-sans); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; transition: background 0.3s, color 0.3s;" onmouseover="this.style.backgroundColor='#1c1c1c'; this.style.color='#ffffff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#1c1c1c';">
          See More Photos
        </a>
      </div>
    </div>

    <!-- SLIDE 2 -->
    <div class="featured-slide" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: none;">
      <img src="{{ '/assets/images/car4.jpg' | relative_url }}" style="width: 100%; height: 420px; object-fit: cover; display: block;">

      <div style="width: 100%; padding: 3rem; box-sizing: border-box; text-align: left;">
        <h3 style="font-family: var(--font-sans); font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: #1c1c1c; margin: 0 0 1rem 0; letter-spacing: 0.03em; text-transform: none;">
          The Long Road
        </h3>
        <p style="font-family: var(--font-sans); font-size: 0.95rem; color: #4a4a4a; line-height: 1.6; max-width: 750px; margin: 0 0 2rem 0;">
          Crossing the country yields views of vast, open horizons. The changing landscape tells a story of geological time, from the jagged peaks of the west to the rolling plains of the midwest.
        </p>
        <a href="/collections" style="display: inline-block; padding: 0.8rem 1.5rem; border: 2px solid #1c1c1c; color: #1c1c1c; text-decoration: none; font-family: var(--font-sans); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; transition: background 0.3s, color 0.3s;" onmouseover="this.style.backgroundColor='#1c1c1c'; this.style.color='#ffffff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#1c1c1c';">
          Read Story
        </a>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button id="feat-prev" style="position: absolute; left: 1.5rem; top: 210px; transform: translateY(-50%); background: transparent; border: none; color: #ffffff; text-shadow: 0 2px 6px rgba(0,0,0,0.5); font-size: 3rem; font-weight: 300; cursor: pointer; z-index: 10; transition: color 0.2s ease;" onmouseover="this.style.color='#e5e5e5'" onmouseout="this.style.color='#ffffff'">‹</button>
    <button id="feat-next" style="position: absolute; right: 1.5rem; top: 210px; transform: translateY(-50%); background: transparent; border: none; color: #ffffff; text-shadow: 0 2px 6px rgba(0,0,0,0.5); font-size: 3rem; font-weight: 300; cursor: pointer; z-index: 10; transition: color 0.2s ease;" onmouseover="this.style.color='#e5e5e5'" onmouseout="this.style.color='#ffffff'">›</button>

  </div>
  </div>
</section>

<!-- 6. FOOTER SECTION -->
<footer style="background-color: #ffffff; width: 100%; padding: 3rem 0; border-top: 1px solid #e5e5e5;">
  <div style="max-width: 1000px; margin: 0 auto; padding: 0 2rem; text-align: center;">
    
    <p style="font-family: var(--font-sans); font-size: 0.75rem; color: #666666; text-transform: uppercase; letter-spacing: 0.15em; margin: 0;">
      &copy; 2026 Gleda Ho. 
    </p>
    
  </div>
</footer>

<!-- ==========================================
     JAVASCRIPT LOGIC
     ========================================== -->
<script type="module">
  import { locations } from "{{ '/assets/data/index.js' | relative_url }}";

  const siteBaseUrl = "{{ site.baseurl | default: '' }}";
  const mapPageUrl = siteBaseUrl + "/map/";

  document.addEventListener("DOMContentLoaded", () => {
    
    /* --- 1. RECENT: MAP & CAROUSEL LOGIC --- */
    const bottomMapEl = document.getElementById("bottom-map");
    const carouselTrack = document.getElementById('carousel-track');
    
    if (bottomMapEl && carouselTrack) {
      
      const bottomMap = L.map(bottomMapEl, {
        zoomControl: false, 
        dragging: false, 
        scrollWheelZoom: false, 
        doubleClickZoom: false, 
        boxZoom: false, 
        keyboard: false, 
        zoomSnap: 0.1,
        minZoom: 1.5,
        maxBounds: [[-90, -Infinity], [90, Infinity]],
        maxBoundsViscosity: 1.0, 
        worldCopyJump: true 
      });

      // FIXED: Keyboard listener for map panning & cluster navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Control' || e.key === 'Meta') {
          bottomMap.dragging.enable();
          bottomMap.doubleClickZoom.enable();
          bottomMapEl.style.cursor = 'grab'; 
          bottomMapEl.classList.add('ctrl-active'); // NEW: Activates hover CSS
        }

        // Arrow keys can still navigate the cluster manually while hovering
        if (window.hoveredCluster) {
          if (e.key === 'ArrowLeft') window.slideCluster(null, -1, window.hoveredCluster);
          else if (e.key === 'ArrowRight') window.slideCluster(null, 1, window.hoveredCluster);
        }
      });

      document.addEventListener('keyup', (e) => {
        if (e.key === 'Control' || e.key === 'Meta') {
          bottomMap.dragging.disable();
          bottomMap.doubleClickZoom.disable();
          bottomMapEl.style.cursor = 'default';
          bottomMapEl.classList.remove('ctrl-active'); // NEW: Deactivates hover CSS
        }
      });

      // NEW: Failsafe to remove the Ctrl state if the user clicks away or switches tabs
      window.addEventListener('blur', () => {
        if (bottomMapEl) bottomMapEl.classList.remove('ctrl-active');
        if (bottomMap) bottomMap.dragging.disable();
      });

      // Custom Scroll Zoom Logic
      bottomMapEl.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault(); 
          const zoomDelta = e.deltaY > 0 ? -0.5 : 0.5;
          bottomMap.setZoomAround(
            bottomMap.mouseEventToContainerPoint(e), 
            bottomMap.getZoom() + zoomDelta, 
            { animate: true }
          );
        }
      }, { passive: false });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        className: 'dark-map-layer' 
      }).addTo(bottomMap);

      /* --- TOP-RIGHT REGION CONTROLS --- */
      const regionBounds = {
        world: [[-55, -170], [75, 180]],
        europe: [[38, -10], [69, 35]],
        na: [[22, -175], [70, -45]],
        oceania: [[-47, 110], [-10, 180]],
      };

      const regionControl = L.control({ position: "topright" });
      regionControl.onAdd = function (mapInstance) {
        const div = L.DomUtil.create("div", "map-region-controls");
        
        div.innerHTML = `
          <button type="button" data-region="world">World</button>
          <button type="button" data-region="europe">Europe</button>
          <button type="button" data-region="na">US & Canada</button>
          <button type="button" data-region="oceania">Australia & NZ</button>
        `;
        
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);

        let lastRegion = "world";
        div.addEventListener("click", (e) => {
          const targetRegion = e.target.dataset.region;
          if (!targetRegion || !regionBounds[targetRegion]) return;

          const currentZoom = mapInstance.getZoom();
          const isZoomedIn = currentZoom > 4;
          const isWorldTransition = lastRegion === "world" || targetRegion === "world";

          if (isZoomedIn || !isWorldTransition) {
            mapInstance.fitBounds(regionBounds[targetRegion], { animate: false, padding: [20, 20] });
          } else {
            mapInstance.flyToBounds(regionBounds[targetRegion], { duration: 0.5, padding: [20, 20] });
          }
          lastRegion = targetRegion;
        });
        return div;
      };
      regionControl.addTo(bottomMap);
      /* --- END REGION CONTROLS --- */

      // NEW: Infinite Looping Carousel Logic for Clusters
      window.slideCluster = function(event, dir, thumbEl) {
        if (event) {
          event.stopPropagation();
          event.preventDefault();
        }
        
        // Prevent clicking too fast and breaking the animation
        if (!thumbEl || thumbEl.isAnimating) return;
        const track = thumbEl.querySelector('.cluster-track');
        if (!track) return;

        thumbEl.isAnimating = true;
        
        // Keep track of the current mathematical index so the map click redirect stays accurate
        const dataString = thumbEl.getAttribute('data-locations');
        const locations = JSON.parse(decodeURIComponent(dataString));
        let currentIndex = parseInt(thumbEl.getAttribute('data-current-index'), 10);
        
        currentIndex = (currentIndex + dir + locations.length) % locations.length;
        thumbEl.setAttribute('data-current-index', currentIndex);
        
        // --- INFINITE LOOP SLIDE ANIMATION ---
        if (dir === 1) {
          // Slide left to reveal the next image
          track.style.transition = 'transform 0.3s ease-in-out';
          track.style.transform = 'translateX(-100%)';
          
          setTimeout(() => {
            track.style.transition = 'none'; // Turn off animation
            track.appendChild(track.firstElementChild); // Teleport first image to the back
            track.style.transform = 'translateX(0%)'; // Snap the track back to normal instantly
            
            setTimeout(() => { thumbEl.isAnimating = false; }, 20); // Unlock
          }, 300); // 300ms matches the CSS transition time
          
        } else {
          // Teleport the last image to the front instantly while hidden
          track.style.transition = 'none';
          track.prepend(track.lastElementChild);
          track.style.transform = 'translateX(-100%)'; 
          
          // Force the browser to register the instant move before we animate
          void track.offsetWidth; 
          
          // Slide right to reveal the teleported image
          track.style.transition = 'transform 0.3s ease-in-out';
          track.style.transform = 'translateX(0%)';
          
          setTimeout(() => { thumbEl.isAnimating = false; }, 300); // Unlock
        }
      };

      const bottomMarkers = L.markerClusterGroup({
        showCoverageOnHover: false, 
        maxClusterRadius: 120, // CHANGED: Reduced from 120 so clusters break apart much easier
        zoomToBoundsOnClick: false, 
        iconCreateFunction: function (cluster) {
          // ... (keep the data parsing and imagesHtml exactly the same) ...
          const children = cluster.getAllChildMarkers();
          const locationCount = cluster.getChildCount(); 
          
          const clusterData = children.map(child => ({
            img: child.options.firstImg,
            name: child.options.locName,
            query: child.options.queryParam
          }));

          const dataString = encodeURIComponent(JSON.stringify(clusterData));
          
          const imagesHtml = clusterData.map(loc => 
            `<img src="${loc.img}" style="width: 100%; height: 100%; flex-shrink: 0; object-fit: cover !important; display: block;">`
          ).join('');

          return L.divIcon({
            html: `
              <div class="mini-map-thumb cluster-thumb" data-locations="${dataString}" data-current-index="0"
                   onmouseenter="
                     const mapRect = this.closest('.leaflet-container').getBoundingClientRect();
                     const rect = this.getBoundingClientRect();
                     let ox = '50%', oy = '50%';
                     
                     if (rect.left - mapRect.left < 80) ox = '0%';
                     if (mapRect.right - rect.right < 80) ox = '100%';
                     if (rect.top - mapRect.top < 80) oy = '0%';
                     if (mapRect.bottom - rect.bottom < 80) oy = '100%';
                     
                     this.style.transformOrigin = ox + ' ' + oy;
                     this.style.transform = 'scale(1.5)';
                     
                     window.hoveredCluster = this; 
                     this.querySelector('.cluster-nav').style.opacity = '1';
                     
                     clearTimeout(this.initialSlideTimeout);
                     clearInterval(this.slideshowInterval);
                     
                     this.initialSlideTimeout = setTimeout(() => {
                       window.slideCluster(null, 1, this);
                       
                       this.slideshowInterval = setInterval(() => { 
                         window.slideCluster(null, 1, this); 
                       }, 1500);
                     }, 500);
                   "
                   onmouseleave="
                     this.style.transform = 'scale(1)';
                     window.hoveredCluster = null; 
                     this.querySelector('.cluster-nav').style.opacity = '0';
                     
                     clearTimeout(this.initialSlideTimeout);
                     clearInterval(this.slideshowInterval);
                   ">
                
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border-radius: 2px;">
                  <div class="cluster-track" style="display: flex; width: 100%; height: 100%; transform: translateX(0%);">
                    ${imagesHtml}
                  </div>
                </div>

                <!-- NEW: Four diagonal expand arrows (Spread further out, 60% opacity white) -->
                <div class="ctrl-zoom-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); border-radius: 2px; opacity: 0; transition: opacity 0.2s ease; z-index: 15; display: flex; align-items: center; justify-content: center; pointer-events: none;">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <!-- Top Right -->
                    <polyline points="16 4 20 4 20 8"></polyline>
                    <line x1="15" y1="9" x2="20" y2="4"></line>
                    <!-- Bottom Left -->
                    <polyline points="8 20 4 20 4 16"></polyline>
                    <line x1="9" y1="15" x2="4" y2="20"></line>
                    <!-- Top Left -->
                    <polyline points="8 4 4 4 4 8"></polyline>
                    <line x1="9" y1="9" x2="4" y2="4"></line>
                    <!-- Bottom Right -->
                    <polyline points="16 20 20 20 20 16"></polyline>
                    <line x1="15" y1="15" x2="20" y2="20"></line>
                  </svg>
                </div>

                <div class="thumb-badge">${locationCount}</div>
                
                <div class="cluster-nav" style="opacity: 0; transition: opacity 0.2s ease;" 
                     onmousedown="event.stopPropagation();" onclick="event.stopPropagation();">
                  
                  <!-- Left Arrow -->
                  <button onclick="window.slideCluster(event, -1, this.closest('.cluster-thumb'))" 
                          style="position: absolute; left: -3px; top: 50%; transform: translateY(-50%); background: transparent; color: black; -webkit-text-stroke: 1px #ffffff; border: none; padding: 2px 6px; cursor: pointer; font-size: 1.5rem; font-weight: 700; z-index: 10;">‹</button>
                  
                  <!-- Right Arrow -->
                  <button onclick="window.slideCluster(event, 1, this.closest('.cluster-thumb'))" 
                          style="position: absolute; right: -3px; top: 50%; transform: translateY(-50%); background: transparent; color: black; -webkit-text-stroke: 1px #ffffff; border: none; padding: 2px 6px; cursor: pointer; font-size: 1.5rem; font-weight: 700; z-index: 10;">›</button>
                
                </div>
              </div>
            `,
            className: "", 
            iconSize: L.point(110, 110)
          });
        }
      });

      let carouselHtml = '';
      
      locations.forEach((loc, index) => {
        const imgCount = loc.images ? loc.images.length : 0;
        let firstImg = imgCount > 0 ? (loc.images[0].thumb800 || loc.images[0].src) : "";

        if (firstImg) {
          firstImg = firstImg.replace(/^(\.\.\/|\.\/)+/, ""); 
          firstImg = siteBaseUrl + "/" + firstImg;            
          firstImg = firstImg.replace(/\/\//g, "/"); 
        }

        if (firstImg) {
          const queryParam = loc.id ? `?id=${loc.id}` : `?loc=${index}`;

          // UPDATED: Single location HTML (Removed the 'View Gallery' text entirely)
          const customIcon = L.divIcon({
            html: `
              <div class="mini-map-thumb"
                   onmouseenter="
                     const mapRect = this.closest('.leaflet-container').getBoundingClientRect();
                     const rect = this.getBoundingClientRect();
                     let ox = '50%', oy = '50%';
                     
                     if (rect.left - mapRect.left < 80) ox = '0%';
                     if (mapRect.right - rect.right < 80) ox = '100%';
                     if (rect.top - mapRect.top < 80) oy = '0%';
                     if (mapRect.bottom - rect.bottom < 80) oy = '100%';
                     
                     this.style.transformOrigin = ox + ' ' + oy;
                     this.style.transform = 'scale(1.5)';
                   "
                   onmouseleave="
                     this.style.transform = 'scale(1)';
                   ">
                <img src="${firstImg}">
              </div>
            `,
            className: "", 
            iconSize: L.point(110, 110)
          });
          
          const marker = L.marker(loc.coords, { 
            icon: customIcon, 
            imgCount: imgCount, 
            firstImg: firstImg, 
            locIndex: index,
            locId: loc.id,
            locName: loc.name.split(":")[0].trim(),
            queryParam: queryParam
          });

          bottomMarkers.addLayer(marker);

          if (index < 10) {
            const title = loc.name.split(":")[0].trim();
            const country = loc.country || "Other";
            
            carouselHtml += `
              <a href="${mapPageUrl}${queryParam}" class="carousel-card" style="display: flex; flex-direction: column; text-decoration: none; color: inherit; border: 1px solid #e5e5e5; padding: 0; background-color: #ffffff; transition: opacity 0.2s ease;">
                <img src="${firstImg}" style="width: 100%; height: 140px; object-fit: cover; margin-bottom: 0rem; display: block;">
                <div style="text-align: left;">
                  <div style="font-family: 'Merriweather', serif; font-size: 0.9rem; font-weight: 600; line-height: 1.2; color: #1c1c1c; margin-left: 0.5rem; margin-right: 0.5rem; margin-top: 0.8rem; margin-bottom: 0.5rem">${title}</div>
                  <div style="font-family: var(--font-sans); font-size: 0.6rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.8rem; margin-left: 0.5rem; margin-right: 0.5rem; line-height: 1.2;">${country}</div>
                </div>
              </a>
            `;
          }
        }
      });

      carouselTrack.innerHTML = carouselHtml;

      // FIXED: Click events for Single Pins & Clusters
      // Clicking a single pin redirects to its map gallery
      bottomMarkers.on('click', function(e) {
        window.location.href = mapPageUrl + e.layer.options.queryParam;
      });

      // FIXED: Instant zoom without flyTo animation when Ctrl/Cmd is held
      bottomMarkers.on('clusterclick', function(e) {
        
        // 1. Check if the user is holding Ctrl (Windows) or Cmd (Mac)
        if (e.originalEvent && (e.originalEvent.ctrlKey || e.originalEvent.metaKey)) {
          const cluster = e.layer;
          const bounds = cluster.getBounds();
          const targetCenter = bounds.getCenter();
          const currentZoom = bottomMap.getZoom();
          let targetZoom = currentZoom;

          const desiredPixelSpread = cluster.getChildCount() > 2 ? 250 : 50;
          for (let z = currentZoom; z <= 15; z++) {
            if (
              bottomMap.project(bounds.getSouthWest(), z).distanceTo(bottomMap.project(bounds.getNorthEast(), z)) >= desiredPixelSpread
            ) {
              targetZoom = z;
              break;
            }
            if (z === 15) targetZoom = 15;
          }

          if (targetZoom <= currentZoom) targetZoom = Math.min(currentZoom + 3, 15);

          // Force instant zoom immediately (No flyTo animation)
          bottomMap.setView(targetCenter, targetZoom, { animate: false });
          return; 
        }

        // 2. Normal Click -> Redirect to the currently visible image's gallery
        const clusterEl = e.layer.getElement().querySelector('.cluster-thumb');
        if (clusterEl) {
          const currentIndex = parseInt(clusterEl.getAttribute('data-current-index'), 10) || 0;
          const dataString = clusterEl.getAttribute('data-locations');
          const locations = JSON.parse(decodeURIComponent(dataString));
          window.location.href = mapPageUrl + locations[currentIndex].query;
        }
      });

      bottomMap.addLayer(bottomMarkers);
      bottomMap.fitBounds([[-55, -100], [75, 120]], { paddingTopLeft: [0, 60], paddingBottomRight: [0, 20] });
      
      // FIXED: Keyboard listener for map panning & cluster navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Control' || e.key === 'Meta') {
          bottomMap.dragging.enable();
          bottomMap.doubleClickZoom.enable();
          bottomMapEl.style.cursor = 'grab'; 
        }

        // Arrow keys can still navigate the cluster manually while hovering
        if (window.hoveredCluster) {
          if (e.key === 'ArrowLeft') window.slideCluster(null, -1, window.hoveredCluster);
          else if (e.key === 'ArrowRight') window.slideCluster(null, 1, window.hoveredCluster);
        }
      });

      const btnNextC = document.getElementById('carousel-next');
      const btnPrevC = document.getElementById('carousel-prev');

      if (btnNextC && btnPrevC) {
        const getScrollDistance = () => {
          const card = carouselTrack.querySelector('.carousel-card');
          return card ? card.offsetWidth + 24 : 250; 
        };
        
        let isAnimating = false;

        btnNextC.addEventListener('click', () => { 
          if (isAnimating) return;
          isAnimating = true;
          
          const distance = getScrollDistance();
          carouselTrack.scrollBy({ left: distance, behavior: 'smooth' }); 
          
          setTimeout(() => {
            carouselTrack.style.scrollBehavior = 'auto'; 
            carouselTrack.appendChild(carouselTrack.firstElementChild); 
            carouselTrack.scrollLeft -= distance; 
            
            requestAnimationFrame(() => {
              carouselTrack.style.scrollBehavior = 'smooth';
              isAnimating = false;
            });
          }, 400); 
        });
        
        btnPrevC.addEventListener('click', () => { 
          if (isAnimating) return;
          isAnimating = true;
          
          const distance = getScrollDistance();
          
          carouselTrack.style.scrollBehavior = 'auto'; 
          carouselTrack.prepend(carouselTrack.lastElementChild);
          carouselTrack.scrollLeft += distance; 
          
          requestAnimationFrame(() => {
            carouselTrack.style.scrollBehavior = 'smooth';
            carouselTrack.scrollBy({ left: -distance, behavior: 'smooth' });
            
            setTimeout(() => { isAnimating = false; }, 400);
          });
        });
      }
    }

    /* --- 2. FEATURED EDITORIAL SLIDESHOW LOGIC --- */
    const featSlides = document.querySelectorAll('.featured-slide');
    const featNext = document.getElementById('feat-next');
    const featPrev = document.getElementById('feat-prev');
    let currentFeat = 0;

    if (featSlides.length > 0 && featNext && featPrev) {
      const showFeatSlide = (index) => {
        featSlides.forEach((slide, i) => {
          slide.style.display = i === index ? 'block' : 'none';
        });
      };

      featNext.addEventListener('click', () => {
        currentFeat = (currentFeat + 1) % featSlides.length;
        showFeatSlide(currentFeat);
      });

      featPrev.addEventListener('click', () => {
        currentFeat = (currentFeat - 1 + featSlides.length) % featSlides.length;
        showFeatSlide(currentFeat);
      });
    }

  });
</script>
