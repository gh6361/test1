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
<section id="stacked-layout" style="max-width: 1000px; margin: 0 auto; padding: 2rem 2rem 2rem 2rem;">
  
  <!-- Centered, sans-serif "RECENT" heading without the bottom line -->
  <h2 style="font-family: var(--font-sans) !important; font-weight: 600; font-size: 2rem; letter-spacing: 0.05em; text-align: center; margin-top: 1rem; margin-bottom: 2rem; color: #1c1c1c;">RECENT</h2>

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
  <div style="position: relative; width: 100%; aspect-ratio: 1.8 / 1; background: #e0e0e0; overflow: hidden; margin-top: 1rem; margin-bottom: 0rem; border: 1px solid #e5e5e5;">
  <!-- NEW: Interaction Label overlay -->
    <!-- NEW: Interaction Label overlay (Dark grey background, white text) -->
    <div style="position: absolute; top: 0px; left: 0px; z-index: 1000; background: rgba(62, 62, 62, 0.75); padding: 0.4rem 0.8rem; border-radius: 0px; font-family: var(--font-sans); font-size: 0.7rem; font-weight: 600; color: #ffffff; letter-spacing: 0.05em; text-transform: none; pointer-events: none; box-shadow: none;">
      Ctrl + click/scroll to move/zoom
    </div>
    <div id="bottom-map" style="width: 100%; height: 100%; z-index: 1;"></div>
  </div>

</section>

{% include collections-grid.html %}

