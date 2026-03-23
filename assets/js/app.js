const PRODUCTS = [
  {
    id: "1",
    name: "Midnight Muse Satin Dress",
    category: "Dresses",
    price: 84,
    compareAt: 104,
    tag: "bestseller",
    color: "Black",
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    description: "A fluid satin midi dress with soft drape, sculpted waist, and evening-ready movement.",
    rating: 4.9
  },
  {
    id: "2",
    name: "Rose Hour Corset Top",
    category: "Tops",
    price: 52,
    compareAt: 68,
    tag: "new",
    color: "Rose",
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    description: "Structured corset-inspired top designed for denim, tailoring, and late-night plans.",
    rating: 4.8
  },
  {
    id: "3",
    name: "Off-Duty Sculpt Set",
    category: "Activewear",
    price: 64,
    compareAt: 78,
    tag: "trending",
    color: "Olive",
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    description: "Performance-knit matching set with sculpting stretch and elevated athleisure lines.",
    rating: 4.7
  },
  {
    id: "4",
    name: "West Village Knit Lounge Set",
    category: "Loungewear",
    price: 74,
    compareAt: 88,
    tag: "new",
    color: "Beige",
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    description: "Refined lounge layering set in a soft-touch rib knit for airport to apartment dressing.",
    rating: 4.8
  },
  {
    id: "5",
    name: "After Dark Sequin Mini",
    category: "Party Wear",
    price: 96,
    compareAt: 120,
    tag: "bestseller",
    color: "Black",
    sizes: ["XS", "S", "M"],
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
    description: "High-shine statement mini with contour seams and a party-first silhouette.",
    rating: 4.9
  },
  {
    id: "6",
    name: "Golden Hour Hoop Set",
    category: "Accessories",
    price: 28,
    compareAt: 36,
    tag: "trending",
    color: "Gold",
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
    description: "Layerable statement hoops with polished finish for day-to-night styling.",
    rating: 4.6
  },
  {
    id: "7",
    name: "Manhattan Tailored Blazer Dress",
    category: "Dresses",
    price: 110,
    compareAt: 136,
    tag: "trending",
    color: "Ivory",
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description: "A sharp blazer-dress hybrid made for dinner reservations, rooftop events, and camera-ready polish.",
    rating: 4.8
  },
  {
    id: "8",
    name: "Sunset Column Maxi",
    category: "Dresses",
    price: 88,
    compareAt: 104,
    tag: "new",
    color: "Blue",
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80",
    description: "Minimal column maxi with clean straps and a soft statement color for destination dressing.",
    rating: 4.7
  }
];

const STORAGE_KEYS = {
  cart: "clothiva-cart",
  wishlist: "clothiva-wishlist",
  cookie: "clothiva-cookie-consent"
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCart() {
  return readStorage(STORAGE_KEYS.cart, []);
}

function getWishlist() {
  return readStorage(STORAGE_KEYS.wishlist, []);
}

function saveCart(items) {
  writeStorage(STORAGE_KEYS.cart, items);
  updateGlobalCounts();
}

function saveWishlist(items) {
  writeStorage(STORAGE_KEYS.wishlist, items);
  updateGlobalCounts();
}

function updateGlobalCounts() {
  const cartCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = getWishlist().length;

  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = cartCount;
  });

  document.querySelectorAll("[data-wishlist-count]").forEach((node) => {
    node.textContent = wishlistCount;
  });
}

function productById(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const line = cart.find((item) => item.id === productId);
  if (line) {
    line.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  saveCart(cart);
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const next = wishlist.includes(productId)
    ? wishlist.filter((id) => id !== productId)
    : [...wishlist, productId];
  saveWishlist(next);
}

function cartSubtotal() {
  return getCart().reduce((sum, item) => {
    const product = productById(item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function updateCartQuantity(productId, delta) {
  const next = getCart()
    .map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + delta } : item
    )
    .filter((item) => item.quantity > 0);
  saveCart(next);
  renderCheckout();
}

function createProductCard(product) {
  const wishlist = getWishlist();
  const isFavorite = wishlist.includes(product.id);

  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-tags">
          <span class="chip">${product.category}</span>
          <span class="chip">${product.tag}</span>
        </div>
        <button class="wishlist-btn ${isFavorite ? "is-active" : ""}" type="button" data-wishlist-toggle="${product.id}" aria-label="Save ${product.name}">
          ${isFavorite ? "&#9829;" : "&#9825;"}
        </button>
      </div>
      <div class="product-body">
        <div class="product-meta">
          <div>
            <h3>${product.name}</h3>
            <small>${product.color} · ${product.sizes.join(", ")}</small>
          </div>
          <span class="price">${currency.format(product.price)}</span>
        </div>
        <p>${product.description}</p>
        <div class="button-row">
          <a class="button secondary" href="product.html?id=${product.id}">View Product</a>
          <button class="button primary" type="button" data-add-cart="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function attachCatalogActions(scope = document) {
  scope.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.addCart, 1);
      alert("Added to cart.");
      renderCheckout();
    });
  });

  scope.querySelectorAll("[data-wishlist-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleWishlist(button.dataset.wishlistToggle);
      rerenderVisibleCatalogs();
    });
  });
}

