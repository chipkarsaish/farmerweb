import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const farmerTableBody = document.getElementById('farmerTableBody');
const searchInput = document.getElementById('farmerSearch');

// Add authentication check
let currentUser = null;
let isAdmin = false;

// Wait for authentication before loading data
onAuthStateChanged(auth, async (user) => {
    console.log("🔐 Auth state changed:", user ? "User logged in" : "No user");

    if (!user) {
        console.warn("⚠️ No user authenticated, redirecting to login...");
        window.location.href = "../../index.html";
        return;
    }

    currentUser = user;
    console.log("✅ User authenticated:", {
        uid: user.uid,
        email: user.email
    });

    // Check if user is admin
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            isAdmin = userData.role === "administrator";
            console.log("👤 User role:", userData.role);
            console.log("🔑 Is Admin:", isAdmin);

            if (!isAdmin) {
                alert("Access Denied: You must be an administrator to access this page.");
                window.location.href = "../../index.html";
                return;
            }

            // User is admin, load data
            fetchFarmers();
            fetchFunds();
        } else {
            console.error("❌ User document not found");
            alert("User profile not found. Please contact support.");
            window.location.href = "../../index.html";
        }
    } catch (error) {
        console.error("❌ Error checking user role:", error);
        alert("Error verifying permissions. Please try again.");
    }
});

// Ensure the drawer toggle function is globally accessible
window.toggleDrawer = function (show, name = '', id = '', role = '', crop = '', location = '', size = '') {
    const drawer = document.getElementById('profileDrawer');
    if (show) {
        document.getElementById('pName').innerText = name || 'N/A';
        document.getElementById('pID').innerText = "ID: " + (id || 'N/A');

        // Populate additional details in the drawer if elements exist
        // You might need to add these elements to your HTML drawer first
        const detailsContainer = drawer.querySelector('.drawer-content > div'); // The existing div with background
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <h4 style="margin-bottom: 10px; color: var(--dark-green);">Farmer Details</h4>
                <p><strong>Role:</strong> ${role || 'N/A'}</p>
                <p><strong>Crops:</strong> ${crop || 'N/A'}</p>
                <p><strong>Location:</strong> ${location || 'N/A'}</p>
                <p><strong>Farm Size:</strong> ${size ? size + ' Acres' : 'N/A'}</p>
                <hr style="margin: 15px 0; border-color: #ddd;">
                <h4 style="margin-bottom: 10px; color: var(--dark-green);">Audit Checklist</h4>
                <p>✅ Land Title Verified</p>
                <p>✅ Past Resource Audit: High Yield</p>
                <p>✅ Carbon Credits: 14.2 Tons</p>
            `;
        }

        drawer.classList.add('active');
    } else {
        drawer.classList.remove('active');
    }
}

async function fetchFarmers() {
    console.log("Starting fetchFarmers...");
    try {
        if (!farmerTableBody) {
            console.error("Critical Error: farmerTableBody element not found!");
            return;
        }

        farmerTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading farmers from Firestore...</td></tr>';

        console.log("Querying users collection where role == 'farmer'...");
        const q = query(collection(db, "users"), where("role", "==", "farmer"));
        const querySnapshot = await getDocs(q);

        console.log(`Query completed. Documents found: ${querySnapshot.size}`);
        farmerTableBody.innerHTML = ''; // Clear loading message

        if (querySnapshot.empty) {
            console.warn("No farmers found matching the query.");
            farmerTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No farmers found in the database.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Processing doc:", doc.id, data);

            const row = document.createElement('tr');

            // Format ID for display (first 6 chars)
            const displayId = data.uid ? '#' + data.uid.substring(0, 6).toUpperCase() : '#UNKNOWN';

            row.innerHTML = `
                <td><strong>${data.name || 'Unknown Name'}</strong></td>
                <td>${displayId}</td>
                <td>${data.farmlocation || 'N/A'}</td>
                <td>${data.crop || 'N/A'}</td>
                <td>${data.phone || 'N/A'}</td>
                <td>
                    <button class="view-btn" onclick="toggleDrawer(
                        true, 
                        '${data.name || ''}', 
                        '${displayId}',
                        '${data.role || ''}',
                        '${data.crop || ''}',
                        '${data.farmlocation || ''}',
                        '${data.farmsize || ''}'
                    )">View Details</button>
                </td>
            `;
            farmerTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching farmers:", error);

        let errorMsg = `Error loading data: ${error.message}`;
        if (error.code === 'permission-denied' || error.message.includes('permission-denied')) {
            errorMsg = `<strong>Permission Denied</strong><br>
            1. Check Firestore Rules (allow read/write).<br>
            2. Ensure you are logged in (if rules require auth).`;
        } else if (error.code === 'unavailable') {
            errorMsg = `<strong>Network Error</strong><br>Check your internet connection or Firestore quotas.`;
        }

        farmerTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red; padding:20px; line-height:1.5;">${errorMsg}</td></tr>`;
    }
}

