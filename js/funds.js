// ========================================
// FUNDS PAGE JAVASCRIPT - Firebase Powered
// ========================================

import { db, auth } from "./firebase-config.js";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// State
let currentUser = null;
let financialData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log("🚀 Funds page loading...");

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

        // Set user initials
        document.getElementById("userInitials").textContent =
            user.displayName
                ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase()
                : "F";

        // Load financial data
        await loadFinancialData();

        // Initialize UI components
        initializeFundsPage();
    });
});

// ========================================
// FIREBASE DATA LOADING
// ========================================

async function loadFinancialData() {
    try {
        console.log("🔍 Loading financial data for user:", currentUser.uid);

        // Query fund_loan collection for this user's data
        const q = query(
            collection(db, "fund_loan"),
            where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("📭 No financial data found, using defaults");
            financialData = getDefaultFinancialData();
        } else {
            // Get the first document (assuming one record per user)
            const docData = snapshot.docs[0].data();
            financialData = docData;
            console.log("✅ Financial data loaded:", financialData);
        }

        // Update the UI with the data
        updateFinancialSnapshot();

    } catch (error) {
        console.error("❌ Error loading financial data:", error);
        financialData = getDefaultFinancialData();
        updateFinancialSnapshot();
    }
}

function getDefaultFinancialData() {
    return {
        creditLimit: 50000,
        activeLoans: 0,
        outstandingAmount: 0,
        eligibleSubsidies: 0,
        carbonCredits: 0,
        carbonValue: 0
    };
}

function updateFinancialSnapshot() {
    console.log("🎨 Updating financial snapshot UI");

    // Update Credit Limit
    const creditEl = document.querySelector('.card-credit .snapshot-value');
    if (creditEl) {
        creditEl.textContent = `₹${(financialData.creditLimit || 0).toLocaleString()}`;
    }

    // Update Active Loans
    const loansValueEl = document.querySelector('.card-loans .snapshot-value');
    const loansDetailEl = document.querySelector('.card-loans .snapshot-detail');
    if (loansValueEl) {
        const loanCount = financialData.activeLoans || 0;
        loansValueEl.textContent = `${loanCount} Loan${loanCount !== 1 ? 's' : ''}`;
    }
    if (loansDetailEl) {
        loansDetailEl.textContent = `₹${(financialData.outstandingAmount || 0).toLocaleString()} outstanding`;
    }

    // Update Eligible Subsidies
    const subsidiesEl = document.querySelector('.card-subsidies .snapshot-value');
    if (subsidiesEl) {
        const schemeCount = financialData.eligibleSubsidies || 0;
        subsidiesEl.textContent = `${schemeCount} Scheme${schemeCount !== 1 ? 's' : ''}`;
    }

    // Update Carbon Credits
    const carbonValueEl = document.querySelector('.card-carbon .snapshot-value');
    const carbonDetailEl = document.querySelector('.card-carbon .snapshot-detail');
    if (carbonValueEl) {
        carbonValueEl.textContent = `${financialData.carbonCredits || 0} Credits`;
    }
    if (carbonDetailEl) {
        carbonDetailEl.textContent = `= ₹${(financialData.carbonValue || 0).toLocaleString()}`;
    }

    console.log("✅ Financial snapshot updated");
}

function initializeFundsPage() {
    // Initialize all components
    initializePrimaryOptions();
    initializeLoanModal();
    initializeLoanSlider();
    initializeNotifications();
}

// ========================================
// PRIMARY OPTIONS NAVIGATION
// ========================================

