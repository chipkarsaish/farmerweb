// ========================================
// MY ORDERS PAGE JAVASCRIPT
// ========================================

// Mock Data
const mockOrders = {
    amenities: [
        {
            id: 'AMN-001',
            itemName: 'Tractor Rental',
            category: 'Equipment',
            quantity: '3 days',
            amount: 1300,
            date: '15 Jan 2026',
            status: 'completed',
            paymentMode: 'Cash',
            module: '🧰',
            basePrice: 1500,
            discount: 150,
            carbonUsed: 50,
            rentalStart: '13 Jan 2026',
            rentalEnd: '15 Jan 2026',
            returnDue: '15 Jan 2026, 6:00 PM'
        },
        {
            id: 'AMN-002',
            itemName: 'Fertilizer (50kg)',
            category: 'Input',
            quantity: '50 kg',
            amount: 2400,
            date: '10 Jan 2026',
            status: 'in-progress',
            paymentMode: 'Produce',
            module: '🧰',
            basePrice: 2500,
            discount: 100,
            carbonUsed: 0
        },
        {
            id: 'AMN-003',
            itemName: 'Drip Irrigation Kit',
            category: 'Equipment',
            quantity: '1 set',
            amount: 5500,
            date: '5 Jan 2026',
            status: 'completed',
            paymentMode: 'Cash',
            module: '🧰',
            basePrice: 6000,
            discount: 500,
            carbonUsed: 0
        }
    ],
    crops: [
        {
            id: 'CRP-001',
            itemName: 'Rice (Grade A)',
            category: 'Crop Sale',
            quantity: '500 kg',
            amount: 15000,
            date: '12 Jan 2026',
            status: 'completed',
            paymentMode: 'Bank Transfer',
            module: '🌾',
            buyer: 'Buyer #1234',
            settlement: 'Completed'
        },
        {
            id: 'CRP-002',
            itemName: 'Wheat',
            category: 'Crop Sale',
            quantity: '300 kg',
            amount: 9000,
            date: '8 Jan 2026',
            status: 'in-progress',
            paymentMode: 'Cash',
            module: '🌾',
            buyer: 'Buyer #5678',
            settlement: 'Pending'
        }
    ],
    payments: [
        {
            id: 'PAY-001',
            itemName: 'Loan Disbursement',
            category: 'Loan',
            quantity: 'N/A',
            amount: 50000,
            date: '1 Jan 2026',
            status: 'completed',
            paymentMode: 'Bank Transfer',
            module: '💰',
            loanType: 'Crop Loan',
            repaymentDue: '1 Jul 2026'
        },
        {
            id: 'PAY-002',
            itemName: 'Loan Repayment',
            category: 'Repayment',
            quantity: 'Installment 1',
            amount: 5000,
            date: '15 Jan 2026',
            status: 'completed',
            paymentMode: 'Cash + Carbon Credits',
            module: '💰',
            carbonCreditsUsed: 500
        }
    ],
    carbon: [
        {
            id: 'CRB-001',
            itemName: 'Carbon Credits Earned',
            category: 'Earned',
            quantity: '150 credits',
            amount: 1500,
            date: '10 Jan 2026',
            status: 'completed',
            paymentMode: 'N/A',
            module: '🌱',
            conversionRate: '₹10/credit'
        },
        {
            id: 'CRB-002',
            itemName: 'Carbon Credits Sold',
            category: 'Sold',
            quantity: '50 credits',
            amount: 550,
            date: '14 Jan 2026',
            status: 'completed',
            paymentMode: 'Bank Transfer',
            module: '🌱',
            conversionRate: '₹11/credit'
        }
    ],
    group: [
        {
            id: 'GRP-001',
            itemName: 'Bulk Fertilizer Order',
            category: 'Group Purchase',
            quantity: '500 kg',
            amount: 3500,
            date: '5 Jan 2026',
            status: 'completed',
            paymentMode: 'Cash',
            module: '👥',
            groupName: 'Sunrise Farmers Cooperative',
            individualShare: '₹3,500 (10%)',
            totalOrder: '₹35,000'
        },
        {
            id: 'GRP-002',
            itemName: 'Shared Tractor Booking',
            category: 'Group Equipment',
            quantity: '2 days',
            amount: 800,
            date: '12 Jan 2026',
            status: 'in-progress',
            paymentMode: 'Cash',
            module: '👥',
            groupName: 'Green Valley Cooperative',
            individualShare: '₹800 (20%)',
            totalOrder: '₹4,000'
        }
    ]
};

