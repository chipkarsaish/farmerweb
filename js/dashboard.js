// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Load user data from localStorage (demo)
    loadUserData();

    // User menu toggle
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function () {
            userDropdown.classList.add('hidden');
        });

        userDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Clear user data
            localStorage.removeItem('farmerConnectUser');
            // Redirect to landing page
            window.location.href = '../index.html';
        });
    }

    // Dashboard tile navigation
    const dashboardTiles = document.querySelectorAll('.dashboard-tile');
    dashboardTiles.forEach(tile => {
        tile.addEventListener('click', function () {
            const feature = this.dataset.feature;
            handleFeatureClick(feature);
        });
    });

    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function () {
            alert('Notifications:\n\n1. New fertilizer rental approved\n2. Carbon credit payment received\n3. Group farming invitation pending\n\n(This is a demo feature)');
        });
    }
});

function loadUserData() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('farmerConnectUser') || '{}');

    // Set default values if no user data
    const userName = userData.name || 'Farmer';
    const userEmail = userData.email || 'farmer@example.com';

    // Update welcome message
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) {
        welcomeName.textContent = userName.split(' ')[0]; // First name only
    }

    // Update user initials
    const initials = getInitials(userName);
    const userInitials = document.getElementById('userInitials');
    const dropdownInitials = document.getElementById('dropdownInitials');

    if (userInitials) userInitials.textContent = initials;
    if (dropdownInitials) dropdownInitials.textContent = initials;

    // Update dropdown info
    const dropdownName = document.getElementById('dropdownName');
    const dropdownEmail = document.getElementById('dropdownEmail');

    if (dropdownName) dropdownName.textContent = userName;
    if (dropdownEmail) dropdownEmail.textContent = userEmail;
}

function getInitials(name) {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function handleFeatureClick(feature) {
    // Feature navigation mapping
    const featurePages = {
        'amenities': '../html/amenities.html',
        'funds': '../html/funds.html',
        'availability': '../html/availability.html',
        'carbon-credits': '../html/carbon-credits.html',
        'group-farming': '../html/group-farming.html',
        'my-orders': '../html/my-orders.html'
    };

    const featureNames = {
        'amenities': 'Amenities Rental',
        'funds': 'Funds & Loans',
        'availability': 'Crop Availability',
        'carbon-credits': 'Carbon Credit Selling',
        'group-farming': 'Group Farming',
        'my-orders': 'My Orders'
    };

    // Navigate to amenities, funds, availability, or carbon-credits page if available
    if (feature === 'amenities' || feature === 'funds' || feature === 'availability' || feature === 'carbon-credits' || feature === 'group-farming' || feature === 'my-orders') {
        window.location.href = featurePages[feature];
    } else {
        // For other features, show coming soon alert
        alert(`${featureNames[feature]} - Coming Soon!\n\nThis feature will be available in the next phase of development.\n\nYou clicked: ${feature}`);
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

