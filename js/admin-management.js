import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from "firebase/firestore";

const farmerTableBody = document.getElementById('farmerTableBody');
const searchInput = document.getElementById('farmerSearch');

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

// Initial fetch
document.addEventListener('DOMContentLoaded', fetchFarmers);

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
