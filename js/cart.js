/**
 * cart.js — Add to Cart feature for Cycle Store
 * Works alongside existing files without modifying them.
 */

const CART_KEY = 'cycle_cart';

// ── Helpers ────────────────────────────────────────────────────────────────

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateBadge() {
  const cart = getCart();
  const total = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  document.querySelectorAll('.cart-badge').forEach(function (el) {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

function showToast(name) {
  var toast = document.getElementById('cart-toast');
  if (!toast) return;
  toast.querySelector('.cart-toast-name').textContent = name;
  toast.classList.add('cart-toast--show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.classList.remove('cart-toast--show');
  }, 2800);
}

// ── Core API ───────────────────────────────────────────────────────────────

function addToCart(id, name, price, img) {
  var cart = getCart();
  var existing = cart.find(function (i) { return i.id === id; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: id, name: name, price: price, img: img, qty: 1 });
  }
  saveCart(cart);
  updateBadge();
  showToast(name);
}

function removeFromCart(id) {
  var cart = getCart().filter(function (i) { return i.id !== id; });
  saveCart(cart);
  updateBadge();
  renderCartPage();
}

function changeQty(id, delta) {
  var cart = getCart();
  var item = cart.find(function (i) { return i.id === id; });
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  updateBadge();
  renderCartPage();
}

function clearCart() {
  saveCart([]);
  updateBadge();
  renderCartPage();
}

// ── Cart Page Renderer ─────────────────────────────────────────────────────

function renderCartPage() {
  var container = document.getElementById('cart-items-container');
  var summaryEl  = document.getElementById('cart-summary');
  if (!container) return;

  var cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty"><i class="fa fa-shopping-cart"></i><p>Your cart is empty.</p><a href="shop.html" class="cart-shop-link">Browse Cycles</a></div>';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (summaryEl) summaryEl.style.display = 'block';

  var html = '';
  var subtotal = 0;

  cart.forEach(function (item) {
    var lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    html += '<div class="cart-row" data-id="' + item.id + '">' +
      '<div class="cart-row__img"><img src="' + item.img + '" alt="' + item.name + '"></div>' +
      '<div class="cart-row__info">' +
        '<h5 class="cart-row__name">' + item.name + '</h5>' +
        '<p class="cart-row__price">$' + item.price.toFixed(2) + ' each</p>' +
      '</div>' +
      '<div class="cart-row__qty">' +
        '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', -1)">&#8722;</button>' +
        '<span>' + item.qty + '</span>' +
        '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', 1)">&#43;</button>' +
      '</div>' +
      '<div class="cart-row__total">$' + lineTotal.toFixed(2) + '</div>' +
      '<button class="cart-row__remove" onclick="removeFromCart(\'' + item.id + '\')" title="Remove">&times;</button>' +
    '</div>';
  });

  container.innerHTML = html;

  var tax = subtotal * 0.08;
  var grand = subtotal + tax;

  document.getElementById('cart-subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('cart-tax').textContent      = '$' + tax.toFixed(2);
  document.getElementById('cart-grand').textContent    = '$' + grand.toFixed(2);
}

// ── Inject Toast + Badge wrapper on every page ─────────────────────────────

function injectCartUI() {
  // Toast notification
  if (!document.getElementById('cart-toast')) {
    var toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    toast.innerHTML = '<i class="fa fa-check-circle"></i> <span class="cart-toast-name"></span> added to cart! <a href="cart.html">View Cart</a>';
    document.body.appendChild(toast);
  }

  // Inject badge next to existing trolly icon(s) in navbar
  document.querySelectorAll('a img[src*="trolly-icon"]').forEach(function (img) {
    var link = img.closest('a');
    if (link && !link.querySelector('.cart-badge')) {
      link.style.position = 'relative';
      link.href = 'cart.html';
      var badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.style.display = 'none';
      link.appendChild(badge);
    }
  });

  updateBadge();
}

document.addEventListener('DOMContentLoaded', function () {
  injectCartUI();
  renderCartPage(); // no-op if not on cart.html
});
