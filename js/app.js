/* ============================================
   SOLECRAFT - Main Store Application
   Cart, Wishlist, Products, Razorpay, Auth UI
   ============================================ */

const App = {
  currentFilter: 'all',
  searchQuery: '',
  selectedSizes: {},

  // =========================================================================
  // INIT
  // =========================================================================
  init() {
    this.renderProducts('all');
    this.updateCartUI();
    this.updateWishlistUI();
    this.updateAuthUI();
    this.setupNavbarScroll();
    this.setupBackToTop();
    this.setupMobileMenu();
    this.renderNewArrivals();
    this.setupSizeSelection();
    this.setupScrollReveal();
    this.setupHeroParallax();

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('profileDropdown');
      const userBtn = document.querySelector('.nav-user-btn');
      if (dropdown && userBtn && !userBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  },

  // =========================================================================
  // NAVBAR
  // =========================================================================
  setupNavbarScroll() {
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      }
    });
  },

  setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  setupMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (btn && navLinks) {
      btn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
          navLinks.style.flexDirection = 'column';
          navLinks.style.position = 'absolute';
          navLinks.style.top = '100%';
          navLinks.style.left = '0';
          navLinks.style.width = '100%';
          navLinks.style.background = 'rgba(255,255,255,0.95)';
          navLinks.style.backdropFilter = 'blur(20px)';
          navLinks.style.padding = '1.5rem';
          navLinks.style.borderRadius = '0 0 20px 20px';
          navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
          navLinks.style.gap = '1.2rem';
        }
      });
    }
  },

  setupSizeSelection() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('size-option')) {
        const productId = e.target.dataset.productId;
        e.target.parentElement.querySelectorAll('.size-option').forEach(s => s.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedSizes[productId] = e.target.dataset.size;
      }
    });
  },

  // =========================================================================
  // PRODUCTS
  // =========================================================================
  getProducts() {
    return StorageManager.getProducts();
  },

  renderProducts(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    this.currentFilter = filter;
    let products = this.getProducts();

    if (filter !== 'all') {
      products = products.filter(p => p.category === filter);
    }

    // Apply search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.badge?.toLowerCase().includes(q)
      );
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:var(--text-muted);">
          <i class="fas fa-search" style="font-size:3rem;margin-bottom:1rem;opacity:0.3;"></i>
          <p style="font-size:1.2rem;font-weight:600;">No products found</p>
          <p style="margin-top:0.5rem;">Try a different category or search term</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(product => this.renderProductCard(product)).join('');
    // Re-trigger grid stagger after dynamic render
    grid.classList.remove('is-visible');
    requestAnimationFrame(() => grid.classList.add('is-visible'));
  },

  renderProductCard(product) {
    const wishlist = StorageManager.getWishlist();
    const isWishlisted = wishlist.some(w => w.id === product.id);
    const discount = product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

    const badgeClass = product.badge?.toLowerCase().includes('sale') ? 'sale'
      : product.badge?.toLowerCase().includes('new') ? 'new'
      : product.badge?.toLowerCase().includes('limited') ? 'limited'
      : '';

    const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');

    return `
      <div class="product-card animate-fade-in-up">
        ${product.badge ? `<span class="product-badge ${badgeClass}">${product.badge}</span>` : ''}
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="App.toggleWishlistItem(${product.id})" aria-label="Toggle wishlist">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            <span class="stars">${stars}</span>
            <span class="rating-count">(${product.reviews})</span>
          </div>
          <div class="product-sizes" data-product-id="${product.id}">
            ${product.sizes.map((s, i) =>
              `<button class="size-option ${i === 0 ? 'selected' : ''}" data-product-id="${product.id}" data-size="${s}">${s}</button>`
            ).join('')}
          </div>
          <div class="product-footer">
            <div class="price-box">                  <span class="current-price">₹${product.price.toLocaleString('en-IN')}</span>
                  ${product.originalPrice > product.price ? `
                    <span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                    <span class="discount-badge">${discount}% OFF</span>
                  ` : ''}
            </div>
            <button class="add-cart-btn" onclick="App.addToCart(${product.id})" aria-label="Add to cart">
              <i class="fas fa-cart-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderNewArrivals() {
    const container = document.getElementById('newArrivalsGrid');
    if (!container) return;
    const products = this.getProducts().filter(p => p.badge === 'NEW' || p.badge === 'HOT').slice(0, 4);
    container.innerHTML = products.map(p => this.renderProductCard(p)).join('');
    requestAnimationFrame(() => container.classList.add('is-visible'));
  },

  filterProducts(category, btn) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderProducts(category);
  },

  searchProducts() {
    const input = document.getElementById('searchInput');
    if (input) {
      this.searchQuery = input.value.trim();
      // Reset to 'all' tab
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      const allTab = document.querySelector('.filter-tab[data-filter="all"]');
      if (allTab) allTab.classList.add('active');
      this.renderProducts('all');
    }
  },

  // =========================================================================
  // CART
  // =========================================================================
  addToCart(productId) {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = StorageManager.getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        selectedSize: this.selectedSizes[productId] || product.sizes[0] || ''
      });
    }

    StorageManager.saveCart(cart);
    this.updateCartUI();
    this.showToast(`${product.name} added to cart!`, 'success');

    // Animate cart icon
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
      const parent = cartIcon.closest('.icon-btn');
      if (parent) {
        parent.style.transform = 'scale(1.3)';
        setTimeout(() => parent.style.transform = 'scale(1)', 200);
      }
    }
  },

  removeFromCart(productId) {
    let cart = StorageManager.getCart();
    cart = cart.filter(item => item.id !== productId);
    StorageManager.saveCart(cart);
    this.updateCartUI();
    this.showToast('Item removed from cart', 'info');
  },

  updateQuantity(productId, change) {
    let cart = StorageManager.getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = (item.quantity || 1) + change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        StorageManager.saveCart(cart);
        this.updateCartUI();
      }
    }
  },

  updateCartUI() {
    const cart = StorageManager.getCart();
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const gstEl = document.getElementById('gst');
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartCount) return;

    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    if (cartItems) {
      if (cart.length === 0) {
        cartItems.innerHTML = `
          <div class="cart-empty">
            <i class="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
            <p style="font-size:0.9rem;margin-top:0.5rem;">Browse our collection and add some awesome shoes!</p>
          </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
      } else {
        cartItems.innerHTML = cart.map(item => `
          <div class="cart-item animate-fade-in">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              ${item.selectedSize ? `<div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.2rem;">Size: ${item.selectedSize}</div>` : ''}
              <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
              <div class="qty-controls">
                <button class="qty-btn" onclick="App.updateQuantity(${item.id}, -1)">−</button>
                <span class="qty-value">${item.quantity || 1}</span>
                <button class="qty-btn" onclick="App.updateQuantity(${item.id}, 1)">+</button>
              </div>
            </div>
            <button class="remove-item-btn" onclick="App.removeFromCart(${item.id})" aria-label="Remove item">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `).join('');
        if (checkoutBtn) checkoutBtn.disabled = false;
      }
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (gstEl) gstEl.textContent = `₹${Math.round(gst).toLocaleString('en-IN')}`;
    if (totalEl) totalEl.textContent = `₹${Math.round(total).toLocaleString('en-IN')}`;
  },

  toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if (!overlay || !sidebar) return;

    const isActive = overlay.classList.contains('active');
    overlay.classList.toggle('active');
    sidebar.classList.toggle('active');
    document.body.style.overflow = isActive ? '' : 'hidden';
  },

  // =========================================================================
  // WISHLIST
  // =========================================================================
  toggleWishlistItem(productId) {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let wishlist = StorageManager.getWishlist();
    const index = wishlist.findIndex(w => w.id === productId);

    if (index > -1) {
      wishlist.splice(index, 1);
      this.showToast(`${product.name} removed from wishlist`, 'info');
    } else {
      wishlist.push({ id: product.id, name: product.name, price: product.price, image: product.image });
      this.showToast(`${product.name} added to wishlist! ❤️`, 'success');
    }

    StorageManager.saveWishlist(wishlist);
    this.updateWishlistUI();
    // Re-render products to update wishlist buttons
    this.renderProducts(this.currentFilter);
  },

  updateWishlistUI() {
    const wishlist = StorageManager.getWishlist();
    // Dropdown badge
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
      wishlistCount.textContent = wishlist.length;
      wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
    // Nav icon badge
    const wishlistBadge = document.getElementById('wishlistCountBadge');
    if (wishlistBadge) {
      wishlistBadge.textContent = wishlist.length;
      wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
  },

  toggleWishlist() {
    const wishlist = StorageManager.getWishlist();
    if (wishlist.length === 0) {
      this.showToast('Your wishlist is empty! Browse our collection 💫', 'info');
    } else {
      const names = wishlist.map(w => w.name).join(', ');
      this.showToast(`❤️ Wishlist: ${names}`, 'info');
    }
  },

  // =========================================================================
  // AUTH UI
  // =========================================================================
  openAuthModal(tab = 'login') {
    const overlay = document.getElementById('authOverlay');
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.switchAuthTab(tab);
  },

  closeAuthModal() {
    const overlay = document.getElementById('authOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  },

  switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');

    if (!loginForm || !registerForm) return;

    if (tab === 'login') {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      if (loginTab) loginTab.classList.add('active');
      if (registerTab) registerTab.classList.remove('active');
    } else {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      if (loginTab) loginTab.classList.remove('active');
      if (registerTab) registerTab.classList.add('active');
    }
  },

  handleLogin() {
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const errorEl = document.getElementById('loginError');

    const result = Auth.login(email, password);
    if (result.success) {
      this.closeAuthModal();
      this.updateAuthUI();
      this.showToast(`Welcome back, ${result.user.name}! 👋`, 'success');
    } else {
      if (errorEl) {
        errorEl.textContent = result.message;
        errorEl.style.display = 'block';
      }
    }
  },

  handleRegister() {
    const name = document.getElementById('regName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const confirmPassword = document.getElementById('regConfirmPassword')?.value;
    const phone = document.getElementById('regPhone')?.value.trim();
    const errorEl = document.getElementById('registerError');

    if (password !== confirmPassword) {
      if (errorEl) {
        errorEl.textContent = 'Passwords do not match';
        errorEl.style.display = 'block';
      }
      return;
    }

    const result = Auth.register(name, email, password, phone);
    if (result.success) {
      this.closeAuthModal();
      this.updateAuthUI();
      this.showToast(`Welcome, ${result.user.name}! Account created 🎉`, 'success');
    } else {
      if (errorEl) {
        errorEl.textContent = result.message;
        errorEl.style.display = 'block';
      }
    }
  },

  handleLogout() {
    Auth.logout();
    this.updateAuthUI();
    this.showToast('Logged out successfully', 'info');
    // Hide dropdown
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.remove('active');
  },

  updateAuthUI() {
    const user = Auth.getCurrentUser();
    const authContainer = document.getElementById('authContainer');
    const userMenu = document.getElementById('userMenu');
    const profileDropdown = document.getElementById('profileDropdown');

    if (!authContainer || !userMenu) return;

    if (user) {
      authContainer.style.display = 'none';
      userMenu.style.display = 'flex';
      // Update dropdown info
      const dropName = document.getElementById('dropUserName');
      const dropEmail = document.getElementById('dropUserEmail');
      const avatarLetter = document.getElementById('avatarLetter');
      const dropAvatar = document.getElementById('dropAvatarLetter');
      if (dropName) dropName.textContent = user.name;
      if (dropEmail) dropEmail.textContent = user.email;
      const letter = user.name.charAt(0).toUpperCase();
      if (avatarLetter) avatarLetter.textContent = letter;
      if (dropAvatar) dropAvatar.textContent = letter;

      // Show/hide admin link
      const adminLink = document.getElementById('adminPanelLink');
      if (adminLink) {
        adminLink.style.display = user.isAdmin ? 'flex' : 'none';
      }
    } else {
      authContainer.style.display = 'flex';
      userMenu.style.display = 'none';
      if (profileDropdown) profileDropdown.classList.remove('active');
    }
  },

  toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  },

  // =========================================================================
  // PROFILE PAGE
  // =========================================================================
  openProfile() {
    const user = Auth.getCurrentUser();
    if (!user) {
      this.openAuthModal('login');
      return;
    }
    document.getElementById('profileDropdown')?.classList.remove('active');
    this.showProfilePage();
  },

  showProfilePage() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const main = document.getElementById('mainContent');
    const profilePage = document.getElementById('profilePage');
    if (!main || !profilePage) return;

    main.style.display = 'none';
    profilePage.style.display = 'block';
    profilePage.innerHTML = this.getProfileHTML(user);

    // Load user orders
    this.loadUserOrders(user.id);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  getProfileHTML(user) {
    return `
      <div class="profile-container">
        <div class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar">${user.name.charAt(0).toUpperCase()}</div>
            <div>
              <h2 class="profile-name">${user.name}</h2>
              <p class="profile-email">${user.email}</p>
              ${user.isAdmin ? '<span style="display:inline-block;margin-top:0.3rem;padding:0.2rem 0.8rem;background:rgba(212,160,77,0.15);color:var(--primary);border-radius:50px;font-size:0.8rem;font-weight:600;">👑 Admin</span>' : ''}
            </div>
          </div>

          <form id="profileForm" onsubmit="event.preventDefault(); App.saveProfile();">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="profileName" value="${user.name}" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" value="${user.email}" disabled style="opacity:0.6;">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" id="profilePhone" value="${user.phone || ''}" placeholder="Enter your phone">
            </div>
            <div class="form-group">
              <label>Delivery Address</label>
              <textarea id="profileAddress" rows="3" placeholder="Enter your delivery address">${user.address || ''}</textarea>
            </div>
            <div style="display:flex;gap:1rem;margin-top:1.5rem;">
              <button type="submit" class="btn btn-primary">Save Changes</button>
              <button type="button" class="btn btn-secondary" onclick="App.backToStore()">← Back to Store</button>
            </div>
            <div id="profileMessage" style="margin-top:1rem;font-weight:600;display:none;"></div>
          </form>

          <div style="margin-top:2.5rem;padding-top:2rem;border-top:1px solid rgba(0,0,0,0.06);">
            <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:1.5rem;">📦 My Orders</h3>
            <div id="userOrdersList"></div>
          </div>
        </div>
      </div>
    `;
  },

  loadUserOrders(userId) {
    const container = document.getElementById('userOrdersList');
    if (!container) return;

    const orders = StorageManager.getOrdersByUser(userId);
    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--text-muted);">
          <i class="fas fa-box-open" style="font-size:2.5rem;margin-bottom:1rem;opacity:0.3;"></i>
          <p>No orders yet</p>
          <p style="font-size:0.9rem;">Start shopping to see your orders here!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => `
      <div style="padding:1.2rem;background:rgba(255,255,255,0.5);border-radius:var(--radius-md);margin-bottom:1rem;border:1px solid rgba(255,255,255,0.3);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;flex-wrap:wrap;gap:0.5rem;">
          <span style="font-weight:700;">Order #${order.id.slice(-8).toUpperCase()}</span>
          <span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>
        <div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:0.5rem;">
          ${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div style="margin-bottom:0.8rem;">
          ${order.items.map(item => `
            <div style="display:flex;align-items:center;gap:0.8rem;padding:0.3rem 0;">
              <img src="${item.image}" alt="${item.name}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">
              <span style="flex:1;font-size:0.9rem;">${item.name} × ${item.quantity}</span>
              <span style="font-weight:600;font-size:0.9rem;">₹${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:0.8rem;border-top:1px solid rgba(0,0,0,0.05);">
          <span style="font-weight:600;">Total</span>
          <span style="font-weight:800;color:var(--primary);">₹${Math.round(order.total).toLocaleString('en-IN')}</span>
        </div>
        ${order.paymentId ? `<div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.5rem;">Payment ID: ${order.paymentId}</div>` : ''}
      </div>
    `).join('');
  },

  saveProfile() {
    const name = document.getElementById('profileName')?.value.trim();
    const phone = document.getElementById('profilePhone')?.value.trim();
    const address = document.getElementById('profileAddress')?.value.trim();
    const msg = document.getElementById('profileMessage');

    const result = Auth.updateProfile(name, phone, address);
    if (result.success) {
      if (msg) {
        msg.textContent = '✅ Profile updated successfully!';
        msg.style.display = 'block';
        msg.style.color = 'var(--success)';
        setTimeout(() => { if (msg) msg.style.display = 'none'; }, 3000);
      }
      this.showToast('Profile updated! ✅', 'success');
    } else {
      if (msg) {
        msg.textContent = '❌ ' + result.message;
        msg.style.display = 'block';
        msg.style.color = 'var(--danger)';
      }
    }
  },

  backToStore() {
    const main = document.getElementById('mainContent');
    const profilePage = document.getElementById('profilePage');
    if (main && profilePage) {
      main.style.display = 'block';
      profilePage.style.display = 'none';
      profilePage.innerHTML = '';
    }
  },

  // =========================================================================
  // CHECKOUT - RAZORPAY / DEMO FALLBACK
  // =========================================================================

  handlePaymentSuccess(response, total) {
    const cart = StorageManager.getCart();
    const user = Auth.getCurrentUser();

    // Create order
    const order = {
      id: 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest',
      userEmail: user?.email || '',
      items: [...cart],
      subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      gst: Math.round(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.18),
      total: total,
      status: 'confirmed',
      date: new Date().toISOString(),
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      address: user?.address || ''
    };

    // Save order
    const orders = StorageManager.getOrders();
    orders.push(order);
    StorageManager.saveOrders(orders);

    // Clear cart
    StorageManager.saveCart([]);
    this.updateCartUI();
    this.toggleCart();

    this.showToast('🎉 Order placed successfully! Thank you!', 'success');
  },

  // =========================================================================
  // TOAST
  // =========================================================================
  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle'
      : type === 'error' ? 'fa-exclamation-circle'
      : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // =========================================================================
  // NEWSLETTER
  // =========================================================================
  subscribeNewsletter() {
    const input = document.getElementById('newsletterEmail');
    if (!input || !input.value.trim()) {
      this.showToast('Please enter your email', 'error');
      return;
    }
    if (!Auth.isValidEmail(input.value.trim())) {
      this.showToast('Please enter a valid email', 'error');
      return;
    }
    this.showToast('Subscribed successfully! 🎉', 'success');
    input.value = '';
  },

  // =========================================================================
  // SCROLL REVEAL (IntersectionObserver)
  // =========================================================================
  setupScrollReveal() {
    const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Animate section-title underline
          const title = entry.target.querySelector?.('.section-title') || entry.target;
          if (title?.classList.contains('section-title')) title.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(el => observer.observe(el));

    // Re-run on dynamic product renders
    this._revealObserver = observer;
  },

  revealNewCards() {
    if (!this._revealObserver) return;
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => {
      this._revealObserver.observe(el);
    });
  },

  // =========================================================================
  // HERO PARALLAX (subtle mouse-tilt on image)
  // =========================================================================
  setupHeroParallax() {
    const hero = document.querySelector('.hero');
    const img  = document.querySelector('.hero-image-wrapper img');
    if (!hero || !img) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy = (e.clientY - rect.top)  / rect.height - 0.5;
      img.style.transform = `perspective(1000px) rotateY(${-5 + cx * 8}deg) rotateX(${cy * -5}deg) scale(1.03)`;
    });

    hero.addEventListener('mouseleave', () => {
      img.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(0deg) scale(1)';
    });
  },

  // =========================================================================
  // RAZORPAY — demo-safe checkout
  // =========================================================================
  checkout() {
    const user = Auth.getCurrentUser();
    if (!user) {
      this.showToast('Please sign in to checkout', 'error');
      this.openAuthModal('login');
      return;
    }

    const cart = StorageManager.getCart();
    if (!cart.length) {
      this.showToast('Your cart is empty', 'error');
      return;
    }

    const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    const gst      = Math.round(subtotal * 0.18);
    const total    = subtotal + gst;

    // If Razorpay is not available (no real key), show demo success
    if (typeof Razorpay === 'undefined' || !window._rzpKey) {
      this._showDemoPayment(total, user);
      return;
    }

    const options = {
      key:       window._rzpKey,
      amount:    total * 100,
      currency:  'INR',
      name:      'SoleCraft',
      description: 'Premium Footwear Order',
      prefill:   { name: user.name, email: user.email, contact: user.phone || '' },
      theme:     { color: '#d4a04d' },
      handler:   (resp) => {
        this._placeOrder(cart, total, resp.razorpay_payment_id);
      }
    };
    new Razorpay(options).open();
  },

  _showDemoPayment(total, user) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(15,15,26,0.6);backdrop-filter:blur(12px);z-index:9999;display:flex;align-items:center;justify-content:center;animation:pageFadeIn .3s ease`;
    overlay.innerHTML = `
      <div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-radius:24px;padding:2.5rem 3rem;max-width:440px;width:92%;text-align:center;box-shadow:0 40px 80px rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.6);">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#d4a04d,#9a7030);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.2rem;font-size:1.8rem;color:white;">
          <i class="fas fa-lock"></i>
        </div>
        <h3 style="font-size:1.5rem;font-weight:800;margin-bottom:0.4rem;">Secure Checkout</h3>
        <p style="color:#718096;font-size:0.9rem;margin-bottom:1.8rem;">Total: <strong style="color:#1a202c;">₹${total.toLocaleString('en-IN')}</strong></p>
        <div style="display:grid;gap:0.8rem;margin-bottom:1.5rem;">
          <button onclick="App._processDemoPayment('upi', this.closest('[data-demo]').parentElement)" style="padding:.9rem;border-radius:12px;border:2px solid #e2e8f0;background:white;cursor:pointer;font-weight:600;font-size:.95rem;transition:all .2s;">
            <i class="fas fa-mobile-alt" style="color:#4299e1;margin-right:.5rem;"></i>UPI / QR Code
          </button>
          <button onclick="App._processDemoPayment('card', this.closest('[data-demo]').parentElement)" style="padding:.9rem;border-radius:12px;border:2px solid #e2e8f0;background:white;cursor:pointer;font-weight:600;font-size:.95rem;transition:all .2s;">
            <i class="fab fa-cc-visa" style="color:#1A1F71;margin-right:.5rem;"></i>Credit / Debit Card
          </button>
          <button onclick="App._processDemoPayment('cod', this.closest('[data-demo]').parentElement)" style="padding:.9rem;border-radius:12px;border:2px solid #e2e8f0;background:white;cursor:pointer;font-weight:600;font-size:.95rem;transition:all .2s;">
            <i class="fas fa-money-bill-wave" style="color:#48bb78;margin-right:.5rem;"></i>Cash on Delivery
          </button>
        </div>
        <button onclick="this.closest('div').parentElement.remove()" style="background:none;border:none;color:#a0aec0;font-size:.9rem;cursor:pointer;">Cancel</button>
      </div>
    `;
    // Attach a data-demo attr to find parent
    const inner = overlay.querySelector('div');
    inner.setAttribute('data-demo', '1');
    document.body.appendChild(overlay);
  },

  _processDemoPayment(method, overlay) {
    const cart = StorageManager.getCart();
    const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    const total    = subtotal + Math.round(subtotal * 0.18);
    const payId    = 'DEMO_' + Date.now();
    overlay.remove();
    this._placeOrder(cart, total, payId);
  },

  _placeOrder(cart, total, paymentId) {
    this.handlePaymentSuccess({
      razorpay_payment_id: paymentId,
      razorpay_order_id:   'demo_' + Date.now(),
      razorpay_signature:  'demo'
    }, total);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
