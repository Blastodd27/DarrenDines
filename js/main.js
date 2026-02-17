/* =============================================
   MAIN.JS — Homepage Logic
   ============================================= */

// ---------- Scroll Animations (Intersection Observer) ----------
document.addEventListener("DOMContentLoaded", () => {
  // Animate elements when they scroll into view
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

  // ---------- Search Functionality ----------
  const searchInput = document.getElementById("search-input");
  const postsGrid = document.getElementById("posts-grid");

  if (searchInput && postsGrid) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = postsGrid.querySelectorAll(".post-card");

      cards.forEach((card) => {
        const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
        const excerpt =
          card.querySelector(".excerpt")?.textContent.toLowerCase() || "";
        const label =
          card.querySelector(".label")?.textContent.toLowerCase() || "";

        if (
          title.includes(query) ||
          excerpt.includes(query) ||
          label.includes(query)
        ) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

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