function initializePrimaryOptions() {
    // Apply for Loan
    const applyLoanCard = document.getElementById('applyLoanCard');
    if (applyLoanCard) {
        applyLoanCard.addEventListener('click', function () {
            openLoanModal();
        });
    }

    // Government Schemes
    const schemesCard = document.getElementById('schemesCard');
    if (schemesCard) {
        schemesCard.addEventListener('click', function () {
            scrollToSection('schemesSection');
        });
    }

    // Group Funding
    const groupFundingCard = document.getElementById('groupFundingCard');
    if (groupFundingCard) {
        groupFundingCard.addEventListener('click', function () {
            scrollToSection('groupFundingSection');
        });
    }

    // Carbon Credits
    const carbonCreditsCard = document.getElementById('carbonCreditsCard');
    if (carbonCreditsCard) {
        carbonCreditsCard.addEventListener('click', function () {
            scrollToSection('carbonSection');
        });
    }

    // Loan Status
    const loanStatusCard = document.getElementById('loanStatusCard');
    if (loanStatusCard) {
        loanStatusCard.addEventListener('click', function () {
            scrollToSection('repaymentSection');
        });
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========================================
// LOAN APPLICATION MODAL
// ========================================

let currentStep = 1;
let selectedLoanType = null;

function initializeLoanModal() {
    const modal = document.getElementById('loanModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const submitLoanBtn = document.getElementById('submitLoanBtn');

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closeLoanModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeLoanModal);
    }

    // Navigation buttons
    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', previousStep);
    }
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', nextStep);
    }
    if (submitLoanBtn) {
        submitLoanBtn.addEventListener('click', submitLoanApplication);
    }

    // Loan type selection
    const loanTypeCards = document.querySelectorAll('.loan-type-card');
    loanTypeCards.forEach(card => {
        card.addEventListener('click', function () {
            // Remove selected class from all cards
            loanTypeCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');
            selectedLoanType = this.dataset.type;
        });
    });
}

function openLoanModal() {
    const modal = document.getElementById('loanModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        currentStep = 1;
        showStep(1);
    }
}

function closeLoanModal() {
    const modal = document.getElementById('loanModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        resetModal();
    }
}

function resetModal() {
    currentStep = 1;
    selectedLoanType = null;
    showStep(1);

    // Reset loan type selection
    const loanTypeCards = document.querySelectorAll('.loan-type-card');
    loanTypeCards.forEach(card => card.classList.remove('selected'));

    // Reset form
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.reset();
    }
}

function showStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.loan-step');
    steps.forEach(s => s.classList.add('hidden'));

    // Show current step
    const currentStepElement = document.getElementById(`step${step}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('hidden');
    }

    // Update buttons
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('submitLoanBtn');

    if (prevBtn) {
        prevBtn.classList.toggle('hidden', step === 1);
    }

    if (step === 3) {
        if (nextBtn) nextBtn.classList.add('hidden');
        if (submitBtn) submitBtn.classList.remove('hidden');
    } else {
        if (nextBtn) nextBtn.classList.remove('hidden');
        if (submitBtn) submitBtn.classList.add('hidden');
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function nextStep() {
    // Validation
    if (currentStep === 1 && !selectedLoanType) {
        alert('Please select a loan type');
        return;
    }

    if (currentStep === 2) {
        const purpose = document.getElementById('loanPurpose').value;
        if (!purpose) {
            alert('Please select a loan purpose');
            return;
        }
    }

    if (currentStep < 3) {
        currentStep++;
        showStep(currentStep);

        // Update summary on step 3
        if (currentStep === 3) {
            updateLoanSummary();
        }
    }
}

function updateLoanSummary() {
    const loanAmount = document.getElementById('loanAmount').value;
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryTotal = document.getElementById('summaryTotal');

    if (summaryAmount) {
        summaryAmount.textContent = parseInt(loanAmount).toLocaleString('en-IN');
    }

    // Calculate total with 6.5% interest for 1 year
    const principal = parseInt(loanAmount);
    const interest = principal * 0.065;
    const total = principal + interest;

    if (summaryTotal) {
        summaryTotal.textContent = Math.round(total).toLocaleString('en-IN');
    }
}

function submitLoanApplication() {
    // In a real application, this would submit to a backend
    alert('Loan application submitted successfully! You will receive a confirmation email shortly.');
    closeLoanModal();
}

// ========================================
// LOAN AMOUNT SLIDER
// ========================================

function initializeLoanSlider() {
    const loanSlider = document.getElementById('loanAmount');
    const loanAmountValue = document.getElementById('loanAmountValue');

    if (loanSlider && loanAmountValue) {
        loanSlider.addEventListener('input', function () {
            const value = parseInt(this.value);
            loanAmountValue.textContent = value.toLocaleString('en-IN');
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
            alert('Notifications:\n\n1. Loan EMI due on 15 Feb 2026\n2. New subsidy scheme available\n3. Carbon credits updated');
        });
    }
}

// ========================================
// CARBON CREDIT ACTIONS
// ========================================

// Carbon action buttons
document.addEventListener('click', function (e) {
    if (e.target.closest('.carbon-action-btn')) {
        const btn = e.target.closest('.carbon-action-btn');
        const actionText = btn.querySelector('.action-text').textContent;

        if (actionText.includes('Withdraw')) {
            alert('Withdraw to Bank: ₹4,500 will be transferred to your registered bank account within 2-3 business days.');
        } else if (actionText.includes('Discount')) {
            alert('Rental Discount: You can use your 450 carbon credits to get ₹4,500 discount on amenity rentals!');
        } else if (actionText.includes('Loan')) {
            alert('Pay Loan EMI: Use ₹4,500 carbon credits to reduce your next loan payment.');
        }
    }
});

// ========================================
// SCHEME APPLICATION
// ========================================

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-primary') && e.target.textContent === 'Apply Now') {
        const schemeCard = e.target.closest('.scheme-card');
        if (schemeCard) {
            const schemeName = schemeCard.querySelector('.scheme-name').textContent;
            alert(`Application started for ${schemeName}.\n\nRequired documents:\n- Aadhaar Card\n- Land Records\n- Bank Account\n\nYou will be redirected to the application portal.`);
        }
    }
});

// ========================================
// GROUP LOAN APPLICATION
// ========================================

document.addEventListener('click', function (e) {
    if (e.target.textContent === 'Apply for Group Loan') {
        alert('Group Loan Application\n\nYour cooperative: Pune Farmers Cooperative\nAvailable credit: ₹50,000\nInterest rate: 6.5% (2% discount)\n\nProceed with application?');
    }
});

// ========================================
// LOAN REPAYMENT
// ========================================

document.addEventListener('click', function (e) {
    if (e.target.textContent === 'Pay Now') {
        const loanCard = e.target.closest('.loan-card');
        if (loanCard) {
            const nextEMI = loanCard.querySelector('.detail-value:last-of-type').textContent;
            alert(`Payment Options:\n\n1. UPI / Bank Transfer: ${nextEMI}\n2. Crop Produce Adjustment\n3. Carbon Credits (₹4,500 available)\n\nSelect your preferred payment method.`);
        }
    }
});

// ========================================
// FINANCIAL LITERACY
// ========================================

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-outline') && e.target.classList.contains('btn-sm')) {
        const literacyCard = e.target.closest('.literacy-card');
        if (literacyCard) {
            const title = literacyCard.querySelector('.literacy-title').textContent;
            alert(`Opening article: ${title}\n\nThis would open a detailed educational resource about this topic.`);
        }
    }
});

// ========================================
// SUPPORT OPTIONS
// ========================================

document.addEventListener('click', function (e) {
    if (e.target.closest('.support-btn')) {
        const btn = e.target.closest('.support-btn');
        const text = btn.textContent.trim();

        if (text.includes('Chat')) {
            alert('Connecting you to a financial advisor...\n\nChat support will open in a new window.');
        } else if (text.includes('Call')) {
            alert('Call Support: 1800-XXX-XXXX\n\nAvailable 24/7 for financial assistance.');
        } else if (text.includes('Help Center')) {
            alert('Nearest Help Center:\n\nPune Agricultural Office\nAddress: 123 Main Road, Pune\nPhone: 020-XXXX-XXXX\nOpen: Mon-Sat, 9 AM - 5 PM');
        }
    }
});

// ========================================
// LOAN DETAILS
// ========================================

document.addEventListener('click', function (e) {
    if (e.target.textContent === 'View Details') {
        const loanCard = e.target.closest('.loan-card');
        if (loanCard) {
            const loanName = loanCard.querySelector('.loan-name').textContent;
            alert(`${loanName} - Full Details\n\nLoan ID: FML-2026-001\nDisbursed: 15 Nov 2025\nTenure: 12 months\nInterest Rate: 6.5% p.a.\nProcessing Fee: ₹0 (Waived)\n\nRepayment Schedule:\n- 15 Dec 2025: ₹5,000 (Paid)\n- 15 Jan 2026: ₹5,000 (Pending)\n- 15 Feb 2026: ₹5,000 (Upcoming)\n- 15 Mar 2026: ₹5,000 (Upcoming)`);
        }
    }
});

// ========================================
// USER MENU
// ========================================

const userMenuBtn = document.getElementById('userMenuBtn');
if (userMenuBtn) {
    userMenuBtn.addEventListener('click', function () {
        alert('User Menu:\n\n- Profile Settings\n- Financial History\n- Documents\n- Logout');
    });
}

// ========================================
// LOCATION SELECTOR
// ========================================

const locationSelect = document.getElementById('locationSelect');
if (locationSelect) {
    locationSelect.addEventListener('change', function () {
        const location = this.options[this.selectedIndex].text;
        console.log('Location changed to:', location);
        // In a real app, this would update available schemes and services
    });
}
