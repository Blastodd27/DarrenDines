/* =============================================
   MAP.JS — Leaflet Map with Blog Post Pins
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

  // ---------- Blog Pin Data ----------
  // To add a new pin: copy one of the objects below and change the values.
  // lat/lng = the GPS coordinates of the restaurant (find on Google Maps)
  // title   = restaurant or location name
  // caption = a short one-liner about the meal
  // image   = relative path to a food photo (in the images/ folder)
  // postUrl = relative path to the blog post HTML file (in the posts/ folder)
  const blogPins = [
    {
      lat: 40.7626,
      lng: -73.9851,
      title: "Gallagher's Steakhouse, New York City",
      caption: "A New York institution since 1927. Dry aged beef, wood-fired grills, and the most unexpectedly transcendent tiramisu.",
      image: "images/gallaghers-dry-age.jpg",
      postUrl: "posts/post1.html"
    },
    {
      lat: 52.9947,
      lng: -9.3790,
      title: "Homestead Cottage, Doolin",
      caption: "A Michelin-starred cottage near the Cliffs of Moher. Steamed John Dory, spring lamb, and a head chef who drove us to the bus stop.",
      image: "images/homestead-exterior.jpg",
      postUrl: "posts/post2.html"
    }
  ];

  // ---------- Initialize Map ----------
  const map = L.map('map', {
    zoomControl: false,        // We'll add it in a custom position
    preferCanvas: true,        // Canvas renderer = faster than SVG for markers
    updateWhenZooming: false,  // Don't re-render tiles mid-zoom animation
    updateWhenIdle: true,      // Only load new tiles when movement stops
    zoomSnap: 1,               // Snap to integer zoom levels
    zoomAnimation: true,       // Smooth zoom animation
    markerZoomAnimation: true  // Smooth marker animation on zoom
  }).setView([25, 10], 3);     // World view, slightly centered

  // Zoom control intentionally omitted — users pinch-to-zoom on mobile and scroll-wheel on desktop

  // ---------- Map Tiles (CartoDB Positron — Minimal, Yelp-like style) ----------
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 18,
    keepBuffer: 4              // Pre-cache surrounding tiles to reduce blank areas
  }).addTo(map);

  // ---------- Custom Pin Icon ----------
  const pinIcon = L.divIcon({
    className: 'custom-pin-wrapper',
    html: '<div class="custom-pin"></div>',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44]
  });

  // ---------- Add Pins to Map ----------
  const markers = [];

  blogPins.forEach(pin => {
    const popupContent = `
      <div class="popup-card" onclick="window.open('${pin.postUrl}', '_blank')">
        <img src="${pin.image}" alt="${pin.title}" />
        <div class="popup-card-body">
          <h4>${pin.title}</h4>
          <p>${pin.caption}</p>
          <span class="popup-link">Read Blog Post →</span>
        </div>
      </div>
    `;

    const marker = L.marker([pin.lat, pin.lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup(popupContent, {
        maxWidth: 280,
        minWidth: 280,
        closeButton: true,
        className: 'custom-popup'
      });

    // Store marker with pin data for search
    marker._pinData = pin;
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
        // Show all markers
        markers.forEach(m => {
          if (!map.hasLayer(m)) map.addLayer(m);
        });
        map.setView([25, 10], 3);
        return;
      }

      searchTimeout = setTimeout(() => {
        const matched = [];

        markers.forEach(m => {
          const data = m._pinData;
          const match =
            data.title.toLowerCase().includes(query) ||
            data.caption.toLowerCase().includes(query);

          if (match) {
            if (!map.hasLayer(m)) map.addLayer(m);
            matched.push(m);
          } else {
            map.removeLayer(m);
          }
        });

        if (matched.length === 1) {
          // Single match — fly to it and open popup
          map.flyTo(matched[0].getLatLng(), 12, { duration: 1.5 });
          matched[0].openPopup();
        } else if (matched.length > 1) {
          // Multiple matches — zoom to fit all of them
          const group = L.featureGroup(matched);
          map.flyToBounds(group.getBounds().pad(0.5), { maxZoom: 5, duration: 1.5 });
        }
      }, 400);
    });
  }

  // ---------- Fit Bounds to Show All Pins ----------
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.5), { maxZoom: 5 });
  }
});
