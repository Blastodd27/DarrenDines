/* =============================================
   MAIN.JS — Homepage Logic
   ============================================= */

// ---------- Render Homepage Posts from SEARCH_DATA ----------
// This runs first so the animation observer picks up the new elements.
function renderHomePosts() {
  if (typeof SEARCH_DATA === 'undefined' || SEARCH_DATA.length === 0) return;

  // --- Posts Grid (all posts as equal-sized cards) ---
  const postsGrid = document.getElementById('posts-grid');
  if (postsGrid) {
    postsGrid.innerHTML = SEARCH_DATA.map(post => `
      <a href="${post.url}" class="post-card animate-in">
        <div class="post-card-image-wrapper">
          <img src="${post.image}" alt="${post.title}" class="post-card-image" />
        </div>
        <div class="post-card-body">
          <span class="label">${post.location}</span>
          <h3>${post.title}</h3>
          <p class="excerpt">${post.excerpt}</p>
          <div class="post-card-meta">
            <span>${post.date}</span>
          </div>
        </div>
      </a>
    `).join('');
  }
}

// Run before DOMContentLoaded observer so animations apply to rendered cards
renderHomePosts();

document.addEventListener("DOMContentLoaded", () => {

  // ---------- Scroll Animations (Intersection Observer) ----------
  const animatedElements = document.querySelectorAll(".animate-in");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    animatedElements.forEach((el) => {
      el.style.animationPlayState = "paused";
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    animatedElements.forEach((el) => {
      el.style.opacity = "1";
    });
  }

  // ---------- Mobile Menu Toggle ----------
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "var(--nav-height)";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "var(--color-dark)";
      navLinks.style.padding = "1rem 2rem";
      navLinks.style.gap = "1rem";
    });
  }

  // ---------- Search ----------
  // Search is now handled by the unified search module (search.js)

  // ---------- Navbar Background on Scroll ----------
  const navbar = document.getElementById("navbar");

  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.15)";
      } else {
        navbar.style.boxShadow = "none";
      }
    });
  }
});
