let products = [];
let cart = JSON.parse(localStorage.getItem('glowher_cart')) || [];
let currentSection = 'home';
let selectedProduct = null;
let isLoggedIn = JSON.parse(localStorage.getItem('glowher_isLoggedIn')) || false;
let currentUser = JSON.parse(localStorage.getItem('glowher_currentUser')) || null;
let registeredUsers = JSON.parse(localStorage.getItem('glowher_users')) || [];


function saveCart() {
    localStorage.setItem('glowher_cart', JSON.stringify(cart));
}

function saveUsers() {
    localStorage.setItem('glowher_users', JSON.stringify(registeredUsers));
}

function saveSession() {
    localStorage.setItem('glowher_isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('glowher_currentUser', JSON.stringify(currentUser));
}


async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products/category/womens-dresses?limit=30');
        const data = await response.json();
        
        const response2 = await fetch('https://dummyjson.com/products/category/womens-shoes?limit=30');
        const data2 = await response2.json();

        const response3 = await fetch('https://dummyjson.com/products/category/womens-bags?limit=30');
        const data3 = await response3.json();

        const response4 = await fetch('https://dummyjson.com/products/category/womens-jewellery?limit=30');
        const data4 = await response4.json();

        const response5 = await fetch('https://dummyjson.com/products/category/tops?limit=30');
        const data5 = await response5.json();

        const response6 = await fetch('https://dummyjson.com/products/category/sunglasses?limit=30');
        const data6 = await response6.json();

        const response7 = await fetch('https://dummyjson.com/products/category/shirts?limit=30');
        const data7 = await response7.json();

        const response8 = await fetch('https://dummyjson.com/products/category/jackets?limit=30');
        const data8 = await response8.json();

        const response9 = await fetch('https://dummyjson.com/products/category/jeans?limit=30');
        const data9 = await response9.json();

        const allProducts = [
            ...data.products,
            ...data2.products,
            ...data3.products,
            ...data4.products,
            ...data5.products,
            ...data6.products,
            ...data7.products,
            ...data8.products,
            ...data9.products
        ];

        products = allProducts.map((p, index) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            image: p.thumbnail,
            category: mapCategory(p.category),
            description: p.description,
            inStock: p.stock > 0,
            featured: index < 8
        }));

        loadFeaturedProducts();
        loadProducts();

    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
}

function mapCategory(apiCategory) {
    if (apiCategory.includes('dresses') || apiCategory.includes('tops') || apiCategory.includes('shirts') || apiCategory.includes('jackets') || apiCategory.includes('jeans')) return 'clothing';
    if (apiCategory.includes('shoes')) return 'footwear';
    if (apiCategory.includes('bags') || apiCategory.includes('jewellery') || apiCategory.includes('sunglasses')) return 'accessories';
    return 'clothing';
}

// Load featured products 
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    const featuredProducts = products.filter(product => product.featured);
    
    featuredContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productElement = createProductElement(product);
        featuredContainer.appendChild(productElement);
    });
}

// Load all products in catalog
function loadProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('productsGrid');
    const productsToDisplay = filteredProducts || products;
    
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500"><p class="text-xl">No products found matching your criteria.</p></div>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productElement = createProductElement(product);
        productsGrid.appendChild(productElement);
    });
}

// Create product 
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 group';
    
    productDiv.innerHTML = `
        <div class="overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300">
        </div>
        <div class="p-4">
            <h3 class="text-lg font-semibold mb-2 text-gray-800">${product.name}</h3>
            <p class="text-primary font-bold text-xl mb-4">$${product.price}</p>
            <div class="flex gap-2">
                <button class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors" onclick="viewProductDetails(${product.id})">View Details</button>
                <button class="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
    
    return productDiv;
}

// Filter products by category
function filterByCategory(category) {
    document.getElementById('categoryFilter').value = category;
    applyFilters();
    showSection('catalog');
}

// Apply filters
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceSort = document.getElementById('priceSort').value;
    
    let filteredProducts = [...products];
    
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    if (priceSort === 'low-high') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    
    loadProducts(filteredProducts);
}

// Set up search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    loadProducts(filteredProducts);
    showSection('catalog');
}

// View product details
function viewProductDetails(productId) {
    selectedProduct = products.find(product => product.id === productId);
    
    if (!selectedProduct) {
        return;
    }
    
    const productDetailContent = document.getElementById('productDetailContent');
    
    productDetailContent.innerHTML = `
        <div class="flex flex-col lg:flex-row gap-8">
            <div class="flex-1">
                <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="w-full h-80 lg:h-96 object-cover rounded-xl mb-4">
                <div class="flex gap-3">
                    <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="w-20 h-20 object-cover rounded-lg cursor-pointer opacity-100 border-2 border-primary">
                    <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="w-20 h-20 object-cover rounded-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                    <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="w-20 h-20 object-cover rounded-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                </div>
            </div>
            <div class="flex-1">
                <h2 class="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">${selectedProduct.name}</h2>
                <p class="text-3xl font-bold text-primary mb-6">$${selectedProduct.price}</p>
                <div class="mb-6">
                    <p class="text-gray-600 leading-relaxed">${selectedProduct.description}</p>
                </div>
                <div class="mb-6 space-y-2">
                    <p class="text-gray-700"><span class="font-semibold">Category:</span> ${selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}</p>
                    <p class="text-gray-700"><span class="font-semibold">Availability:</span> <span class="${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}">${selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}</span></p>
                </div>
                <div class="flex items-center gap-4 mb-6">
                    <span class="font-medium text-gray-700">Quantity:</span>
                    <div class="flex items-center">
                        <button onclick="decrementQuantity()" class="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-l-lg flex items-center justify-center text-lg font-bold transition-colors">-</button>
                        <input type="number" id="quantity" value="1" min="1" max="10" class="w-16 h-10 text-center border-y border-gray-200 focus:outline-none">
                        <button onclick="incrementQuantity()" class="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-r-lg flex items-center justify-center text-lg font-bold transition-colors">+</button>
                    </div>
                </div>
                <button onclick="addToCartFromDetail()" class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-xl transition-colors text-lg">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    showSection('productDetail');
}

