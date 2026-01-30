// ===============================
// Amenities Page JavaScript
// Firebase Powered (FINAL)
// ===============================

import { db } from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";

// ===============================
// State
// ===============================
let amenitiesData = [];
let currentCategory = "all";
let currentFilters = {};
let displayedItems = 8;

// ===============================
// DOM
// ===============================
const categoryCards = document.querySelectorAll(".category-card");
const filterToggleBtn = document.getElementById("filterToggleBtn");
const filterPanel = document.getElementById("filterPanel");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const cancelFilterBtn = document.getElementById("cancelFilterBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const searchInput = document.getElementById("searchInput");
const amenitiesGrid = document.getElementById("amenitiesGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const incentiveClose = document.querySelector(".incentive-close");
const langBtns = document.querySelectorAll(".lang-btn");
const rentOutBtn = document.getElementById("rentOutBtn");

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
    setupEventListeners();
    loadUserData();
    await fetchAmenitiesFromFirebase();
    renderAmenities();
});

// ===============================
// Firebase Fetch
// ===============================
async function fetchAmenitiesFromFirebase() {
    try {
        console.log("🔍 Fetching rental listings from Firestore...");
        const snapshot = await getDocs(collection(db, "rental_listings"));

        amenitiesData = snapshot.docs.map(doc => {
            const data = doc.data();
            // Map rental_listings fields to amenities card fields
            return {
                id: doc.id,
                name: data.itemName,
                category: data.category,
                price: data.rentalRate,
                priceUnit: data.priceUnit,
                paymentOptions: data.paymentModes || [],
                crops: data.cropCompatibility?.join(", ") || "All Crops",
                rating: data.rating || 0,
                supplier: data.ownerName || "Unknown",
                availability: data.status === "active" ? "available" : data.status === "rented" ? "booked" : "limited",
                image: data.photos?.[0] || "../public/farmer.png",
                ...data // Include all other fields
            };
        });

        console.log("✅ Rental listings loaded:", amenitiesData.length);
        console.log("📦 Sample item:", amenitiesData[0]);
    } catch (error) {
        console.error("❌ Firestore fetch failed:", error);
        amenitiesGrid.innerHTML = "<p class='empty-msg'>Failed to load amenities</p>";
    }
}

// ===============================
// Event Listeners
// ===============================
function setupEventListeners() {

    categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            categoryCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            currentCategory = card.dataset.category;
            displayedItems = 8;
            renderAmenities();
        });
    });

    filterToggleBtn?.addEventListener("click", () => {
        filterPanel.classList.toggle("hidden");
    });

    applyFilterBtn?.addEventListener("click", () => {
        applyFilters();
        filterPanel.classList.add("hidden");
    });

    cancelFilterBtn?.addEventListener("click", () => {
        filterPanel.classList.add("hidden");
    });

    clearFiltersBtn?.addEventListener("click", clearAllFilters);

    searchInput?.addEventListener("input", debounce(renderAmenities, 300));

    loadMoreBtn?.addEventListener("click", () => {
        displayedItems += 8;
        renderAmenities();
    });

    incentiveClose?.addEventListener("click", () => {
        document.querySelector(".incentive-banner")?.remove();
    });

    langBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            langBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    rentOutBtn?.addEventListener("click", () => {
        window.location.href = "your-rented-items.html";
    });
}

