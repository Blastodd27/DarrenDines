# 📝 How to Add a New Blog Post

A step-by-step guide for adding a new food post to **Darren Dines**.

---

## Quick Checklist

- [ ] 1. Add your food photo to `images/`
- [ ] 2. Create the blog post HTML in `posts/`
- [ ] 3. Add to search index in `js/search-data.js`
- [ ] 4. Add a map pin in `js/map.js`
- [ ] 5. Add a card to the homepage in `index.html`
- [ ] 6. Push to GitHub

---

## Step 1: Add Your Food Photo

Place your image in the `images/` folder.

```
images/your-photo.png
```

> **Tip:** Use square or landscape images. PNG or JPG both work. Keep filenames short and lowercase (e.g., `sushi.png`, `pad-thai.jpg`).

---

## Step 2: Create the Blog Post HTML

1. **Copy** `posts/post1.html` (or `post2.html`) as a template
2. **Rename** it to `posts/post3.html` (or whatever number you're on)
3. **Edit** these sections:

### Title (line ~7)

```html
<title>Your Post Title — Darren Dines</title>
```

### Hero Image (line ~51)

```html
<img src="../images/your-photo.png" alt="Description of your food" />
```

### Post Content (lines ~56–127)

```html
<span class="label">City, Country</span>
<h1>Your Post Title</h1>
<div class="post-meta">
  <span>By Darren</span>
  <span>·</span>
  <span>February 17, 2026</span>
  <span>·</span>
  <span>5 min read</span>
</div>

<div class="post-body">
  <p>Your story goes here...</p>
  <h2>Subheading</h2>
  <p>More text...</p>
  <blockquote>"A memorable quote."</blockquote>
</div>
```

### Restaurant Info (end of post body)

```html
<p>
  <strong>Restaurant Name</strong><br />
  📍 Address<br />
  🕐 Hours<br />
  💰 Price range
</p>
```

> **Don't touch:** The `<nav>`, `<footer>`, or `<script>` tags — they're already set up correctly.

---

## Step 3: Add to Search Index

Open **`js/search-data.js`** and add a new entry to the array:

```js
const SEARCH_DATA = [
  // ... existing entries ...
  {
    title: "Your Post Title",
    location: "City, Country",
    excerpt: "A one-line summary of the post for search results.",
    tags: ["keyword1", "keyword2", "cuisine", "city"],
    image: "images/your-photo.png",
    url: "posts/post3.html",
    date: "Feb 17, 2026",
  },
];
```

> **This is what makes your post appear in search results on every page.**

---

## Step 4: Add a Map Pin

Open **`js/map.js`** and add to the `blogPins` array (around line 14):

```js
const blogPins = [
  // ... existing pins ...
  {
    lat: 48.8566, // ← Get from Google Maps
    lng: 2.3522, // ← Right-click location → "What's here?"
    title: "Restaurant Name, City",
    caption: "A short description of the meal.",
    image: "images/your-photo.png",
    postUrl: "posts/post3.html",
  },
];
```

### How to get coordinates:

1. Go to [Google Maps](https://maps.google.com)
2. Find the restaurant
3. Right-click → **"What's here?"**
4. Copy the latitude and longitude from the popup

---

## Step 5: Add a Card to the Homepage

Open **`index.html`** and add a new card inside the `<div class="posts-grid">` section (around line 192):

```html
<a href="posts/post3.html" class="post-card animate-in">
  <div class="post-card-image-wrapper">
    <img
      src="images/your-photo.png"
      alt="Description"
      class="post-card-image"
    />
  </div>
  <div class="post-card-body">
    <span class="label">City, Country</span>
    <h3>Your Post Title</h3>
    <p class="excerpt">
      A short excerpt about the post that appears on the card.
    </p>
    <div class="post-card-meta">
      <span>Feb 17, 2026</span>
      <span>5 min read</span>
    </div>
  </div>
</a>
```

> **Optional:** You can also add it as a featured side card in the `featured-side` section above the grid if you want it highlighted.

---

## Step 6: Push to GitHub

```bash
cd ~/Documents/Blog
git add .
git commit -m "Add new post: Your Post Title"
git push origin main
```

Your changes will be live on GitHub Pages within ~1 minute.

---

## File Reference

| File                | What to edit                       |
| ------------------- | ---------------------------------- |
| `images/`           | Add food photo                     |
| `posts/post3.html`  | New blog post (copy from template) |
| `js/search-data.js` | Add entry for search               |
| `js/map.js`         | Add pin with coordinates           |
| `index.html`        | Add homepage card                  |

---

## Tips

- **Preview locally** by double-clicking `index.html` in Finder before pushing
- **Check your links** — post URLs should be `posts/post3.html` (from root) or `../posts/post3.html` (from another post)
- **Image paths** from `posts/` use `../images/`, from root use `images/`
- **Keep excerpts short** — 1-2 sentences max for search results and cards
