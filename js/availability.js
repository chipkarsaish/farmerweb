// ========================================
// AVAILABILITY PAGE JAVASCRIPT
// ========================================

// Mock Data
const mockData = {
    crops: [
        {
            id: 1,
            name: "Hybrid Wheat Seeds",
            variety: "HD-2967",
            category: "Wheat",
            quantity: 800,
            unit: "kg",
            price: 450,
            priceUnit: "kg",
            rating: 4.8,
            ratingCount: 526,
            image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
            quality: "A",
            harvestDate: "2026-01-10",
            shelfLife: 45,
            location: "Warehouse A",
            farmer: "Ramesh Patil",
            status: "available",
            stockStatus: "In Stock",
            condition: "good",
            priceTrend: "rising",
            demand: "high",
            deliveryDays: "3-5",
            sellerType: "Farmer Verified",
            sustainable: true,
            organic: true
        },
        {
            id: 2,
            name: "Premium Basmati Rice",
            variety: "Basmati",
            category: "Rice",
            quantity: 650,
            unit: "kg",
            price: 850,
            priceUnit: "kg",
            rating: 4.9,
            ratingCount: 324,
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
            quality: "A",
            harvestDate: "2026-01-05",
            shelfLife: 60,
            location: "Warehouse B",
            farmer: "Suresh Kumar",
            status: "available",
            stockStatus: "In Stock",
            condition: "good",
            priceTrend: "stable",
            demand: "medium",
            deliveryDays: "2-4",
            sellerType: "Local Seller",
            sustainable: false,
            organic: false
        },
        {
            id: 3,
            name: "Fresh Tomato Seeds",
            variety: "Hybrid",
            category: "Vegetable",
            quantity: 100,
            unit: "kg",
            price: 1200,
            priceUnit: "kg",
            rating: 4.5,
            ratingCount: 672,
            image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400",
            quality: "B",
            harvestDate: "2026-01-12",
            shelfLife: 7,
            location: "Cold Storage",
            farmer: "Anita Desai",
            status: "available",
            stockStatus: "Limited Stock",
            condition: "good",
            priceTrend: "falling",
            demand: "low",
            deliveryDays: "1-3",
            sellerType: "Farmer Verified",
            sustainable: true,
            organic: true
        },
        {
            id: 4,
            name: "BT Cotton Seeds",
            variety: "BT Cotton",
            category: "Cotton",
            quantity: 300,
            unit: "kg",
            price: 680,
            priceUnit: "kg",
            rating: 4.2,
            ratingCount: 458,
            image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400",
            quality: "A",
            harvestDate: "2025-12-28",
            shelfLife: 90,
            location: "Warehouse A",
            farmer: "Vijay Patil",
            status: "reserved",
            stockStatus: "Reserved",
            condition: "good",
            priceTrend: "rising",
            demand: "high",
            deliveryDays: "4-6",
            sellerType: "Local Seller",
            sustainable: false,
            organic: false
        },
        {
            id: 5,
            name: "Sugarcane Seedlings",
            variety: "Co-86032",
            category: "Cash Crop",
            quantity: 200,
            unit: "units",
            price: 15,
            priceUnit: "unit",
            rating: 4.6,
            ratingCount: 213,
            image: "https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?w=400",
            quality: "B",
            harvestDate: "2026-01-08",
            shelfLife: 14,
            location: "Field Storage",
            farmer: "Prakash Rao",
            status: "available",
            stockStatus: "In Stock",
            condition: "maintenance",
            priceTrend: "stable",
            demand: "medium",
            deliveryDays: "5-7",
            sellerType: "Farmer Verified",
            sustainable: true,
            organic: false
        }
    ],
    equipment: [
        {
            id: 1,
            name: "Mahindra 575 Tractor",
            category: "Tractor",
            status: "available",
            condition: "good",
            rentalRate: 800,
            unit: "per day",
            utilization: 65,
            nextMaintenance: "2026-02-15",
            location: "Equipment Yard",
            idleDays: 3,
            ownership: "group",
            sustainable: true
        },
        {
            id: 2,
            name: "Rotavator",
            category: "Tillage Equipment",
            status: "available",
            condition: "good",
            rentalRate: 500,
            unit: "per day",
            utilization: 45,
            nextMaintenance: "2026-03-01",
            location: "Equipment Yard",
            idleDays: 5,
            ownership: "individual",
            sustainable: false
        },
        {
            id: 3,
            name: "Seed Drill",
            category: "Sowing Equipment",
            status: "reserved",
            condition: "good",
            rentalRate: 400,
            unit: "per day",
            utilization: 80,
            nextMaintenance: "2026-02-20",
            location: "Equipment Yard",
            idleDays: 0,
            ownership: "group",
            sustainable: true
        },
        {
            id: 4,
            name: "Sprayer",
            category: "Crop Protection",
            status: "available",
            condition: "maintenance",
            rentalRate: 300,
            unit: "per day",
            utilization: 55,
            nextMaintenance: "2026-01-20",
            location: "Equipment Yard",
            idleDays: 7,
            ownership: "platform",
            sustainable: true
        }
    ],
    inputs: [
        {
            id: 1,
            name: "NPK 10-26-26",
            category: "Fertilizer",
            quantity: 15,
            unit: "kg",
            batchNumber: "FRT-2025-1234",
            expiryDate: "2026-06-30",
            status: "available",
            condition: "good",
            location: "Storage Room A",
            recommendedCrops: ["Wheat", "Rice"],
            ownership: "individual",
            organic: false,
            sustainable: false
        },
        {
            id: 2,
            name: "Tomato Seeds (Hybrid)",
            category: "Seeds",
            quantity: 5,
            unit: "kg",
            batchNumber: "SED-2025-5678",
            expiryDate: "2026-01-27",
            status: "available",
            condition: "good",
            location: "Storage Room B",
            recommendedCrops: ["Tomato"],
            ownership: "individual",
            organic: false,
            sustainable: true
        },
        {
            id: 3,
            name: "Organic Compost",
            category: "Fertilizer",
            quantity: 200,
            unit: "kg",
            batchNumber: "ORG-2025-9012",
            expiryDate: "2027-01-15",
            status: "available",
            condition: "good",
            location: "Compost Yard",
            recommendedCrops: ["All Crops"],
            ownership: "group",
            organic: true,
            sustainable: true
        },
        {
            id: 4,
            name: "Pesticide (Neem-based)",
            category: "Pesticide",
            quantity: 10,
            unit: "liters",
            batchNumber: "PST-2025-3456",
            expiryDate: "2026-08-15",
            status: "available",
            condition: "good",
            location: "Storage Room A",
            recommendedCrops: ["Vegetables", "Cotton"],
            ownership: "individual",
            organic: true,
            sustainable: true
        }
    ]
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeAvailabilityPage();
});

