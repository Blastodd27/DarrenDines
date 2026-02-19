/* =============================================
   SEARCH.JS — Unified Dropdown Search Module
   =============================================
   Loaded on every page. Uses SEARCH_DATA from search-data.js.
   Shows a dropdown panel with matching results below the navbar.
*/

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  if (!searchInput || typeof SEARCH_DATA === 'undefined') return;

  // Determine base path: blog post pages are in posts/ subfolder
  const isSubpage = window.location.pathname.includes('/posts/');
  const basePath = isSubpage ? '../' : '';

  // ---------- Create Dropdown Container ----------
  const dropdown = document.createElement('div');
  dropdown.className = 'search-dropdown';
  dropdown.id = 'search-dropdown';

  // Insert dropdown right after the navbar in the DOM
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.after(dropdown);
  }

  // ---------- Render Results ----------
  function renderResults(results) {
    if (results.length === 0) {
      dropdown.innerHTML = `
        <div class="search-no-results">
          <span class="search-no-results-icon">🔍</span>
          <p>No results found</p>
        </div>
      `;
      return;
    }

    dropdown.innerHTML = results.map(item => `
      <a href="${basePath}${item.url}" class="search-result-item">
        <img src="${basePath}${item.image}" alt="${item.title}" class="search-result-thumb" />
        <div class="search-result-info">
          <h4 class="search-result-title">${highlightMatch(item.title, searchInput.value)}</h4>
          <span class="search-result-location">${item.location}</span>
          <p class="search-result-excerpt">${item.excerpt}</p>
        </div>
      </a>
    `).join('');
  }

  // ---------- Highlight Matching Text ----------
  function highlightMatch(text, query) {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${escapeRegex(query.trim())})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ---------- Search Logic ----------
  function performSearch(query) {
    query = query.toLowerCase().trim();

    if (!query) {
      hideDropdown();
      return;
    }

    const results = SEARCH_DATA.filter(item => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });

    renderResults(results);
    showDropdown();
  }

  // ---------- Show / Hide ----------
  function showDropdown() {
    dropdown.classList.add('active');
  }

  function hideDropdown() {
    dropdown.classList.remove('active');
    dropdown.innerHTML = '';
  }

  // ---------- Event Listeners ----------
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(e.target.value);
    }, 150);
  });

  // Focus shows results if there's a query
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
      performSearch(searchInput.value);
    }
  });

  // Escape key closes dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideDropdown();
      searchInput.blur();
    }
  });

  // Click outside closes dropdown
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper') && !e.target.closest('.search-dropdown')) {
      hideDropdown();
    }
  });
});
