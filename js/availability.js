// ========================================
// AVAILABILITY PAGE JAVASCRIPT
// ========================================

// Mock Data
const mockData = {
    crops: [
        {
            id: 1,
            name: "Wheat",
            variety: "HD-2967",
            category: "Grain",
            quantity: 800,
            unit: "kg",
            quality: "A",
            harvestDate: "2026-01-10",
            shelfLife: 45,
            location: "Warehouse A",
            farmer: "Ramesh Patil",
            status: "available",
            condition: "good",
            priceTrend: "rising",
            demand: "high",
            sustainable: true,
            organic: true
        },
        {
            id: 2,
            name: "Rice",
            variety: "Basmati",
            category: "Grain",
            quantity: 650,
            unit: "kg",
            quality: "A",
            harvestDate: "2026-01-05",
            shelfLife: 60,
            location: "Warehouse B",
            farmer: "Suresh Kumar",
            status: "available",
            condition: "good",
            priceTrend: "stable",
            demand: "medium",
            sustainable: false,
            organic: false
        },
        {
            id: 3,
            name: "Tomatoes",
            variety: "Hybrid",
            category: "Vegetable",
            quantity: 500,
            unit: "kg",
            quality: "B",
            harvestDate: "2026-01-12",
            shelfLife: 7,
            location: "Cold Storage",
            farmer: "Anita Desai",
            status: "available",
            condition: "good",
            priceTrend: "falling",
            demand: "low",
            sustainable: true,
            organic: true
        },
        {
            id: 4,
            name: "Cotton",
            variety: "BT Cotton",
            category: "Cash Crop",
            quantity: 300,
            unit: "kg",
            quality: "A",
            harvestDate: "2025-12-28",
            shelfLife: 90,
            location: "Warehouse A",
            farmer: "Vijay Patil",
            status: "reserved",
            condition: "good",
            priceTrend: "rising",
            demand: "high",
            sustainable: false,
            organic: false
        },
        {
            id: 5,
            name: "Sugarcane",
            variety: "Co-86032",
            category: "Cash Crop",
            quantity: 200,
            unit: "kg",
            quality: "B",
            harvestDate: "2026-01-08",
            shelfLife: 14,
            location: "Field Storage",
            farmer: "Prakash Rao",
            status: "available",
            condition: "maintenance",
            priceTrend: "stable",
            demand: "medium",
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
    const conditionClass = `condition-${crop.condition}`;

    const sustainabilityTags = [];
    if (crop.organic) sustainabilityTags.push('<span class="sustainability-tag">♻️ Organic</span>');
    if (crop.sustainable) sustainabilityTags.push('<span class="sustainability-tag">🌱 Eco-friendly</span>');

    card.innerHTML = `
        <div class="resource-header">
            <div class="resource-name-row">
                <h3 class="resource-name">${crop.name}</h3>
                <span class="status-badge ${statusClass}">${crop.status}</span>
            </div>
            <p class="resource-category">${crop.variety} • ${crop.category}</p>
            <p class="resource-quantity">${crop.quantity} ${crop.unit}</p>
        </div>
        <div class="resource-body">
            <div class="resource-details">
                <div class="detail-row">
                    <span class="detail-label">Quality Grade</span>
                    <span class="detail-value">Grade ${crop.quality}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Harvest Date</span>
                    <span class="detail-value">${formatDate(crop.harvestDate)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Shelf Life</span>
                    <span class="detail-value">${crop.shelfLife} days</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">${crop.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Farmer</span>
                    <span class="detail-value">${crop.farmer}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Price Trend</span>
                    <span class="detail-value">${getTrendIcon(crop.priceTrend)} ${crop.priceTrend}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Demand</span>
                    <span class="detail-value">${crop.demand}</span>
                </div>
            </div>
            <div class="condition-indicator">
                <div class="condition-dot ${conditionClass}"></div>
                <span>Condition: ${crop.condition}</span>
            </div>
            ${sustainabilityTags.length > 0 ? `<div class="sustainability-tags">${sustainabilityTags.join('')}</div>` : ''}
            <div class="resource-actions">
                <button class="btn-view" onclick="viewResourceDetails(${crop.id}, 'crop')">View Details</button>
                <button class="btn-reserve" onclick="openReservationModal(${crop.id}, 'crop')">Reserve</button>
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
