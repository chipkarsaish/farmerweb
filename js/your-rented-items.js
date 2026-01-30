// ===============================
// Your Rented Items Page JavaScript
// Firebase Powered (FINAL FIXED)
// ===============================

import { db, auth } from "./firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    doc,
    getDoc
} from "firebase/firestore";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";

// ===============================
// State
// ===============================
let currentUser = null;
let rentalListings = [];
let currentView = "all";

// ===============================
// DOM Elements
// ===============================
const addItemBtn = document.getElementById("addItemBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");
const itemModal = document.getElementById("itemModal");
const modalClose = document.getElementById("modalClose");
const cancelBtn = document.getElementById("cancelBtn");
const listingForm = document.getElementById("listingForm");
const itemsGrid = document.getElementById("itemsGrid");
const emptyState = document.getElementById("emptyState");
const viewBtns = document.querySelectorAll(".view-btn");

// Location
const useMyLocationBtn = document.getElementById("useMyLocationBtn");
const pickupLocationInput = document.getElementById("pickupLocation");

// Stats
const totalListingsEl = document.getElementById("totalListings");
const activeRentalsEl = document.getElementById("activeRentals");
const totalEarningsEl = document.getElementById("totalEarnings");
const avgRatingEl = document.getElementById("avgRating");

// ===============================
// Init (AUTH SAFE)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Page loaded, waiting for auth...");

    onAuthStateChanged(auth, async (user) => {
        console.log("🔐 Auth state changed:", user ? "User logged in" : "No user");

        if (!user) {
            console.warn("⚠️ No user authenticated, redirecting to login...");
            window.location.href = "../index.html";
            return;
        }

        currentUser = user;
        console.log("✅ User authenticated:", {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
        });

        // If displayName is not set, fetch from Firestore (for users registered before the fix)
        if (!user.displayName) {
            console.log("🔍 Fetching user name from Firestore...");
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Attach the name to currentUser for use in the app
                    currentUser.displayName = userData.name || "Farmer";
                    console.log("✅ Fetched name from Firestore:", currentUser.displayName);
                }
            } catch (error) {
                console.error("❌ Error fetching user data from Firestore:", error);
            }
        }

        document.getElementById("userInitials").textContent =
            currentUser.displayName
                ? currentUser.displayName.split(" ").map(n => n[0]).join("").toUpperCase()
                : "F";

        setupEventListeners();
        await loadRentalListings();
        updateStats();
    });
});

// ===============================
// Event Listeners
// ===============================
function setupEventListeners() {

    addItemBtn?.addEventListener("click", openModal);
    emptyAddBtn?.addEventListener("click", openModal);
    modalClose?.addEventListener("click", closeModal);
    cancelBtn?.addEventListener("click", closeModal);

    itemModal?.addEventListener("click", (e) => {
        if (e.target === itemModal) closeModal();
    });

    listingForm?.addEventListener("submit", handleFormSubmit);

    useMyLocationBtn?.addEventListener("click", () => {
        if (pickupLocationInput) pickupLocationInput.value = "My Farm Location";
    });

    viewBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            viewBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentView = btn.dataset.view;
            renderItems();
        });
    });

    const startDate = document.getElementById("availabilityStart");
    const endDate = document.getElementById("availabilityEnd");

    startDate?.addEventListener("change", () => {
        endDate.min = startDate.value;
    });
}

// ===============================
// Modal
// ===============================
function openModal() {
    itemModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    const today = new Date().toISOString().split("T")[0];
    document.getElementById("availabilityStart").min = today;
    document.getElementById("availabilityEnd").min = today;
}

function closeModal() {
    itemModal.classList.add("hidden");
    document.body.style.overflow = "auto";
    listingForm.reset();
}

// ===============================
// Form Submit
// ===============================
async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Listing Item...";

    try {
        const formData = getFormData();

        await addDoc(collection(db, "rental_listings"), {
            ...formData,

            ownerId: currentUser.uid,
            ownerName: currentUser.displayName || "Farmer",
            photos: [],
            verificationDocs: [],
            status: "active",
            verified: false,
            rating: 0,
            totalRentals: 0,
            createdAt: serverTimestamp()
        });

        alert("Item listed successfully!");
        closeModal();
        await loadRentalListings();
        updateStats();

    } catch (error) {
        console.error("Error listing item:", error);
        alert("Failed to list item.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "List Item for Rent";
    }
}

