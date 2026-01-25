// Amenities Page JavaScript

// Sample Amenities Data
const amenitiesData = [
    {
        id: 1,
        name: "Wheat Seeds (HD-2967)",
        category: "seeds",
        crops: "Wheat",
        price: 450,
        priceUnit: "per kg",
        availability: "available",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
        paymentOptions: ["cash", "produce"],
        season: "rabi",
        supplier: "Maharashtra Agro Co-op"
    },
    {
        id: 2,
        name: "NPK Fertilizer (20:20:20)",
        category: "fertilizers",
        crops: "All Crops",
        price: 1200,
        priceUnit: "per 50kg bag",
        availability: "available",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
        paymentOptions: ["cash", "produce"],
        season: "all",
        supplier: "FarmTech Solutions"
    },
    {
        id: 3,
        name: "Tractor (Mahindra 575 DI)",
        category: "machinery",
        crops: "All Crops",
        price: 800,
        priceUnit: "per day",
        availability: "limited",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
        paymentOptions: ["cash"],
        season: "all",
        supplier: "Rural Equipment Rentals"
    },
    {
        id: 4,
        name: "Drip Irrigation Kit",
        category: "irrigation",
        crops: "Vegetables, Fruits",
        price: 5000,
        priceUnit: "per season",
        availability: "available",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
        paymentOptions: ["cash", "produce"],
        season: "all",
        supplier: "WaterWise Agro"
    },
    {
        id: 5,
        name: "Rice Seeds (Basmati)",
        category: "seeds",
        crops: "Rice",
        price: 650,
        priceUnit: "per kg",
        availability: "available",
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
        paymentOptions: ["cash", "produce"],
        season: "kharif",
        supplier: "Premium Seeds Ltd"
    },
    {
        id: 6,
        name: "Organic Compost",
        category: "organic",
        crops: "All Crops",
        price: 300,
        priceUnit: "per 25kg bag",
        availability: "available",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
        paymentOptions: ["cash", "produce"],
        season: "all",
        supplier: "Green Earth Organics"
    },
    {
        id: 7,
        name: "Rotavator",
        category: "machinery",
        crops: "All Crops",
        price: 600,
        priceUnit: "per day",
        availability: "available",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
        paymentOptions: ["cash"],
        season: "all",
        supplier: "Rural Equipment Rentals"
    },
    {
        id: 8,
        name: "Pesticide Sprayer",
        category: "machinery",
        crops: "All Crops",
        price: 200,
        priceUnit: "per day",
        availability: "available",
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
        paymentOptions: ["cash"],
        season: "all",
        supplier: "AgriTools Hub"
    }
];

// State Management
let currentCategory = 'all';
let currentFilters = {};
let displayedItems = 8;

// DOM Elements
const categoryCards = document.querySelectorAll('.category-card');
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterPanel = document.getElementById('filterPanel');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const cancelFilterBtn = document.getElementById('cancelFilterBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const searchInput = document.getElementById('searchInput');
const amenitiesGrid = document.getElementById('amenitiesGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const incentiveClose = document.querySelector('.incentive-close');
const langBtns = document.querySelectorAll('.lang-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderAmenities();
    setupEventListeners();
    loadUserData();
});

// Setup Event Listeners
function setupEventListeners() {
    // Category Selection
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentCategory = card.dataset.category;
            displayedItems = 8;
            renderAmenities();
        });
    });

    // Filter Toggle
    filterToggleBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('hidden');
    });

    // Apply Filters
    applyFilterBtn.addEventListener('click', () => {
        applyFilters();
        filterPanel.classList.add('hidden');
    });

    // Cancel Filters
    cancelFilterBtn.addEventListener('click', () => {
        filterPanel.classList.add('hidden');
    });

    // Clear Filters
    clearFiltersBtn.addEventListener('click', () => {
        clearAllFilters();
    });

    // Search
    searchInput.addEventListener('input', debounce(() => {
        renderAmenities();
    }, 300));

    // Load More
    loadMoreBtn.addEventListener('click', () => {
        displayedItems += 8;
        renderAmenities();
    });

    // Close Incentive Banner
    if (incentiveClose) {
        incentiveClose.addEventListener('click', () => {
            document.querySelector('.incentive-banner').style.display = 'none';
        });
    }

    // Language Toggle
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // In production, this would trigger language change
            console.log('Language changed to:', btn.dataset.lang);
        });
    });
}

