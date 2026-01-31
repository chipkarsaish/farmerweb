// ========================================
// BUY NOW FLOW - STATE MANAGEMENT
// ========================================

let buyNowState = {
    product: null,
    quantity: 1,
    negotiatedPrice: null,
    address: null,
    deliveryOption: 'home',
    paymentMethod: 'upi',
    stockLock: null,
    deliveryFee: 50,
    platformFee: 20
};

// ========================================
// BUY NOW - MAIN FUNCTIONS
// ========================================

function buyNow(id, type) {
    console.log(`Buy Now clicked: ${type} #${id}`);

    // Find the product
    let product;
    if (type === 'crop') {
        product = mockData.crops.find(c => c.id === id);
    }

    if (!product) {
        alert('Product not found');
        return;
    }

    // Check authentication (simplified for now)
    // In production, check Firebase auth

    // Initialize state
    buyNowState.product = product;
    buyNowState.quantity = 1;
    buyNowState.negotiatedPrice = null;

    // Open modal
    openBuyNowModal();
}

function openBuyNowModal() {
    const modal = document.getElementById('buyNowModal');
    const product = buyNowState.product;

    if (!modal || !product) return;

    // Populate product details
    document.getElementById('buyProductImage').src = product.image;
    document.getElementById('buyProductName').textContent = product.name;
    document.getElementById('buySellerName').textContent = product.farmer;
    document.getElementById('buySellerLocation').textContent = `• ${product.location}`;
    document.getElementById('buyProductPrice').textContent = `₹${product.price} / ${product.priceUnit}`;
    document.getElementById('buyStockAvailable').textContent = `${product.quantity} ${product.unit}`;
    document.getElementById('buyQuantity').value = 1;
    document.getElementById('buyQuantity').max = product.quantity;

    // Reset to step 1
    goToStep(1);

    // Calculate initial price
    updatePriceBreakdown();

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Lock stock
    lockStock(product.id, 1);
}

function closeBuyNowModal() {
    const modal = document.getElementById('buyNowModal');
    if (!modal) return;

    modal.classList.add('hidden');
    document.body.style.overflow = '';

    // Release stock lock
    releaseStockLock();

    // Reset state
    buyNowState = {
        product: null,
        quantity: 1,
        negotiatedPrice: null,
        address: null,
        deliveryOption: 'home',
        paymentMethod: 'upi',
        stockLock: null,
        deliveryFee: 50,
        platformFee: 20
    };
}

// Close modal when clicking overlay
document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('buyNowOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeBuyNowModal);
    }
});

// ========================================
// STEP NAVIGATION
// ========================================

function goToStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.buy-now-step');
    steps.forEach(step => step.classList.remove('active'));

    // Show target step
    const targetStep = document.getElementById(`buyNowStep${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Update progress indicator
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// ========================================
// QUANTITY MANAGEMENT
// ========================================

function updateBuyQuantity(delta) {
    const input = document.getElementById('buyQuantity');
    const product = buyNowState.product;

    if (!input || !product) return;

    let newQuantity = parseInt(input.value) + delta;

    // Validate bounds
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > product.quantity) {
        alert(`Only ${product.quantity} ${product.unit} available in stock`);
        return;
    }

    input.value = newQuantity;
    buyNowState.quantity = newQuantity;

    // Update price breakdown
    updatePriceBreakdown();

    // Update stock lock
    lockStock(product.id, newQuantity);
}

function updatePriceBreakdown() {
    const product = buyNowState.product;
    if (!product) return;

    const quantity = buyNowState.quantity;
    const price = buyNowState.negotiatedPrice || product.price;
    const subtotal = price * quantity;
    const total = subtotal + buyNowState.deliveryFee + buyNowState.platformFee;

    // Update breakdown
    document.getElementById('breakdownItemPrice').textContent = `₹${price}`;
    document.getElementById('breakdownQuantity').textContent = quantity;
    document.getElementById('breakdownSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('breakdownDelivery').textContent = `₹${buyNowState.deliveryFee}`;
    document.getElementById('breakdownPlatform').textContent = `₹${buyNowState.platformFee}`;
    document.getElementById('breakdownTotal').textContent = `₹${total}`;

    // Update final amount in payment step
    document.getElementById('finalAmount').textContent = `₹${total}`;
    document.getElementById('payButtonAmount').textContent = `₹${total}`;
}

// ========================================
// PRICE NEGOTIATION
// ========================================

function toggleNegotiation() {
    const toggle = document.getElementById('negotiationToggle');
    const input = document.getElementById('negotiationInput');

    if (!toggle || !input) return;

    if (toggle.checked) {
        input.classList.remove('hidden');
    } else {
        input.classList.add('hidden');
        buyNowState.negotiatedPrice = null;
        updatePriceBreakdown();
    }
}

function sendPriceOffer() {
    const offerInput = document.getElementById('offerPrice');
    const product = buyNowState.product;

    if (!offerInput || !product) return;

    const offerPrice = parseFloat(offerInput.value);

    if (!offerPrice || offerPrice <= 0) {
        alert('Please enter a valid offer price');
        return;
    }

    if (offerPrice >= product.price) {
        alert('Offer price should be less than the current price');
        return;
    }

    // In production, send offer to seller via Firestore
    alert(`✅ Price offer sent to seller!\n\nYour Offer: ₹${offerPrice} / ${product.priceUnit}\nCurrent Price: ₹${product.price} / ${product.priceUnit}\n\nThe seller will review your offer and respond soon.`);

    // For demo, accept the offer immediately
    buyNowState.negotiatedPrice = offerPrice;
    updatePriceBreakdown();
}

// ========================================
// ADDRESS & DELIVERY
// ========================================

function proceedToAddress() {
    // Validate quantity
    if (buyNowState.quantity < 1) {
        alert('Please select a valid quantity');
        return;
    }

    // Auto-fill address if available (from Firebase user profile)
    // For demo, leave empty

    // Calculate estimated delivery
    const deliveryDate = new Date();
    const product = buyNowState.product;
    const deliveryDays = product.deliveryDays ? parseInt(product.deliveryDays.split('-')[1]) : 5;
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    document.getElementById('estimatedDelivery').textContent = deliveryDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    // Go to step 2
    goToStep(2);
}

function proceedToPayment() {
    // Validate address
    const name = document.getElementById('addressName').value.trim();
    const mobile = document.getElementById('addressMobile').value.trim();
    const line1 = document.getElementById('addressLine1').value.trim();
    const city = document.getElementById('addressCity').value.trim();
    const pincode = document.getElementById('addressPincode').value.trim();

    if (!name || !mobile || !line1 || !city || !pincode) {
        alert('Please fill in all required address fields');
        return;
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(pincode)) {
        alert('Please enter a valid 6-digit pincode');
        return;
    }

    // Save address
    buyNowState.address = {
        name,
        mobile,
        line1,
        line2: document.getElementById('addressLine2').value.trim(),
        city,
        pincode
    };

    // Get delivery option
    const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked');
    if (deliveryOption) {
        buyNowState.deliveryOption = deliveryOption.value;

        // Update delivery fee based on option
        if (deliveryOption.value === 'pickup') {
            buyNowState.deliveryFee = 0;
            updatePriceBreakdown();
        }
    }

    // Go to step 3
    goToStep(3);
}

// ========================================
// PAYMENT PROCESSING
// ========================================

function processPayment() {
    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        alert('Please select a payment method');
        return;
    }

    buyNowState.paymentMethod = paymentMethod.value;

    // Show loading
    const loading = document.getElementById('buyNowLoading');
    if (loading) {
        loading.classList.remove('hidden');
    }

    // Simulate payment processing
    setTimeout(() => {
        // Hide loading
        if (loading) {
            loading.classList.add('hidden');
        }

        // Create order
        createOrder();
    }, 2000);
}

async function createOrder() {
    const product = buyNowState.product;
    const quantity = buyNowState.quantity;
    const price = buyNowState.negotiatedPrice || product.price;
    const subtotal = price * quantity;
    const total = subtotal + buyNowState.deliveryFee + buyNowState.platformFee;

    // Generate order ID
    const orderId = 'ORD' + Date.now().toString().slice(-8);

    // Calculate delivery date
    const deliveryDate = new Date();
    const deliveryDays = product.deliveryDays ? parseInt(product.deliveryDays.split('-')[1]) : 5;
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    // In production, save to Firestore
    const orderData = {
        orderId,
        productId: product.id,
        productName: product.name,
        sellerId: product.farmer,
        quantity,
        price,
        subtotal,
        deliveryFee: buyNowState.deliveryFee,
        platformFee: buyNowState.platformFee,
        total,
        address: buyNowState.address,
        deliveryOption: buyNowState.deliveryOption,
        paymentMethod: buyNowState.paymentMethod,
        status: 'pending',
        createdAt: new Date(),
        deliveryDate
    };

    console.log('Order created:', orderData);

    // Show success screen
    showOrderSuccess(orderId, deliveryDate, total);

    // Notify seller (in production, via Firestore)
    console.log('Seller notified:', product.farmer);
}

function showOrderSuccess(orderId, deliveryDate, total) {
    const product = buyNowState.product;

    // Populate success details
    document.getElementById('successOrderId').textContent = orderId;
    document.getElementById('successDeliveryDate').textContent = deliveryDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById('successAmount').textContent = `₹${total}`;
    document.getElementById('successSellerContact').textContent = product.farmer;

    // Go to success step
    goToStep(4);
}

// ========================================
// STOCK LOCK MECHANISM
// ========================================

function lockStock(productId, quantity) {
    // Release previous lock
    releaseStockLock();

    // Create new lock
    const lockData = {
        productId,
        quantity,
        timestamp: Date.now(),
        expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
    };

    buyNowState.stockLock = lockData;

    // Save to localStorage
    localStorage.setItem('stockLock', JSON.stringify(lockData));

    console.log(`Stock locked: ${quantity} units for 15 minutes`);
}

function releaseStockLock() {
    if (buyNowState.stockLock) {
        localStorage.removeItem('stockLock');
        buyNowState.stockLock = null;
        console.log('Stock lock released');
    }
}

// Auto-release stock lock on page unload
window.addEventListener('beforeunload', releaseStockLock);

// ========================================
// SUCCESS ACTIONS
// ========================================

function trackOrder() {
    alert('🚚 Track Order\n\nRedirecting to order tracking page...\n\nIn production, this would show real-time order status and delivery updates.');
    closeBuyNowModal();
    // In production: window.location.href = '/track-order';
}

function continueShopping() {
    closeBuyNowModal();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// ADD TO CART (Existing function - keep simple)
// ========================================

function addToCart(id, type) {
    console.log(`Adding to cart: ${type} #${id}`);

    // Find the item
    let item;
    if (type === 'crop') {
        item = mockData.crops.find(c => c.id === id);
    }

    if (!item) {
        alert('Item not found');
        return;
    }

    // Show success message
    const message = `✅ Added to Cart!\n\n${item.name}\n₹${item.price} / ${item.priceUnit}\n\nYour item has been added to the cart.`;
    alert(message);

    // In production, add to cart state/localStorage
}
