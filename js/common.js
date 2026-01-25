// Common script for user avatar click to navigate to profile
document.addEventListener('DOMContentLoaded', function () {
    const userAvatar = document.getElementById('userMenuBtn');
    if (userAvatar) {
        userAvatar.style.cursor = 'pointer';
        userAvatar.addEventListener('click', function () {
            window.location.href = 'farmer-profile.html';
        });
    }
});
