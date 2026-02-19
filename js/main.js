/* =============================================
   MAIN.JS — Site-wide Logic
   ============================================= */

// ---------- Render Homepage Posts (carousel) ----------
function renderHomePosts() {
  if (typeof SEARCH_DATA === 'undefined' || SEARCH_DATA.length === 0) return;

  const REVERSED_DATA = [...SEARCH_DATA].reverse();

  const postsGrid = document.getElementById('posts-grid');
  if (!postsGrid) return;

  const PAGE_SIZE = 3;
  let currentPage = 0;
  const totalPages = Math.ceil(REVERSED_DATA.length / PAGE_SIZE);
  const hasMoreThanOnePage = totalPages > 1;

  // Build card HTML for a given page
  function getPageCards(page) {
    const start = page * PAGE_SIZE;
    return REVERSED_DATA.slice(start, start + PAGE_SIZE).map(post => `
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

  // Render first page
  postsGrid.innerHTML = getPageCards(0);

  // Only add the button if there are more than PAGE_SIZE posts
  if (!hasMoreThanOnePage) return;

  // Create the carousel nav button
  const btnWrapper = document.createElement('div');
  btnWrapper.className = 'carousel-nav';
  btnWrapper.innerHTML = '<button class="carousel-btn" aria-label="Next posts">&rsaquo;</button>';
  postsGrid.parentNode.insertBefore(btnWrapper, postsGrid.nextSibling);

  const btn = btnWrapper.querySelector('.carousel-btn');
  const isMobile = () => window.innerWidth <= 768;

  btn.addEventListener('click', () => {
    currentPage++;

    // If we've shown all pages, go to stories
    if (currentPage >= totalPages) {
      window.location.href = 'stories.html';
      return;
    }

    if (isMobile()) {
      // Mobile: append more cards below
      const newCards = getPageCards(currentPage);
      postsGrid.insertAdjacentHTML('beforeend', newCards);
    } else {
      // Desktop: slide to next page
      postsGrid.style.opacity = '0';
      postsGrid.style.transform = 'translateX(40px)';
      setTimeout(() => {
        postsGrid.innerHTML = getPageCards(currentPage);
        postsGrid.style.transform = 'translateX(-40px)';
        // Force reflow
        postsGrid.offsetHeight;
        postsGrid.style.opacity = '1';
        postsGrid.style.transform = 'translateX(0)';
      }, 250);
    }

    // Update button for last page
    if (currentPage >= totalPages - 1) {
      btn.textContent = 'View Older Posts';
      btn.classList.add('carousel-btn-text');
    }
  });
}

// ---------- Render Stories Page from SEARCH_DATA ----------
function renderStories() {
  if (typeof SEARCH_DATA === 'undefined' || SEARCH_DATA.length === 0) return;

  const REVERSED_DATA = [...SEARCH_DATA].reverse();

  const storiesList = document.getElementById('stories-list');
  if (!storiesList) return;

  storiesList.innerHTML = REVERSED_DATA.map(post => `
    <a href="${post.url}" class="story-item animate-in">
      <div class="story-item-image-wrapper">
        <img src="${post.image}" alt="${post.title}" class="story-item-image" />
      </div>
      <div class="story-item-content">
        <span class="label">${post.location}</span>
        <h2>${post.title}</h2>
        <div class="story-item-meta">${post.date}</div>
        <p class="story-item-excerpt">${post.excerpt}</p>
        <span class="story-read-more">Read Story &rarr;</span>
      </div>
    </a>
  `).join('');
}

// Run renderers before DOMContentLoaded so animation observer picks up elements
renderHomePosts();
renderStories();

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
