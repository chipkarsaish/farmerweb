// ===============================
// My Orders - Rental Approvals
// Fetch and Display Approved Rentals
// ===============================

import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";

// DOM Elements
const rentalsGrid = document.getElementById('rentalsOrders');

// State
let currentUser = null;
let approvedRentals = [];

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
    // Check auth state
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (user) {
            console.log("🔐 Farmer logged in:", user.email);
            await fetchApprovedRentals();
        } else {
            console.log("🔐 No user logged in");
            rentalsGrid.innerHTML = '<p style="text-align:center; color:#666; padding:40px;">Please log in to view your approved rentals.</p>';
        }
    });
});

// ===============================
// Fetch Approved Rentals
// ===============================
async function fetchApprovedRentals() {
    try {
        console.log("🔍 Fetching approved rentals for farmer:", currentUser.uid);
        rentalsGrid.innerHTML = '<p style="text-align:center; color:#666; padding:40px;">Loading approved rentals...</p>';

        // Query: Get rental requests where farmerId = current user AND status = approved
        const q = query(
            collection(db, "rental_requests"),
            where("farmerId", "==", currentUser.uid),
            where("status", "==", "approved")
        );

        const querySnapshot = await getDocs(q);

        approvedRentals = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`✅ Loaded ${approvedRentals.length} approved rentals`);

        if (approvedRentals.length === 0) {
            rentalsGrid.innerHTML = `
                <div style="text-align:center; padding:60px 20px;">
                    <div style="font-size:4rem; margin-bottom:20px;">📦</div>
                    <h3 style="color:#666; margin-bottom:10px;">No Approved Rentals Yet</h3>
                    <p style="color:#999;">Your approved rental requests will appear here.</p>
                    <a href="amenities.html" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#4a7c2c; color:white; text-decoration:none; border-radius:8px;">Browse Amenities</a>
                </div>
            `;
            return;
        }

        renderRentals();
    } catch (error) {
        console.error("❌ Error fetching approved rentals:", error);
        rentalsGrid.innerHTML = `<p style="text-align:center; color:red; padding:40px;">Error loading rentals: ${error.message}</p>`;
    }
}

// ===============================
// Render Rentals
// ===============================
function renderRentals() {
    rentalsGrid.innerHTML = approvedRentals.map(rental => createRentalCard(rental)).join('');
}