function rerenderVisibleCatalogs() {
  renderHomeProducts();
  renderShop();
  renderProductDetail();
  renderCheckout();
}

function renderHomeProducts() {
  const grid = document.querySelector("[data-home-products]");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.slice(0, 4).map(createProductCard).join("");
  attachCatalogActions(grid);
}

function readQuery() {
  return new URLSearchParams(window.location.search);
}

function filterProducts(products) {
  const params = readQuery();
  const form = document.querySelector("[data-filter-form]");
  const formData = form ? new FormData(form) : null;

  const search = (formData?.get("search") || params.get("q") || "").toString().trim().toLowerCase();
  const category = (formData?.get("category") || params.get("category") || "").toString();
  const tag = (formData?.get("tag") || params.get("tag") || "").toString();
  const color = (formData?.get("color") || params.get("color") || "").toString();
  const size = (formData?.get("size") || params.get("size") || "").toString();
  const price = (formData?.get("price") || params.get("price") || "").toString();

  return products.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory = !category || product.category === category;
    const matchesTag = !tag || product.tag === tag;
    const matchesColor = !color || product.color === color;
    const matchesSize = !size || product.sizes.includes(size);

    let matchesPrice = true;
    if (price) {
      const [min, max] = price.split("-").map(Number);
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        matchesPrice = product.price >= min && product.price <= max;
      } else if (!Number.isNaN(min)) {
        matchesPrice = product.price >= min;
      }
    }

    return matchesSearch && matchesCategory && matchesTag && matchesColor && matchesSize && matchesPrice;
  });
}

function renderShop() {
  const grid = document.querySelector("[data-shop-grid]");
  const wishlistGrid = document.querySelector("[data-wishlist-grid]");
  if (!grid && !wishlistGrid) return;

  if (grid) {
    const products = filterProducts(PRODUCTS);
    const resultsNote = document.querySelector("[data-results-note]");
    if (resultsNote) {
      resultsNote.textContent = `${products.length} styles available`;
    }
    grid.innerHTML = products.length
      ? products.map(createProductCard).join("")
      : '<div class="empty-state">No products match the current filters. Try another search or category.</div>';
    attachCatalogActions(grid);
  }

  if (wishlistGrid) {
    const favorites = PRODUCTS.filter((product) => getWishlist().includes(product.id));
    wishlistGrid.innerHTML = favorites.length
      ? favorites.map(createProductCard).join("")
      : '<div class="empty-state">Your saved styles will appear here.</div>';
    attachCatalogActions(wishlistGrid);
  }
}

function productColorSwatch(product) {
  const value = product.color.toLowerCase();

  if (value === "rose") return "#d98ca2";
  if (value === "ivory") return "#f4eee2";
  if (value === "beige") return "#c8b09b";
  if (value === "olive") return "#69745b";
  if (value === "blue") return "#7392c6";
  if (value === "gold") return "#d3aa44";
  return "#222222";
}

