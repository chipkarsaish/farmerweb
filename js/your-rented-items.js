// ===============================
// Your Rented Items Page JavaScript
// Firebase Powered
// ===============================

import { db, auth } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ===============================
// State
// ===============================
let currentUser = null;
let rentalListings = [];
let currentView = "all";
let uploadedPhotos = [];
let uploadedDocs = [];

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

// Photo upload
const uploadPhotosBtn = document.getElementById("uploadPhotosBtn");
const photosInput = document.getElementById("photos");
const photoPreview = document.getElementById("photoPreview");

// Docs upload
const uploadDocsBtn = document.getElementById("uploadDocsBtn");
const docsInput = document.getElementById("verificationDocs");
const docsPreview = document.getElementById("docsPreview");

// Location
const useMyLocationBtn = document.getElementById("useMyLocationBtn");
const pickupLocationInput = document.getElementById("pickupLocation");

// Stats
const totalListingsEl = document.getElementById("totalListings");
const activeRentalsEl = document.getElementById("activeRentals");
const totalEarningsEl = document.getElementById("totalEarnings");
const avgRatingEl = document.getElementById("avgRating");

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
    loadUserData();
    setupEventListeners();
    await loadRentalListings();
    updateStats();
});

// ===============================
// User Data
// ===============================
function loadUserData() {
    const user = JSON.parse(localStorage.getItem("farmerConnectUser"));
    if (user) {
        currentUser = user;
        document.getElementById("userInitials").textContent =
            user.name.split(" ").map(n => n[0]).join("").toUpperCase();
    } else {
        // Redirect to login if no user
        window.location.href = "../index.html";
    }
}

// ===============================
// Event Listeners
// ===============================
function setupEventListeners() {
    // Modal open/close
    addItemBtn?.addEventListener("click", openModal);
    emptyAddBtn?.addEventListener("click", openModal);
    modalClose?.addEventListener("click", closeModal);
    cancelBtn?.addEventListener("click", closeModal);

    // Click outside modal to close
    itemModal?.addEventListener("click", (e) => {
        if (e.target === itemModal) closeModal();
    });

    // Form submission
    listingForm?.addEventListener("submit", handleFormSubmit);

    // Photo upload
    uploadPhotosBtn?.addEventListener("click", () => photosInput.click());
    photosInput?.addEventListener("change", handlePhotoUpload);

    // Docs upload
    uploadDocsBtn?.addEventListener("click", () => docsInput.click());
    docsInput?.addEventListener("change", handleDocsUpload);

    // Use my location
    useMyLocationBtn?.addEventListener("click", useMyFarmLocation);

    // View toggle
    viewBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            viewBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentView = btn.dataset.view;
            renderItems();
        });
    });

    // Date validation
    const startDate = document.getElementById("availabilityStart");
    const endDate = document.getElementById("availabilityEnd");

    startDate?.addEventListener("change", () => {
        endDate.min = startDate.value;
    });
}

// ===============================
// Modal Functions
// ===============================
function openModal() {
    itemModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("availabilityStart").min = today;
    document.getElementById("availabilityEnd").min = today;
}

function closeModal() {
    itemModal.classList.add("hidden");
    document.body.style.overflow = "auto";
    listingForm.reset();
    uploadedPhotos = [];
    uploadedDocs = [];
    photoPreview.innerHTML = "";
    docsPreview.innerHTML = "";
}

// ===============================
// Photo Upload
// ===============================
function handlePhotoUpload(e) {
    const files = Array.from(e.target.files);

    if (uploadedPhotos.length + files.length > 5) {
        alert("You can upload maximum 5 photos");
        return;
    }

    files.forEach(file => {
        if (file.type.startsWith("image/")) {
            uploadedPhotos.push(file);
            displayPhotoPreview(file);
        }
    });
}

function displayPhotoPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const div = document.createElement("div");
        div.className = "photo-preview-item";
        div.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button type="button" class="photo-remove" onclick="removePhoto(${uploadedPhotos.length - 1})">×</button>
        `;
        photoPreview.appendChild(div);
    };
    reader.readAsDataURL(file);
}

window.removePhoto = function (index) {
    uploadedPhotos.splice(index, 1);
    photoPreview.children[index].remove();
};

// ===============================
// Docs Upload
// ===============================
function handleDocsUpload(e) {
    const files = Array.from(e.target.files);

    files.forEach(file => {
        uploadedDocs.push(file);
        displayDocPreview(file);
    });
}

function displayDocPreview(file) {
    const div = document.createElement("div");
    div.className = "doc-item";
    div.innerHTML = `
        <span class="doc-icon">📄</span>
        <span class="doc-name">${file.name}</span>
        <button type="button" class="doc-remove" onclick="removeDoc(${uploadedDocs.length - 1})">×</button>
    `;
    docsPreview.appendChild(div);
}

window.removeDoc = function (index) {
    uploadedDocs.splice(index, 1);
    docsPreview.children[index].remove();
};

// ===============================
// Location Auto-fill
// ===============================
function useMyFarmLocation() {
    if (currentUser && currentUser.farmLocation) {
        pickupLocationInput.value = currentUser.farmLocation;
    } else {
        alert("Farm location not found in your profile");
    }
}

// ===============================
// Form Submission
// ===============================
async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Listing Item...";

    try {
        // Get form data
        const formData = getFormData();

        // Upload photos to Firebase Storage
        const photoUrls = await uploadPhotosToStorage(uploadedPhotos);
        formData.photos = photoUrls;

        // Upload verification docs
        const docUrls = await uploadPhotosToStorage(uploadedDocs, "verification_docs");
        formData.verificationDocs = docUrls;

        // Add to Firestore
        await addDoc(collection(db, "rental_listings"), {
            ...formData,
            ownerId: currentUser.uid,
            ownerName: currentUser.name,
            createdAt: new Date(),
            status: "active",
            verified: docUrls.length > 0,
            rating: 0,
            totalRentals: 0
        });

        alert("Item listed successfully!");
        closeModal();
        await loadRentalListings();
        updateStats();

    } catch (error) {
        console.error("Error listing item:", error);
        alert("Failed to list item. Please try again.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "List Item for Rent";
    }
}

// ===============================
// Get Form Data
// ===============================
function getFormData() {
    // Get selected crops
    const crops = Array.from(document.querySelectorAll('input[name="crops"]:checked'))
        .map(cb => cb.value);

    // Get payment modes
    const paymentModes = Array.from(document.querySelectorAll('input[name="payment"]:checked'))
        .map(cb => cb.value);

    // Get ownership type
    const ownershipType = document.querySelector('input[name="ownershipType"]:checked').value;

    return {
        itemName: document.getElementById("itemName").value,
        category: document.getElementById("category").value,
        season: document.getElementById("season").value,
        description: document.getElementById("description").value,
        cropCompatibility: crops,
        rentalRate: parseFloat(document.getElementById("rentalRate").value),
        priceUnit: document.getElementById("priceUnit").value,
        paymentModes: paymentModes,
        securityDeposit: parseFloat(document.getElementById("securityDeposit").value) || 0,
        condition: document.getElementById("condition").value,
        pickupLocation: document.getElementById("pickupLocation").value,
        availabilityStart: new Date(document.getElementById("availabilityStart").value),
        availabilityEnd: new Date(document.getElementById("availabilityEnd").value),
        ownershipType: ownershipType
    };
}

// ===============================
// Upload to Firebase Storage
// ===============================
async function uploadPhotosToStorage(files, folder = "rental_photos") {
    const storage = getStorage();
    const urls = [];

    for (const file of files) {
        const timestamp = Date.now();
        const fileName = `${folder}/${currentUser.uid}_${timestamp}_${file.name}`;
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
    }

    return urls;
}

// ===============================
// Load Rental Listings
// ===============================
async function loadRentalListings() {
    try {
        const q = query(
            collection(db, "rental_listings"),
            where("ownerId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);
        rentalListings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("✅ Loaded listings:", rentalListings.length);
        renderItems();

    } catch (error) {
        console.error("❌ Error loading listings:", error);
    }
}

// ===============================
// Render Items
// ===============================
function renderItems() {
    let filteredItems = rentalListings;

    // Filter by view
    if (currentView !== "all") {
        filteredItems = rentalListings.filter(item => item.status === currentView);
    }

    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");
    itemsGrid.innerHTML = filteredItems.map(createItemCard).join("");
}

// ===============================
// Create Item Card
// ===============================
function createItemCard(item) {
    const statusBadge = {
        active: "🟢 Active",
        rented: "🔵 Rented Out",
        inactive: "⚪ Inactive"
    };

    const photoUrl = item.photos && item.photos.length > 0
        ? item.photos[0]
        : "../public/farmer.png";

    return `
        <div class="amenity-card">
            <div class="amenity-image-container">
                <img src="${photoUrl}" alt="${item.itemName}">
                <span class="availability-badge badge-${item.status}">
                    ${statusBadge[item.status] || "⚪ Unknown"}
                </span>
                ${item.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
            </div>
            <div class="amenity-content">
                <span class="amenity-category">${item.category}</span>
                <h3>${item.itemName}</h3>
                <p>📍 ${item.pickupLocation}</p>
                <p class="amenity-price">₹${item.rentalRate.toLocaleString()} <small>/ ${item.priceUnit}</small></p>
                <div class="item-stats">
                    <span>⭐ ${item.rating || 0}</span>
                    <span>📦 ${item.totalRentals || 0} rentals</span>
                </div>
                <div class="amenity-actions">
                    <button class="btn-view-details" onclick="viewItemDetails('${item.id}')">View Details</button>
                    <button class="btn-edit" onclick="editItem('${item.id}')">Edit</button>
                </div>
            </div>
        </div>
    `;
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

// ===============================
// Update Stats
// ===============================
function updateStats() {
    totalListingsEl.textContent = rentalListings.length;

    const activeRentals = rentalListings.filter(item => item.status === "rented").length;
    activeRentalsEl.textContent = activeRentals;

    const totalEarnings = rentalListings.reduce((sum, item) => {
        return sum + ((item.totalRentals || 0) * item.rentalRate);
    }, 0);
    totalEarningsEl.textContent = totalEarnings.toLocaleString();

    const avgRating = rentalListings.length > 0
        ? (rentalListings.reduce((sum, item) => sum + (item.rating || 0), 0) / rentalListings.length).toFixed(1)
        : "0.0";
    avgRatingEl.textContent = avgRating;
}