// Render Amenities
function renderAmenities() {
    let filteredData = amenitiesData;

    // Filter by category
    if (currentCategory !== 'all') {
        filteredData = filteredData.filter(item => item.category === currentCategory);
    }

    // Filter by search
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredData = filteredData.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.crops.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
    }

    // Apply additional filters
    if (currentFilters.cropType) {
        filteredData = filteredData.filter(item =>
            item.crops.toLowerCase().includes(currentFilters.cropType.toLowerCase())
        );
    }

    if (currentFilters.season && currentFilters.season !== 'all') {
        filteredData = filteredData.filter(item =>
            item.season === currentFilters.season || item.season === 'all'
        );
    }

    if (currentFilters.minPrice) {
        filteredData = filteredData.filter(item => item.price >= currentFilters.minPrice);
    }

    if (currentFilters.maxPrice) {
        filteredData = filteredData.filter(item => item.price <= currentFilters.maxPrice);
    }

    // Update count
    document.getElementById('itemCount').textContent = filteredData.length;

    // Render cards
    const itemsToShow = filteredData.slice(0, displayedItems);
    amenitiesGrid.innerHTML = itemsToShow.map(item => createAmenityCard(item)).join('');

    // Show/hide load more button
    if (filteredData.length <= displayedItems) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }

    // Add click listeners to cards
    document.querySelectorAll('.btn-view-details').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            viewDetails(itemsToShow[index]);
        });
    });

    document.querySelectorAll('.btn-rent-now').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            rentNow(itemsToShow[index]);
        });
    });
}

// Create Amenity Card HTML
function createAmenityCard(item) {
    const availabilityClass = `badge-${item.availability}`;
    const availabilityText = item.availability === 'available' ? '🟢 Available' :
        item.availability === 'limited' ? '🔴 Limited' : '⚪ Booked';

    const paymentBadges = item.paymentOptions.map(option =>
        `<span class="payment-badge">${option === 'cash' ? '💰 Cash' : '🌾 Produce'}</span>`
    ).join('');

    return `
        <div class="amenity-card">
            <div class="amenity-image-container">
                <img src="${item.image}" alt="${item.name}" class="amenity-image">
                <span class="availability-badge ${availabilityClass}">${availabilityText}</span>
            </div>
            <div class="amenity-content">
                <div class="amenity-header">
                    <span class="amenity-category">${item.category}</span>
                    <h3 class="amenity-name">${item.name}</h3>
                    <p class="amenity-crops">🌾 ${item.crops}</p>
                </div>
                <div class="amenity-details">
                    <p class="amenity-price">
                        ₹${item.price.toLocaleString()}
                        <span class="price-unit">${item.priceUnit}</span>
                    </p>
                    <div class="payment-options">
                        ${paymentBadges}
                    </div>
                    <div class="amenity-rating">
                        ⭐ ${item.rating} • ${item.supplier}
                    </div>
                </div>
                <div class="amenity-actions">
                    <button class="btn-view-details">View Details</button>
                    <button class="btn-rent-now">Rent Now</button>
                </div>
            </div>
        </div>
    `;
}

// Apply Filters
function applyFilters() {
    currentFilters = {
        cropType: document.getElementById('cropTypeFilter').value,
        season: document.getElementById('seasonFilter').value,
        duration: document.getElementById('durationFilter').value,
        minPrice: parseInt(document.getElementById('minPrice').value) || null,
        maxPrice: parseInt(document.getElementById('maxPrice').value) || null,
        sort: document.getElementById('sortFilter').value
    };

    // Update filter count
    const filterCount = Object.values(currentFilters).filter(v => v !== null && v !== '').length;
    const filterCountEl = document.getElementById('filterCount');
    if (filterCount > 0) {
        filterCountEl.textContent = filterCount;
        filterCountEl.classList.remove('hidden');
    } else {
        filterCountEl.classList.add('hidden');
    }

    displayedItems = 8;
    renderAmenities();
}

// Clear All Filters
function clearAllFilters() {
    document.getElementById('cropTypeFilter').value = '';
    document.getElementById('seasonFilter').value = '';
    document.getElementById('durationFilter').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortFilter').value = 'popular';
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => cb.checked = false);

    currentFilters = {};
    document.getElementById('filterCount').classList.add('hidden');
    renderAmenities();
}

// View Details
function viewDetails(item) {
    // TODO: Navigate to detail page
    alert(`Viewing details for: ${item.name}\n\nThis will open the amenity detail page with full information, rental terms, and booking options.`);
}

// Rent Now
function rentNow(item) {
    // TODO: Add to cart or navigate to booking
    alert(`Renting: ${item.name}\nPrice: ₹${item.price} ${item.priceUnit}\n\nThis will add the item to your cart and proceed to checkout.`);
}

// Load User Data
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('farmerConnectUser'));
    if (userData) {
        const initials = userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'F';
        document.getElementById('userInitials').textContent = initials;
    }
}

// Utility: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
