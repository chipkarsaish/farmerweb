// i18n.js - Internationalization Module for FarmerConnect
// Supports English, Hindi, and Marathi

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.fallbackLang = 'en';
    }

    // Load translation file for a specific language
    async loadTranslations(lang) {
        try {
            // Automatically detect base path for GitHub Pages or local server
            let basePath = '/translations/';

            // If on GitHub Pages, extract repository name from URL
            if (window.location.hostname.includes('github.io')) {
                const pathParts = window.location.pathname.split('/').filter(p => p);
                if (pathParts.length > 0) {
                    basePath = `/${pathParts[0]}/translations/`;
                }
            }

            const response = await fetch(`${basePath}${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
            this.translations[lang] = await response.json();
            return true;
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            return false;
        }
    }

    // Initialize i18n system
    async init() {
        // Load current language
        await this.loadTranslations(this.currentLang);

        // Load fallback language if different
        if (this.currentLang !== this.fallbackLang) {
            await this.loadTranslations(this.fallbackLang);
        }

        // Apply translations to page
        this.translatePage();

        // Update language switcher UI
        this.updateLanguageSwitcher();
    }

    // Get translation by key path (e.g., "nav.login")
    t(key, lang = this.currentLang) {
        const keys = key.split('.');
        let translation = this.translations[lang];

        // Traverse the nested object
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English if key not found
                if (lang !== this.fallbackLang) {
                    return this.t(key, this.fallbackLang);
                }
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return translation;
    }

    // Translate all elements on the page
    translatePage() {
        // Translate text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Translate titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Translate aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            element.setAttribute('aria-label', this.t(key));
        });

        // Update document title
        const titleElement = document.querySelector('[data-i18n-page-title]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n-page-title');
            document.title = this.t(key);
        }

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
    }

    // Change language
    async changeLanguage(lang) {
        if (lang === this.currentLang) return;

        // Load translations if not already loaded
        if (!this.translations[lang]) {
            const loaded = await this.loadTranslations(lang);
            if (!loaded) {
                console.error(`Failed to change language to ${lang}`);
                return;
            }
        }

        // Update current language
        this.currentLang = lang;
        localStorage.setItem('language', lang);

        // Re-translate page
        this.translatePage();

        // Update language switcher UI
        this.updateLanguageSwitcher();

        // Dispatch custom event for other components to react
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    // Update language switcher button states
    updateLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update dropdown display if exists
        const currentLangDisplay = document.querySelector('.current-lang-display');
        if (currentLangDisplay) {
            const langNames = {
                'en': 'English',
                'hi': 'हिंदी',
                'mr': 'मराठी'
            };
            currentLangDisplay.textContent = langNames[this.currentLang];
        }
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Create global i18n instance
const i18n = new I18n();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await i18n.init();

    // Setup language switcher event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            i18n.changeLanguage(lang);
        });
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}