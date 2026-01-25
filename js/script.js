
// Import Firebase module
import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc
} from "firebase/firestore";

// Modal and Authentication State Management
let currentAuthMode = 'login'; // 'login' or 'register'
let selectedRole = null; // 'farmer', 'administrator', or 'buyer'

// DOM Elements
const modal = document.getElementById('authModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

// Buttons
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const heroRegisterBtn = document.getElementById('heroRegisterBtn');
const heroLearnBtn = document.getElementById('heroLearnBtn');

// Auth Steps
const roleSelection = document.getElementById('roleSelection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Role Cards
const roleCards = document.querySelectorAll('.role-card');

// Back Buttons
const backToRoleFromLogin = document.getElementById('backToRoleFromLogin');
const backToRoleFromRegister = document.getElementById('backToRoleFromRegister');

// Switch Links
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// Role-specific fields
const farmerFields = document.getElementById('farmerFields');
const adminFields = document.getElementById('adminFields');

// Role text displays
const loginRoleText = document.getElementById('loginRoleText');
const registerRoleText = document.getElementById('registerRoleText');

// Event Listeners - Open Modal
loginBtn.addEventListener('click', () => openModal('login'));
registerBtn.addEventListener('click', () => openModal('register'));
heroRegisterBtn.addEventListener('click', () => openModal('register'));

// Learn More - Scroll to features
heroLearnBtn.addEventListener('click', () => {
    document.querySelector('.features').scrollIntoView({ behavior: 'smooth' });
});

// Event Listeners - Close Modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Event Listeners - Role Selection
roleCards.forEach(card => {
    card.addEventListener('click', () => {
        selectedRole = card.dataset.role;
        showAuthForm();
    });
});

// Event Listeners - Back Buttons
backToRoleFromLogin.addEventListener('click', showRoleSelection);
backToRoleFromRegister.addEventListener('click', showRoleSelection);

// Event Listeners - Switch Between Login/Register
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    currentAuthMode = 'register';
    showRoleSelection();
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    currentAuthMode = 'login';
    showRoleSelection();
});

// Event Listeners - Form Submissions
document.querySelector('#loginForm .auth-form').addEventListener('submit', handleLogin);
document.getElementById('registrationForm').addEventListener('submit', handleRegister);

// Functions
function openModal(mode) {
    currentAuthMode = mode;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    showRoleSelection();
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    resetModal();
}

function resetModal() {
    selectedRole = null;
    hideAllSteps();
    roleSelection.classList.remove('hidden');
    // Clear forms
    document.querySelector('#loginForm .auth-form').reset();
    document.getElementById('registrationForm').reset();
}

function hideAllSteps() {
    roleSelection.classList.add('hidden');
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
}

function showRoleSelection() {
    hideAllSteps();
    roleSelection.classList.remove('hidden');
}

function showAuthForm() {
    hideAllSteps();

    // Capitalize role name for display
    const roleDisplayName = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);

    if (currentAuthMode === 'login') {
        loginForm.classList.remove('hidden');
        loginRoleText.textContent = roleDisplayName;
    } else {
        registerForm.classList.remove('hidden');
        registerRoleText.textContent = roleDisplayName;
        showRoleSpecificFields();
    }
}

function showRoleSpecificFields() {
    // Hide all role-specific fields first
    farmerFields.classList.add('hidden');
    adminFields.classList.add('hidden');

    // Show relevant fields based on selected role
    if (selectedRole === 'farmer') {
        farmerFields.classList.remove('hidden');
    } else if (selectedRole === 'administrator') {
        adminFields.classList.remove('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();

    // UI Feedback: Disable button, show loading state can be added here
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch User Data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Allow login only if the role matches the selected role or if we don't enforce role selection at login (currently we do enforce it via UI flow)
            // Ideally, we should just redirect based on the role in the DB, but the UI forces a selection first.
            // Let's verify if the selected role matches the DB role to prevent confusion.
            if (userData.role !== selectedRole) {
                alert(`This account is registered as a ${userData.role}, not a ${selectedRole}. Please switch roles.`);
                auth.signOut(); // Sign out the mis-matched user
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                return;
            }

            console.log('Login successful:', userData);

            // Store user data in localStorage for simple access in other pages (optional but keeps existing pattern)
            // Note: Firebase Auth persists session automatically, so this is just for easy redundant access
            localStorage.setItem('farmerConnectUser', JSON.stringify({
                uid: user.uid,
                ...userData,
                loginTime: new Date().toISOString()
            }));

            // Redirect based on role
            if (userData.role === 'farmer') {
                window.location.href = './html/farmer-dashboard.html';
            } else if (userData.role === 'administrator') {
                window.location.href = './html/admin/dashboard.html';
            }
        } else {
            console.error("No such user document!");
            alert("User profile not found. Please contact support.");
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }

    } catch (error) {
        console.error("Login error:", error);
        let errorMessage = "Failed to login. Please check your credentials.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "Invalid email or password.";
        }
        alert(errorMessage);
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
    }

    // Validate terms agreement
    if (!agreeTerms) {
        alert('Please agree to the Terms & Conditions');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
    }

    // Collect role-specific data
    let roleSpecificData = {};

    if (selectedRole === 'farmer') {
        roleSpecificData = {
            farmLocation: document.getElementById('farmLocation').value,
            farmSize: document.getElementById('farmSize').value,
            cropsGrown: document.getElementById('cropsGrown').value
        };
    } else if (selectedRole === 'administrator') {
        roleSpecificData = {
            department: document.getElementById('department').value
        };
    }

    try {
        // Create Authentication User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Prepare User Data for Firestore
        const userData = {
            uid: user.uid,
            role: selectedRole,
            name: name,
            email: email,
            phone: phone,
            registrationTime: new Date().toISOString(),
            ...roleSpecificData
        };

        // Save User Data to Firestore
        // Using setDoc with specific ID (user.uid)
        await setDoc(doc(db, "users", user.uid), userData);

        console.log('Registration successful:', userData);

        // Sign out the automatically logged-in user
        await signOut(auth);

        // Switch to login view
        currentAuthMode = 'login';
        showAuthForm();

        // Show inline success message
        const loginFormContainer = document.querySelector('#loginForm');

        // Remove any existing alerts
        const existingAlert = loginFormContainer.querySelector('.alert');
        if (existingAlert) existingAlert.remove();

        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success';
        successAlert.innerHTML = `
            <div>✅</div>
            <div>Registration successful! Please login.</div>
        `;

        // Insert after back button (as second element)
        const backBtn = loginFormContainer.querySelector('.back-btn');
        if (backBtn && backBtn.nextSibling) {
            loginFormContainer.insertBefore(successAlert, backBtn.nextSibling);
        } else {
            loginFormContainer.prepend(successAlert);
        }

        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;

    } catch (error) {
        console.error("Registration error:", error);
        // Show the actual error message for debugging
        alert(`Registration Failed:\n${error.message}\n(Code: ${error.code})`);

        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}


// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }

    lastScroll = currentScroll;
});
