/* =============================================
   MAP.JS — Leaflet Map with Blog Post Pins
   Reads pin data from SEARCH_DATA (search-data.js)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile Menu Toggle ----------
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isVisible = navLinks.style.display === "flex";
      navLinks.style.display = isVisible ? "none" : "flex";

      if (!isVisible) {
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "var(--nav-height)";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.background = "var(--color-dark)";
        navLinks.style.padding = "1rem 2rem";
        navLinks.style.gap = "1rem";
        navLinks.style.borderBottom = "1px solid rgba(255, 255, 255, 0.08)";
      }
    });
  }

  // ---------- Pin Data from SEARCH_DATA ----------
  if (typeof SEARCH_DATA === 'undefined' || SEARCH_DATA.length === 0) return;

  // ---------- Initialize Map ----------
  const map = L.map('map', {
    zoomControl: false,
    preferCanvas: true,
    updateWhenZooming: false,
    updateWhenIdle: true,
    zoomSnap: 1,
    zoomAnimation: true,
    markerZoomAnimation: true,
    minZoom: 3,
    // Set vertical limits to +/- 90 (poles) but allow virtually infinite horizontal panning
    maxBounds: [[-90, -18000], [90, 18000]],
    maxBoundsViscosity: 1.0,
    worldCopyJump: true,
    attributionControl: false
  }).setView([25, 10], 3);

  // Zoom control intentionally omitted — users pinch-to-zoom on mobile and scroll-wheel on desktop

  // ---------- Map Tiles (CartoDB Positron — Minimal, Yelp-like style) ----------
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 18,
    keepBuffer: 4
  }).addTo(map);

  // ---------- Custom Pin Icon ----------
  const pinIcon = L.divIcon({
    className: 'custom-pin-wrapper',
    html: '<div class="custom-pin"></div>',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44]
  });

  // ---------- Add Pins to Map from SEARCH_DATA ----------
  const markers = [];

  SEARCH_DATA.forEach(post => {
    if (!post.lat || !post.lng) return; // skip entries without coordinates

    const popupContent = `
      <div class="popup-card" onclick="window.open('${post.url}', '_blank')">
        <img src="${post.image}" alt="${post.title}" />
        <div class="popup-card-body">
          <h4>${post.title}</h4>
          <p>${post.excerpt}</p>
          <span class="popup-link">Read Blog Post →</span>
        </div>
      </div>
    `;

    const marker = L.marker([post.lat, post.lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup(popupContent, {
        maxWidth: 280,
        minWidth: 280,
        closeButton: true,
        className: 'custom-popup',
        autoPanPaddingTopLeft: [40, 120],
        autoPanPaddingBottomRight: [40, 40]
      });

    // Store post data for search
    marker._pinData = post;
    markers.push(marker);
  });

  // ---------- Search Pins ----------
  const searchInput = document.getElementById('search-input');
  let searchTimeout = null;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Debounce: wait for the user to stop typing before moving the map
      clearTimeout(searchTimeout);

      if (!query) {
        markers.forEach(m => {
          if (!map.hasLayer(m)) map.addLayer(m);
        });
        map.setView([25, 10], 3);
        return;
      }

      // Require at least 3 characters to avoid noisy partial matches
      if (query.length < 3) {
        markers.forEach(m => {
          if (!map.hasLayer(m)) map.addLayer(m);
        });
        return;
      }

      searchTimeout = setTimeout(() => {
        const matched = [];

        markers.forEach(m => {
          const data = m._pinData;
          const tagStr = Array.isArray(data.tags) ? data.tags.join(' ') : (data.tags || '');
          const searchable = (data.title + ' ' + data.location + ' ' + data.excerpt + ' ' + tagStr).toLowerCase();
          const match = searchable.includes(query);

          if (match) {
            if (!map.hasLayer(m)) map.addLayer(m);
            matched.push(m);
          } else {
            map.removeLayer(m);
          }
        });

        if (matched.length === 1) {
          map.flyTo(matched[0].getLatLng(), 12, { duration: 1.5 });
          matched[0].openPopup();
        } else if (matched.length > 1) {
          const group = L.featureGroup(matched);
          map.flyToBounds(group.getBounds().pad(0.5), { maxZoom: 5, duration: 1.5 });
        }
      }, 400);
    });
  }

  // ---------- Trip Filter from URL or Fit All Pins ----------
  const urlParams = new URLSearchParams(window.location.search);
  const tripFilter = urlParams.get('trip');

  if (tripFilter) {
    const matched = [];
    markers.forEach(m => {
      if (m._pinData.trip === tripFilter) {
        matched.push(m);
      } else {
        map.removeLayer(m);
      }
    });

    if (matched.length === 1) {
      map.setView(matched[0].getLatLng(), 14);
      matched[0].openPopup();
    } else if (matched.length > 1) {
      const group = L.featureGroup(matched);
      map.fitBounds(group.getBounds().pad(0.4), { maxZoom: 14 });
    }
  } else {
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.5), { maxZoom: 5 });
    }
  }
});