// State
let currentTab = 'amenities';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadOrders(currentTab);
    initializeEventListeners();
});

// Initialize Tabs
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
}

// Switch Tab
function switchTab(tab) {
    currentTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-content`).classList.add('active');

    // Load orders for this tab
    loadOrders(tab);
}

// Load Orders
function loadOrders(tab) {
    const orders = mockOrders[tab] || [];
    const containerId = `${tab}Orders`;
    const container = document.getElementById(containerId);

    if (orders.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No orders found</p>';
        return;
    }

    container.innerHTML = orders.map(order => createOrderCard(order)).join('');

    // Add click listeners to view details buttons
    container.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.dataset.orderId;
            const order = findOrderById(orderId);
            if (order) {
                showOrderDetail(order);
            }
        });
    });
}

// Create Order Card
function createOrderCard(order) {
    const statusClass = order.status === 'completed' ? 'status-completed' :
        order.status === 'in-progress' ? 'status-in-progress' :
            'status-cancelled';

    const statusText = order.status === 'completed' ? '🟢 Completed' :
        order.status === 'in-progress' ? '🟡 In Progress' :
            '🔴 Cancelled';

    return `
        <div class="order-card">
            <div class="order-card-header">
                <div class="order-header-left">
                    <div class="order-id">${order.id}</div>
                    <div class="order-date">${order.date}</div>
                </div>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="order-details">
                <h3 class="order-item-name">${order.itemName}</h3>
                <div class="order-meta">
                    <div class="meta-row">
                        <span class="meta-label">Category:</span>
                        <span class="meta-value">${order.category}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Quantity:</span>
                        <span class="meta-value">${order.quantity}</span>
                    </div>
                </div>
                <div class="order-amount">₹${order.amount.toLocaleString()}</div>
            </div>
            <div class="order-extra">
                <div class="extra-item">
                    <span class="extra-icon">${order.module}</span>
                    <span>Module</span>
                </div>
                <div class="extra-item">
                    <span class="extra-icon">💳</span>
                    <span>${order.paymentMode}</span>
                </div>
            </div>
            <div class="order-actions">
                <button class="btn btn-outline btn-small view-details-btn" data-order-id="${order.id}">View Details</button>
                <button class="btn btn-outline btn-small">📄 Receipt</button>
            </div>
        </div>
    `;
}

// Find Order by ID
function findOrderById(orderId) {
    for (const tab in mockOrders) {
        const order = mockOrders[tab].find(o => o.id === orderId);
        if (order) return order;
    }
    return null;
}

// Show Order Detail
function showOrderDetail(order) {
    const modal = document.getElementById('orderDetailModal');

    // Populate modal with order data
    document.getElementById('modalItemName').textContent = order.itemName;
    document.getElementById('modalOrderId').textContent = order.id;
    document.getElementById('modalCategory').textContent = order.category;
    document.getElementById('modalQuantity').textContent = order.quantity;
    document.getElementById('modalDate').textContent = order.date;
    document.getElementById('modalPayment').textContent = order.paymentMode;

    // Status badge
    const statusBadge = document.getElementById('modalStatus');
    statusBadge.className = 'status-badge';
    if (order.status === 'completed') {
        statusBadge.classList.add('status-completed');
        statusBadge.textContent = '🟢 Completed';
    } else if (order.status === 'in-progress') {
        statusBadge.classList.add('status-in-progress');
        statusBadge.textContent = '🟡 In Progress';
    } else {
        statusBadge.classList.add('status-cancelled');
        statusBadge.textContent = '🔴 Cancelled';
    }

    // Price breakdown
    if (order.basePrice) {
        document.getElementById('modalBasePrice').textContent = `₹${order.basePrice}`;
        document.getElementById('modalDiscount').textContent = `-₹${order.discount || 0}`;
        document.getElementById('modalCarbonUsed').textContent = `-₹${order.carbonUsed || 0}`;
    }
    document.getElementById('modalTotal').textContent = `₹${order.amount}`;

    // Payment info
    document.getElementById('modalTxnId').textContent = `TXN-${order.date.replace(/\s/g, '')}-${order.id}`;
    document.getElementById('modalAmountPaid').textContent = `₹${order.amount}`;
    document.getElementById('modalPending').textContent = '₹0';

    // Show/hide rental specific section
    const rentalSpecific = document.getElementById('rentalSpecific');
    if (order.rentalStart) {
        rentalSpecific.classList.remove('hidden');
    } else {
        rentalSpecific.classList.add('hidden');
    }

    modal.classList.remove('hidden');
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Search
    document.getElementById('searchInput')?.addEventListener('input', handleSearch);

    // Filter
    document.getElementById('filterBtn')?.addEventListener('click', handleFilter);
    document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
    document.getElementById('clearFilters')?.addEventListener('click', clearFilters);

    // Modal close
    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.getElementById('modalOverlay')?.addEventListener('click', closeModal);

    // Modal actions
    document.getElementById('downloadReceiptBtn')?.addEventListener('click', handleDownloadReceipt);
    document.getElementById('reportIssueBtn')?.addEventListener('click', handleReportIssue);
    document.getElementById('contactSupportBtn')?.addEventListener('click', handleContactSupport);

    // Notification
    document.getElementById('notificationBtn')?.addEventListener('click', handleNotifications);

    // User menu
    document.getElementById('userMenuBtn')?.addEventListener('click', handleUserMenu);
}

// Handle Search
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const orders = mockOrders[currentTab] || [];

    if (!query) {
        loadOrders(currentTab);
        return;
    }

    const filtered = orders.filter(order =>
        order.itemName.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query) ||
        order.date.toLowerCase().includes(query)
    );

    const containerId = `${currentTab}Orders`;
    const container = document.getElementById(containerId);

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No orders found matching your search</p>';
        return;
    }

    container.innerHTML = filtered.map(order => createOrderCard(order)).join('');

    // Re-attach click listeners
    container.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.dataset.orderId;
            const order = findOrderById(orderId);
            if (order) {
                showOrderDetail(order);
            }
        });
    });
}

// Handle Filter
function handleFilter() {
    const filterPanel = document.getElementById('filterPanel');
    filterPanel.classList.toggle('hidden');
}

// Apply Filters
function applyFilters() {
    const statusCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    const selectedStatuses = [];

    statusCheckboxes.forEach(checkbox => {
        if (checkbox.checked && checkbox.value !== 'all') {
            selectedStatuses.push(checkbox.value);
        }
    });

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    let orders = mockOrders[currentTab] || [];

    // Filter by status
    if (selectedStatuses.length > 0) {
        orders = orders.filter(order => selectedStatuses.includes(order.status));
    }

    // Filter by date range
    if (startDate || endDate) {
        orders = orders.filter(order => {
            const orderDate = new Date(order.date);
            const start = startDate ? new Date(startDate) : new Date('2000-01-01');
            const end = endDate ? new Date(endDate) : new Date('2100-12-31');
            return orderDate >= start && orderDate <= end;
        });
    }

    // Display filtered orders
    const containerId = `${currentTab}Orders`;
    const container = document.getElementById(containerId);

    if (orders.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No orders found matching your filters</p>';
        return;
    }

    container.innerHTML = orders.map(order => createOrderCard(order)).join('');

    // Re-attach click listeners
    container.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.dataset.orderId;
            const order = findOrderById(orderId);
            if (order) {
                showOrderDetail(order);
            }
        });
    });

    // Close filter panel
    document.getElementById('filterPanel').classList.add('hidden');
}

// Clear Filters
function clearFilters() {
    // Reset checkboxes
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.value === 'all') {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });

    // Reset date inputs
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';

    // Reload orders
    loadOrders(currentTab);

    // Close filter panel
    document.getElementById('filterPanel').classList.add('hidden');
}

// Close Modal
function closeModal() {
    document.getElementById('orderDetailModal').classList.add('hidden');
}

// Handle Download Receipt
function handleDownloadReceipt() {
    alert('Receipt downloaded!\n\nThe receipt PDF has been saved to your downloads folder.');
}

// Handle Report Issue
function handleReportIssue() {
    alert('Report Issue:\n\nPlease describe the issue:\n- Damaged equipment\n- Wrong quantity\n- Payment issue\n- Other\n\nYou can also upload photos of the issue.');
}

// Handle Contact Support
function handleContactSupport() {
    alert('Contact Support:\n\n📞 Phone: 1800-XXX-XXXX\n📧 Email: support@farmerconnect.com\n💬 Chat: Available 9 AM - 6 PM\n\nA support representative will contact you within 24 hours.');
}

// Handle Notifications
function handleNotifications() {
    alert('Notifications:\n\n🔔 Rental return due tomorrow - Tractor\n💰 Payment due in 3 days - ₹5,000\n✅ Settlement completed - Rice sale');
}

// Handle User Menu
function handleUserMenu() {
    alert('User Menu:\n\n👤 Profile\n⚙️ Settings\n📊 My Activity\n🚪 Logout');
}