function initializeAvailabilityPage() {
    initializeDateSelector();
    initializeLocationSelector();
    initializeSummaryCards();
    initializeTabs();
    initializeSearch();
    initializeFilters();
    initializeViewToggle();
    initializeReservationModal();
    initializeNotifications();

    // Load initial data
    loadCropsData();
}

// ========================================
// DATE SELECTOR
// ========================================

function initializeDateSelector() {
    const dateBtns = document.querySelectorAll('.date-btn');
    dateBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            dateBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = this.dataset.period;
            console.log('Date period changed to:', period);
            // In production, this would filter data by date range
        });
    });
}

// ========================================
// LOCATION SELECTOR
// ========================================

function initializeLocationSelector() {
    const locationSelect = document.getElementById('locationSelect');
    if (locationSelect) {
        locationSelect.addEventListener('change', function () {
            console.log('Location changed to:', this.value);
            // In production, this would filter data by location
        });
    }
}

// ========================================
// SUMMARY CARDS
// ========================================

function initializeSummaryCards() {
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach(card => {
        card.addEventListener('click', function () {
            const filter = this.dataset.filter;
            console.log('Filter by:', filter);
            // In production, this would filter the current tab's data
        });
    });
}

// ========================================
// TABS
// ========================================

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabName = this.dataset.tab;

            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update active tab content
            tabContents.forEach(content => content.classList.add('hidden'));
            const activeTab = document.getElementById(`${tabName}Tab`);
            if (activeTab) {
                activeTab.classList.remove('hidden');
            }

            // Load data for the selected tab
            loadTabData(tabName);
        });
    });
}

