// ===============================
// Admin Resources Page JavaScript
// Rental Requests Management
// ===============================

import { db } from "./firebase-config.js";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";

// DOM Elements
const requestsGrid = document.getElementById('requestsGrid');

// State
let currentUser = null;
let rentalRequests = [];

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
    // Check auth state
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (user) {
            console.log("🔐 Admin user logged in:", user.email);
            await fetchRentalRequests();
        } else {
            console.log("🔐 No user logged in");
            requestsGrid.innerHTML = '<p style="text-align:center; color:#666; padding:40px;">Please log in to view rental requests.</p>';
        }
    });
});

// ===============================
// Fetch Rental Requests
// ===============================
async function fetchRentalRequests() {
    try {
        console.log("🔍 Fetching rental requests from Firestore...");
        requestsGrid.innerHTML = '<p style="text-align:center; color:#666; padding:40px;">Loading rental requests...</p>';

        const querySnapshot = await getDocs(collection(db, "rental_requests"));

        rentalRequests = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`✅ Loaded ${rentalRequests.length} rental requests`);

        if (rentalRequests.length === 0) {
            requestsGrid.innerHTML = '<p style="text-align:center; color:#666; padding:40px;">No rental requests found.</p>';
            return;
        }

        renderRequests();
    } catch (error) {
        console.error("❌ Error fetching rental requests:", error);
        requestsGrid.innerHTML = `<p style="text-align:center; color:red; padding:40px;">Error loading requests: ${error.message}</p>`;
    }
}

// ===============================
// Render Requests
// ===============================
function renderRequests() {
    requestsGrid.innerHTML = rentalRequests.map(request => createRequestCard(request)).join('');
}

// ===============================
// Create Request Card
// ===============================
function createRequestCard(request) {
    const statusColors = {
        pending: { bg: '#fff3cd', text: '#856404', label: '🟡 Pending' },
        approved: { bg: '#d4edda', text: '#155724', label: '🟢 Approved' },
        rejected: { bg: '#f8d7da', text: '#721c24', label: '🔴 Rejected' }
    };

    const status = statusColors[request.status] || statusColors.pending;

    // Format dates
    const startDate = new Date(request.startDate).toLocaleDateString('en-IN');
    const endDate = new Date(request.endDate).toLocaleDateString('en-IN');

    // Calculate days
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return `
        <div class="resource-card" data-request-id="${request.id}">
            <div class="card-header">
                <div>
                    <h3>${request.farmerName || 'Unknown Farmer'}</h3>
                    <p style="font-size:0.85rem; color:#666; margin-top:5px;">${request.farmerEmail || ''}</p>
                </div>
                <span class="status-badge" style="background:${status.bg}; color:${status.text}; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:700;">
                    ${status.label}
                </span>
            </div>
            
            <div class="resource-info">
                <p><strong>Item:</strong> ${request.itemName}</p>
                <p><strong>Category:</strong> ${request.itemCategory}</p>
                <p><strong>Dates:</strong> ${startDate} → ${endDate} (${days} days)</p>
                <p><strong>Quantity:</strong> ${request.quantity}</p>
                <p><strong>Total Amount:</strong> ₹${request.totalAmount?.toLocaleString()}</p>
                <p><strong>Location:</strong> ${request.usageLocation}</p>
                <p><strong>Delivery:</strong> ${request.deliveryOption === 'pickup' ? '🚶 Self Pickup' : '🏠 Home Delivery'}</p>
                <p><strong>Payment:</strong> ${formatPaymentMethod(request.paymentMethod)}</p>
                ${request.messageToOwner ? `<p style="margin-top:10px; padding:10px; background:#f9f9f9; border-radius:8px;"><strong>Message:</strong> "${request.messageToOwner}"</p>` : ''}
                ${request.requestDiscount ? `<p style="color:#e67e22;"><strong>Discount Requested:</strong> ${request.discountReason || 'Yes'}</p>` : ''}
                ${request.yourPrice ? `<p style="color:#e67e22;"><strong>Offered Price:</strong> ₹${request.yourPrice.toLocaleString()}</p>` : ''}
            </div>
            
            ${request.status === 'pending' ? `
                <div class="btn-group">
                    <button class="approve-btn" onclick="handleApprove('${request.id}')">✅ Approve</button>
                    <button class="reject-btn" onclick="handleReject('${request.id}')">❌ Reject</button>
                </div>
            ` : `
                <div style="text-align:center; padding:10px; margin-top:15px; background:${status.bg}; color:${status.text}; border-radius:8px; font-weight:600;">
                    ${status.label}
                </div>
            `}
        </div>
    `;
}

// ===============================
// Helper Functions
// ===============================
function formatPaymentMethod(method) {
    const methods = {
        cash: '💵 Cash',
        online: '📱 Online',
        'after-return': '⏰ Pay After Return'
    };
    return methods[method] || method;
}

// ===============================
// Approve Request
// ===============================
window.handleApprove = async function (requestId) {
    if (!confirm('Are you sure you want to approve this rental request?')) {
        return;
    }

    try {
        console.log("✅ Approving request:", requestId);

        const requestRef = doc(db, "rental_requests", requestId);
        await updateDoc(requestRef, {
            status: 'approved',
            updatedAt: new Date().toISOString(),
            approvedBy: currentUser?.email || 'admin'
        });

        console.log("✅ Request approved successfully");
        alert('✅ Request approved successfully!');

        // Refresh data
        await fetchRentalRequests();
    } catch (error) {
        console.error("❌ Error approving request:", error);
        alert(`Failed to approve request: ${error.message}`);
    }
};

// ===============================
// Reject Request
// ===============================
window.handleReject = async function (requestId) {
    const reason = prompt('Please enter rejection reason (optional):');

    if (reason === null) {
        return; // User cancelled
    }

    try {
        console.log("❌ Rejecting request:", requestId);

        const requestRef = doc(db, "rental_requests", requestId);
        await updateDoc(requestRef, {
            status: 'rejected',
            updatedAt: new Date().toISOString(),
            rejectedBy: currentUser?.email || 'admin',
            rejectionReason: reason || 'No reason provided'
        });

        console.log("✅ Request rejected successfully");
        alert('✅ Request rejected successfully!');

        // Refresh data
        await fetchRentalRequests();
    } catch (error) {
        console.error("❌ Error rejecting request:", error);
        alert(`Failed to reject request: ${error.message}`);
    }
};
