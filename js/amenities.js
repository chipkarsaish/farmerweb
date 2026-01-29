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
        const snapshot = await getDocs(collection(db, "amenities"));

        amenitiesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("✅ Amenities loaded:", amenitiesData.length);
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
    if (currentFilters.minPrice !== null) {
        data = data.filter(i => i.price >= currentFilters.minPrice);
    }
    if (currentFilters.maxPrice !== null) {
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
    <div class="amenity-card">
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
            <button class="btn-rent-now">Rent Now</button>
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