function loadTabData(tabName) {
    switch (tabName) {
        case 'crops':
            loadCropsData();
            break;
        case 'equipment':
            loadEquipmentData();
            break;
        case 'inputs':
            loadInputsData();
            break;
        case 'group':
            loadGroupData();
            break;
        case 'platform':
            loadPlatformData();
            break;
    }
}

// ========================================
// LOAD DATA FUNCTIONS
// ========================================

function loadCropsData() {
    const cropsGrid = document.getElementById('cropsGrid');
    if (!cropsGrid) return;

    cropsGrid.innerHTML = '';

    // Apply filters
    const filteredCrops = filterResources(mockData.crops);

    if (filteredCrops.length === 0) {
        cropsGrid.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">No crops match the selected filters.</p>';
        return;
    }

    filteredCrops.forEach(crop => {
        const card = createCropCard(crop);
        cropsGrid.appendChild(card);
    });
}

function createCropCard(crop) {
    const card = document.createElement('div');
    card.className = 'resource-card';

    const statusClass = `status-${crop.status}`;

    // Determine stock status color
    let stockBadgeColor = '#10b981'; // green for in stock
    if (crop.stockStatus === 'Limited Stock') stockBadgeColor = '#f59e0b'; // orange
    if (crop.stockStatus === 'Reserved') stockBadgeColor = '#6b7280'; // gray

    // Seller badge color
    const sellerBadgeColor = crop.sellerType === 'Farmer Verified' ? '#10b981' : '#3b82f6';

    card.innerHTML = `
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; height: 100%;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
            
            <!-- Product Image -->
            <div style="position: relative; width: 100%; height: 200px; overflow: hidden; background: #f3f4f6;">
                <img src="${crop.image}" alt="${crop.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                ${crop.organic ? '<div style="position: absolute; top: 12px; left: 12px; background: rgba(16, 185, 129, 0.95); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">♻️ Organic</div>' : ''}
            </div>

            <!-- Card Content -->
            <div style="padding: 16px;">
                
                <!-- Product Name -->
                <h3 style="margin: 0 0 4px 0; font-size: 1.05rem; font-weight: 600; color: #1f2937; line-height: 1.3;">
                    ${crop.name}
                </h3>

                <!-- Category -->
                <p style="margin: 0 0 12px 0; font-size: 0.85rem; color: #6b7280;">
                    ${crop.category}
                </p>

                <!-- Rating -->
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 2px;">
                        <span style="color: #fbbf24; font-size: 1rem;">⭐</span>
                        <span style="font-weight: 600; color: #1f2937; font-size: 0.9rem;">${crop.rating}</span>
                    </div>
                    <span style="color: #9ca3af; font-size: 0.8rem;">(${crop.ratingCount})</span>
                </div>

                <!-- Price -->
                <div style="margin-bottom: 12px;">
                    <span style="font-size: 1.5rem; font-weight: 700; color: #059669;">₹${crop.price}</span>
                    <span style="font-size: 0.9rem; color: #6b7280;"> / ${crop.priceUnit}</span>
                </div>

                <!-- Stock Status -->
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${stockBadgeColor};"></div>
                    <span style="font-size: 0.85rem; color: #374151; font-weight: 500;">${crop.stockStatus}</span>
                </div>

                <!-- Delivery Info -->
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
                    <span style="font-size: 1rem;">🚚</span>
                    <span style="font-size: 0.85rem; color: #6b7280;">Delivery in ${crop.deliveryDays} days</span>
                </div>

                <!-- Seller Badge -->
                <div style="display: inline-flex; align-items: center; gap: 6px; background: ${sellerBadgeColor}15; padding: 6px 12px; border-radius: 20px; margin-bottom: 16px;">
                    <span style="font-size: 0.9rem;">${crop.sellerType === 'Farmer Verified' ? '🟢' : '🔵'}</span>
                    <span style="font-size: 0.8rem; color: ${sellerBadgeColor}; font-weight: 600;">${crop.sellerType}</span>
                </div>

                <!-- Action Buttons -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button onclick="addToCart(${crop.id}, 'crop')" style="background: white; border: 2px solid #10b981; color: #10b981; padding: 10px 16px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#10b981'">
                        🛒 Add to Cart
                    </button>
                    <button onclick="buyNow(${crop.id}, 'crop')" style="background: #10b981; border: none; color: white; padding: 10px 16px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;

    return card;
}

function loadEquipmentData() {
    const equipmentGrid = document.getElementById('equipmentGrid');
    if (!equipmentGrid) return;

    equipmentGrid.innerHTML = '';

    // Apply filters
    const filteredEquipment = filterResources(mockData.equipment);

    if (filteredEquipment.length === 0) {
        equipmentGrid.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">No equipment matches the selected filters.</p>';
        return;
    }

    filteredEquipment.forEach(equipment => {
        const card = createEquipmentCard(equipment);
        equipmentGrid.appendChild(card);
    });
}

function createEquipmentCard(equipment) {
    const card = document.createElement('div');
    card.className = 'resource-card';

    const statusClass = `status-${equipment.status}`;
    const conditionClass = `condition-${equipment.condition}`;

    card.innerHTML = `
        <div class="resource-header">
            <div class="resource-name-row">
                <h3 class="resource-name">${equipment.name}</h3>
                <span class="status-badge ${statusClass}">${equipment.status}</span>
            </div>
            <p class="resource-category">${equipment.category}</p>
            <p class="resource-quantity">₹${equipment.rentalRate} ${equipment.unit}</p>
        </div>
        <div class="resource-body">
            <div class="resource-details">
                <div class="detail-row">
                    <span class="detail-label">Utilization</span>
                    <span class="detail-value">${equipment.utilization}%</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Next Maintenance</span>
                    <span class="detail-value">${formatDate(equipment.nextMaintenance)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">${equipment.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ownership</span>
                    <span class="detail-value">${equipment.ownership}</span>
                </div>
                ${equipment.idleDays > 0 ? `
                <div class="detail-row">
                    <span class="detail-label">Idle Days</span>
                    <span class="detail-value" style="color: #f59e0b;">${equipment.idleDays} days</span>
                </div>
                ` : ''}
            </div>
            <div class="condition-indicator">
                <div class="condition-dot ${conditionClass}"></div>
                <span>Condition: ${equipment.condition}</span>
            </div>
            ${equipment.sustainable ? '<div class="sustainability-tags"><span class="sustainability-tag">🌱 Eco-friendly</span></div>' : ''}
            <div class="resource-actions">
                <button class="btn-view" onclick="viewResourceDetails(${equipment.id}, 'equipment')">View Schedule</button>
                <button class="btn-reserve" onclick="openReservationModal(${equipment.id}, 'equipment')">Reserve</button>
            </div>
        </div>
    `;

    return card;
}

function loadInputsData() {
    const inputsGrid = document.getElementById('inputsGrid');
    if (!inputsGrid) return;

    inputsGrid.innerHTML = '';

    // Apply filters
    const filteredInputs = filterResources(mockData.inputs);

    if (filteredInputs.length === 0) {
        inputsGrid.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">No inputs match the selected filters.</p>';
        return;
    }

    filteredInputs.forEach(input => {
        const card = createInputCard(input);
        inputsGrid.appendChild(card);
    });
}

function createInputCard(input) {
    const card = document.createElement('div');
    card.className = 'resource-card';

    const statusClass = `status-${input.status}`;
    const conditionClass = `condition-${input.condition}`;

    const sustainabilityTags = [];
    if (input.organic) sustainabilityTags.push('<span class="sustainability-tag">♻️ Organic</span>');
    if (input.sustainable) sustainabilityTags.push('<span class="sustainability-tag">🌱 Eco-friendly</span>');

    // Check if expiring soon
    const daysToExpiry = getDaysUntil(input.expiryDate);
    const expiryWarning = daysToExpiry < 30 ? `<span style="color: #ef4444;">Expires in ${daysToExpiry} days</span>` : formatDate(input.expiryDate);

    card.innerHTML = `
        <div class="resource-header">
            <div class="resource-name-row">
                <h3 class="resource-name">${input.name}</h3>
                <span class="status-badge ${statusClass}">${input.status}</span>
            </div>
            <p class="resource-category">${input.category}</p>
            <p class="resource-quantity">${input.quantity} ${input.unit}</p>
        </div>
        <div class="resource-body">
            <div class="resource-details">
                <div class="detail-row">
                    <span class="detail-label">Batch Number</span>
                    <span class="detail-value">${input.batchNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Expiry Date</span>
                    <span class="detail-value">${expiryWarning}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">${input.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Recommended For</span>
                    <span class="detail-value">${input.recommendedCrops.join(', ')}</span>
                </div>
            </div>
            <div class="condition-indicator">
                <div class="condition-dot ${conditionClass}"></div>
                <span>Storage: ${input.condition}</span>
            </div>
            ${sustainabilityTags.length > 0 ? `<div class="sustainability-tags">${sustainabilityTags.join('')}</div>` : ''}
            <div class="resource-actions">
                <button class="btn-view" onclick="viewResourceDetails(${input.id}, 'input')">View Details</button>
                <button class="btn-reserve" onclick="openReservationModal(${input.id}, 'input')">Reserve</button>
            </div>
        </div>
    `;

    return card;
}

function loadGroupData() {
    const groupGrid = document.getElementById('groupGrid');
    if (!groupGrid) return;

    groupGrid.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">Group resources will be displayed here. This includes shared equipment and collective inventory.</p>';
}

function loadPlatformData() {
    const platformGrid = document.getElementById('platformGrid');
    if (!platformGrid) return;

    platformGrid.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">Platform-owned assets will be displayed here. This includes platform equipment and resources available for rent.</p>';
}

// ========================================
// SEARCH
// ========================================

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            console.log('Search query:', query);
            // In production, this would filter the displayed resources
        });
    }
}

// ========================================
// FILTERS
// ========================================

let activeFilters = {
    status: ['available', 'reserved', 'unavailable'],
    condition: ['good', 'maintenance', 'poor'],
    ownership: ['individual', 'group', 'platform'],
    sustainability: []
};

function initializeFilters() {
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const filterCloseBtn = document.getElementById('filterCloseBtn');

    if (filterToggleBtn && filterSidebar) {
        filterToggleBtn.addEventListener('click', function () {
            filterSidebar.classList.toggle('hidden');
        });
    }

    // Close button
    if (filterCloseBtn && filterSidebar) {
        filterCloseBtn.addEventListener('click', function () {
            filterSidebar.classList.add('hidden');
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function () {
            const checkboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
            checkboxes.forEach(cb => {
                // Reset to default checked state
                if (cb.value === 'available' || cb.value === 'good' || cb.value === 'individual' || cb.value === 'group') {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });
            updateFiltersFromCheckboxes();
            applyFilters();
        });
    }

    // Add event listeners to all filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            updateFiltersFromCheckboxes();
            applyFilters();
            // Auto-close sidebar after applying filters
            setTimeout(() => {
                if (filterSidebar) {
                    filterSidebar.classList.add('hidden');
                }
            }, 300);
        });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function (event) {
        if (filterSidebar && !filterSidebar.classList.contains('hidden')) {
            const isClickInsideSidebar = filterSidebar.contains(event.target);
            const isClickOnToggleBtn = filterToggleBtn && filterToggleBtn.contains(event.target);

            if (!isClickInsideSidebar && !isClickOnToggleBtn) {
                filterSidebar.classList.add('hidden');
            }
        }
    });
}

function updateFiltersFromCheckboxes() {
    // Reset filters
    activeFilters = {
        status: [],
        condition: [],
        ownership: [],
        sustainability: []
    };

    // Get all checked checkboxes
    const statusCheckboxes = document.querySelectorAll('.filter-sidebar input[value="available"], .filter-sidebar input[value="reserved"], .filter-sidebar input[value="unavailable"]');
    statusCheckboxes.forEach(cb => {
        if (cb.checked) activeFilters.status.push(cb.value);
    });

    const conditionCheckboxes = document.querySelectorAll('.filter-sidebar input[value="good"], .filter-sidebar input[value="maintenance"], .filter-sidebar input[value="poor"]');
    conditionCheckboxes.forEach(cb => {
        if (cb.checked) activeFilters.condition.push(cb.value);
    });

    const ownershipCheckboxes = document.querySelectorAll('.filter-sidebar input[value="individual"], .filter-sidebar input[value="group"], .filter-sidebar input[value="platform"]');
    ownershipCheckboxes.forEach(cb => {
        if (cb.checked) activeFilters.ownership.push(cb.value);
    });

    const sustainabilityCheckboxes = document.querySelectorAll('.filter-sidebar input[value="organic"], .filter-sidebar input[value="eco"]');
    sustainabilityCheckboxes.forEach(cb => {
        if (cb.checked) activeFilters.sustainability.push(cb.value);
    });
}

function applyFilters() {
    // Get the active tab
    const activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab) return;

    const tabName = activeTab.dataset.tab;

    // Reload data with filters
    loadTabData(tabName);
}

function filterResources(resources) {
    return resources.filter(resource => {
        // Filter by status
        if (activeFilters.status.length > 0 && !activeFilters.status.includes(resource.status)) {
            return false;
        }

        // Filter by condition
        if (activeFilters.condition.length > 0 && !activeFilters.condition.includes(resource.condition)) {
            return false;
        }

        // Filter by ownership
        if (resource.ownership && activeFilters.ownership.length > 0 && !activeFilters.ownership.includes(resource.ownership)) {
            return false;
        }

        // Filter by sustainability
        if (activeFilters.sustainability.length > 0) {
            let hasSustainabilityTag = false;
            if (activeFilters.sustainability.includes('organic') && resource.organic) {
                hasSustainabilityTag = true;
            }
            if (activeFilters.sustainability.includes('eco') && resource.sustainable) {
                hasSustainabilityTag = true;
            }
            if (!hasSustainabilityTag) {
                return false;
            }
        }

        return true;
    });
}

// ========================================
// VIEW TOGGLE
// ========================================

let currentView = 'grid';

function initializeViewToggle() {
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            viewToggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const view = this.dataset.view;
            currentView = view;
            applyViewMode(view);
        });
    });
}

function applyViewMode(view) {
    const resourcesGrids = document.querySelectorAll('.resources-grid');
    resourcesGrids.forEach(grid => {
        if (view === 'list') {
            grid.style.gridTemplateColumns = '1fr';
        } else {
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
        }
    });
}

// ========================================
// RESERVATION MODAL
// ========================================

let currentReservationStep = 1;
let selectedResource = null;

function initializeReservationModal() {
    const modal = document.getElementById('reservationModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const prevBtn = document.getElementById('prevReservationBtn');
    const nextBtn = document.getElementById('nextReservationBtn');
    const confirmBtn = document.getElementById('confirmReservationBtn');

    if (modalClose) modalClose.addEventListener('click', closeReservationModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeReservationModal);
    if (prevBtn) prevBtn.addEventListener('click', previousReservationStep);
    if (nextBtn) nextBtn.addEventListener('click', nextReservationStep);
    if (confirmBtn) confirmBtn.addEventListener('click', confirmReservation);
}

function openReservationModal(resourceId, resourceType) {
    selectedResource = { id: resourceId, type: resourceType };
    const modal = document.getElementById('reservationModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        currentReservationStep = 1;
        showReservationStep(1);
        populateResourceSummary(resourceId, resourceType);
    }
}

function closeReservationModal() {
    const modal = document.getElementById('reservationModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        selectedResource = null;
    }
}

function showReservationStep(step) {
    const steps = document.querySelectorAll('.reservation-step');
    steps.forEach(s => s.classList.add('hidden'));

    const currentStep = document.getElementById(`reservationStep${step}`);
    if (currentStep) currentStep.classList.remove('hidden');

    const prevBtn = document.getElementById('prevReservationBtn');
    const nextBtn = document.getElementById('nextReservationBtn');
    const confirmBtn = document.getElementById('confirmReservationBtn');

    if (prevBtn) prevBtn.classList.toggle('hidden', step === 1);

    if (step === 4) {
        if (nextBtn) nextBtn.classList.add('hidden');
        if (confirmBtn) confirmBtn.classList.remove('hidden');
        updateConfirmationSummary();
    } else {
        if (nextBtn) nextBtn.classList.remove('hidden');
        if (confirmBtn) confirmBtn.classList.add('hidden');
    }
}

function previousReservationStep() {
    if (currentReservationStep > 1) {
        currentReservationStep--;
        showReservationStep(currentReservationStep);
    }
}

function nextReservationStep() {
    if (currentReservationStep < 4) {
        currentReservationStep++;
        showReservationStep(currentReservationStep);
    }
}

function populateResourceSummary(resourceId, resourceType) {
    const summary = document.getElementById('resourceSummary');
    if (!summary) return;

    let resource;
    if (resourceType === 'crop') {
        resource = mockData.crops.find(c => c.id === resourceId);
    } else if (resourceType === 'equipment') {
        resource = mockData.equipment.find(e => e.id === resourceId);
    } else if (resourceType === 'input') {
        resource = mockData.inputs.find(i => i.id === resourceId);
    }

    if (resource) {
        summary.innerHTML = `
            <h4>${resource.name}</h4>
            <p>${resourceType === 'crop' ? resource.variety : resource.category}</p>
        `;
    }
}

function updateConfirmationSummary() {
    if (!selectedResource) return;

    const confirmResource = document.getElementById('confirmResource');
    const confirmDuration = document.getElementById('confirmDuration');
    const confirmActivity = document.getElementById('confirmActivity');
    const confirmCost = document.getElementById('confirmCost');

    let resource;
    if (selectedResource.type === 'crop') {
        resource = mockData.crops.find(c => c.id === selectedResource.id);
    } else if (selectedResource.type === 'equipment') {
        resource = mockData.equipment.find(e => e.id === selectedResource.id);
    } else if (selectedResource.type === 'input') {
        resource = mockData.inputs.find(i => i.id === selectedResource.id);
    }

    if (confirmResource && resource) {
        confirmResource.textContent = resource.name;
    }

    const duration = document.getElementById('duration');
    if (confirmDuration && duration) {
        confirmDuration.textContent = duration.options[duration.selectedIndex].text;
    }

    const activity = document.querySelector('input[name="activity"]:checked');
    if (confirmActivity && activity) {
        confirmActivity.textContent = activity.nextElementSibling.textContent;
    }

    if (confirmCost && resource && selectedResource.type === 'equipment') {
        const days = parseInt(duration?.value || 1);
        const cost = resource.rentalRate * days;
        confirmCost.textContent = `₹${cost}`;
    }
}

function confirmReservation() {
    alert('Reservation confirmed! You will receive a confirmation email shortly.');
    closeReservationModal();
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function viewResourceDetails(resourceId, resourceType) {
    alert(`Viewing details for ${resourceType} ID: ${resourceId}\n\nThis would open a detailed view with full information, images, and history.`);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDaysUntil(dateString) {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getTrendIcon(trend) {
    switch (trend) {
        case 'rising': return '↑';
        case 'falling': return '↓';
        case 'stable': return '→';
        default: return '';
    }
}

// ========================================
// NOTIFICATIONS
// ========================================

function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function () {
            alert('Notifications:\n\n1. Low stock: NPK Fertilizer\n2. Seeds expiring soon\n3. Tractor maintenance due\n4. High demand for wheat');
        });
    }
}

// ========================================
// USER MENU
// ========================================

const userMenuBtn = document.getElementById('userMenuBtn');
if (userMenuBtn) {
    userMenuBtn.addEventListener('click', function () {
        alert('User Menu:\n\n- Profile Settings\n- Resource History\n- Documents\n- Logout');
    });
}