// Increment quantity
function incrementQuantity() {
    const quantityInput = document.getElementById('quantity');
    let quantity = parseInt(quantityInput.value);
    if (quantity < 10) {
        quantityInput.value = quantity + 1;
    }
}

// Decrement quantity
function decrementQuantity() {
    const quantityInput = document.getElementById('quantity');
    let quantity = Number(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
}

// Add to cart from product detail
function addToCartFromDetail() {
    if (!selectedProduct) {
        return;
    }
    
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value);
    
    for (let i = 0; i < quantity; i++) {
        addToCart(selectedProduct.id);
    }
    
    alert(`${quantity} ${selectedProduct.name}${quantity > 1 ? 's' : ''} added to cart!`);
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return;
    }
    
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
    });

    saveCart(); 
    updateCart();
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    const checkoutButton = document.getElementById('checkoutButton');
    checkoutButton.disabled = totalItems === 0;
}

// Update cart
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotalPrice');
    const shippingElement = document.getElementById('shippingPrice');
    const totalElement = document.getElementById('totalPrice');
    
    const combinedCart = [];
    cart.forEach(item => {
        const existingItem = combinedCart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            combinedCart.push({...item});
        }
    });
    
    if (combinedCart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                <p class="text-xl text-gray-500 mb-4">Your cart is empty</p>
                <button onclick="showSection('catalog')" class="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors">Continue Shopping</button>
            </div>
        `;
    } else {
        cartItems.innerHTML = '';
        combinedCart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'flex gap-4 border-b border-gray-100 py-4';
            
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800 mb-1">${item.name}</h3>
                    <p class="text-primary font-bold mb-3">$${item.price}</p>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center">
                            <button onclick="decrementCartItem(${item.id})" class="bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-l flex items-center justify-center transition-colors">-</button>
                            <span class="w-10 h-8 flex items-center justify-center bg-gray-50 border-y border-gray-100">${item.quantity}</span>
                            <button onclick="incrementCartItem(${item.id})" class="bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-r flex items-center justify-center transition-colors">+</button>
                        </div>
                        <button class="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded transition-colors" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
    }
    
    const subtotal = combinedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = subtotal.toFixed(2);
    shippingElement.textContent = shipping.toFixed(2);
    totalElement.textContent = total.toFixed(2);
    
    updateCheckoutSummary(combinedCart, subtotal, shipping, total);
}

// Update checkout 
function updateCheckoutSummary(combinedCart, subtotal, shipping, total) {
    const orderItems = document.getElementById('orderItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutShipping = document.getElementById('checkoutShipping');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    orderItems.innerHTML = '';
    
    combinedCart.forEach(item => {
        const orderItemElement = document.createElement('div');
        orderItemElement.className = 'flex gap-3 mb-4 pb-4 border-b border-gray-200';
        
        orderItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-800">${item.name} x${item.quantity}</h4>
                <p class="text-primary font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `;
        
        orderItems.appendChild(orderItemElement);
    });
    
    checkoutSubtotal.textContent = subtotal.toFixed(2);
    checkoutShipping.textContent = shipping.toFixed(2);
    checkoutTotal.textContent = total.toFixed(2);
}

// Increment cart item quantity
function incrementCartItem(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
        saveCart();
        updateCart();
        updateCartCount();
    }
}

// Decrement cart item quantity
function decrementCartItem(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        saveCart(); // ← persist
        updateCart();
        updateCartCount();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart(); // ← persist
    updateCart();
    updateCartCount();
}

