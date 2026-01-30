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
        console.log("🔍 Fetching rental requests for farmer:", currentUser.uid);
        rentalsGrid.innerHTML = '<p style="text-align:center; color:#666; padding:40px;">Loading rental requests...</p>';

        // Query: Get rental requests where farmerId = current user AND status = approved OR pending
        const q = query(
            collection(db, "rental_requests"),
            where("farmerId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        // Filter for pending and approved only
        approvedRentals = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(rental => rental.status === 'approved' || rental.status === 'pending')
            .sort((a, b) => {
                // Sort: pending first, then approved
                if (a.status === 'pending' && b.status === 'approved') return -1;
                if (a.status === 'approved' && b.status === 'pending') return 1;
                // Then by date (newest first)
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

        console.log(`✅ Loaded ${approvedRentals.length} rental requests (pending + approved)`);

        if (approvedRentals.length === 0) {
            rentalsGrid.innerHTML = `
                <div style="text-align:center; padding:60px 20px;">
                    <div style="font-size:4rem; margin-bottom:20px;">📦</div>
                    <h3 style="color:#666; margin-bottom:10px;">No Rental Requests Yet</h3>
                    <p style="color:#999;">Your rental requests will appear here.</p>
                    <a href="amenities.html" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#4a7c2c; color:white; text-decoration:none; border-radius:8px;">Browse Amenities</a>
                </div>
            `;
            return;
        }

        renderRentals();
    } catch (error) {
        console.error("❌ Error fetching rental requests:", error);
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
    const startDate = new Date(rental.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const endDate = new Date(rental.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    // Calculate days
    const start = new Date(rental.startDate);
    const end = new Date(rental.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Status styling
    const isPending = rental.status === 'pending';
    const statusConfig = isPending ? {
        borderColor: '#ffc107',
        bgColor: '#fff3cd',
        textColor: '#856404',
        label: '🟡 Pending Approval',
        gradientStart: '#fffbf0',
        gradientEnd: '#fff8e1'
    } : {
        borderColor: '#4a7c2c',
        bgColor: '#d4edda',
        textColor: '#155724',
        label: '✅ Approved',
        gradientStart: '#f8f9fa',
        gradientEnd: '#e9ecef'
    };

    return `
        <div class="order-card" data-rental-id="${rental.id}" style="border-left: 4px solid ${statusConfig.borderColor}; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
            
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 4px 0; font-size: 1.1rem; color: #2c3e50; font-weight: 600;">${rental.itemName}</h3>
                    <p style="margin: 0; font-size: 0.85rem; color: #7f8c8d;">${rental.itemCategory}</p>
                </div>
                <span style="background: ${statusConfig.bgColor}; color: ${statusConfig.textColor}; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; white-space: nowrap;">
                    ${statusConfig.label}
                </span>
            </div>
            
            <!-- Rental Period - Highlighted -->
            <div style="background: linear-gradient(135deg, ${statusConfig.gradientStart} 0%, ${statusConfig.gradientEnd} 100%); padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                    <div style="flex: 1; text-align: center;">
                        <div style="font-size: 0.7rem; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Start</div>
                        <div style="font-size: 0.95rem; font-weight: 600; color: #2c3e50;">📅 ${startDate}</div>
                    </div>
                    <div style="color: #6c757d; font-size: 1.2rem;">→</div>
                    <div style="flex: 1; text-align: center;">
                        <div style="font-size: 0.7rem; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">End</div>
                        <div style="font-size: 0.95rem; font-weight: 600; color: #2c3e50;">📅 ${endDate}</div>
                    </div>
                    <div style="flex: 1; text-align: center; border-left: 2px solid #dee2e6; padding-left: 12px;">
                        <div style="font-size: 0.7rem; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Duration</div>
                        <div style="font-size: 0.95rem; font-weight: 600; color: ${statusConfig.borderColor};">⏱️ ${days} day${days > 1 ? 's' : ''}</div>
                    </div>
                </div>
            </div>
            
            <!-- Details Grid - Compact -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">💰</span>
                    <div>
                        <div style="font-size: 0.7rem; color: #6c757d;">Amount</div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: #2c3e50;">₹${rental.totalAmount?.toLocaleString()}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">${rental.deliveryOption === 'pickup' ? '🚶' : '🏠'}</span>
                    <div>
                        <div style="font-size: 0.7rem; color: #6c757d;">Delivery</div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: #2c3e50;">${rental.deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">📍</span>
                    <div style="overflow: hidden;">
                        <div style="font-size: 0.7rem; color: #6c757d;">Location</div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: #2c3e50; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${rental.usageLocation}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">💳</span>
                    <div>
                        <div style="font-size: 0.7rem; color: #6c757d;">Payment</div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: #2c3e50;">${formatPaymentMethod(rental.paymentMethod)}</div>
                    </div>
                </div>
            </div>
            
            ${isPending ? `
            <div style="background: #e7f3ff; padding: 10px 12px; border-radius: 6px; margin-bottom: 16px; border-left: 3px solid #2196F3;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1rem;">⏳</span>
                    <span style="font-size: 0.85rem; color: #0d47a1; font-weight: 500;">Waiting for admin approval...</span>
                </div>
            </div>
            ` : ''}
            
            ${rental.ownerName ? `
            <div style="background: #fff3cd; padding: 10px 12px; border-radius: 6px; margin-bottom: 16px; border-left: 3px solid #ffc107;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1rem;">👤</span>
                    <div>
                        <span style="font-size: 0.75rem; color: #856404; font-weight: 600;">Owner:</span>
                        <span style="font-size: 0.85rem; color: #856404; margin-left: 6px;">${rental.ownerName}</span>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <!-- Footer -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #e9ecef;">
                <div style="font-size: 0.75rem; color: #6c757d;">
                    ID: ${rental.id.substring(0, 8)}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="viewRentalDetails('${rental.id}')" style="background: white; border: 1px solid ${statusConfig.borderColor}; color: ${statusConfig.borderColor}; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.background='${statusConfig.borderColor}'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='${statusConfig.borderColor}'">
                        📄 Details
                    </button>
                    ${!isPending ? `
                    <button onclick="downloadReceipt('${rental.id}')" style="background: ${statusConfig.borderColor}; border: none; color: white; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                        ⬇️ Receipt
                    </button>
                    ` : ''}
                </div>
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
