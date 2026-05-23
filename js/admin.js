/* ============================================
   SOLECRAFT - Admin Panel
   Dashboard, Products CRUD, Orders, Customers
   ============================================ */

const AdminApp = {
  currentPage: 'dashboard',
  editingProductId: null,

  // =========================================================================
  // INIT
  // =========================================================================
  init() {
    // Check if user is admin
    const user = Auth.getCurrentUser();
    if (!user || !user.isAdmin) {
      document.getElementById('adminContent').innerHTML = `
        <div style="text-align:center;padding:4rem 2rem;">
          <i class="fas fa-shield-alt" style="font-size:4rem;color:var(--text-muted);margin-bottom:1rem;"></i>
          <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Access Denied</h2>
          <p style="color:var(--text-muted);margin-bottom:2rem;">You need admin privileges to access this panel.</p>
          <a href="index.html" class="btn btn-primary">← Back to Store</a>
        </div>
      `;
      return;
    }

    this.showPage('dashboard');
    this.updateAdminInfo();

    // Mobile sidebar toggle
    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
      document.getElementById('adminSidebar')?.classList.toggle('open');
    });
  },

  updateAdminInfo() {
    const user = Auth.getCurrentUser();
    if (user) {
      document.getElementById('adminName').textContent = user.name;
      document.getElementById('adminAvatar').textContent = user.name.charAt(0).toUpperCase();
    }
  },

  // =========================================================================
  // NAVIGATION
  // =========================================================================
  showPage(page) {
    // Update nav
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Update title
    const titles = {
      dashboard: 'Dashboard',
      products: 'Product Management',
      orders: 'Order Management',
      customers: 'Customer Management'
    };
    document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

    // Hide all pages
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById(page + 'Page');
    if (target) target.classList.add('active');

    this.currentPage = page;

    // Load data
    switch (page) {
      case 'dashboard': this.loadDashboard(); break;
      case 'products': this.loadProducts(); break;
      case 'orders': this.loadOrders(); break;
      case 'customers': this.loadCustomers(); break;
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
      document.getElementById('adminSidebar')?.classList.remove('open');
    }
  },

  // =========================================================================
  // DASHBOARD
  // =========================================================================
  loadDashboard() {
    const products = StorageManager.getProducts();
    const orders = StorageManager.getOrders();
    const users = StorageManager.getUsers();
    const customers = users.filter(u => !u.isAdmin);

    // Stats
    document.getElementById('statTotalProducts').textContent = products.length;
    document.getElementById('statTotalOrders').textContent = orders.length;
    document.getElementById('statTotalCustomers').textContent = customers.length;

    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById('statTotalRevenue').textContent = `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`;

    // Recent Orders
    const recentOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const tbody = document.getElementById('recentOrdersBody');
    if (tbody) {
      if (recentOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">No orders yet</td></tr>`;
      } else {
        tbody.innerHTML = recentOrders.map(order => `
          <tr>
            <td>#${order.id.slice(-8).toUpperCase()}</td>
            <td>${order.userName || 'Guest'}</td>
            <td>${order.items.length} item(s)</td>
            <td>₹${Math.round(order.total).toLocaleString('en-IN')}</td>
            <td><span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
            <td>${new Date(order.date).toLocaleDateString('en-IN')}</td>
          </tr>
        `).join('');
      }
    }

    // Low stock / Products by category
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const categoryContainer = document.getElementById('categoryStats');
    if (categoryContainer) {
      categoryContainer.innerHTML = Object.entries(categoryCounts).map(([cat, count]) => `
        <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid rgba(0,0,0,0.04);">
          <span style="text-transform:capitalize;">${cat}</span>
          <span style="font-weight:700;">${count}</span>
        </div>
      `).join('');
    }
  },

  // =========================================================================
  // PRODUCTS MANAGEMENT
  // =========================================================================
  loadProducts() {
    const products = StorageManager.getProducts();
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">No products found. Add your first product!</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.image}" alt="${p.name}" class="product-thumb"></td>
        <td><strong>${p.name}</strong></td>
        <td><span style="text-transform:capitalize;">${p.category}</span></td>
        <td>₹${p.price.toLocaleString()}</td>
        <td>${p.originalPrice ? '₹' + p.originalPrice.toLocaleString() : '-'}</td>
        <td>${p.badge ? `<span class="status-badge confirmed">${p.badge}</span>` : '-'}</td>
        <td>
          <div class="actions">
            <button class="btn-icon edit" onclick="AdminApp.editProduct(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon delete" onclick="AdminApp.deleteProduct(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  openAddProductModal() {
    this.editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productModalOverlay').classList.add('active');
    document.getElementById('productModalError').style.display = 'none';
  },

  editProduct(productId) {
    this.openEditProductModal(productId);
  },

  openEditProductModal(productId) {
    const products = StorageManager.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    this.editingProductId = productId;
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('prodName').value = product.name;
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodOriginalPrice').value = product.originalPrice || '';
    document.getElementById('prodImage').value = product.image;
    document.getElementById('prodBadge').value = product.badge || '';
    document.getElementById('prodSizes').value = product.sizes.join(', ');
    document.getElementById('prodDescription').value = product.description || '';

    document.getElementById('productModalOverlay').classList.add('active');
    document.getElementById('productModalError').style.display = 'none';
  },

  closeProductModal() {
    document.getElementById('productModalOverlay').classList.remove('active');
    this.editingProductId = null;
  },

  saveProduct() {
    const name = document.getElementById('prodName').value.trim();
    const category = document.getElementById('prodCategory').value;
    const price = parseInt(document.getElementById('prodPrice').value);
    const originalPrice = parseInt(document.getElementById('prodOriginalPrice').value) || price;
    const image = document.getElementById('prodImage').value.trim();
    const badge = document.getElementById('prodBadge').value.trim() || null;
    const sizesStr = document.getElementById('prodSizes').value.trim();
    const description = document.getElementById('prodDescription').value.trim();
    const errorEl = document.getElementById('productModalError');

    // Validation
    if (!name || !category || !price || !image || !sizesStr) {
      errorEl.textContent = 'Please fill in all required fields';
      errorEl.style.display = 'block';
      return;
    }

    const sizes = sizesStr.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));

    let products = StorageManager.getProducts();

    if (this.editingProductId) {
      // Update existing
      const idx = products.findIndex(p => p.id === this.editingProductId);
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          name, category, price, originalPrice,
          image, badge, sizes, description
        };
      }
    } else {
      // Add new
      const newProduct = {
        id: StorageManager.getNextProductId(),
        name, category, price, originalPrice: originalPrice || price,
        rating: 0, reviews: 0,
        image,
        images: [image],
        sizes, colors: ['Black', 'White'],
        badge,
        description: description || ''
      };
      products.push(newProduct);
    }

    StorageManager.saveProducts(products);
    this.closeProductModal();
    this.loadProducts();
    this.showToast(this.editingProductId ? 'Product updated! ✅' : 'Product added! 🎉', 'success');
  },

  deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    let products = StorageManager.getProducts();
    products = products.filter(p => p.id !== productId);
    StorageManager.saveProducts(products);
    this.loadProducts();
    this.showToast('Product deleted', 'info');
  },

  searchAdminProducts() {
    const query = document.getElementById('adminSearchInput')?.value.toLowerCase().trim();
    const products = StorageManager.getProducts();
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    const filtered = query
      ? products.filter(p => p.name.toLowerCase().includes(query) || p.category.includes(query))
      : products;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">No products match your search</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(p => `
      <tr>
        <td><img src="${p.image}" alt="${p.name}" class="product-thumb"></td>
        <td><strong>${p.name}</strong></td>
        <td><span style="text-transform:capitalize;">${p.category}</span></td>
        <td>₹${p.price.toLocaleString()}</td>
        <td>${p.originalPrice ? '₹' + p.originalPrice.toLocaleString() : '-'}</td>
        <td>${p.badge ? `<span class="status-badge confirmed">${p.badge}</span>` : '-'}</td>
        <td>
          <div class="actions">
            <button class="btn-icon edit" onclick="AdminApp.editProduct(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon delete" onclick="AdminApp.deleteProduct(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // =========================================================================
  // ORDERS MANAGEMENT
  // =========================================================================
  loadOrders() {
    const orders = StorageManager.getOrders();
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedOrders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">No orders yet</td></tr>`;
      return;
    }

    tbody.innerHTML = sortedOrders.map(order => `
      <tr>
        <td>#${order.id.slice(-8).toUpperCase()}</td>
        <td>${order.userName || 'Guest'}</td>
        <td>${order.userEmail || '-'}</td>
        <td>${order.items.length} item(s)</td>
        <td>₹${Math.round(order.total).toLocaleString('en-IN')}</td>
        <td>
          <select class="status-select" onchange="AdminApp.updateOrderStatus('${order.id}', this.value)" 
                  style="padding:0.3rem 0.5rem;border-radius:8px;border:2px solid var(--glass-border);background:white;font-size:0.85rem;font-weight:600;">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
      </tr>
    `).join('');
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = StorageManager.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      StorageManager.saveOrders(orders);
      this.loadOrders();
      this.showToast(`Order #${orderId.slice(-8).toUpperCase()} updated to ${newStatus}`, 'success');
    }
  },

  // =========================================================================
  // CUSTOMERS MANAGEMENT
  // =========================================================================
  loadCustomers() {
    const users = StorageManager.getUsers();
    const customers = users.filter(u => !u.isAdmin);
    const orders = StorageManager.getOrders();
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    if (customers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">No registered customers yet</td></tr>`;
      return;
    }

    tbody.innerHTML = customers.map(u => {
      const userOrders = orders.filter(o => o.userId === u.id);
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      return `
        <tr>
          <td><strong>${u.name}</strong></td>
          <td>${u.email}</td>
          <td>${u.phone || '-'}</td>
          <td>${userOrders.length}</td>
          <td>₹${Math.round(totalSpent).toLocaleString('en-IN')}</td>
          <td>${new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        </tr>
      `;
    }).join('');
  },

  // =========================================================================
  // TOAST
  // =========================================================================
  showToast(message, type = 'success') {
    const container = document.getElementById('adminToastContainer');
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
  // LOGOUT
  // =========================================================================
  logout() {
    Auth.logout();
    window.location.href = 'index.html';
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
