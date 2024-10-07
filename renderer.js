// renderer.js
document.getElementById('minimize').addEventListener('click', () => {
    window.electronAPI.minimizeWindow(); // Use electronAPI instead of electron
});

document.getElementById('maximize').addEventListener('click', () => {
    window.electronAPI.maximizeWindow(); // Use electronAPI instead of electron
});

document.getElementById('close').addEventListener('click', () => {
    window.electronAPI.closeWindow(); // Use electronAPI instead of electron
});

document.querySelector('.title-bar').addEventListener('mousedown', () => {
    window.electronAPI.dragWindow(); // Use electronAPI instead of electron
});
