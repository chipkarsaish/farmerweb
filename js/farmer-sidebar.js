// Farmer Sidebar Toggle Functionality

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.farmer-sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const mainContent = document.querySelector('.main-content-with-sidebar');

    // Load sidebar state from localStorage
    const sidebarState = localStorage.getItem('farmerSidebarMinimized');
    if (sidebarState === 'true') {
        sidebar?.classList.add('minimized');
        mainContent?.classList.add('sidebar-minimized');
    }

    // Toggle sidebar
    toggleBtn?.addEventListener('click', function () {
        sidebar?.classList.toggle('minimized');
        mainContent?.classList.toggle('sidebar-minimized');

        // Save state to localStorage
        const isMinimized = sidebar?.classList.contains('minimized');
        localStorage.setItem('farmerSidebarMinimized', isMinimized);
    });

    // Mobile sidebar toggle
    const mobileToggle = document.querySelector('.mobile-sidebar-toggle');
    mobileToggle?.addEventListener('click', function () {
        sidebar?.classList.toggle('mobile-open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            if (!sidebar?.contains(e.target) && !mobileToggle?.contains(e.target)) {
                sidebar?.classList.remove('mobile-open');
            }
        }
    });
});
