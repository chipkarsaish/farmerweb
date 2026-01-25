// ========================================
// GROUP FARMING PAGE JAVASCRIPT
// ========================================

// Mock Data
const mockData = {
    userInGroup: false, // Change to true to test "in group" state
    currentGroup: {
        name: "Sunrise Farmers Cooperative",
        members: 12,
        maxMembers: 15,
        activities: ["🚜 Shared Tractor", "🌾 Bulk Fertilizer Order"],
        benefits: {
            discount: "15%",
            loanBoost: "₹50,000"
        }
    },
    recommendedGroups: [
        {
            name: "Green Valley Cooperative",
            distance: "2.3 km",
            crops: "Rice & Wheat",
            members: 10,
            maxMembers: 15,
            rating: 4.5,
            benefits: "12% discount, Shared tractor",
            verified: true
        },
        {
            name: "Organic Farmers Alliance",
            distance: "4.1 km",
            crops: "Organic Crops",
            members: 8,
            maxMembers: 12,
            rating: 4.8,
            benefits: "15% discount, Compost sharing",
            verified: true
        },
        {
            name: "Harvest Together Group",
            distance: "5.7 km",
            crops: "Mixed Crops",
            members: 15,
            maxMembers: 20,
            rating: 4.3,
            benefits: "10% discount, Storage access",
            verified: true
        }
    ]
};

// State
let currentStep = 1;
const totalSteps = 4;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeGroupStatus();
    initializeEventListeners();
    initializeModalNavigation();
});

// Initialize Group Status
function initializeGroupStatus() {
    const noGroupCard = document.getElementById('noGroupCard');
    const currentGroupCard = document.getElementById('currentGroupCard');

    if (mockData.userInGroup) {
        noGroupCard.classList.add('hidden');
        currentGroupCard.classList.remove('hidden');
    } else {
        noGroupCard.classList.remove('hidden');
        currentGroupCard.classList.add('hidden');
    }
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Auto-find buttons
    document.getElementById('autoFindBtn')?.addEventListener('click', handleAutoFind);
    document.getElementById('autoFindBtnTop')?.addEventListener('click', handleAutoFind);

    // Create group buttons
    document.getElementById('createGroupBtn')?.addEventListener('click', openCreateGroupModal);
    document.getElementById('createGroupBtnTop')?.addEventListener('click', openCreateGroupModal);

    // View/Leave group buttons
    document.getElementById('viewGroupBtn')?.addEventListener('click', handleViewGroup);
    document.getElementById('leaveGroupBtn')?.addEventListener('click', handleLeaveGroup);

    // Modal controls
    document.getElementById('modalClose')?.addEventListener('click', closeCreateGroupModal);
    document.getElementById('modalOverlay')?.addEventListener('click', closeCreateGroupModal);

    // Notification button
    document.getElementById('notificationBtn')?.addEventListener('click', handleNotifications);

    // User menu
    document.getElementById('userMenuBtn')?.addEventListener('click', handleUserMenu);

    // Change location
    document.getElementById('changeLocationBtn')?.addEventListener('click', handleChangeLocation);

    // Season selector
    document.getElementById('seasonSelect')?.addEventListener('change', handleSeasonChange);

    // Map toggle
    document.getElementById('toggleMapBtn')?.addEventListener('click', handleToggleMap);
}