function renderProductDetail() {
  const root = document.querySelector("[data-product-detail]");
  if (!root) return;

  const id = readQuery().get("id") || PRODUCTS[0].id;
  const product = productById(id) || PRODUCTS[0];

  root.innerHTML = `
    <section class="product-detail">
      <div class="product-gallery">
        <div class="product-gallery-main">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="mini-grid">
          ${PRODUCTS.slice(0, 3)
            .map(
              (item) => `
                <a class="mini-card" href="product.html?id=${item.id}">
                  <img src="${item.image}" alt="${item.name}" style="border-radius: 18px; aspect-ratio: 1.1; object-fit: cover; margin-bottom: 0.9rem;">
                  <h3>${item.name}</h3>
                  <p>${currency.format(item.price)}</p>
                </a>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="product-copy">
        <p class="eyebrow">${product.category}</p>
        <h1>${product.name}</h1>
        <div class="rating">
          <span>${"&#9733;".repeat(5)}</span>
          <span>${product.rating} rating · 124 USA reviews</span>
        </div>
        <div class="summary-row">
          <span class="price">${currency.format(product.price)}</span>
          <span class="muted"><s>${currency.format(product.compareAt)}</s> limited launch pricing</span>
        </div>
        <p>${product.description}</p>
        <div>
          <strong>Color</strong>
          <div class="swatches" style="margin-top: 0.65rem;">
            <span class="swatch"><span class="swatch-dot" style="background:${productColorSwatch(product)};"></span>${product.color}</span>
          </div>
        </div>
        <div>
          <strong>Size</strong>
          <div class="size-row" style="margin-top: 0.65rem;">
            ${product.sizes.map((size) => `<span class="size-pill">${size}</span>`).join("")}
          </div>
        </div>
        <div class="button-row">
          <button class="button primary" type="button" data-add-cart="${product.id}">Add to Cart</button>
          <button class="button secondary" type="button" data-wishlist-toggle="${product.id}">Save to Wishlist</button>
        </div>
        <div class="accordion">
          <details class="faq-item" open>
            <summary>Shipping for US customers</summary>
            <p>Standard delivery is 3 to 6 business days in the continental United States. Express shipping is available at checkout.</p>
          </details>
          <details class="faq-item">
            <summary>Returns and fit</summary>
            <p>Eligible unworn items can be returned within 14 days from delivery. Fit notes and styling guidance are listed on each product card to reduce sizing risk.</p>
          </details>
          <details class="faq-item">
            <summary>Payment options</summary>
            <p>Clothiva supports Visa, Mastercard, Amex, Discover, PayPal, Apple Pay, Google Pay, Shop Pay, Klarna, Afterpay, and Cash on Delivery where available.</p>
          </details>
        </div>
      </div>
    </section>
  `;

  attachCatalogActions(root);
}

function renderCheckout() {
  const cartItems = document.querySelector("[data-cart-items]");
  const cartTotal = document.querySelector("[data-cart-total]");
  if (!cartItems || !cartTotal) return;

  const items = getCart();
  if (!items.length) {
    cartItems.innerHTML = '<div class="empty-state">Your cart is empty. Add products from the shop to continue.</div>';
    cartTotal.textContent = currency.format(0);
    return;
  }

  cartItems.innerHTML = items
    .map((item) => {
      const product = productById(item.id);
      if (!product) return "";

      return `
        <div class="cart-line">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <strong>${product.name}</strong>
            <div class="muted">${product.category} · ${product.color}</div>
            <div class="qty-controls" style="margin-top:0.55rem;">
              <button type="button" data-qty-change="${product.id}" data-delta="-1">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-qty-change="${product.id}" data-delta="1">+</button>
            </div>
          </div>
          <strong>${currency.format(product.price * item.quantity)}</strong>
        </div>
      `;
    })
    .join("");

  cartTotal.textContent = currency.format(cartSubtotal());

  cartItems.querySelectorAll("[data-qty-change]").forEach((button) => {
    button.addEventListener("click", () => {
      updateCartQuantity(button.dataset.qtyChange, Number(button.dataset.delta));
    });
  });
}

function bindSearchForms() {
  document.querySelectorAll("[data-search-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = new FormData(form).get("q")?.toString().trim() || "";
      window.location.href = query ? `shop.html?q=${encodeURIComponent(query)}` : "shop.html";
    });
  });
}

function bindFilterForm() {
  const form = document.querySelector("[data-filter-form]");
  if (!form) return;

  const params = readQuery();
  ["search", "category", "tag", "color", "size", "price"].forEach((name) => {
    const input = form.elements.namedItem(name);
    if (input && params.get(name === "search" ? "q" : name)) {
      input.value = params.get(name === "search" ? "q" : name);
    }
  });

  form.addEventListener("input", renderShop);
  form.addEventListener("change", renderShop);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderShop();
  });
}

function bindMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const wrap = document.querySelector("[data-nav-wrap]");
  if (!toggle || !wrap) return;

  toggle.addEventListener("click", () => {
    wrap.classList.toggle("is-open");
  });
}

function bindNewsletterAndForms() {
  document.querySelectorAll("[data-inline-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.nextElementSibling;

      if (message && message.classList.contains("form-message")) {
        message.textContent = "Thanks. Your request has been received by the Clothiva support team.";
      } else {
        alert("Thanks. Your request has been received.");
      }

      form.reset();
    });
  });
}

function bindCheckoutForm() {
  const form = document.querySelector("[data-checkout-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!getCart().length) {
      alert("Add at least one item before placing an order.");
      return;
    }

    alert("Order submitted. This demo checkout does not process a real payment.");
    saveCart([]);
    form.reset();
    renderCheckout();
  });
}

function bindCookieBanner() {
  const banner = document.querySelector("[data-cookie-banner]");
  if (!banner) return;
  if (localStorage.getItem(STORAGE_KEYS.cookie)) return;

  banner.classList.remove("hidden");
  banner.querySelectorAll("[data-cookie-action]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.setItem(STORAGE_KEYS.cookie, button.dataset.cookieAction);
      banner.classList.add("hidden");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateGlobalCounts();
  bindMenu();
  bindSearchForms();
  bindFilterForm();
  bindNewsletterAndForms();
  bindCheckoutForm();
  bindCookieBanner();
  renderHomeProducts();
  renderShop();
  renderProductDetail();
  renderCheckout();
});
