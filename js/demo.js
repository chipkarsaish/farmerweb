// ===============================
// DEMO PAGE LANGUAGE SWITCHER
// ===============================

// Video paths for different languages
const videoConfig = {
    en: {
        path: '../videos/demo-english.mp4',
        name: 'English',
        available: false // Set to true when video is uploaded
    },
    hi: {
        path: '../videos/demo-hindi.mp4',
        name: 'हिंदी',
        available: false // Set to true when video is uploaded
    },
    mr: {
        path: '../videos/demo-marathi.mp4',
        name: 'मराठी',
        available: false // Set to true when video is uploaded
    }
};

let currentLanguage = 'en';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const videoPlayerWrapper = document.getElementById('videoPlayerWrapper');
    const videoSource = document.getElementById('videoSource');
    const demoVideo = document.getElementById('demoVideo');
    const currentLangName = document.getElementById('currentLangName');
    const videoLangName = document.getElementById('videoLangName');

    // Language button click handlers
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            
            // Update active state
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Switch language
            switchLanguage(selectedLang);
        });
    });

    function switchLanguage(lang) {
        currentLanguage = lang;
        const config = videoConfig[lang];

        // Update language name displays
        if (currentLangName) {
            currentLangName.textContent = config.name;
        }
        if (videoLangName) {
            videoLangName.textContent = config.name;
        }

        // Check if video is available for this language
        if (config.available) {
            // Show video player, hide placeholder
            videoPlaceholder.style.display = 'none';
            videoPlayerWrapper.style.display = 'block';
            
            // Update video source
            videoSource.src = config.path;
            demoVideo.load();
            
            console.log(`Switched to ${config.name} video: ${config.path}`);
        } else {
            // Show placeholder, hide video player
            videoPlaceholder.style.display = 'flex';
            videoPlayerWrapper.style.display = 'none';
            
            console.log(`${config.name} video not yet available`);
        }
    }

    // Initialize with English
    switchLanguage('en');
});

// Function to enable a video (call this when you upload a video)
// Example: enableVideo('en') when you upload the English video
function enableVideo(lang) {
    if (videoConfig[lang]) {
        videoConfig[lang].available = true;
        console.log(`${videoConfig[lang].name} video enabled`);
        
        // If this is the current language, refresh the display
        if (currentLanguage === lang) {
            const event = new Event('click');
            document.querySelector(`[data-lang="${lang}"]`).dispatchEvent(event);
        }
    }
}

// Expose function globally for easy testing
window.enableVideo = enableVideo;
