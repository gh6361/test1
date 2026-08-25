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
    <div id="bottom-map" style="width: 100%; height: 100%; z-index: 1;"></div>
  </div>

</section>

<!-- 4. COLLECTIONS SECTION -->
<section id="collections-section" style="background-color: #ffffff; width: 100%; padding: 4rem 0 6rem 0;">
  <div style="max-width: 1000px; margin: 0 auto; padding: 0 2rem;">
    
    <h2 style="font-family: var(--font-sans) !important; font-weight: 600; font-size: 2rem; letter-spacing: 0.05em; text-align: center; margin-top: 1rem; margin-bottom: 2rem; color: #1c1c1c;">COLLECTIONS</h2>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
      
      <!-- COLLECTION CARD 1 -->
      <a href="/collections/iceland" style="position: relative; display: block; aspect-ratio: 4 / 4; text-decoration: none; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <img src="{{ '/assets/images/rainbow.jpg' | relative_url }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 1;">
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 1.5rem; box-sizing: border-box; z-index: 3; text-align: left;">
          <div style="font-family: var(--font-sans); font-weight: 700; font-size: 1.4rem; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
            Iceland
          </div>
        </div>
      </a>

      <!-- COLLECTION CARD 2 -->
      <!-- COLLECTION CARD 2 -->
      <a href="{{ '/collections/finland/' | relative_url }}" style="position: relative; display: block; aspect-ratio: 4 / 4; text-decoration: none; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <img src="{{ '/assets/images/car4.jpg' | relative_url }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 1;">
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 1.5rem; box-sizing: border-box; z-index: 3; text-align: left;">
          <div style="font-family: var(--font-sans); font-weight: 700; font-size: 1.4rem; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
            Finland
          </div>
        </div>
      </a>

      <!-- COLLECTION CARD 3 -->
      <a href="/collections/guatemala" style="position: relative; display: block; aspect-ratio: 4 / 4; text-decoration: none; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <img src="{{ '/assets/images/lake.jpg' | relative_url }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 1;">
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 1.5rem; box-sizing: border-box; z-index: 3; text-align: left;">
          <div style="font-family: var(--font-sans); font-weight: 700; font-size: 1.4rem; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
            Lake
          </div>
        </div>
      </a>

      <!-- COLLECTION CARD 4 -->
      <a href="/collections/guatemala" style="position: relative; display: block; aspect-ratio: 4 / 4; text-decoration: none; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <img src="{{ '/assets/images/yosemite.jpg' | relative_url }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 1;">
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 1.5rem; box-sizing: border-box; z-index: 3; text-align: left;">
          <div style="font-family: var(--font-sans); font-weight: 700; font-size: 1.4rem; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
            Yosemite
          </div>
        </div>
      </a>


<!-- COLLECTION CARD 5 -->
      <a href="/collections/guatemala" style="position: relative; display: block; aspect-ratio: 4 / 4; text-decoration: none; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <img src="{{ '/assets/images/klavika.jpg' | relative_url }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 1;">
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 1.5rem; box-sizing: border-box; z-index: 3; text-align: left;">
          <div style="font-family: var(--font-sans); font-weight: 700; font-size: 1.4rem; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
            Beach
          </div>
        </div>
      </a>


<!-- COLLECTION CARD 6 -->
      <a href="/collections/guatemala" style="position: relative; display: block; aspect-ratio: 4 / 4; text-decoration: none; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <img src="{{ '/assets/images/conemara.jpg' | relative_url }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 1;">
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 1.5rem; box-sizing: border-box; z-index: 3; text-align: left;">
          <div style="font-family: var(--font-sans); font-weight: 700; font-size: 1.4rem; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
            Ireland
          </div>
        </div>
      </a>


<!-- COLLECTION CARD 7 -->
      <a href="/collections/guatemala" style="position: relative; display: block; aspect-ratio: 4 / 4; text-decoration: none; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <img src="{{ '/assets/images/snowman.jpg' | relative_url }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 1;">
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 1.5rem; box-sizing: border-box; z-index: 3; text-align: left;">
          <div style="font-family: var(--font-sans); font-weight: 700; font-size: 1.4rem; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
            Snowman
          </div>
        </div>
      </a>


<!-- COLLECTION CARD 8 -->
      <a href="/collections/guatemala" style="position: relative; display: block; aspect-ratio: 4 / 4; text-decoration: none; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <img src="{{ '/assets/images/bread.jpg' | relative_url }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 1;">
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 1.5rem; box-sizing: border-box; z-index: 3; text-align: left;">
          <div style="font-family: var(--font-sans); font-weight: 700; font-size: 1.4rem; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
            Bread
          </div>
        </div>
      </a>

<!-- COLLECTION CARD 9 -->
      <a href="/collections/guatemala" style="position: relative; display: block; aspect-ratio: 4 / 4; text-decoration: none; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <img src="{{ '/assets/images/moana-chicken.jpg' | relative_url }}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 1;">
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 1.5rem; box-sizing: border-box; z-index: 3; text-align: left;">
          <div style="font-family: var(--font-sans); font-weight: 700; font-size: 1.4rem; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
            Chicken
          </div>
        </div>
      </a>

    </div>
  </div>
</section>

<!-- 3. FEATURED EDITORIAL SLIDESHOW -->
<section style="background-color: #f4f4f5; width: 100%; padding-top: 2rem;">
  <div id="featured-editorial" style="max-width: 1000px; margin: 0 auto; padding: 0 2rem 6rem 2rem;">
  
  <!-- Centered, sans-serif "FEATURED" heading without the bottom line -->
  <h2 style="font-family: var(--font-sans) !important; font-weight: 600; font-size: 2rem; letter-spacing: 0.05em; text-align: center; margin-top: 1rem; margin-bottom: 2rem; color: #1c1c1c;">FEATURED</h2>

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
        zoomControl: false, dragging: false, scrollWheelZoom: false, 
        doubleClickZoom: false, boxZoom: false, keyboard: false, zoomSnap: 0.1 
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        className: 'dark-map-layer' 
      }).addTo(bottomMap);

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
          const customIcon = L.divIcon({
            html: `<div class="mini-map-thumb" onclick="window.location.href='${mapPageUrl}?loc=${index}'"><img src="${firstImg}"><div class="thumb-badge">${imgCount}</div></div>`,
            className: "", iconSize: L.point(40, 40)
          });
          const marker = L.marker(loc.coords, { icon: customIcon, imgCount: imgCount, firstImg: firstImg, locIndex: index });
          bottomMarkers.addLayer(marker);

          const title = loc.name.split(":")[0].trim();
          const country = loc.country || "Other";
          
          carouselHtml += `
            <a href="${mapPageUrl}?loc=${index}" class="carousel-card" style="display: flex; flex-direction: column; text-decoration: none; color: inherit; border: 1px solid #e5e5e5; padding: 0; background-color: #ffffff; transition: opacity 0.2s ease;">
              <img src="${firstImg}" style="width: 100%; height: 120px; object-fit: cover; margin-bottom: 0rem; display: block;">
              <div style="text-align: left;">
                <div style="font-family: var(--font-sans); font-size: 0.7rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 0.8rem; margin-bottom: 0.3rem; margin-left: 0.5rem; line-height: 1.2;">${country}</div>
                <div style="font-size: 1rem; font-weight: 550; color: #1c1c1c; margin-left: 0.5rem; margin-bottom: 0.4rem">${title}</div>
              </div>
            </a>
          `;
        }
      });

      carouselTrack.innerHTML = carouselHtml;
      
      bottomMarkers.on('clusterclick', function (a) {
        const center = a.layer.getLatLng();
        window.location.href = `${mapPageUrl}?lat=${center.lat}&lng=${center.lng}&zoom=6`;
      });
      
      bottomMap.addLayer(bottomMarkers);
      bottomMap.fitBounds([[-55, -100], [75, 120]], { paddingTopLeft: [0, 60], paddingBottomRight: [0, 20] });

      const btnNextC = document.getElementById('carousel-next');
      const btnPrevC = document.getElementById('carousel-prev');

      if (btnNextC && btnPrevC) {
        const getScrollDistance = () => {
          const card = carouselTrack.querySelector('.carousel-card');
          return card ? card.offsetWidth + 24 : 250; 
        };
        btnNextC.addEventListener('click', () => { carouselTrack.scrollBy({ left: getScrollDistance(), behavior: 'smooth' }); });
        btnPrevC.addEventListener('click', () => { carouselTrack.scrollBy({ left: -getScrollDistance(), behavior: 'smooth' }); });
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