<!-- 3. FEATURED EDITORIAL SLIDESHOW -->
<section style="background-color: #f4f4f5; width: 100%; padding-top: 2rem;">
  <div id="featured-editorial" style="max-width: 1000px; margin: 0 auto; padding: 0 2rem 6rem 2rem;">
  
  <!-- Centered, sans-serif "FEATURED" heading without the bottom line -->
  <h2 style="font-family: var(--font-sans) !important; font-weight: 700 !important; font-size: 2rem; letter-spacing: 0.05em; text-align: center; margin-top: 1rem; margin-bottom: 2rem; color: #1c1c1c;">FEATURED</h2>

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
        
        minZoom: 1.5, /* NEW: Prevents zooming out far enough to see the grey background */

        maxBounds: [[-90, -Infinity], [90, Infinity]],
        maxBoundsViscosity: 1.0, 
        worldCopyJump: true 
      });

      // NEW: Enable pan and zoom only when holding Ctrl (Windows) or Cmd (Mac)
     // UPDATED: KEYBOARD CONTROLS FOR MODAL & HOVERED CLUSTERS
      // Enable pan/drag only when holding Ctrl (Windows) or Cmd (Mac)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Control' || e.key === 'Meta') {
          bottomMap.dragging.enable();
          bottomMap.doubleClickZoom.enable();
          bottomMapEl.style.cursor = 'grab'; 
        }
      });

      document.addEventListener('keyup', (e) => {
        if (e.key === 'Control' || e.key === 'Meta') {
          bottomMap.dragging.disable();
          bottomMap.doubleClickZoom.disable();
          bottomMapEl.style.cursor = 'default';
        }
      });

      // FIXED: Custom Scroll Zoom Logic
      bottomMapEl.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          // 1. Block the browser's default page zoom
          e.preventDefault(); 
          
          // 2. Determine scroll direction (Scroll up = zoom in, Scroll down = zoom out)
          const zoomDelta = e.deltaY > 0 ? -0.5 : 0.5;
          
          // 3. Force the map to zoom smoothly around the exact mouse cursor position
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

      /* --- NEW: TOP-RIGHT REGION CONTROLS --- */
      const regionBounds = {
        world: [[-55, -170], [75, 180]],
        europe: [[38, -10], [69, 35]],
        na: [[22, -175], [70, -45]],
        oceania: [[-47, 110], [-10, 180]],
      };

      const regionControl = L.control({ position: "topright" });
      regionControl.onAdd = function (mapInstance) {
        const div = L.DomUtil.create("div", "map-region-controls");
        
        // You can add or remove regions here to match your main map exactly
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

          // NEW: Close the popup modal if it happens to be open
          const mapModal = document.getElementById('custom-map-modal');
          if (mapModal) {
            mapModal.style.display = 'none';
          }

          const currentZoom = mapInstance.getZoom();
          const isZoomedIn = currentZoom > 4;
          const isWorldTransition = lastRegion === "world" || targetRegion === "world";

          if (isZoomedIn || !isWorldTransition) {
            mapInstance.fitBounds(regionBounds[targetRegion], {
              animate: false,
              padding: [20, 20],
            });
          } else {
            mapInstance.flyToBounds(regionBounds[targetRegion], {
              duration: 0.7,
              padding: [20, 20],
            });
          }
          lastRegion = targetRegion;
        });
        return div;
      };
      regionControl.addTo(bottomMap);
      /* --- END REGION CONTROLS --- */

      // UPDATED: Cluster now embeds all its images and includes hover arrows
      const bottomMarkers = L.markerClusterGroup({
        showCoverageOnHover: false, 
        maxClusterRadius: 80, 
        zoomToBoundsOnClick: false, 
        iconCreateFunction: function (cluster) {
          const children = cluster.getAllChildMarkers();
          const locationCount = cluster.getChildCount(); 
          
          // Map out the data for all pins hidden inside this cluster
          const clusterData = children.map(child => ({
            img: child.options.firstImg,
            name: child.options.locName,
            query: child.options.queryParam
          }));

          // Encode the data safely so we can attach it directly to the HTML element
          const dataString = encodeURIComponent(JSON.stringify(clusterData));

          return L.divIcon({
            html: `
              <div class="mini-map-thumb cluster-thumb" data-locations="${dataString}" data-current-index="0"
                   onmouseenter="window.hoveredCluster = this; this.querySelector('.cluster-nav').style.opacity='1';"
                   onmouseleave="window.hoveredCluster = null; this.querySelector('.cluster-nav').style.opacity='0';">
                <img src="${clusterData[0].img}">
                <div class="thumb-badge">${locationCount}</div>
                
                <!-- FIXED: Blocks Leaflet from intercepting the clicks -->
                <div class="cluster-nav" style="opacity: 0; transition: opacity 0.2s ease;" 
                     onmousedown="event.stopPropagation();" onclick="event.stopPropagation();">
                  <button onclick="window.slideCluster(event, -1, this.closest('.cluster-thumb'))" style="position: absolute; left: 2px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; padding: 2px 6px; cursor: pointer; border-radius: 2px; font-size: 0.7rem; z-index: 10;">‹</button>
                  <button onclick="window.slideCluster(event, 1, this.closest('.cluster-thumb'))" style="position: absolute; right: 2px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; padding: 2px 6px; cursor: pointer; border-radius: 2px; font-size: 0.7rem; z-index: 10;">›</button>
                </div>
              </div>
            `,
            className: "", 
            iconSize: L.point(75, 75)
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
          // NEW: Create the URL parameter using loc.id if it exists, otherwise fall back to the index
          const queryParam = loc.id ? `?id=${loc.id}` : `?loc=${index}`;

          // 1. ADD EVERY LOCATION TO THE MAP
          const customIcon = L.divIcon({
            html: `
              <div class="mini-map-thumb">
                <img src="${firstImg}">
                <div class="single-hover">View<br>Gallery</div>
              </div>
            `,
            className: "", 
            iconSize: L.point(75, 75)
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

          // 2. ONLY ADD THE FIRST 10 LOCATIONS TO THE CAROUSEL
          if (index < 10) {
            const title = loc.name.split(":")[0].trim();
            const country = loc.country || "Other";
            
            carouselHtml += `
              <a href="${mapPageUrl}${queryParam}" class="carousel-card" style="display: flex; flex-direction: column; text-decoration: none; color: inherit; border: 1px solid #e5e5e5; padding: 0; background-color: #ffffff; transition: opacity 0.2s ease;">
                <img src="${firstImg}" style="width: 100%; height: 120px; object-fit: cover; margin-bottom: 0rem; display: block;">
                <div style="text-align: left;">
                  <div style="font-family: var(--font-sans); font-size: 0.7rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 0.8rem; margin-bottom: 0.3rem; margin-left: 0.5rem; line-height: 1.2;">${country}</div>
                  <div style="font-size: 1rem; font-weight: 550; color: #1c1c1c; margin-left: 0.5rem; margin-bottom: 0.4rem">${title}</div>
                </div>
              </a>
            `;
          }
        }
      });

      carouselTrack.innerHTML = carouselHtml;

      // --- NEW: CENTERED MODAL SLIDESHOW LOGIC ---
      let popupCurrentIndex = 0;
      let popupLocations = [];

      // NEW: Function to slide images directly on the map pin
      window.slideCluster = function(event, dir, thumbEl) {
        if (event) {
          event.stopPropagation();
          event.preventDefault();
        }
        if (!thumbEl) return;
        
        const dataString = thumbEl.getAttribute('data-locations');
        const locations = JSON.parse(decodeURIComponent(dataString));
        let currentIndex = parseInt(thumbEl.getAttribute('data-current-index'), 10);
        
        currentIndex = (currentIndex + dir + locations.length) % locations.length;
        thumbEl.setAttribute('data-current-index', currentIndex);
        
        const imgEl = thumbEl.querySelector('img');
        if (imgEl) imgEl.src = locations[currentIndex].img;
      };

      // 1. Create the centered modal overlay dynamically
      let mapModal = document.getElementById('custom-map-modal');
      if (!mapModal) {
        mapModal = document.createElement('div');
        mapModal.id = 'custom-map-modal';
        // Style it to hover dead-center over the map wrapper
        Object.assign(mapModal.style, {
          position: 'absolute',
          bottom: '0%',
          left: '0%',
          transform: 'translate(0%, 0%)',
          zIndex: '2000',
          background: '#ffffff',
          padding: '1.2rem',
          borderRadius: '4px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'none', // Hidden by default
          width: '260px',
          boxSizing: 'border-box'
        });
        // Append it to the div that wraps bottomMapEl so it stays confined to the map area
        bottomMapEl.parentElement.appendChild(mapModal);
      }

      window.changePopupSlide = function(event, dir) {
        event.stopPropagation(); 
        event.preventDefault();
        popupCurrentIndex = (popupCurrentIndex + dir + popupLocations.length) % popupLocations.length;
        mapModal.innerHTML = window.renderMapPopup();
      };

      window.closeMapPopup = function(event) {
        event.stopPropagation();
        mapModal.style.display = 'none';
      };

      window.renderMapPopup = function() {
        if (!popupLocations.length) return "";
        const loc = popupLocations[popupCurrentIndex];
        
        return `
          <div style="position: relative; width: 100%; text-align: center; font-family: var(--font-sans);">
            
            <!-- Custom "X" Button -->
            <button onclick="window.closeMapPopup(event)" style="position: absolute; top: -10px; right: -10px; background: none; border: none; font-size: 1.5rem; color: #1c1c1c; cursor: pointer; z-index: 10; line-height: 1; padding: 5px;">&times;</button>
            
            <div style="position: relative; width: 100%; height: 160px; margin-bottom: 12px; margin-top: 5px;">
              <img src="${loc.img}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 2px;">
              
              ${popupLocations.length > 1 ? `
                <button onclick="window.changePopupSlide(event, -1)" style="position: absolute; left: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 5px 8px; cursor: pointer; border-radius: 3px;">‹</button>
                <button onclick="window.changePopupSlide(event, 1)" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 5px 8px; cursor: pointer; border-radius: 3px;">›</button>
                <div style="position: absolute; top: 5px; left: 5px; background: rgba(0,0,0,0.6); color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 3px;">
                  ${popupCurrentIndex + 1} /${popupLocations.length}
                </div>
              ` : ''}
            </div>
            
            <h4 style="margin: 0 0 12px 0; font-size: 0.95rem; color: #1c1c1c;">${loc.name}</h4>
            
            <a href="${mapPageUrl}${loc.query}" onclick="event.stopPropagation();" style="display: inline-block; padding: 8px 14px; background: #1c1c1c; color: #ffffff; text-decoration: none; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px; transition: background 0.2s ease;">View Gallery</a>
          </div>
        `;
      };

      // When clicking a single pin
      // When clicking a single pin
      // UPDATED: Cluster click now opens the modal starting at the exact image you scrolled to
      bottomMarkers.on('clusterclick', function(e) {
        // Grab the HTML element of the cluster we just clicked
        const clusterEl = e.layer.getElement().querySelector('.cluster-thumb');
        
        if (clusterEl) {
          // Read exactly where the user left off on the mini-carousel
          popupCurrentIndex = parseInt(clusterEl.getAttribute('data-current-index'), 10) || 0;
          const dataString = clusterEl.getAttribute('data-locations');
          popupLocations = JSON.parse(decodeURIComponent(dataString));
        } else {
          // Fallback just in case
          popupCurrentIndex = 0;
          popupLocations = e.layer.getAllChildMarkers().map(marker => ({
            img: marker.options.firstImg, name: marker.options.locName, query: marker.options.queryParam
          }));
        }
        
        mapModal.innerHTML = window.renderMapPopup();
        mapModal.style.display = 'block';
        e.layer.zoomToBounds({ padding: [30, 30] });
      });

      bottomMap.addLayer(bottomMarkers);
      bottomMap.fitBounds([[-55, -100], [75, 120]], { paddingTopLeft: [0, 60], paddingBottomRight: [0, 20] });
      
      // FIXED: One combined keyboard listener for the entire map experience
      document.addEventListener('keydown', (e) => {
        
        // 1. Map Dragging (Ctrl/Cmd)
        if (e.key === 'Control' || e.key === 'Meta') {
          bottomMap.dragging.enable();
          bottomMap.doubleClickZoom.enable();
          bottomMapEl.style.cursor = 'grab'; 
        }

        // 2. Modal & Hovered Cluster Slideshow Logic
        const mapModal = document.getElementById('custom-map-modal');
        const isModalOpen = mapModal && mapModal.style.display === 'block';
        
        if (isModalOpen) {
          // If modal is open, control the modal
          if (e.key === 'Escape') mapModal.style.display = 'none';
          else if (e.key === 'ArrowLeft') window.changePopupSlide({ stopPropagation: () => {}, preventDefault: () => {} }, -1);
          else if (e.key === 'ArrowRight') window.changePopupSlide({ stopPropagation: () => {}, preventDefault: () => {} }, 1);
        } 
        else if (window.hoveredCluster) {
          // If modal is closed but we are hovering a cluster, control the cluster
          if (e.key === 'ArrowLeft') window.slideCluster(null, -1, window.hoveredCluster);
          else if (e.key === 'ArrowRight') window.slideCluster(null, 1, window.hoveredCluster);
        }
      });

      const btnNextC = document.getElementById('carousel-next');
      const btnPrevC = document.getElementById('carousel-prev');

      if (btnNextC && btnPrevC) {
        const getScrollDistance = () => {
          const card = carouselTrack.querySelector('.carousel-card');
          return card ? card.offsetWidth + 24 : 250; // 24px matches your 1.5rem gap
        };
        
        let isAnimating = false;

        btnNextC.addEventListener('click', () => { 
          if (isAnimating) return;
          isAnimating = true;
          
          const distance = getScrollDistance();
          carouselTrack.scrollBy({ left: distance, behavior: 'smooth' }); 
          
          // Wait for the smooth scroll to finish, then quietly move the first card to the back
          setTimeout(() => {
            carouselTrack.style.scrollBehavior = 'auto'; // Turn off smooth scroll
            carouselTrack.appendChild(carouselTrack.firstElementChild); // Move item to end
            carouselTrack.scrollLeft -= distance; // Shift scrollbar back to hide the teleport
            
            // Turn smooth scroll back on for the next click
            requestAnimationFrame(() => {
              carouselTrack.style.scrollBehavior = 'smooth';
              isAnimating = false;
            });
          }, 400); // 400ms gives the browser enough time to finish the slide animation
        });
        
        btnPrevC.addEventListener('click', () => { 
          if (isAnimating) return;
          isAnimating = true;
          
          const distance = getScrollDistance();
          
          // For the left arrow, we have to teleport the last card to the front FIRST
          carouselTrack.style.scrollBehavior = 'auto'; 
          carouselTrack.prepend(carouselTrack.lastElementChild);
          carouselTrack.scrollLeft += distance; 
          
          // Turn smooth scroll back on and execute the slide
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
