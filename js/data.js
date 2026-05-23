/* ============================================
   SOLECRAFT - Data Layer
   50 Products + Users + Orders + localStorage
   ============================================ */

// =========================================================================
// 1. PRODUCTS DATABASE - 50 Premium Shoes
// =========================================================================
const PRODUCTS_DB = [
  // --- SPORTS / RUNNING (12 products) ---
  {
    id: 1, name: "Air Max Pro Runner", category: "sports", price: 4999, originalPrice: 7999,
    rating: 4.5, reviews: 234, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Red","Blue","Black"], badge: "BESTSELLER",
    description: "Premium running shoes with responsive cushioning and breathable mesh upper for ultimate performance."
  },
  {
    id: 2, name: "Running Elite X1", category: "sports", price: 5999, originalPrice: 8999,
    rating: 4.8, reviews: 312, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Black","White","Navy"], badge: "HOT",
    description: "Elite performance runners with carbon fiber plate and energy-return foam technology."
  },
  {
    id: 3, name: "Trail Blazer Hiker", category: "sports", price: 6999, originalPrice: 9999,
    rating: 4.6, reviews: 178, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop"],
    sizes: [8,9,10,11,12], colors: ["Brown","Green","Gray"], badge: null,
    description: "Rugged trail running shoes with aggressive tread pattern and waterproof protection."
  },
  {
    id: 4, name: "Speed Sprint Pro", category: "sports", price: 7999, originalPrice: 11999,
    rating: 4.7, reviews: 145, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10], colors: ["White","Black","Orange"], badge: "LIMITED",
    description: "Competition-grade sprinting shoes with ultra-lightweight construction and spike plate."
  },
  {
    id: 5, name: "Cloud Walker Z5", category: "sports", price: 5499, originalPrice: 7499,
    rating: 4.4, reviews: 203, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Gray","Blue","Red"], badge: null,
    description: "Daily training shoes with cloud-like cushioning and seamless knit upper."
  },
  {
    id: 6, name: "Flex Fit Trainer", category: "sports", price: 3999, originalPrice: 5999,
    rating: 4.3, reviews: 267, image: "https://images.unsplash.com/photo-1579338559194-a162d19d0af1?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1579338559194-a162d19d0af1?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10], colors: ["Black","White","Green"], badge: "SALE",
    description: "Versatile training shoes with multi-directional grip and flexible sole."
  },
  {
    id: 7, name: "Ultra Boost 360", category: "sports", price: 8999, originalPrice: 12999,
    rating: 4.9, reviews: 456, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["White","Black","Beige"], badge: "BESTSELLER",
    description: "Premium ultra-boost shoes with maximum energy return and sock-like fit."
  },
  {
    id: 8, name: "Marathon Elite 2", category: "sports", price: 9999, originalPrice: 14999,
    rating: 4.7, reviews: 189, image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&h=400&fit=crop"],
    sizes: [8,9,10,11], colors: ["Navy","Orange","Black"], badge: "NEW",
    description: "Marathon racing shoes engineered for peak performance with carbon plate technology."
  },
  {
    id: 9, name: "Gym King Pro", category: "sports", price: 4499, originalPrice: 6499,
    rating: 4.5, reviews: 234, image: "https://images.unsplash.com/photo-1562183241-e937e9552d54?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1562183241-e937e9552d54?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Black","Gray","Red"], badge: null,
    description: "Weight training shoes with flat stable base and reinforced heel support."
  },
  {
    id: 10, name: "CrossFit Xtreme", category: "sports", price: 6499, originalPrice: 8499,
    rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1605318692766-5b4d2a2b4f8a?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1605318692766-5b4d2a2b4f8a?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Blue","Black","White"], badge: "HOT",
    description: "Cross-training shoes built for intense workouts with durable outsole and breathable upper."
  },
  {
    id: 11, name: "Trail Runner GTX", category: "sports", price: 8499, originalPrice: 10999,
    rating: 4.8, reviews: 89, image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=400&fit=crop"],
    sizes: [8,9,10,11], colors: ["Green","Brown","Gray"], badge: null,
    description: "Gore-Tex trail running shoes with waterproof membrane and vibram outsole."
  },
  {
    id: 12, name: "Pulse Beat Runner", category: "sports", price: 3499, originalPrice: 4999,
    rating: 4.2, reviews: 345, image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10], colors: ["Red","Blue","Black"], badge: "SALE",
    description: "Affordable daily runner with responsive foam cushioning and stylish design."
  },

  // --- CASUAL / SNEAKERS (14 products) ---
  {
    id: 13, name: "Urban Street Sneakers", category: "casual", price: 2999, originalPrice: 4499,
    rating: 4.3, reviews: 156, image: "https://images.unsplash.com/photo-1560769629-975ec94e6c86?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1560769629-975ec94e6c86?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["White","Black","Navy"], badge: null,
    description: "Classic street sneakers with retro styling and modern comfort technology."
  },
  {
    id: 14, name: "Comfort Loafer Plus", category: "casual", price: 2499, originalPrice: 3999,
    rating: 4.4, reviews: 98, image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Brown","Black","Tan"], badge: null,
    description: "Ultra-comfortable loafers with memory foam insole and premium leather upper."
  },
  {
    id: 15, name: "Canvas Classic White", category: "casual", price: 1999, originalPrice: 2999,
    rating: 4.1, reviews: 423, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10,11,12], colors: ["White","Black","Red"], badge: "BESTSELLER",
    description: "Timeless canvas sneakers that go with everything. Lightweight and breathable."
  },
  {
    id: 16, name: "Retro Runner 80s", category: "casual", price: 3999, originalPrice: 5499,
    rating: 4.5, reviews: 167, image: "https://images.unsplash.com/photo-1597045566677-8cf032ed8434?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1597045566677-8cf032ed8434?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["White/Red","Blue/Yellow","Black"], badge: "NEW",
    description: "Vintage-inspired retro runners with modern cushioning for all-day comfort."
  },
  {
    id: 17, name: "Slip-On Easy Go", category: "casual", price: 1799, originalPrice: 2799,
    rating: 4.2, reviews: 256, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Navy","Gray","Black"], badge: "SALE",
    description: "Easy slip-on sneakers with elastic sides and cushioned footbed."
  },
  {
    id: 18, name: "Leather Sneaker Luxe", category: "casual", price: 4999, originalPrice: 6999,
    rating: 4.6, reviews: 134, image: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Brown","Black","White"], badge: null,
    description: "Premium leather sneakers with gold-tone hardware and ortholite insole."
  },
  {
    id: 19, name: "Espadrille Summer", category: "casual", price: 1499, originalPrice: 2499,
    rating: 4.0, reviews: 89, image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10], colors: ["Beige","Navy","Striped"], badge: null,
    description: "Lightweight espadrille sneakers perfect for summer with jute rope sole."
  },
  {
    id: 20, name: "High-Top Fashion", category: "casual", price: 4499, originalPrice: 5999,
    rating: 4.4, reviews: 112, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Black","White","Red"], badge: "HOT",
    description: "Fashion-forward high-top sneakers with padded collar and chunky sole."
  },
  {
    id: 21, name: "Monochrome Minimal", category: "casual", price: 3499, originalPrice: 4999,
    rating: 4.7, reviews: 198, image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["White","Black","Gray"], badge: null,
    description: "Minimalist monochrome sneakers with clean lines and sustainable materials."
  },
  {
    id: 22, name: "Platform Chunkster", category: "casual", price: 3799, originalPrice: 5299,
    rating: 4.3, reviews: 76, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10], colors: ["White","Black","Pink"], badge: "NEW",
    description: "Trendy platform sneakers with chunky sole and padded tongue."
  },
  {
    id: 23, name: "Skater Vans Style", category: "casual", price: 2799, originalPrice: 3999,
    rating: 4.4, reviews: 312, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10,11], colors: ["Black","White","Checkered"], badge: "BESTSELLER",
    description: "Classic skateboarding shoes with durable canvas and vulcanized sole."
  },
  {
    id: 24, name: "Athleisure Knit", category: "casual", price: 3299, originalPrice: 4499,
    rating: 4.5, reviews: 143, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Gray","Navy","Black"], badge: null,
    description: "Sleek knit sneakers with sock-like fit and responsive foam midsole."
  },
  {
    id: 25, name: "Vacation Slide Sandals", category: "casual", price: 999, originalPrice: 1499,
    rating: 3.9, reviews: 567, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Black","White","Brown"], badge: null,
    description: "Comfortable slide sandals with contoured footbed for casual wear."
  },
  {
    id: 26, name: "Mocassin Driving Shoes", category: "casual", price: 4499, originalPrice: 5999,
    rating: 4.6, reviews: 87, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Brown","Black","Tan"], badge: null,
    description: "Premium driving moccasins with pebbled sole and hand-stitched detail."
  },

  // --- FORMAL (12 products) ---
  {
    id: 27, name: "Classic Leather Oxford", category: "formal", price: 3999, originalPrice: 5999,
    rating: 4.7, reviews: 189, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Black","Brown"], badge: "BESTSELLER",
    description: "Timeless leather oxford shoes with polished finish and leather sole."
  },
  {
    id: 28, name: "Italian Derby Shoes", category: "formal", price: 5499, originalPrice: 7499,
    rating: 4.8, reviews: 98, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Brown","Black","Tan"], badge: "NEW",
    description: "Handcrafted Italian derby shoes with premium calf leather and Blake stitching."
  },
  {
    id: 29, name: "Wingtip Brogue Elite", category: "formal", price: 6499, originalPrice: 8999,
    rating: 4.6, reviews: 76, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Brown","Black","Tan"], badge: null,
    description: "Classic wingtip brogues with intricate perforation patterns and Goodyear welt."
  },
  {
    id: 30, name: "Monk Strap Heritage", category: "formal", price: 7499, originalPrice: 9999,
    rating: 4.7, reviews: 65, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Black","Brown"], badge: "LIMITED",
    description: "Double monk strap shoes with polished buckle closure and premium leather."
  },
  {
    id: 31, name: "Patent Leather Dress", category: "formal", price: 4999, originalPrice: 6999,
    rating: 4.5, reviews: 134, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Black"], badge: null,
    description: "Patent leather dress shoes with mirror shine finish for formal occasions."
  },
  {
    id: 32, name: "Loake Chelsea Boots", category: "formal", price: 8999, originalPrice: 12999,
    rating: 4.9, reviews: 45, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Brown","Black","Tan"], badge: "NEW",
    description: "Premium Chelsea boots with elastic side panels and pull tab."
  },
  {
    id: 33, name: "Office Comfort Slip-On", category: "formal", price: 3299, originalPrice: 4499,
    rating: 4.3, reviews: 213, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Black","Brown"], badge: "SALE",
    description: "Comfortable slip-on formal shoes with cushioned insole for long work days."
  },
  {
    id: 34, name: "Tassel Loafer Premium", category: "formal", price: 4499, originalPrice: 6499,
    rating: 4.5, reviews: 87, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Brown","Black","Navy"], badge: null,
    description: "Elegant tassel loafers crafted from supple leather with leather sole."
  },
  {
    id: 35, name: "Cap-Toe Oxford", category: "formal", price: 5999, originalPrice: 7999,
    rating: 4.6, reviews: 54, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Black","Brown"], badge: null,
    description: "Classic cap-toe oxford shoes with sleek silhouette and Blake construction."
  },
  {
    id: 36, name: "Velvet Evening Slipper", category: "formal", price: 3999, originalPrice: 5499,
    rating: 4.2, reviews: 34, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10], colors: ["Navy","Black","Burgundy"], badge: "LIMITED",
    description: "Luxurious velvet evening slippers with gold embroidered crest."
  },
  {
    id: 37, name: "Suede Chukka Boots", category: "formal", price: 5499, originalPrice: 7499,
    rating: 4.4, reviews: 92, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Brown","Gray","Blue"], badge: null,
    description: "Smart casual chukka boots in premium suede with crepe sole."
  },
  {
    id: 38, name: "Boat Shoe Nautical", category: "formal", price: 3499, originalPrice: 4999,
    rating: 4.3, reviews: 123, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Brown","Navy","Tan"], badge: null,
    description: "Classic boat shoes with rawhide laces and slip-resistant rubber sole."
  },

  // --- SANDALS / SLIPPERS (6 products) ---
  {
    id: 39, name: "Beach Walker Flip-Flops", category: "sandals", price: 699, originalPrice: 999,
    rating: 3.8, reviews: 678, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10,11,12], colors: ["Black","White","Blue","Green"], badge: null,
    description: "Comfortable beach flip-flops with textured footbed and durable straps."
  },
  {
    id: 40, name: "Sport Sandal Adventure", category: "sandals", price: 1999, originalPrice: 2999,
    rating: 4.1, reviews: 234, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Black","Gray","Green"], badge: null,
    description: "Adventure sandals with adjustable straps and rugged outsole for trails."
  },
  {
    id: 41, name: "House Slipper Cozy", category: "sandals", price: 899, originalPrice: 1499,
    rating: 4.2, reviews: 456, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10,11], colors: ["Gray","Brown","Navy"], badge: null,
    description: "Plush house slippers with memory foam footbed and indoor/outdoor sole."
  },
  {
    id: 42, name: "Leather Sandal Premium", category: "sandals", price: 2499, originalPrice: 3499,
    rating: 4.3, reviews: 87, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Brown","Black","Tan"], badge: null,
    description: "Handcrafted leather sandals with cushioned footbed and adjustable buckle."
  },
  {
    id: 43, name: "Pool Slide Quick-Dry", category: "sandals", price: 499, originalPrice: 799,
    rating: 3.7, reviews: 890, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10,11,12], colors: ["Black","White","Blue","Red"], badge: "SALE",
    description: "Quick-dry pool slides with cushioned EVA footbed and sporty strap."
  },
  {
    id: 44, name: "Orthopedic Comfort Sandal", category: "sandals", price: 2999, originalPrice: 3999,
    rating: 4.5, reviews: 345, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Brown","Black","Tan"], badge: null,
    description: "Orthopedic sandals with arch support, heel cup and adjustable straps."
  },

  // --- BOOTS (6 products) ---
  {
    id: 45, name: "Timber Hiker Boots", category: "boots", price: 7999, originalPrice: 10999,
    rating: 4.7, reviews: 234, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Brown","Black","Tan"], badge: "BESTSELLER",
    description: "Rugged hiking boots with waterproof membrane and aggressive tread pattern."
  },
  {
    id: 46, name: "Winter Snow Boots", category: "boots", price: 6999, originalPrice: 9499,
    rating: 4.6, reviews: 178, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Black","Gray","Navy"], badge: "HOT",
    description: "Insulated snow boots with fleece lining and slip-resistant rubber outsole."
  },
  {
    id: 47, name: "Motorcycle Leather Boots", category: "boots", price: 8999, originalPrice: 12999,
    rating: 4.8, reviews: 89, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop"],
    sizes: [8,9,10,11,12], colors: ["Black","Brown"], badge: null,
    description: "Heavy-duty motorcycle boots with reinforced toe and ankle protection."
  },
  {
    id: 48, name: "Desert Boots Suede", category: "boots", price: 4999, originalPrice: 6999,
    rating: 4.4, reviews: 156, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11], colors: ["Tan","Brown","Gray"], badge: null,
    description: "Classic desert boots in soft suede with crepe rubber sole."
  },
  {
    id: 49, name: "Rain Boots Wellington", category: "boots", price: 2499, originalPrice: 3499,
    rating: 4.2, reviews: 267, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop"],
    sizes: [6,7,8,9,10,11,12], colors: ["Green","Black","Navy","Red"], badge: null,
    description: "Classic Wellington rain boots with pull handles and waterproof construction."
  },
  {
    id: 50, name: "Combat Boots Tactical", category: "boots", price: 5999, originalPrice: 7999,
    rating: 4.5, reviews: 123, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&h=400&fit=crop"],
    sizes: [7,8,9,10,11,12], colors: ["Black","Tan"], badge: "NEW",
    description: "Tactical combat boots with side zipper, padded collar and slip-resistant sole."
  }
];

