// ========================================
// CARBON CREDITS PAGE JAVASCRIPT
// ========================================

// Mock Data
const carbonData = {
    totalCredits: 450,
    usedCredits: 150,
    availableCredits: 300,
    creditValue: 10, // ₹ per credit
    verifiedCredits: 400,
    pendingCredits: 50
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeCarbonPage();
});

function initializeCarbonPage() {
    updateSummaryCards();
    initializeActionButtons();
    initializeLearnToggle();
    initializeConversionModal();
    initializeNotifications();
}

// ========================================
// SUMMARY CARDS
// ========================================

function updateSummaryCards() {
    document.getElementById('totalCredits').textContent = carbonData.totalCredits;
    document.getElementById('totalValue').textContent = `₹${carbonData.totalCredits * carbonData.creditValue}`;
    document.getElementById('usedCredits').textContent = carbonData.usedCredits;
    document.getElementById('availableCredits').textContent = carbonData.availableCredits;
}

// ========================================
// ACTION BUTTONS
// ========================================

let currentAction = null;

function initializeActionButtons() {
    const useForDiscounts = document.getElementById('useForDiscounts');
    const sellCredits = document.getElementById('sellCredits');
    const useLoanRepayment = document.getElementById('useLoanRepayment');

    if (useForDiscounts) {
        useForDiscounts.addEventListener('click', function () {
            currentAction = 'discount';
            openConversionModal('Use for Discounts', 'Apply credits to get discounts on amenities, equipment, or inputs');
        });
    }

    if (sellCredits) {
        sellCredits.addEventListener('click', function () {
            currentAction = 'sell';
            openConversionModal('Sell Credits', 'Convert credits to cash at ₹10 per credit');
        });
    }

    if (useLoanRepayment) {
        useLoanRepayment.addEventListener('click', function () {
            currentAction = 'loan';
            openConversionModal('Use for Loan Repayment', 'Apply credits to reduce your loan dues');
        });
    }
}

// ========================================
// CONVERSION MODAL
// ========================================

function initializeConversionModal() {
    const modal = document.getElementById('conversionModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const creditsInput = document.getElementById('creditsInput');

    if (modalClose) modalClose.addEventListener('click', closeConversionModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeConversionModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeConversionModal);
    if (confirmBtn) confirmBtn.addEventListener('click', confirmAction);

    if (creditsInput) {
        creditsInput.addEventListener('input', updatePreview);
        creditsInput.max = carbonData.availableCredits;
    }
}

function openConversionModal(title, description) {
    const modal = document.getElementById('conversionModal');
    const modalTitle = document.getElementById('modalTitle');
    const actionSummary = document.getElementById('actionSummary');
    const creditsInput = document.getElementById('creditsInput');

    if (modal && modalTitle && actionSummary) {
        modalTitle.textContent = title;
        actionSummary.innerHTML = `<p style="font-size: 0.95rem; color: var(--text-secondary);">${description}</p>`;

        // Reset input
        if (creditsInput) {
            creditsInput.value = 100;
            creditsInput.max = carbonData.availableCredits;
        }

        updatePreview();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeConversionModal() {
    const modal = document.getElementById('conversionModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        currentAction = null;
    }
}

function updatePreview() {
    const creditsInput = document.getElementById('creditsInput');
    const previewValue = document.getElementById('previewValue');
    const remainingBalance = document.getElementById('remainingBalance');

    if (creditsInput && previewValue && remainingBalance) {
        const credits = parseInt(creditsInput.value) || 0;
        const value = credits * carbonData.creditValue;
        const remaining = carbonData.availableCredits - credits;

        previewValue.textContent = `₹${value}`;
        remainingBalance.textContent = `${remaining} credits`;
    }
}

function confirmAction() {
    const creditsInput = document.getElementById('creditsInput');
    const credits = parseInt(creditsInput.value) || 0;

    if (credits <= 0) {
        alert('Please enter a valid number of credits');
        return;
    }

    if (credits > carbonData.availableCredits) {
        alert(`You only have ${carbonData.availableCredits} credits available`);
        return;
    }

    let message = '';
    const value = credits * carbonData.creditValue;

    switch (currentAction) {
        case 'discount':
            message = `Success! ${credits} credits (₹${value}) applied as discount.\n\nYou can now use this discount on your next amenity rental or input purchase.`;
            break;
        case 'sell':
            message = `Success! ${credits} credits sold for ₹${value}.\n\nMoney will be credited to your wallet within 24 hours.`;
            break;
        case 'loan':
            message = `Success! ${credits} credits (₹${value}) applied to loan repayment.\n\nYour loan balance has been reduced.`;
            break;
    }

    // Update data
    carbonData.availableCredits -= credits;
    carbonData.usedCredits += credits;
    updateSummaryCards();

    alert(message);
    closeConversionModal();
}

// ========================================
// LEARN MORE TOGGLE
// ========================================

function initializeLearnToggle() {
    const learnToggle = document.getElementById('learnToggle');
    const learnContent = document.getElementById('learnContent');

    if (learnToggle && learnContent) {
        learnToggle.addEventListener('click', function () {
            learnContent.classList.toggle('hidden');
            learnToggle.classList.toggle('active');
        });
    }
}

// ========================================
// NOTIFICATIONS
// ========================================

function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function () {
            alert('Notifications:\n\n1. ✅ Credits Added: +50 credits\n2. 🔍 Verification Complete');
        });
    }
}

// ========================================
// USER MENU
// ========================================

const userMenuBtn = document.getElementById('userMenuBtn');
if (userMenuBtn) {
    userMenuBtn.addEventListener('click', function () {
        alert('User Menu:\n\n- Profile Settings\n- Carbon History\n- Documents\n- Logout');
    });
}
