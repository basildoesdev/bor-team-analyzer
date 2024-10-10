// UPDATET TO 1.0.5 //
import { Elements } from "./globalStore.js";

export function isKeyValid(key) {
    // Check if the key matches the required pattern
    return typeof key === 'string' && /^m=\d+&mk=[a-f0-9]{40}$/i.test(key);
}

export function trimKey(key) {
    if (typeof key !== 'string') {
        console.error('Expected a string for key trimming.');
        return '';
    }
    
    const parts = key.split('=');
    return parts[1] ? parts[1].split('&')[0] : '';
}

export function badKeyDay() {
    Elements.infoDisplay.innerHTML += "<h3 class='red'> Bad Key .. 😢</h3><button id='reload'> Reload </button>";
    
    const reload = document.getElementById('reload');
    
    if (reload) {
        reload.addEventListener('click', () => {
            localStorage.clear();
            location.reload(true);
        });
    }
}

export function checkSaveKeyInput() {
    const apiKeyInput = document.getElementById("settings-api-key");
    const saveButton = document.getElementById("settings-api-save");
    const isValid = isKeyValid(apiKeyInput.value);
    
    apiKeyInput.style.color = isValid ? "green" : "red";
    saveButton.disabled = !isValid;
    saveButton.style.backgroundColor = isValid ? '#e73d3d' : '#5e5d5d';
}

// Save new key and refresh data
export function saveNewKeyandRefresh() {
    const apiKeyInput = document.getElementById('settings-api-key');
    const accessKey = apiKeyInput.value;
    
    if (isKeyValid(accessKey)) {
        localStorage.setItem('key', accessKey);
        window.location.reload();
    } else {
        console.error('Attempted to save an invalid key.');
    }
}


