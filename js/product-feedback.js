// ========================================
// PRODUCT FEEDBACK - STATE MANAGEMENT
// ========================================

let feedbackState = {
    productId: null,
    productName: '',
    productImage: '',
    orderDate: '',

    // User info
    userId: null,
    userName: '',
    userState: '',
    userDistrict: '',
    cropType: '',

    // Ratings
    emojiRating: null,
    starRating: null,

    // Questions
    germination: null,
    waterCondition: null,
    yieldResult: null,
    seedQuality: null,

    // Photos
    photos: [],

    // Composite
    compositeRating: null
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    feedbackState.productId = urlParams.get('productId');

    if (!feedbackState.productId) {
        alert('No product selected. Redirecting to marketplace...');
        window.location.href = 'availability.html';
        return;
    }

    // Load product details
    loadProductDetails();

    // Load user details
    loadUserDetails();

    // Initialize event listeners
    initializeEventListeners();
});

// ========================================
// LOAD DATA
// ========================================

function loadProductDetails() {
    // In production, fetch from Firestore
    // For now, use sample data or localStorage

    const sampleProducts = {
        'PROD001': {
            name: 'Organic Wheat Seeds - Premium Quality',
            image: 'https://via.placeholder.com/120',
            orderDate: '2026-01-15'
        },
        'PROD002': {
            name: 'Hybrid Rice Seeds - High Yield',
            image: 'https://via.placeholder.com/120',
            orderDate: '2026-01-20'
        }
    };

    const product = sampleProducts[feedbackState.productId] || {
        name: 'Product Name',
        image: 'https://via.placeholder.com/120',
        orderDate: new Date().toISOString().split('T')[0]
    };

    feedbackState.productName = product.name;
    feedbackState.productImage = product.image;
    feedbackState.orderDate = product.orderDate;

    // Update UI
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productImage').src = product.image;
    document.getElementById('orderDate').textContent = formatDate(product.orderDate);
}

function loadUserDetails() {
    // In production, get from Firebase Auth and Firestore
    // For now, use sample data or localStorage

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    feedbackState.userId = userData.uid || 'user123';
    feedbackState.userName = userData.name || 'Farmer Name';
    feedbackState.userState = userData.state || 'Maharashtra';
    feedbackState.userDistrict = userData.district || 'Pune';
    feedbackState.cropType = userData.cropType || 'Wheat';

    // Update UI
    document.getElementById('userLocation').textContent =
        `${feedbackState.userDistrict}, ${feedbackState.userState}`;
    document.getElementById('cropType').textContent = feedbackState.cropType;
}

// ========================================
// EVENT LISTENERS
// ========================================

function initializeEventListeners() {
    // Emoji rating buttons
    const emojiButtons = document.querySelectorAll('.emoji-rating-btn');
    emojiButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            handleEmojiRating(this);
        });
    });

    // Question option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            handleQuestionOption(this);
        });
    });

    // Photo upload
    const photoInput = document.getElementById('photoInput');
    photoInput.addEventListener('change', handlePhotoUpload);

    // Submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', handleSubmit);
}

// ========================================
// EMOJI RATING HANDLER
// ========================================

function handleEmojiRating(button) {
    const rating = parseInt(button.dataset.rating);

    // Update state
    feedbackState.emojiRating = rating;
    feedbackState.starRating = rating;

    // Update UI - remove selected from all
    document.querySelectorAll('.emoji-rating-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selected to clicked button
    button.classList.add('selected');

    // Check if form is complete
    checkFormComplete();
}

// ========================================
// QUESTION OPTION HANDLER
// ========================================

function handleQuestionOption(button) {
    const question = button.dataset.question;
    const value = button.dataset.value;

    // Update state
    feedbackState[question] = value;

    // Update UI - remove selected from siblings
    const siblings = button.parentElement.querySelectorAll('.option-btn');
    siblings.forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selected to clicked button
    button.classList.add('selected');

    // Check if form is complete
    checkFormComplete();
}

// ========================================
// PHOTO UPLOAD HANDLER
// ========================================

function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);

    // Limit to 2 photos
    const remainingSlots = 2 - feedbackState.photos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload only image files');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Add to state
        feedbackState.photos.push(file);

        // Create preview
        createPhotoPreview(file);
    });

    // Clear input
    event.target.value = '';
}

function createPhotoPreview(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const previewGrid = document.getElementById('photoPreview');

        const previewItem = document.createElement('div');
        previewItem.className = 'photo-preview-item';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'photo-preview-img';
        img.alt = 'Photo preview';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'photo-remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = function () {
            removePhoto(file, previewItem);
        };

        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        previewGrid.appendChild(previewItem);
    };

    reader.readAsDataURL(file);
}

