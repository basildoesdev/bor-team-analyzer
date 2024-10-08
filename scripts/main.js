import { globals, submitBtn, accessKey, isSaveKey, keyValidDisplay, versionTop, version} from "./globalStore.js"; 
import { retrieveData } from "./fetchFunctions.js";
import { sortPlayers } from "./uiFunctions.js";
import { trimKey, checkSaveKeyInput, saveNewKeyandRefresh } from "./keyFunctions.js";
import { resetSliders} from "./settingsUiFunctions.js";

// versionTop.innerHTML = ` Version  <span style='font-size:small;'>( ${version} )</span>`;

window.showTab = showTab;
window.showTabDropdown = showTabDropdown;
window.checkKeyInput = checkKeyInput;
window.sortPlayers = sortPlayers;
window.checkSaveKeyInput = checkSaveKeyInput;
window.saveNewKeyandRefresh = saveNewKeyandRefresh;
window.retrieveData = retrieveData;
window.resetSliders = resetSliders;

submitBtn.addEventListener('click', () => {
    if (isSaveKey.checked) localStorage.setItem('key', accessKey.value);
});

window.onload = () => {
    let savedKey = localStorage.getItem('key');
    // loadSavedPositionWeights();
    // setRanges();
    if (savedKey) {
        globals._mainKey = savedKey.slice(-40);
        retrieveData(true);
    }
};

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
    showTab(tabNumber); 
}

document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
        const activeTabId = this.id; 
        localStorage.setItem('activeTab', activeTabId); 
    });
});

window.addEventListener('load', function() {
    const savedTabId = localStorage.getItem('activeTab'); 
    if (savedTabId) {
        document.getElementById(savedTabId).click(); 
    } else {
        document.getElementById('tab-2-btn').click();
    }
});


let backToTopButton = document.getElementById("backToTop");


window.onscroll = function() { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
}

// Scroll to the top of the page when the button is clicked
backToTopButton.onclick = function() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
};