// Auto-Find Group
function handleAutoFind() {
    const recommendedSection = document.getElementById('recommendedSection');
    const recommendedGrid = document.getElementById('recommendedGrid');

    // Show loading state
    recommendedGrid.innerHTML = '<p style="text-align: center; padding: 2rem;">🔍 Finding the best groups for you...</p>';
    recommendedSection.classList.remove('hidden');

    // Scroll to recommendations
    setTimeout(() => {
        recommendedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Simulate matching algorithm
    setTimeout(() => {
        displayRecommendedGroups();
    }, 1500);
}

// Display Recommended Groups
function displayRecommendedGroups() {
    const recommendedGrid = document.getElementById('recommendedGrid');

    recommendedGrid.innerHTML = mockData.recommendedGroups.map(group => `
        <div class="group-card">
            <div class="group-card-header">
                <h3 class="group-card-title">${group.name}</h3>
                ${group.verified ? '<span class="verified-badge-small">✓</span>' : ''}
            </div>
            <div class="group-card-meta">
                <span class="meta-item">📍 ${group.distance}</span>
                <span class="meta-item">🌾 ${group.crops}</span>
                <span class="meta-item">⭐ ${group.rating}</span>
            </div>
            <div class="group-card-info">
                <p><strong>Members:</strong> ${group.members}/${group.maxMembers}</p>
                <p><strong>Benefits:</strong> ${group.benefits}</p>
            </div>
            <div class="group-card-actions">
                <button class="btn btn-outline btn-small" onclick="handleViewGroup()">View Group</button>
                <button class="btn btn-primary btn-small" onclick="handleJoinRequest('${group.name}')">Request to Join</button>
            </div>
        </div>
    `).join('');
}

// Handle Join Request
function handleJoinRequest(groupName) {
    alert(`Join request sent to ${groupName}!\n\nYou will be notified when the group leader reviews your request.`);
}

// View Group
function handleViewGroup() {
    alert('Group detail page will open here.\n\nThis will show:\n- Full member list\n- Shared resources\n- Financial benefits\n- Activities\n- Communication');
}

// Leave Group
function handleLeaveGroup() {
    const confirmed = confirm('Are you sure you want to leave this group?\n\nYou will need to give 7 days notice and settle any pending payments.');
    if (confirmed) {
        alert('Leave request submitted. You will be removed from the group after 7 days.');
    }
}

// Modal Navigation
function initializeModalNavigation() {
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('createGroupSubmitBtn');

    prevBtn?.addEventListener('click', () => navigateStep(-1));
    nextBtn?.addEventListener('click', () => navigateStep(1));
    submitBtn?.addEventListener('click', handleCreateGroup);
}

// Navigate Steps
function navigateStep(direction) {
    const newStep = currentStep + direction;

    if (newStep < 1 || newStep > totalSteps) return;

    // Hide current step
    document.querySelector(`#step${currentStep}`)?.classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`)?.classList.remove('active');

    // Mark completed
    if (direction > 0) {
        document.querySelector(`.step[data-step="${currentStep}"]`)?.classList.add('completed');
    }

    // Show new step
    currentStep = newStep;
    document.querySelector(`#step${currentStep}`)?.classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`)?.classList.add('active');

    // Update buttons
    updateModalButtons();
}

// Update Modal Buttons
function updateModalButtons() {
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('createGroupSubmitBtn');

    // Show/hide previous button
    if (currentStep === 1) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }

    // Show/hide next vs submit button
    if (currentStep === totalSteps) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

// Open Create Group Modal
function openCreateGroupModal() {
    const modal = document.getElementById('createGroupModal');
    modal.classList.remove('hidden');
    currentStep = 1;

    // Reset form
    resetCreateGroupForm();

    // Show first step
    document.querySelectorAll('.step-content').forEach(content => content.classList.remove('active'));
    document.querySelector('#step1')?.classList.add('active');

    // Reset step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.querySelector('.step[data-step="1"]')?.classList.add('active');

    updateModalButtons();
}

// Close Create Group Modal
function closeCreateGroupModal() {
    const modal = document.getElementById('createGroupModal');
    modal.classList.add('hidden');
}

// Reset Create Group Form
function resetCreateGroupForm() {
    document.getElementById('groupName').value = '';
    document.getElementById('cropFocus').value = '';
    document.getElementById('groupArea').value = '';
    document.getElementById('maxMembers').value = '15';

    // Reset checkboxes
    document.querySelectorAll('input[name="groupType"]').forEach(checkbox => {
        if (checkbox.value === 'full-cooperative') {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
}

// Handle Create Group
function handleCreateGroup() {
    const groupName = document.getElementById('groupName').value;
    const cropFocus = document.getElementById('cropFocus').value;
    const groupArea = document.getElementById('groupArea').value;
    const maxMembers = document.getElementById('maxMembers').value;

    if (!groupName || !cropFocus || !groupArea) {
        alert('Please fill in all required fields');
        return;
    }

    // Get selected group types
    const selectedTypes = Array.from(document.querySelectorAll('input[name="groupType"]:checked'))
        .map(cb => cb.value);

    alert(`Group Created Successfully! 🎉\n\nGroup Name: ${groupName}\nCrop Focus: ${cropFocus}\nArea: ${groupArea}\nMax Members: ${maxMembers}\nTypes: ${selectedTypes.join(', ')}\n\nYou can now invite farmers to join your cooperative!`);

    closeCreateGroupModal();
}

// Handle Notifications
function handleNotifications() {
    alert('Notifications:\n\n✅ Join request approved - Green Valley Cooperative\n🚜 Tractor available tomorrow\n💰 Payment due: ₹5,000\n📢 New fertilizer bulk order starting');
}

// Handle User Menu
function handleUserMenu() {
    alert('User Menu:\n\n👤 Profile\n⚙️ Settings\n📊 My Activity\n🚪 Logout');
}

// Handle Change Location
function handleChangeLocation() {
    const newLocation = prompt('Enter your location:', 'Pune, Maharashtra');
    if (newLocation) {
        document.getElementById('currentLocation').textContent = newLocation;
        alert(`Location updated to: ${newLocation}\n\nNearby groups will be refreshed.`);
    }
}

// Handle Season Change
function handleSeasonChange(event) {
    const season = event.target.value;
    alert(`Season changed to: ${season.charAt(0).toUpperCase() + season.slice(1)}\n\nGroup recommendations will be updated based on the selected season.`);
}

// Handle Toggle Map
function handleToggleMap() {
    alert('Map view will be displayed here.\n\nThis will show:\n- Your location\n- Nearby groups with markers\n- Distance indicators\n- Interactive group selection');
}

// Initialize user initials
function initializeUserInitials() {
    const userInitials = document.getElementById('userInitials');
    if (userInitials) {
        userInitials.textContent = 'F'; // Can be dynamic based on user name
    }
}
