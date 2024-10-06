import { infoDisplay } from "./globalStore.js";
import { retrieveData } from "./fetchFunctions.js";

export function isKeyValid(key) {
    return /^m=\d+&mk=[a-f0-9]{40}$/i.test(key);
}

export function trimKey(key) {
    return key.split('=')[1].split('&')[0];
}

export function badKeyDay(){
    infoDisplay.innerHTML += "<h3 class='red'> Bad Key .. 😢</h3><button id='reload'> Reload </button>";

    let reload = document.getElementById('reload');
    
    reload.addEventListener('click', () =>{
        localStorage.clear();
        location.reload(true);
    })
}

export function checkSaveKeyInput(){
    let _key = document.getElementById("settings-api-key").value
    
    if(isKeyValid(_key)){
        document.getElementById("settings-api-key").style.color = "green"
        document.getElementById("settings-api-save").disabled = false;
        document.getElementById("settings-api-save").style.backgroundColor = '#e73d3d';
    }else{
        document.getElementById("settings-api-key").style.color = "red"
        document.getElementById("settings-api-save").disabled = true;
        document.getElementById("settings-api-save").style.backgroundColor = '#5e5d5d';
        
    };
}

// Save new key and refresh data
export function saveNewKeyandRefresh() {
    const _accessKey = document.getElementById('settings-api-key').value;
    localStorage.setItem('key', _accessKey);
    retrieveData(true);
}

