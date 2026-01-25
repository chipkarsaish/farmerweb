// Farmer Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Modal elements
    const editModal = document.getElementById('editModal');
    const locationModal = document.getElementById('locationModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const locationModalClose = document.getElementById('locationModalClose');

    // Buttons
    const editProfileBtn = document.getElementById('editProfileBtn');
    const sectionEditBtns = document.querySelectorAll('.section-edit-btn');
    const updateLocationBtn = document.getElementById('updateLocationBtn');
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const photoUpload = document.getElementById('photoUpload');
    const autoDetectBtn = document.getElementById('autoDetectBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');

    // Photo upload
    if (uploadPhotoBtn && photoUpload) {
        uploadPhotoBtn.addEventListener('click', function () {
            photoUpload.click();
        });

        photoUpload.addEventListener('change', function (e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const profilePhoto = document.getElementById('profilePhoto');
                    profilePhoto.style.backgroundImage = `url(${event.target.result})`;
                    profilePhoto.style.backgroundSize = 'cover';
                    profilePhoto.style.backgroundPosition = 'center';
                    const placeholder = profilePhoto.querySelector('.profile-photo-placeholder');
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Edit section buttons
    sectionEditBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.dataset.section;
            openEditModal(section);
        });
    });

    // Update location button
    if (updateLocationBtn) {
        updateLocationBtn.addEventListener('click', function () {
            openLocationModal();
        });
    }

    // Auto-detect location
    if (autoDetectBtn) {
        autoDetectBtn.addEventListener('click', function () {
            if (navigator.geolocation) {
                autoDetectBtn.textContent = '📍 Detecting...';
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        console.log('Location detected:', position.coords);
                        autoDetectBtn.textContent = '✓ Location Detected';
                        setTimeout(() => {
                            autoDetectBtn.textContent = '📍 Auto-Detect Current Location';
                        }, 2000);
                    },
                    function (error) {
                        console.error('Error detecting location:', error);
                        autoDetectBtn.textContent = '❌ Detection Failed';
                        setTimeout(() => {
                            autoDetectBtn.textContent = '📍 Auto-Detect Current Location';
                        }, 2000);
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }

    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeEditModal);
    }

    if (locationModalClose) {
        locationModalClose.addEventListener('click', closeLocationModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function () {
            closeEditModal();
            closeLocationModal();
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditModal);
    }

    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', function () {
            // Save logic here
            alert('Changes saved successfully!');
            closeEditModal();
        });
    }

    // Functions
    function openEditModal(section) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (section === 'personal') {
            modalTitle.textContent = 'Edit Personal Information';
            modalBody.innerHTML = getPersonalInfoForm();
        } else if (section === 'farm') {
            modalTitle.textContent = 'Edit Farm Details';
            modalBody.innerHTML = getFarmDetailsForm();
        }

        editModal.classList.remove('hidden');
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
    }

    function openLocationModal() {
        locationModal.classList.remove('hidden');
    }

    function closeLocationModal() {
        locationModal.classList.add('hidden');
    }

    function getPersonalInfoForm() {
        return `
            <div class="edit-form">
                <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" class="form-input" value="Ramesh Kumar Patil">
                </div>
                <div class="form-group">
                    <label class="form-label">Mobile Number *</label>
                    <input type="tel" class="form-input" value="+91 98765 43210" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" value="ramesh.patil@example.com">
                </div>
                <div class="form-group">
                    <label class="form-label">Gender</label>
                    <select class="form-input">
                        <option value="male" selected>Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not">Prefer not to say</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Preferred Language</label>
                    <select class="form-input">
                        <option value="marathi" selected>Marathi</option>
                        <option value="hindi">Hindi</option>
                        <option value="english">English</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Age Group</label>
                    <select class="form-input">
                        <option value="18-25">18-25 years</option>
                        <option value="25-35">25-35 years</option>
                        <option value="35-45" selected>35-45 years</option>
                        <option value="45-60">45-60 years</option>
                        <option value="60+">60+ years</option>
                    </select>
                </div>
            </div>
        `;
    }

    function getFarmDetailsForm() {
        return `
            <div class="edit-form">
                <div class="form-group">
                    <label class="form-label">Farm Type *</label>
                    <select class="form-input">
                        <option value="individual" selected>Individual</option>
                        <option value="group">Group Farming</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Total Land Area *</label>
                    <div class="input-group">
                        <input type="number" class="form-input" value="5" step="0.1">
                        <select class="form-input" style="max-width: 120px;">
                            <option value="acres" selected>Acres</option>
                            <option value="hectares">Hectares</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Soil Type *</label>
                    <select class="form-input">
                        <option value="black" selected>Black Soil (Regur)</option>
                        <option value="red">Red Soil</option>
                        <option value="alluvial">Alluvial Soil</option>
                        <option value="laterite">Laterite Soil</option>
                        <option value="sandy">Sandy Soil</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Irrigation Type *</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" value="rainfed"> Rainfed
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="borewell" checked> Borewell
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="canal"> Canal
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="drip" checked> Drip
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Crops Grown *</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" value="wheat" checked> Wheat
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="rice" checked> Rice
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="cotton" checked> Cotton
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="sugarcane"> Sugarcane
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="vegetables" checked> Vegetables
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Current Season Crop</label>
                    <input type="text" class="form-input" value="Wheat (Rabi Season)">
                </div>
            </div>
        `;
    }

    // Form styling
    const style = document.createElement('style');
    style.textContent = `
        .edit-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .form-label {
            font-weight: 500;
            color: #333;
            font-size: 0.95rem;
        }
        .form-input {
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        .form-input:focus {
            outline: none;
            border-color: #43a047;
        }
        .input-group {
            display: flex;
            gap: 0.5rem;
        }
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});