// =========================================================================
// 2. STORAGE MANAGER
// =========================================================================
const StorageManager = {
  // Keys
  KEYS: {
    USERS: 'solecraft_users',
    CURRENT_USER: 'solecraft_current_user',
    CART: 'solecraft_cart',
    WISHLIST: 'solecraft_wishlist',
    ORDERS: 'solecraft_orders',
    PRODUCTS: 'solecraft_products'
  },

  // Generic get/set
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  // --- Products ---
  getProducts() {
    return this.get(this.KEYS.PRODUCTS, PRODUCTS_DB);
  },

  saveProducts(products) {
    return this.set(this.KEYS.PRODUCTS, products);
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  getNextProductId() {
    const products = this.getProducts();
    return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  },

  // --- Users ---
  getUsers() {
    return this.get(this.KEYS.USERS, []);
  },

  saveUsers(users) {
    return this.set(this.KEYS.USERS, users);
  },

  getCurrentUser() {
    return this.get(this.KEYS.CURRENT_USER, null);
  },

  saveCurrentUser(user) {
    return this.set(this.KEYS.CURRENT_USER, user);
  },

  logout() {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  },

  // --- Cart ---
  getCart() {
    return this.get(this.KEYS.CART, []);
  },

  saveCart(cart) {
    return this.set(this.KEYS.CART, cart);
  },

  // --- Wishlist ---
  getWishlist() {
    return this.get(this.KEYS.WISHLIST, []);
  },

  saveWishlist(wishlist) {
    return this.set(this.KEYS.WISHLIST, wishlist);
  },

  // --- Orders ---
  getOrders() {
    return this.get(this.KEYS.ORDERS, []);
  },

  saveOrders(orders) {
    return this.set(this.KEYS.ORDERS, orders);
  },

  getOrdersByUser(userId) {
    const orders = this.getOrders();
    return orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // --- Seed Default Admin ---
  seedAdmin() {
    const users = this.getUsers();
    if (!users.find(u => u.isAdmin)) {
      users.push({
        id: 'admin_1',
        name: 'Admin',
        email: 'admin@nawabisshoes.com',
        password: 'admin123',
        phone: '',
        address: '',
        isAdmin: true,
        createdAt: new Date().toISOString()
      });
      this.saveUsers(users);
    }
  }
};

// Seed admin on load
StorageManager.seedAdmin();
