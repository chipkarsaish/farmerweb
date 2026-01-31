// ========================================
// SELLER ONBOARDING - STATE MANAGEMENT
// ========================================

let sellerState = {
    currentScreen: 'screenLanding',
    mobile: null,
    otpVerified: false,
    sellerType: null,
    profile: {
        name: '',
        shopName: '',
        photo: null,
        state: '',
        district: '',
        city: '',
        pincode: '',
        crops: '',
        farmSize: ''
    },
    kyc: {
        aadhaar: null,
        bank: null,
        certificate: null
    },
    bankDetails: {
        holderName: '',
        bankName: '',
        accountNumber: '',
        ifsc: ''
    },
    products: [],
    orders: [],
    earnings: 0
};

// ========================================
// SCREEN NAVIGATION
// ========================================

function goToSellerScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.seller-screen');
    screens.forEach(screen => screen.classList.remove('active'));

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        sellerState.currentScreen = screenId;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ========================================
// SCREEN 2: REGISTRATION & OTP
// ========================================

function sendOTP() {
    const mobileInput = document.getElementById('sellerMobile');
    const otpGroup = document.getElementById('otpGroup');
    const mobile = mobileInput.value.trim();

    // Validate mobile number
    if (!/^\d{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    // In production, send OTP via Firebase Auth or SMS API
    console.log('Sending OTP to:', mobile);

    // Show OTP input
    otpGroup.classList.remove('hidden');
    sellerState.mobile = mobile;

    // Simulate OTP sent
    alert(`OTP sent to ${mobile}\n\nFor demo, use any 6-digit code`);

    // Change button to verify OTP
    const btn = event.target;
    btn.textContent = 'Verify OTP';
    btn.onclick = verifyOTP;
}

function verifyOTP() {
    const otpInput = document.getElementById('sellerOTP');
    const otp = otpInput.value.trim();

    // Validate OTP
    if (!/^\d{6}$/.test(otp)) {
        alert('Please enter a valid 6-digit OTP');
        return;
    }

    // In production, verify OTP with backend
    console.log('Verifying OTP:', otp);

    // Simulate successful verification
    sellerState.otpVerified = true;
    alert('✅ Mobile number verified successfully!');

    // Go to seller type selection
    goToSellerScreen('screenType');
}

// ========================================
// SCREEN 3: SELLER TYPE SELECTION
// ========================================

function selectSellerType(type) {
    sellerState.sellerType = type;

    // Visual feedback
    const cards = document.querySelectorAll('.type-card');
    cards.forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    // Auto-proceed after short delay
    setTimeout(() => {
        goToSellerScreen('screenProfile');
    }, 500);
}

// ========================================
// SCREEN 4: PROFILE SETUP
// ========================================

function saveProfile() {
    // Get form values
    const name = document.getElementById('sellerName').value.trim();
    const shopName = document.getElementById('sellerShopName').value.trim();
    const state = document.getElementById('sellerState').value;
    const district = document.getElementById('sellerDistrict').value.trim();
    const city = document.getElementById('sellerCity').value.trim();
    const pincode = document.getElementById('sellerPincode').value.trim();
    const crops = document.getElementById('sellerCrops').value.trim();
    const farmSize = document.getElementById('sellerFarmSize').value.trim();

    // Validate required fields
    if (!name || !shopName || !state || !district || !city || !pincode) {
        alert('Please fill in all required fields');
        return;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(pincode)) {
        alert('Please enter a valid 6-digit PIN code');
        return;
    }

    // Save to state
    sellerState.profile = {
        name,
        shopName,
        photo: document.getElementById('sellerPhoto').files[0] || null,
        state,
        district,
        city,
        pincode,
        crops,
        farmSize
    };

    console.log('Profile saved:', sellerState.profile);

    // In production, save to Firestore
    alert('✅ Profile saved successfully!');

    // Go to KYC screen
    goToSellerScreen('screenKYC');
}

// ========================================
// SCREEN 5: KYC DOCUMENT UPLOAD
// ========================================

// Handle file uploads
document.addEventListener('DOMContentLoaded', function () {
    const kycAadhaar = document.getElementById('kycAadhaar');
    const kycBank = document.getElementById('kycBank');
    const kycCert = document.getElementById('kycCert');

    if (kycAadhaar) {
        kycAadhaar.addEventListener('change', function (e) {
            handleKYCUpload('aadhaar', e.target.files[0]);
        });
    }

    if (kycBank) {
        kycBank.addEventListener('change', function (e) {
            handleKYCUpload('bank', e.target.files[0]);
        });
    }

    if (kycCert) {
        kycCert.addEventListener('change', function (e) {
            handleKYCUpload('certificate', e.target.files[0]);
        });
    }

    // Negotiation checkbox handler
    const negotiationCheckbox = document.getElementById('allowNegotiation');
    if (negotiationCheckbox) {
        negotiationCheckbox.addEventListener('change', function () {
            const minPriceGroup = document.getElementById('minPriceGroup');
            if (minPriceGroup) {
                minPriceGroup.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
});

function handleKYCUpload(type, file) {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image or PDF file');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
    }

    // Save to state
    sellerState.kyc[type] = file;

    console.log(`${type} document uploaded:`, file.name);

    // Update badge
    const card = event.target.closest('.kyc-card');
    const badge = card.querySelector('.verification-badge');
    if (badge) {
        badge.textContent = '⏳ Uploaded';
        badge.classList.remove('pending');
        badge.classList.add('uploaded');
    }

    // In production, upload to Firebase Storage
    alert(`✅ ${type} document uploaded successfully!`);
}

// ========================================
// SCREEN 6: BANK DETAILS
// ========================================

function saveBankDetails() {
    // Get form values
    const holderName = document.getElementById('bankHolderName').value.trim();
    const bankName = document.getElementById('bankName').value.trim();
    const accountNumber = document.getElementById('bankAccount').value.trim();
    const ifsc = document.getElementById('bankIFSC').value.trim();

    // Validate required fields
    if (!holderName || !bankName || !accountNumber || !ifsc) {
        alert('Please fill in all bank details');
        return;
    }

    // Validate IFSC code format
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) {
        alert('Please enter a valid IFSC code');
        return;
    }

    // Save to state
    sellerState.bankDetails = {
        holderName,
        bankName,
        accountNumber,
        ifsc: ifsc.toUpperCase()
    };

    console.log('Bank details saved:', sellerState.bankDetails);

    // In production, save to Firestore
    alert('✅ Bank details saved successfully!\n\nYour seller account is now set up!');

    // Go to dashboard
    goToSellerScreen('screenDashboard');
}

// ========================================
// SCREEN 8: ADD PRODUCT
// ========================================

function saveDraft() {
    const productData = getProductFormData();

    if (!productData.name) {
        alert('Please enter a product name');
        return;
    }

    // Save to localStorage
    localStorage.setItem('productDraft', JSON.stringify(productData));

    alert('✅ Product saved as draft!');
}

function publishProduct() {
    const productData = getProductFormData();

    // Validate required fields
    if (!productData.name || !productData.category || !productData.price || !productData.quantity) {
        alert('Please fill in all required fields:\n- Product Name\n- Category\n- Price\n- Quantity');
        return;
    }

    // Validate at least one delivery option
    if (!productData.deliveryPlatform && !productData.deliverySelf && !productData.deliveryBuyer) {
        alert('Please select at least one delivery option');
        return;
    }

    // Generate product ID
    const productId = 'PROD' + Date.now().toString().slice(-8);
    productData.id = productId;
    productData.sellerId = sellerState.mobile;
    productData.status = 'active';
    productData.createdAt = new Date();

    // Add to products array
    sellerState.products.push(productData);

    console.log('Product published:', productData);

    // In production, save to Firestore
    alert('🎉 Product published successfully!\n\nYour product is now live on the marketplace!');

    // Clear form
    clearProductForm();

    // Go to dashboard
    goToSellerScreen('screenDashboard');
}

function getProductFormData() {
    return {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        cropType: document.getElementById('productCropType').value.trim(),
        images: document.getElementById('productImages').files,
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        unit: document.getElementById('productUnit').value,
        quantity: parseFloat(document.getElementById('productQuantity').value) || 0,
        minOrder: parseFloat(document.getElementById('productMinOrder').value) || 1,
        allowNegotiation: document.getElementById('allowNegotiation').checked,
        minPrice: parseFloat(document.getElementById('productMinPrice').value) || 0,
        deliveryPlatform: document.getElementById('deliveryPlatform').checked,
        deliverySelf: document.getElementById('deliverySelf').checked,
        deliveryBuyer: document.getElementById('deliveryBuyer').checked
    };
}

function clearProductForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productCropType').value = '';
    document.getElementById('productImages').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productQuantity').value = '';
    document.getElementById('productMinOrder').value = '';
    document.getElementById('allowNegotiation').checked = false;
    document.getElementById('productMinPrice').value = '';
    document.getElementById('deliveryPlatform').checked = false;
    document.getElementById('deliverySelf').checked = false;
    document.getElementById('deliveryBuyer').checked = false;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Load draft on page load
window.addEventListener('DOMContentLoaded', function () {
    const draft = localStorage.getItem('productDraft');
    if (draft) {
        console.log('Product draft found:', JSON.parse(draft));
    }
});

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
const logoutBtnHeader = document.getElementById('logoutBtnHeader');

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear state
        sellerState = {
            currentScreen: 'screenLanding',
            mobile: null,
            otpVerified: false,
            sellerType: null,
            profile: {},
            kyc: {},
            bankDetails: {},
            products: [],
            orders: [],
            earnings: 0
        };

        // In production, sign out from Firebase
        window.location.href = 'farmer-dashboard.html';
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

if (logoutBtnHeader) {
    logoutBtnHeader.addEventListener('click', function (e) {
        e.preventDefault();
        handleLogout();
    });
}

// Mobile sidebar toggle
const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
const sidebar = document.querySelector('.farmer-sidebar');

if (mobileSidebarToggle && sidebar) {
    mobileSidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });
}

console.log('Seller Onboarding Platform Initialized');