// ===============================
// Render
// ===============================
function renderAmenities() {
    let data = [...amenitiesData];

    // Category
    if (currentCategory !== "all") {
        data = data.filter(i => i.category === currentCategory);
    }

    // Search
    const term = searchInput.value.trim().toLowerCase();
    if (term) {
        data = data.filter(i =>
            (i.name || "").toLowerCase().includes(term) ||
            (i.crops || "").toLowerCase().includes(term) ||
            (i.category || "").toLowerCase().includes(term)
        );
    }

    // Crop
    if (currentFilters.cropType) {
        data = data.filter(i =>
            (i.crops || "").toLowerCase().includes(currentFilters.cropType.toLowerCase())
        );
    }

    // Season
    if (currentFilters.season && currentFilters.season !== "all") {
        data = data.filter(i =>
            i.season === currentFilters.season || i.season === "all"
        );
    }

    // Price
    if (currentFilters.minPrice != null) {
        data = data.filter(i => i.price >= currentFilters.minPrice);
    }
    if (currentFilters.maxPrice != null) {
        data = data.filter(i => i.price <= currentFilters.maxPrice);
    }

    // Sorting (FIXED)
    if (currentFilters.sort === "price-low") {
        data.sort((a, b) => a.price - b.price);
    } else if (currentFilters.sort === "price-high") {
        data.sort((a, b) => b.price - a.price);
    } else if (currentFilters.sort === "rating") {
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    document.getElementById("itemCount").textContent = data.length;

    if (data.length === 0) {
        amenitiesGrid.innerHTML = "<p class='empty-msg'>No amenities found</p>";
        loadMoreBtn.style.display = "none";
        return;
    }

    const visibleItems = data.slice(0, displayedItems);
    amenitiesGrid.innerHTML = visibleItems.map(createAmenityCard).join("");

    loadMoreBtn.style.display = data.length > displayedItems ? "block" : "none";

    document.querySelectorAll(".btn-view-details")
        .forEach((btn, i) => btn.onclick = () => viewDetails(visibleItems[i]));

    document.querySelectorAll(".btn-rent-now")
        .forEach((btn, i) => btn.onclick = () => rentNow(visibleItems[i]));
}

// ===============================
// Card
// ===============================
function createAmenityCard(item) {
    const availabilityMap = {
        available: "🟢 Available",
        limited: "🔴 Limited",
        booked: "⚪ Booked"
    };

    const payments = (item.paymentOptions || []).map(p =>
        `<span class="payment-badge">${p === "cash" ? "💰 Cash" : "🌾 Produce"}</span>`
    ).join("");

    return `
    <div class="amenity-card" data-item='${JSON.stringify(item)}'>
        <div class="amenity-image-container">
            <img src="${item.image || "assets/placeholder.jpg"}" alt="${item.name}">
            <span class="availability-badge badge-${item.availability}">
                ${availabilityMap[item.availability] || "⚪ Unknown"}
            </span>
        </div>
        <div class="amenity-content">
            <span class="amenity-category">${item.category}</span>
            <h3>${item.name}</h3>
            <p>🌾 ${item.crops || "All Crops"}</p>
            <p>₹${item.price?.toLocaleString()} <small>${item.priceUnit || ""}</small></p>
            <div>${payments}</div>
            <div>⭐ ${item.rating || 0} • ${item.supplier || "Unknown"}</div>
            <button class="btn-view-details">View Details</button>
            <button class="btn-rent-now" onclick='openRentModal(${JSON.stringify(item)})'>Rent Now</button>
        </div>
    </div>`;
}

// ===============================
// Filters
// ===============================
function applyFilters() {
    currentFilters = {
        cropType: document.getElementById("cropTypeFilter").value,
        season: document.getElementById("seasonFilter").value,
        minPrice: parseInt(document.getElementById("minPrice").value) || null,
        maxPrice: parseInt(document.getElementById("maxPrice").value) || null,
        sort: document.getElementById("sortFilter").value
    };
    displayedItems = 8;
    renderAmenities();
}

function clearAllFilters() {
    document.querySelectorAll("#filterPanel input, #filterPanel select")
        .forEach(el => el.value = "");
    currentFilters = {};
    displayedItems = 8;
    renderAmenities();
}

// ===============================
// Actions
// ===============================
function viewDetails(item) {
    alert(`Viewing details for ${item.name}`);
}

function rentNow(item) {
    alert(`Renting ${item.name} for ₹${item.price}`);
}

// ===============================
// User
// ===============================
function loadUserData() {
    const user = JSON.parse(localStorage.getItem("farmerConnectUser"));
    if (user?.name) {
        document.getElementById("userInitials").textContent =
            user.name.split(" ").map(n => n[0]).join("").toUpperCase();
    }
}

// ===============================
// Utils
// ===============================
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ===============================
// Rent Modal Functionality
// ===============================
let currentRentItem = null;

// Modal Elements
const rentModal = document.getElementById('rentModal');
const closeRentModalBtn = document.getElementById('closeRentModal');
const cancelRentBtn = document.getElementById('cancelRent');
const sendRentRequestBtn = document.getElementById('sendRentRequest');

// Form Elements
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const quantityInput = document.getElementById('quantity');
const decreaseQtyBtn = document.getElementById('decreaseQty');
const increaseQtyBtn = document.getElementById('increaseQty');
const totalAmountSpan = document.getElementById('totalAmount');
const requestDiscountCheckbox = document.getElementById('requestDiscount');
const discountReasonSection = document.getElementById('discountReasonSection');
const agreeTermsCheckbox = document.getElementById('agreeTerms');

// Open Rent Modal
window.openRentModal = function (item) {
    currentRentItem = item;

    // Populate item summary
    document.getElementById('rentItemImage').src = item.image || '../public/farmer.png';
    document.getElementById('rentItemName').textContent = item.name;
    document.getElementById('rentItemCategory').textContent = item.category;
    document.getElementById('rentItemPrice').textContent = item.price?.toLocaleString() || '0';
    document.getElementById('rentItemUnit').textContent = item.priceUnit || 'per day';

    const availabilityMap = {
        available: '🟢 Available',
        limited: '🟡 Limited',
        booked: '🔴 Booked'
    };
    document.getElementById('rentItemAvailability').textContent = availabilityMap[item.availability] || '⚪ Unknown';

    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    startDateInput.value = today;
    endDateInput.min = today;

    // Reset form
    quantityInput.value = 1;
    document.getElementById('yourPrice').value = '';
    document.getElementById('messageToOwner').value = '';
    document.getElementById('usageLocation').value = '';
    requestDiscountCheckbox.checked = false;
    discountReasonSection.classList.add('hidden');
    agreeTermsCheckbox.checked = false;

    // Calculate initial total
    calculateTotal();

    // Show modal
    rentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Close Rent Modal
function closeRentModal() {
    rentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentRentItem = null;
}

closeRentModalBtn.addEventListener('click', closeRentModal);
cancelRentBtn.addEventListener('click', closeRentModal);

// Close on outside click
rentModal.addEventListener('click', (e) => {
    if (e.target === rentModal) {
        closeRentModal();
    }
});

// Quantity Controls
decreaseQtyBtn.addEventListener('click', () => {
    const currentQty = parseInt(quantityInput.value);
    if (currentQty > 1) {
        quantityInput.value = currentQty - 1;
        calculateTotal();
    }
});

increaseQtyBtn.addEventListener('click', () => {
    const currentQty = parseInt(quantityInput.value);
    quantityInput.value = currentQty + 1;
    calculateTotal();
});

// Calculate Total Amount
function calculateTotal() {
    if (!currentRentItem) return;

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const quantity = parseInt(quantityInput.value) || 1;
    const pricePerUnit = currentRentItem.price || 0;

    let days = 1;
    if (startDateInput.value && endDateInput.value && endDate >= startDate) {
        days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    }

    const total = days * quantity * pricePerUnit;
    totalAmountSpan.textContent = total.toLocaleString();
}

// Update total when dates change
startDateInput.addEventListener('change', () => {
    if (startDateInput.value) {
        endDateInput.min = startDateInput.value;
    }
    calculateTotal();
});

endDateInput.addEventListener('change', calculateTotal);

// Toggle Discount Reason Section
requestDiscountCheckbox.addEventListener('change', () => {
    if (requestDiscountCheckbox.checked) {
        discountReasonSection.classList.remove('hidden');
    } else {
        discountReasonSection.classList.add('hidden');
    }
});

// Send Rent Request
sendRentRequestBtn.addEventListener('click', async () => {
    // Validation
    if (!startDateInput.value || !endDateInput.value) {
        alert('⚠️ Please select start and end dates');
        return;
    }

    if (!document.getElementById('usageLocation').value.trim()) {
        alert('⚠️ Please enter usage location');
        return;
    }

    if (!agreeTermsCheckbox.checked) {
        alert('⚠️ Please agree to the terms');
        return;
    }

    // Get form data
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    const rentRequest = {
        itemId: currentRentItem.id,
        itemName: currentRentItem.name,
        itemCategory: currentRentItem.category,
        itemPrice: currentRentItem.price,
        priceUnit: currentRentItem.priceUnit,
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        quantity: parseInt(quantityInput.value),
        totalAmount: parseInt(totalAmountSpan.textContent.replace(/,/g, '')),
        yourPrice: document.getElementById('yourPrice').value ? parseInt(document.getElementById('yourPrice').value) : null,
        requestDiscount: requestDiscountCheckbox.checked,
        discountReason: requestDiscountCheckbox.checked ? document.getElementById('discountReason').value : null,
        messageToOwner: document.getElementById('messageToOwner').value.trim(),
        deliveryOption: deliveryOption,
        usageLocation: document.getElementById('usageLocation').value.trim(),
        paymentMethod: paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    console.log('📤 Sending rent request:', rentRequest);

    // TODO: Save to Firestore (rental_requests collection)
    // For now, show success message
    alert(`✅ Request sent to owner!\n\nYou will be notified when the owner responds.\n\nItem: ${rentRequest.itemName}\nDates: ${rentRequest.startDate} to ${rentRequest.endDate}\nTotal: ₹${rentRequest.totalAmount.toLocaleString()}`);

    closeRentModal();
});