// ===============================
// Create Rental Card
// ===============================
function createRentalCard(rental) {
    // Format dates
    const startDate = new Date(rental.startDate).toLocaleDateString('en-IN');
    const endDate = new Date(rental.endDate).toLocaleDateString('en-IN');

    // Calculate days
    const start = new Date(rental.startDate);
    const end = new Date(rental.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Format created date
    const createdDate = new Date(rental.createdAt).toLocaleDateString('en-IN');

    return `
        <div class="order-card" data-rental-id="${rental.id}">
            <div class="order-header">
                <div class="order-title-section">
                    <h3 class="order-item-name">${rental.itemName}</h3>
                    <p class="order-category">${rental.itemCategory}</p>
                </div>
                <span class="status-badge status-approved" style="background:#d4edda; color:#155724; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:700;">
                    ✅ Approved
                </span>
            </div>
            
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-icon">📅</span>
                    <span class="detail-text"><strong>Rental Period:</strong> ${startDate} → ${endDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">⏱️</span>
                    <span class="detail-text"><strong>Duration:</strong> ${days} day${days > 1 ? 's' : ''}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">💰</span>
                    <span class="detail-text"><strong>Total Amount:</strong> ₹${rental.totalAmount?.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">📍</span>
                    <span class="detail-text"><strong>Location:</strong> ${rental.usageLocation}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">${rental.deliveryOption === 'pickup' ? '🚶' : '🏠'}</span>
                    <span class="detail-text"><strong>Delivery:</strong> ${rental.deliveryOption === 'pickup' ? 'Self Pickup' : 'Home Delivery'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">💳</span>
                    <span class="detail-text"><strong>Payment:</strong> ${formatPaymentMethod(rental.paymentMethod)}</span>
                </div>
                ${rental.ownerName ? `
                    <div class="detail-row">
                        <span class="detail-icon">👤</span>
                        <span class="detail-text"><strong>Owner:</strong> ${rental.ownerName}</span>
                    </div>
                ` : ''}
            </div>

            <div class="order-meta">
                <span class="order-id">Request ID: ${rental.id.substring(0, 8)}</span>
                <span class="order-date">Approved: ${createdDate}</span>
            </div>

            <div class="order-actions">
                <button class="btn btn-outline btn-small" onclick="viewRentalDetails('${rental.id}')">
                    📄 View Details
                </button>
                <button class="btn btn-outline btn-small" onclick="downloadReceipt('${rental.id}')">
                    ⬇️ Receipt
                </button>
            </div>
        </div>
    `;
}

// ===============================
// Helper Functions
// ===============================
function formatPaymentMethod(method) {
    const methods = {
        cash: 'Cash',
        online: 'Online',
        'after-return': 'Pay After Return'
    };
    return methods[method] || method;
}

// ===============================
// View Rental Details
// ===============================
window.viewRentalDetails = function (rentalId) {
    const rental = approvedRentals.find(r => r.id === rentalId);
    if (!rental) {
        alert('Rental not found');
        return;
    }

    // Format dates
    const startDate = new Date(rental.startDate).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const endDate = new Date(rental.endDate).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const details = `
📦 RENTAL DETAILS

Item: ${rental.itemName}
Category: ${rental.itemCategory}

📅 Rental Period:
Start: ${startDate}
End: ${endDate}

💰 Payment:
Total Amount: ₹${rental.totalAmount?.toLocaleString()}
Payment Method: ${formatPaymentMethod(rental.paymentMethod)}

📍 Delivery:
Location: ${rental.usageLocation}
Option: ${rental.deliveryOption === 'pickup' ? 'Self Pickup' : 'Home Delivery'}

${rental.messageToOwner ? `📝 Your Message:\n"${rental.messageToOwner}"\n\n` : ''}
${rental.ownerName ? `👤 Owner: ${rental.ownerName}\n` : ''}
${rental.approvedBy ? `✅ Approved By: ${rental.approvedBy}\n` : ''}

Request ID: ${rental.id}
    `.trim();

    alert(details);
};

// ===============================
// Download Receipt
// ===============================
window.downloadReceipt = function (rentalId) {
    const rental = approvedRentals.find(r => r.id === rentalId);
    if (!rental) {
        alert('Rental not found');
        return;
    }

    // Create receipt text
    const receipt = `
===========================================
        RENTAL RECEIPT
===========================================

Request ID: ${rental.id}
Date: ${new Date().toLocaleDateString('en-IN')}

-------------------------------------------
ITEM DETAILS
-------------------------------------------
Item: ${rental.itemName}
Category: ${rental.itemCategory}
Quantity: ${rental.quantity}

-------------------------------------------
RENTAL PERIOD
-------------------------------------------
Start Date: ${new Date(rental.startDate).toLocaleDateString('en-IN')}
End Date: ${new Date(rental.endDate).toLocaleDateString('en-IN')}

-------------------------------------------
PAYMENT DETAILS
-------------------------------------------
Total Amount: ₹${rental.totalAmount?.toLocaleString()}
Payment Method: ${formatPaymentMethod(rental.paymentMethod)}

-------------------------------------------
DELIVERY INFORMATION
-------------------------------------------
Location: ${rental.usageLocation}
Delivery Option: ${rental.deliveryOption === 'pickup' ? 'Self Pickup' : 'Home Delivery'}

-------------------------------------------
FARMER INFORMATION
-------------------------------------------
Name: ${rental.farmerName}
Email: ${rental.farmerEmail}

${rental.ownerName ? `
-------------------------------------------
OWNER INFORMATION
-------------------------------------------
Name: ${rental.ownerName}
` : ''}

-------------------------------------------
STATUS: APPROVED ✅
-------------------------------------------

Thank you for using AgriSahay!

===========================================
    `.trim();

    // Create blob and download
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rental-receipt-${rental.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("✅ Receipt downloaded");
};
