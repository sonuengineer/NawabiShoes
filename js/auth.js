/* ============================================
   SOLECRAFT - Authentication Module
   Register, Login, Logout, Profile Management
   ============================================ */

const Auth = {
  // --- Register a new user ---
  register(name, email, password, phone = '', address = '') {
    // Validate inputs
    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    const users = StorageManager.getUsers();

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists' };
    }

    // Create user
    const newUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name,
      email: email.toLowerCase(),
      password, // In production, hash this!
      phone,
      address,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    StorageManager.saveUsers(users);

    // Auto-login
    StorageManager.saveCurrentUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      isAdmin: newUser.isAdmin
    });

    return { success: true, message: 'Account created successfully!', user: newUser };
  },

  // --- Login ---
  login(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    const users = StorageManager.getUsers();
    const user = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    StorageManager.saveCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin
    });

    return { success: true, message: 'Login successful!', user };
  },

  // --- Logout ---
  logout() {
    StorageManager.logout();
  },

  // --- Get current user ---
  getCurrentUser() {
    return StorageManager.getCurrentUser();
  },

  // --- Check if logged in ---
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // --- Check if admin ---
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.isAdmin === true;
  },

  // --- Update profile ---
  updateProfile(name, phone, address) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'Please login first' };
    }

    const users = StorageManager.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    users[userIndex].name = name || users[userIndex].name;
    users[userIndex].phone = phone || users[userIndex].phone;
    users[userIndex].address = address || users[userIndex].address;

    StorageManager.saveUsers(users);

    // Update current user
    const updatedUser = {
      ...currentUser,
      name: users[userIndex].name,
      phone: users[userIndex].phone,
      address: users[userIndex].address
    };
    StorageManager.saveCurrentUser(updatedUser);

    return { success: true, message: 'Profile updated successfully!', user: updatedUser };
  },

  // --- Helper: Validate email ---
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
};
