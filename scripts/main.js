// UPDATED TO 1.0.5 //

import { Elements, globals } from "./globalStore.js"; 
import { retrieveData } from "./fetchFunctions.js";
import { sortPlayers } from "./uiFunctions.js";
import { trimKey, checkSaveKeyInput, saveNewKeyandRefresh } from "./keyFunctions.js";
import { resetSliders, loadSavedPositionWeights } from "./settingsUiFunctions.js";

// Global functions for event handlers
window.showTab = showTab;
window.showTabDropdown = showTabDropdown;
window.checkKeyInput = checkKeyInput;
window.sortPlayers = sortPlayers;
window.checkSaveKeyInput = checkSaveKeyInput;
window.saveNewKeyandRefresh = saveNewKeyandRefresh;
window.retrieveData = retrieveData;
window.resetSliders = resetSliders;

// Event listener for the submit button
Elements.submitBtn.addEventListener('click', () => {
    if (Elements.isSaveKey.checked) {
        localStorage.setItem('key', Elements.accessKey.value);
    }
});


// On window load, check for saved key and retrieve data if available
window.onload = () => {
    const savedKey = localStorage.getItem('key');
    if (savedKey) {
        globals._mainKey = savedKey.slice(-40);
        retrieveData(true);
    }
};

function checkKeyInput() {
    const isValidKey = /^m=(\d+)&mk=([a-fA-F0-9]{40})$/;
    const fullKey = Elements.accessKey.value;

    if (isValidKey.test(fullKey)) {
        globals._mainKey = fullKey.slice(-40);
        globals._memberid = trimKey(fullKey);
        Elements.accessKey.style.color = 'green';
        Elements.submitBtn.style.backgroundColor = '#e73d3d';
        Elements.submitBtn.disabled = false;
        Elements.keyValidDisplay.innerHTML = '<p>Access Key:<span class="green"> (Valid Key Format) </span></p>';
    } else {
        Elements.accessKey.style.color = 'red';
        Elements.submitBtn.style.backgroundColor = '#a39999';
        Elements.submitBtn.disabled = true;
        Elements.keyValidDisplay.innerHTML = '<p>Access Key:<span class="red"> (Invalid Key Format) </span></p>';
    }
}

// Show the selected tab and update the active tab button
export function showTab(tabNumber) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById('tab' + tabNumber).classList.add('active');

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.getElementById('tab-' + tabNumber + '-btn').classList.add('active');
}

// Show tab via dropdown
export function showTabDropdown(tabNumber) {
    showTab(tabNumber); 
}

// Save the active tab to localStorage on click
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
        const activeTabId = tab.id; 
        localStorage.setItem('activeTab', activeTabId); 
    });
});

// Load saved tab on window load
window.addEventListener('load', () => {
    const savedTabId = localStorage.getItem('activeTab'); 
    const defaultTabId = 'tab-2-btn';
    (savedTabId ? document.getElementById(savedTabId) : document.getElementById(defaultTabId)).click(); 
});

// Back to top button functionality
const backToTopButton = document.getElementById("backToTop");

window.onscroll = () => {
    scrollFunction();
};

function scrollFunction() {
    backToTopButton.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? "block" : "none";
}

backToTopButton.onclick = () => {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
};

function isElectron() {
    return typeof window !== 'undefined' && window.process && window.process.type === 'renderer';
  }
  
  if (isElectron()) {
    console.log("Running in Electron");
  } else {
    let buttons = document.getElementById('title-bar-contols')
    buttons.style.display = 'none';
    console.log("Running in a traditional browser");
  }
  