// DOMContentLoaded is no longer needed - auth callback handles initialization
// Data will be fetched after authentication is verified

// Search Logic (Client-side filtering of the fetched table)
if (searchInput) {
    searchInput.addEventListener('keyup', function () {
        let filter = this.value.toLowerCase();
        let rows = farmerTableBody.getElementsByTagName('tr');

        for (let row of rows) {
            let text = row.innerText.toLowerCase();
            row.style.display = text.includes(filter) ? "" : "none";
        }
    });
}

// ========================================
// FUNDS MANAGEMENT
// ========================================

const fundsTableBody = document.getElementById('fundsTableBody');
const fundsSearchInput = document.getElementById('fundsSearch');

async function fetchFunds() {
    console.log("Starting fetchFunds...");
    try {
        if (!fundsTableBody) {
            console.error("Critical Error: fundsTableBody element not found!");
            return;
        }

        fundsTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Loading funds data from Firestore...</td></tr>';

        console.log("Querying fund_loan collection...");
        const fundsSnapshot = await getDocs(collection(db, "fund_loan"));

        console.log(`Query completed. Documents found: ${fundsSnapshot.size}`);
        fundsTableBody.innerHTML = ''; // Clear loading message

        if (fundsSnapshot.empty) {
            console.warn("No funds data found.");
            fundsTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No funds data found in the database.</td></tr>';
            return;
        }

        // Fetch all users to map userId to farmer name
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnapshot.forEach(doc => {
            usersMap[doc.id] = doc.data().name || 'Unknown';
        });

        fundsSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Processing funds doc:", doc.id, data);

            const row = document.createElement('tr');

            // Get farmer name from users map
            const farmerName = usersMap[data.userId] || 'Unknown Farmer';
            const displayId = data.userId ? '#' + data.userId.substring(0, 6).toUpperCase() : '#UNKNOWN';

            row.innerHTML = `
                <td><strong>${farmerName}</strong></td>
                <td>${displayId}</td>
                <td>₹${(data.creditLimit || 0).toLocaleString()}</td>
                <td>${data.activeLoans || 0}</td>
                <td>₹${(data.outstandingAmount || 0).toLocaleString()}</td>
                <td>${data.eligibleSubsidies || 0} Schemes</td>
                <td>${data.carbonCredits || 0} (₹${(data.carbonValue || 0).toLocaleString()})</td>
            `;
            fundsTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching funds:", error);

        let errorMsg = `Error loading data: ${error.message}`;
        if (error.code === 'permission-denied' || error.message.includes('permission-denied')) {
            errorMsg = `<strong>Permission Denied</strong><br>
            1. Check Firestore Rules for fund_loan collection.<br>
            2. Ensure admin has read access.`;
        } else if (error.code === 'unavailable') {
            errorMsg = `<strong>Network Error</strong><br>Check your internet connection or Firestore quotas.`;
        }

        fundsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red; padding:20px; line-height:1.5;">${errorMsg}</td></tr>`;
    }
}

// Search Logic for Funds Table
if (fundsSearchInput) {
    fundsSearchInput.addEventListener('keyup', function () {
        let filter = this.value.toLowerCase();
        let rows = fundsTableBody.getElementsByTagName('tr');

        for (let row of rows) {
            let text = row.innerText.toLowerCase();
            row.style.display = text.includes(filter) ? "" : "none";
        }
    });
}
