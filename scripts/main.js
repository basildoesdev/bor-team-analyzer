import { globals, submitBtn, accessKey, isSaveKey, keyValidDisplay, versionTop, version} from "./globalStore.js"; 
import { retrieveData } from "./fetchFunctions.js";
import { sortPlayers } from "./uiFunctions.js";
import { trimKey, checkSaveKeyInput, saveNewKeyandRefresh } from "./keyFunctions.js";
import { resetSliders} from "./settingsUiFunctions.js";

versionTop.innerHTML = ` Version  <span style='font-size:small;'>( ${version} )</span>`;
// Save key if checkbox is checked
submitBtn.addEventListener('click', () => {
    if (isSaveKey.checked) localStorage.setItem('key', accessKey.value);
});

// Initialize on window load
window.onload = () => {
    let savedKey = localStorage.getItem('key');
    // loadSavedPositionWeights();
    // setRanges();
    if (savedKey) {
        globals._mainKey = savedKey.slice(-40);
        retrieveData(true);
    }
};

// Check if the access key input is valid
function checkKeyInput() {
    const isValidKey = /^m=(\d+)&mk=([a-fA-F0-9]{40})$/;
    const fullKey = accessKey.value;

    if (isValidKey.test(fullKey)) {
        globals._mainKey = fullKey.slice(-40);
        globals._memberid = trimKey(fullKey);
        accessKey.style.color = 'green';
        submitBtn.style.backgroundColor = '#e73d3d';
        submitBtn.disabled = false;
        keyValidDisplay.innerHTML = '<p>Access Key:<span class="green"> (Valid Key Format) </span></p>';
    } else {
        accessKey.style.color = 'red';
        submitBtn.style.backgroundColor = '#a39999';
        submitBtn.disabled = true;
        keyValidDisplay.innerHTML = '<p>Access Key:<span class="red"> (Invalid Key Format) </span></p>';
    }
}

export function showTab(tabNumber) {
    // Hide all tab contents
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show the selected tab content
    document.getElementById('tab' + tabNumber).classList.add('active');

    // Optional: For buttons, also toggle active class
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.getElementById('tab-' + tabNumber + '-btn').classList.add('active');
}

export function showTabDropdown(tabNumber) {
    showTab(tabNumber); // Reuse the same logic
}

window.showTab = showTab;
window.showTabDropdown = showTabDropdown;
window.checkKeyInput = checkKeyInput;
window.sortPlayers = sortPlayers;
window.checkSaveKeyInput = checkSaveKeyInput;
window.saveNewKeyandRefresh = saveNewKeyandRefresh;
window.retrieveData = retrieveData;
window.resetSliders = resetSliders;

document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
        const activeTabId = this.id; // Assuming tab buttons have unique IDs
        localStorage.setItem('activeTab', activeTabId); // Store active tab ID
    });
});

window.addEventListener('load', function() {
    const savedTabId = localStorage.getItem('activeTab'); // Get saved tab ID
    if (savedTabId) {
        document.getElementById(savedTabId).click(); // Simulate a click on the saved tab to restore it
    } else {
        // Optionally, handle the default case (if nothing is saved)
        document.getElementById('tab-2-btn').click(); // Click the default tab
    }
});

fetch('/.netlify/functions/getKey.js')
  .then(response => response.json())
  .then(data => {
    console.log(data.DEVKEY); // Access the key here
  })
  .catch(error => console.error('Error fetching key:', error));