// ===============================
// Get Form Data
// ===============================
function getFormData() {

    const crops = Array.from(
        document.querySelectorAll('input[name="crops"]:checked')
    ).map(cb => cb.value);

    const paymentModes = Array.from(
        document.querySelectorAll('input[name="payment"]:checked')
    ).map(cb => cb.value);

    const ownershipType =
        document.querySelector('input[name="ownershipType"]:checked')?.value || "";

    return {
        itemName: document.getElementById("itemName").value,
        category: document.getElementById("category").value,
        season: document.getElementById("season").value,
        description: document.getElementById("description").value,
        cropCompatibility: crops,
        rentalRate: Number(document.getElementById("rentalRate").value),
        priceUnit: document.getElementById("priceUnit").value,
        paymentModes,
        securityDeposit: Number(document.getElementById("securityDeposit").value) || 0,
        condition: document.getElementById("condition").value,
        pickupLocation: document.getElementById("pickupLocation").value,
        availabilityStart: new Date(document.getElementById("availabilityStart").value),
        availabilityEnd: new Date(document.getElementById("availabilityEnd").value),
        ownershipType
    };
}

// ===============================
// Load Listings
// ===============================
async function loadRentalListings() {
    try {
        console.log("🔍 Loading rental listings...");
        console.log("👤 Current user:", currentUser);
        console.log("🆔 User UID:", currentUser?.uid);

        const q = query(
            collection(db, "rental_listings"),
            where("ownerId", "==", currentUser.uid)
        );

        console.log("📊 Querying rental_listings where ownerId ==", currentUser.uid);

        const snapshot = await getDocs(q);

        console.log("📦 Documents found:", snapshot.docs.length);

        rentalListings = snapshot.docs.map(doc => {
            const data = { id: doc.id, ...doc.data() };
            console.log("📄 Item:", data);
            return data;
        });

        console.log("✅ Total rental listings loaded:", rentalListings.length);
        renderItems();

    } catch (error) {
        console.error("❌ Error loading listings:", error);
        console.error("Error details:", error.message);
    }
}

// ===============================
// Render
// ===============================
function renderItems() {
    console.log("🎨 Rendering items...");
    console.log("📋 Total items:", rentalListings.length);
    console.log("🔍 Current view filter:", currentView);

    let items = rentalListings;

    if (currentView !== "all") {
        items = items.filter(item => item.status === currentView);
        console.log(`🔎 Filtered to ${currentView}:`, items.length, "items");
    }

    if (items.length === 0) {
        console.log("📭 No items to display, showing empty state");
        itemsGrid.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    console.log("✅ Rendering", items.length, "cards");
    emptyState.classList.add("hidden");
    itemsGrid.innerHTML = items.map(createItemCard).join("");
}

// ===============================
// Card
// ===============================
function createItemCard(item) {
    console.log("🎨 Rendering card with new format:", item.itemName);

    const statusMap = {
        active: "🟢 Available",
        rented: "🔵 Rented Out",
        inactive: "⚪ Inactive"
    };

    // Format payment modes
    const payments = (item.paymentModes || []).map(p =>
        `<span class="payment-badge">${p === "cash" ? "💰 Cash" : "🌾 Produce"}</span>`
    ).join("");

    // Format crop compatibility
    const crops = item.cropCompatibility && item.cropCompatibility.length > 0
        ? item.cropCompatibility.join(", ")
        : "All Crops";

    return `
    <div class="amenity-card">
      <div class="amenity-image-container">
        <img src="../public/farmer.png" alt="${item.itemName}">
        <span class="availability-badge badge-${item.status}">
          ${statusMap[item.status]}
        </span>
        ${item.verified ? `<span class="verified-badge">✓ Verified</span>` : ""}
      </div>
      <div class="amenity-content">
        <span class="amenity-category">${item.category}</span>
        <h3>${item.itemName}</h3>
        <p>🌾 ${crops}</p>
        <p>₹${item.rentalRate.toLocaleString()} <small>${item.priceUnit}</small></p>
        <div>${payments}</div>
        <div>⭐ ${item.rating || 0} • ${item.ownerName || "You"}</div>
        <button class="btn-view-details" onclick="viewItemDetails('${item.id}')">View Details</button>
        <button class="btn-rent-now" onclick="editItem('${item.id}')">Edit</button>
      </div>
    </div>
  `;
}

// ===============================
// Stats
// ===============================
function updateStats() {

    totalListingsEl.textContent = rentalListings.length;

    const activeCount = rentalListings.filter(i => i.status === "rented").length;
    activeRentalsEl.textContent = activeCount;

    const earnings = rentalListings.reduce(
        (sum, i) => sum + (i.totalRentals * i.rentalRate),
        0
    );
    totalEarningsEl.textContent = earnings.toLocaleString();

    const avg =
        rentalListings.length > 0
            ? (
                rentalListings.reduce((s, i) => s + i.rating, 0) /
                rentalListings.length
            ).toFixed(1)
            : "0.0";

    avgRatingEl.textContent = avg;
}

// ===============================
// Item Actions
// ===============================
window.viewItemDetails = function (itemId) {
    const item = rentalListings.find(i => i.id === itemId);
    if (item) {
        alert(`Item Details:\n\n${JSON.stringify(item, null, 2)}`);
        // TODO: Create a detailed view modal
    }
};

window.editItem = function (itemId) {
    alert(`Edit functionality coming soon for item: ${itemId}`);
    // TODO: Populate modal with item data for editing
};
