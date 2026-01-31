// ===============================
// AVAILABILITY PAGE FILTER HANDLERS
// ===============================

// Initialize filter controls
document.addEventListener('DOMContentLoaded', function () {
    const filterToggleBtn = document.getElementById("filterToggleBtn");
    const filterModalOverlay = document.getElementById("filterModalOverlay");
    const filterModalClose = document.getElementById("filterModalClose");
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");
    const priceRangeMin = document.getElementById("priceRangeMin");
    const priceRangeMax = document.getElementById("priceRangeMax");
    const minPriceLabel = document.getElementById("minPriceLabel");
    const maxPriceLabel = document.getElementById("maxPriceLabel");
    const minQuantitySelect = document.getElementById("minQuantity");
    const sortBySelect = document.getElementById("sortBy");
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");
    const ratingInputs = document.querySelectorAll('input[name="minRating"]');
    const availabilityInputs = document.querySelectorAll('input[name="availability"]');
    const conditionInputs = document.querySelectorAll('input[name="condition"]');
    const ownershipInputs = document.querySelectorAll('input[name="ownership"]');

    // Initialize filters object
    if (!window.currentFilters) {
        window.currentFilters = {};
    }

    // Open filter modal
    if (filterToggleBtn) {
        filterToggleBtn.addEventListener("click", () => {
            filterModalOverlay.classList.remove("hidden");
        });
    }

    // Close filter modal
    if (filterModalClose) {
        filterModalClose.addEventListener("click", () => {
            filterModalOverlay.classList.add("hidden");
        });
    }

    // Close on overlay click
    if (filterModalOverlay) {
        filterModalOverlay.addEventListener("click", (e) => {
            if (e.target === filterModalOverlay) {
                filterModalOverlay.classList.add("hidden");
            }
        });
    }

    // Apply filters and close
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", () => {
            filterModalOverlay.classList.add("hidden");
        });
    }

    // Price Range Handlers
    if (minPriceInput && priceRangeMin) {
        minPriceInput.addEventListener("input", (e) => {
            const value = parseInt(e.target.value) || 0;
            priceRangeMin.value = value;
            if (minPriceLabel) minPriceLabel.textContent = `₹${value}`;
            window.currentFilters.minPrice = value;
            applyFiltersToProducts();
        });

        priceRangeMin.addEventListener("input", (e) => {
            const value = parseInt(e.target.value);
            minPriceInput.value = value;
            if (minPriceLabel) minPriceLabel.textContent = `₹${value}`;
            window.currentFilters.minPrice = value;
            applyFiltersToProducts();
        });
    }

    if (maxPriceInput && priceRangeMax) {
        maxPriceInput.addEventListener("input", (e) => {
            const value = parseInt(e.target.value) || 10000;
            priceRangeMax.value = value;
            if (maxPriceLabel) maxPriceLabel.textContent = `₹${value}`;
            window.currentFilters.maxPrice = value;
            applyFiltersToProducts();
        });

        priceRangeMax.addEventListener("input", (e) => {
            const value = parseInt(e.target.value);
            maxPriceInput.value = value;
            if (maxPriceLabel) maxPriceLabel.textContent = `₹${value}`;
            window.currentFilters.maxPrice = value;
            applyFiltersToProducts();
        });
    }

    // Quantity Filter
    if (minQuantitySelect) {
        minQuantitySelect.addEventListener("change", (e) => {
            window.currentFilters.minQuantity = e.target.value ? parseInt(e.target.value) : null;
            applyFiltersToProducts();
        });
    }

    // Rating Filter
    ratingInputs.forEach(input => {
        input.addEventListener("change", (e) => {
            window.currentFilters.minRating = e.target.value ? parseFloat(e.target.value) : null;
            applyFiltersToProducts();
        });
    });

    // Availability Filter
    availabilityInputs.forEach(input => {
        input.addEventListener("change", () => {
            const selected = Array.from(availabilityInputs)
                .filter(i => i.checked)
                .map(i => i.value);
            window.currentFilters.availability = selected.length > 0 ? selected : null;
            applyFiltersToProducts();
        });
    });

    // Condition Filter
    conditionInputs.forEach(input => {
        input.addEventListener("change", () => {
            const selected = Array.from(conditionInputs)
                .filter(i => i.checked)
                .map(i => i.value);
            window.currentFilters.condition = selected.length > 0 ? selected : null;
            applyFiltersToProducts();
        });
    });

    // Ownership Filter
    ownershipInputs.forEach(input => {
        input.addEventListener("change", () => {
            const selected = Array.from(ownershipInputs)
                .filter(i => i.checked)
                .map(i => i.value);
            window.currentFilters.ownership = selected.length > 0 ? selected : null;
            applyFiltersToProducts();
        });
    });

    // Sort By
    if (sortBySelect) {
        sortBySelect.addEventListener("change", (e) => {
            window.currentFilters.sort = e.target.value;
            applyFiltersToProducts();
        });
    }

    // Clear Filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            // Reset all inputs
            if (minPriceInput) minPriceInput.value = "";
            if (maxPriceInput) maxPriceInput.value = "";
            if (priceRangeMin) priceRangeMin.value = 0;
            if (priceRangeMax) priceRangeMax.value = 10000;
            if (minPriceLabel) minPriceLabel.textContent = "₹0";
            if (maxPriceLabel) maxPriceLabel.textContent = "₹10000";
            if (minQuantitySelect) minQuantitySelect.value = "";
            if (sortBySelect) sortBySelect.value = "";

            // Reset rating
            ratingInputs.forEach(input => input.checked = input.value === "");

            // Reset checkboxes to default
            availabilityInputs.forEach(input => {
                input.checked = input.value === "available";
            });
            conditionInputs.forEach(input => {
                input.checked = input.value === "good";
            });
            ownershipInputs.forEach(input => {
                input.checked = input.value === "individual" || input.value === "group";
            });

            // Clear filters
            window.currentFilters = {};
            applyFiltersToProducts();
        });
    }

    // Function to apply filters to products
    function applyFiltersToProducts() {
        // Reload all product grids with new filters
        if (typeof window.loadCropsData === 'function') {
            window.loadCropsData();
        }
        if (typeof window.loadEquipmentData === 'function') {
            window.loadEquipmentData();
        }
        if (typeof window.loadInputsData === 'function') {
            window.loadInputsData();
        }
    }
});
