// ===============================
// FILTER MODAL AND HANDLERS
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
            if (window.currentFilters) {
                window.currentFilters.minPrice = value;
                if (window.renderAmenities) window.renderAmenities();
            }
        });

        priceRangeMin.addEventListener("input", (e) => {
            const value = parseInt(e.target.value);
            minPriceInput.value = value;
            if (minPriceLabel) minPriceLabel.textContent = `₹${value}`;
            if (window.currentFilters) {
                window.currentFilters.minPrice = value;
                if (window.renderAmenities) window.renderAmenities();
            }
        });
    }

    if (maxPriceInput && priceRangeMax) {
        maxPriceInput.addEventListener("input", (e) => {
            const value = parseInt(e.target.value) || 5000;
            priceRangeMax.value = value;
            if (maxPriceLabel) maxPriceLabel.textContent = `₹${value}`;
            if (window.currentFilters) {
                window.currentFilters.maxPrice = value;
                if (window.renderAmenities) window.renderAmenities();
            }
        });

        priceRangeMax.addEventListener("input", (e) => {
            const value = parseInt(e.target.value);
            maxPriceInput.value = value;
            if (maxPriceLabel) maxPriceLabel.textContent = `₹${value}`;
            if (window.currentFilters) {
                window.currentFilters.maxPrice = value;
                if (window.renderAmenities) window.renderAmenities();
            }
        });
    }

    // Quantity Filter
    if (minQuantitySelect) {
        minQuantitySelect.addEventListener("change", (e) => {
            if (window.currentFilters) {
                window.currentFilters.minQuantity = e.target.value ? parseInt(e.target.value) : null;
                if (window.renderAmenities) window.renderAmenities();
            }
        });
    }

    // Sort By
    if (sortBySelect) {
        sortBySelect.addEventListener("change", (e) => {
            if (window.currentFilters) {
                window.currentFilters.sort = e.target.value;
                if (window.renderAmenities) window.renderAmenities();
            }
        });
    }

    // Clear Filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            // Reset all inputs
            if (minPriceInput) minPriceInput.value = "";
            if (maxPriceInput) maxPriceInput.value = "";
            if (priceRangeMin) priceRangeMin.value = 0;
            if (priceRangeMax) priceRangeMax.value = 5000;
            if (minPriceLabel) minPriceLabel.textContent = "₹0";
            if (maxPriceLabel) maxPriceLabel.textContent = "₹5000";
            if (minQuantitySelect) minQuantitySelect.value = "";
            if (sortBySelect) sortBySelect.value = "";

            // Clear filters
            if (window.currentFilters) {
                window.currentFilters = {};
                if (window.renderAmenities) window.renderAmenities();
            }
        });
    }
});