function removePhoto(file, previewElement) {
    // Remove from state
    const index = feedbackState.photos.indexOf(file);
    if (index > -1) {
        feedbackState.photos.splice(index, 1);
    }

    // Remove from UI
    previewElement.remove();
}

// ========================================
// FORM VALIDATION
// ========================================

function checkFormComplete() {
    const submitBtn = document.getElementById('submitBtn');

    // Check if emoji rating is selected (minimum requirement)
    if (feedbackState.emojiRating !== null) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// ========================================
// RATING CALCULATION
// ========================================

function calculateCompositeRating() {
    // Base rating from emoji
    let composite = feedbackState.emojiRating * 0.4;

    // Germination contribution (20%)
    if (feedbackState.germination === 'yes') {
        composite += 5 * 0.2;
    } else if (feedbackState.germination === 'no') {
        composite += 1 * 0.2;
    } else {
        composite += feedbackState.emojiRating * 0.2; // Use emoji rating if not answered
    }

    // Yield contribution (20%)
    if (feedbackState.yieldResult === 'high') {
        composite += 5 * 0.2;
    } else if (feedbackState.yieldResult === 'average') {
        composite += 3 * 0.2;
    } else if (feedbackState.yieldResult === 'low') {
        composite += 1 * 0.2;
    } else {
        composite += feedbackState.emojiRating * 0.2;
    }

    // Quality contribution (20%)
    if (feedbackState.seedQuality === 'excellent') {
        composite += 5 * 0.2;
    } else if (feedbackState.seedQuality === 'good') {
        composite += 3 * 0.2;
    } else if (feedbackState.seedQuality === 'poor') {
        composite += 1 * 0.2;
    } else {
        composite += feedbackState.emojiRating * 0.2;
    }

    // Normalize to 5-star scale
    feedbackState.compositeRating = Math.round(composite * 10) / 10;

    return feedbackState.compositeRating;
}

// ========================================
// FORM SUBMISSION
// ========================================

async function handleSubmit() {
    const submitBtn = document.getElementById('submitBtn');

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Submitting...';

    // Calculate composite rating
    calculateCompositeRating();

    // Prepare review data
    const reviewData = {
        productId: feedbackState.productId,
        userId: feedbackState.userId,
        userName: feedbackState.userName,
        userState: feedbackState.userState,
        userDistrict: feedbackState.userDistrict,
        cropType: feedbackState.cropType,
        verifiedPurchase: true,

        // Ratings
        emojiRating: feedbackState.emojiRating,
        starRating: feedbackState.starRating,
        compositeRating: feedbackState.compositeRating,

        // Questions
        germination: feedbackState.germination,
        waterCondition: feedbackState.waterCondition,
        yieldResult: feedbackState.yieldResult,
        seedQuality: feedbackState.seedQuality,

        // Metadata
        orderDate: feedbackState.orderDate,
        reviewDate: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
    };

    console.log('Submitting review:', reviewData);

    // In production, upload photos to Firebase Storage
    if (feedbackState.photos.length > 0) {
        console.log('Photos to upload:', feedbackState.photos.length);
        // reviewData.photos = await uploadPhotos(feedbackState.photos);
    }

    // In production, save to Firestore
    try {
        // await saveReviewToFirestore(reviewData);

        // Save to localStorage for demo
        const reviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
        reviews.push(reviewData);
        localStorage.setItem('productReviews', JSON.stringify(reviews));

        // Show success screen
        showSuccessScreen();
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit feedback. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = '🟢 Submit Feedback';
    }
}

// ========================================
// SUCCESS SCREEN
// ========================================

function showSuccessScreen() {
    // Hide form
    document.getElementById('feedbackForm').classList.remove('active');

    // Show success screen
    document.getElementById('successScreen').classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

// ========================================
// FIREBASE INTEGRATION (PLACEHOLDER)
// ========================================

async function uploadPhotos(photos) {
    // In production, upload to Firebase Storage
    // const storage = firebase.storage();
    // const photoUrls = [];

    // for (const photo of photos) {
    //     const storageRef = storage.ref(`reviews/${Date.now()}_${photo.name}`);
    //     await storageRef.put(photo);
    //     const url = await storageRef.getDownloadURL();
    //     photoUrls.push(url);
    // }

    // return photoUrls;
    return [];
}

async function saveReviewToFirestore(reviewData) {
    // In production, save to Firestore
    // const db = firebase.firestore();
    // await db.collection('productReviews').add(reviewData);
}

console.log('Product Feedback System Initialized');