// Show section
function showSection(section) {
    ['home', 'catalog', 'cart', 'checkout', 'productDetail'].forEach(id => {
        document.getElementById(id).classList.remove('visible');
    });
    document.getElementById(section).classList.add('visible');
    
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('bg-white/20');
    });
    
    const navLink = document.querySelector(`nav a[onclick="showSection('${section}')"]`);
    if (navLink) {
        navLink.classList.add('bg-white/20');
    }
    
    currentSection = section;
    window.scrollTo(0, 0);
}

// Scroll to Contact Us section
function scrollToContact() {
    const contactSection = document.getElementById('contactSection');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Validation 
function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    let errEl = document.getElementById(fieldId + '_error');

    if (message) {
        field.classList.add('border-red-500');
        if (!errEl) {
            errEl = document.createElement('p');
            errEl.id = fieldId + '_error';
            errEl.className = 'text-red-500 text-sm mt-1';
            field.parentNode.appendChild(errEl);
        }
        errEl.textContent = message;
        return false;
    } else {
        field.classList.remove('border-red-500');
        if (errEl) errEl.remove();
        return true;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function luhnCheck(num) {
    const digits = num.replace(/\s/g, '').split('').reverse().map(Number);
    const sum = digits.reduce((acc, d, i) => {
        if (i % 2 !== 0) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        return acc + d;
    }, 0);
    return sum % 10 === 0;
}

function isValidCard(cardNumber) {
    const digits = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(digits);
}

// Complete purchase 
function completePurchase() {
    const fields = {
        name:       document.getElementById('name').value.trim(),
        email:      document.getElementById('email').value.trim(),
        address:    document.getElementById('address').value.trim(),
        city:       document.getElementById('city').value.trim(),
        zip:        document.getElementById('zip').value.trim(),
        country:    document.getElementById('country').value,
        cardName:   document.getElementById('cardName').value.trim(),
        cardNumber: document.getElementById('cardNumber').value.trim(),
        expDate:    document.getElementById('expDate').value.trim(),
        cvv:        document.getElementById('cvv').value.trim(),
    };

    let valid = true;

    const required = ['name','address','city','zip','country','cardName','expDate','cvv'];
    required.forEach(id => {
        valid = setFieldError(id, fields[id] ? '' : 'This field is required.') && valid;
    });

    // Email validation
    if (!fields.email) {
        valid = setFieldError('email', 'Email is required.') && valid;
    } else if (!isValidEmail(fields.email)) {
        valid = setFieldError('email', 'Please enter a valid email address (e.g. you@example.com).') && valid;
    } else {
        setFieldError('email', '');
    }

    // Card number validation
    if (!fields.cardNumber) {
        valid = setFieldError('cardNumber', 'Card number is required.') && valid;
    } else if (!isValidCard(fields.cardNumber)) {
        valid = setFieldError('cardNumber', 'Please enter a valid 16-digit card number.') && valid;
    } else {
        setFieldError('cardNumber', '');
    }

    if (!valid) return;

    const orderNumber = Math.floor(Math.random() * 1000000);
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('confirmationEmail').textContent = fields.email;
    document.getElementById('confirmationModal').style.display = 'flex';
    
    cart = [];
    saveCart(); 
    updateCart();
    updateCartCount();
}

// Close confirmation
function closeConfirmation() {
    document.getElementById('confirmationModal').style.display = 'none';
    showSection('home');
}

// login modal
function toggleLogin() {
    const loginModal = document.getElementById('loginModal');

    if (isLoggedIn) {
        isLoggedIn = false;
        currentUser = null;
        saveSession(); // ← persist logout
        alert('You have been logged out.');
        return;
    }

    if (loginModal.style.display === 'flex') {
        loginModal.style.display = 'none';
    } else {
        loginModal.style.display = 'flex';
    }
}

// switch to register
function switchToRegister() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('registerModal').style.display = 'flex';
}

// switch to login
function switchToLogin() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('loginModal').style.display = 'flex';
}

// Login
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }
    const matchedUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (!matchedUser) {
        alert('Invalid email or password. Please try again.');
        return;
    }
    
    isLoggedIn = true;
    currentUser = { email, name: matchedUser.name };
    saveSession(); 
    
    document.getElementById('loginModal').style.display = 'none';
    alert('You have been logged in successfully!');
}

// Register
function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }

    const alreadyExists = registeredUsers.find(u => u.email === email);
    if (alreadyExists) {
        alert('An account with this email already exists.');
        return;
    }
    
    registeredUsers.push({ name, email, password });
    saveUsers(); // ← persist new user

    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('loginModal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
    setupSearch();
    showSection('home');
    updateCart();       // restore cart UI from localStorage
    updateCartCount();  // restore cart count badge
    document.getElementById('confirmationModal').style.display = 'none';
    document.getElementById('loginModal').style.display = 'none'; 
    document.getElementById('registerModal').style.display = 'none';
});
