import {positionWeights, defaultPositionWeights} from "./algorithmFunctions.js";
import { version, globals } from "./globalStore.js";

let positionData = {};

// Generate HTML for settings
export function getSettingsInfo() {
    let positionSettingsHTML = '';

    Object.keys(positionWeights).forEach(position => {
        const weights = positionWeights[position];
        globals.totalWeightsSum = Object.values(weights).reduce((acc, value) => acc + value, 0);
        positionSettingsHTML += `
            <div class='card'>
                <div><h2>${position} ~ <span id='${position}-total' style='font-size:large;'>( ${globals.totalWeightsSum} )</span></h2></div> 
                <br>
                <span class='hide-show-button' id='${position}-toggle'> Show </span>
                <hr>
                <br>
                <div class='slider-container' id='${position}-sliders'><span id='hide-show-button'>
                    <div>
                        <label for='${position}-weight'>Weight:</label> <span id='${position}-weightDisplay' class='sliderValue'>${weights.Weight}</span><br>
                        <input type='range' id='${position}-weight' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Weight}>
                    </div>
                    <div>
                        <label for='${position}-height'>Height:</label> <span id='${position}-heightDisplay' class='sliderValue'>${weights.Height}</span><br>
                        <input type='range' id='${position}-height' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Height}>    
                    </div>
                    <div>
                        <label for='${position}-stamina'>Stamina:</label> <span id='${position}-staminaDisplay' class='sliderValue'>${weights.Stamina}</span><br>
                        <input type='range' id='${position}-stamina' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Stamina}>    
                    </div>
                    <div>
                        <label for='${position}-attack'>Attack:</label> <span id='${position}-attackDisplay' class='sliderValue'>${weights.Attack}</span><br>
                        <input type='range' id='${position}-attack' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Attack}>    
                    </div>
                    <div>
                        <label for='${position}-technique'>Technique:</label>  <span id='${position}-techniqueDisplay' class='sliderValue'>${weights.Technique}</span><br>
                        <input type='range' id='${position}-technique' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Technique}>   
                    </div>
                    <div>
                        <label for='${position}-jumping'>Jumping:</label>  <span id='${position}-jumpingDisplay' class='sliderValue'>${weights.Jumping}</span><br>
                        <input type='range' id='${position}-jumping' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Jumping}>   
                    </div>
                    <div>
                        <label for='${position}-agility'>Agility:</label> <span id='${position}-agilityDisplay' class='sliderValue'>${weights.Agility}</span><br>
                        <input type='range' id='${position}-agility' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Agility}>    
                    </div>
                    <div>
                        <label for='${position}-handling'>Handling:</label>  <span id='${position}-handlingDisplay' class='sliderValue'>${weights.Handling}</span><br>
                        <input type='range' id='${position}-handling' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Handling}>   
                    </div>
                    <div>
                        <label for='${position}-defense'>Defense:</label> <span id='${position}-defenseDisplay' class='sliderValue'>${weights.Defense}</span><br>
                        <input type='range' id='${position}-defense' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Defense}>    
                    </div>
                    <div>
                        <label for='${position}-strength'>Strength:</label> <span id='${position}-strengthDisplay' class='sliderValue'>${weights.Strength}</span><br>
                        <input type='range' id='${position}-strength' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Strength}>
                    </div>
                    <div>
                        <label for='${position}-speed'>Speed:</label>  <span id='${position}-speedDisplay' class='sliderValue'>${weights.Speed}</span><br>
                        <input type='range' id='${position}-speed' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Speed}>
                    </div>
                    <div>
                        <label for='${position}-kicking'>Kicking:</label> <span id='${position}-kickingDisplay' class='sliderValue'>${weights.Kicking}</span><br>
                        <input type='range' id='${position}-kicking' class='restricted-input styled-slider' min='0' max='2' step='0.01' value=${weights.Kicking}>
                    </div>
                </div>
            </div>
        `;
    });

    return `
        
        <div class='card'>
            <h2>Algorithm Weight Adjustments</h2> 
            <hr><br>
            <div>
                Recomended that all totals for each position are the same to get fair and balanced results
            </div>
            <div>
                Refresh/reload to see updated suggestions on squad sheet
            </div>
            <br>
            <span><h3 id="refresh" class="refresh hide">↻ <small> Save and Refresh </small>↻ </h3></span>
        </div>        
        ${positionSettingsHTML}
        <div class='card'>
            <div  class='green default-weights'>
            <button onclick="resetSliders()" id='reload-defaults'>reload defaults</button>
            </div>
        </div>
        <div class='card'>
            <div class='flex-align'>
                <span>
                    <label for="settings-api-key" aria-label="Enter API Key">API Key</label>
                    <input type="text" id="settings-api-key" oninput="checkSaveKeyInput()">
                </span>
                <span>
                    <button id="settings-api-save" onclick='saveNewKeyandRefresh()' disabled="true" style="background-color:#5e5d5d;"> Save </button>
                </span>
            </div>
        </div>
        <div class='card'>
            <div class='flex-align'>
                <span>WIP Items</span>
                <span>(Version ${version})</span>
            </div>
            <div class='physicals'>
                <div> TM Page ? </div>
                <div>Player Stats</div>
                <div>Trohpy Cabinet ✅ </div>
                <div>Deploy Electron distributable</div>
                <div>Electron window UI ✅</div>
                <div>Adjustable algorithm weights✅</div>
                <div>Some positions are copies of others atm (halves, wing and FB) ✅ fixed</div>
                <div>Adjustable min weight and height exclusions</div>
                <div>Min Prop Weight & Height ✅</div>
                <div>Min Hooker Weight & Height ✅</div>
                <div>Min Lock Height ✅</div>
                <div>Positional skill algorithm ✅</div>
                <div>Squad sort ✅</div>
            </div>
        </div>

        <div class='card'>
            🪲 Bug? pm yaya <a href='https://www.blackoutrugby.com/game/me.office.php#page=mail&newmessage=1&folder=1&tab=inbox' target="_blank">here</a>
        </div>
    `;
}

// LOGIC SECTION //

// Calculate total for a position
function calculateTotal(position) {
    if (!positionData[position]) return 0;
    const total = positionData[position].sliders.reduce((sum, slider) => sum + parseFloat(slider.value), 0).toFixed(2);
    return `(${total})`;
}

// Set up the sliders and their behaviors
export function setRanges() {
    const inputs = document.querySelectorAll('.restricted-input');
    const hideShows = document.querySelectorAll('.hide-show-button');

    inputs.forEach(input => {
        const position = input.id.split('-')[0];

        // Initialize positionData if not already done
        if (!positionData[position]) {
            positionData[position] = {
                sliders: []
            };
        }

        positionData[position].sliders.push(input);

        const displayId = `${input.id}Display`;
        const displayElement = document.getElementById(displayId);
        displayElement.textContent = input.value;

        input.addEventListener('input', function () {
            displayElement.textContent = this.value; // Update display
            updateTotal(position); // Update the total score for the position
            updatePositionWeights(position); // Update the positionWeights object
        });
        
    });

    hideShows.forEach(hide => {
        hide.addEventListener('click', function() {
            const position = this.id.split('-toggle')[0];
            const sliderContainer = document.getElementById(`${position}-sliders`);
            if (sliderContainer.style.display === "none" || !sliderContainer.style.display) {
                sliderContainer.style.display = "block"; // Show sliders
                this.textContent = "Hide"; // Change button text to "Hide"
            } else {
                sliderContainer.style.display = "none"; // Hide sliders
                this.textContent = "Show"; // Change button text to "Show"
            }
        });
    });

    resetSliders(); // Call resetSliders after setting up the sliders
}

// Update the total score display for a position
function updateTotal(position) {
    const totalDisplayElement = document.getElementById(`${position}-total`);
    totalDisplayElement.textContent = calculateTotal(position);
}

// Update positionWeights based on the current slider values
function updatePositionWeights(position) {
    const sliders = positionData[position]?.sliders;

    if (!sliders || sliders.length === 0) {
        console.warn(`No sliders found for position: ${position}`);
        return;
    }

    // Update the positionWeights object with the current slider values
    const attributes = ['Weight', 'Height', 'Stamina', 'Attack', 'Technique', 'Jumping', 'Agility', 'Handling', 'Defense', 'Strength', 'Speed', 'Kicking'];
    attributes.forEach((attr, index) => {
        positionWeights[position][attr] = parseFloat(sliders[index].value);
    });

    savePositionWeights();
}

// Save positionWeights to localStorage
function savePositionWeights() {
    localStorage.setItem('positionWeights', JSON.stringify(positionWeights));
}

// Load saved position weights from localStorage
export function loadSavedPositionWeights() {
    const savedWeights = localStorage.getItem('positionWeights');
    if (savedWeights) {
        const loadedWeights = JSON.parse(savedWeights);

        Object.keys(loadedWeights).forEach(position => {
            const sliders = positionData[position]?.sliders;
            if (sliders) {
                sliders.forEach((slider, index) => {
                    slider.value = loadedWeights[position][Object.keys(loadedWeights[position])[index]];
                    updateSliderAndDisplay(position, slider);
                });
            }
        });

        // Update the global positionWeights object with loaded values
        Object.assign(positionWeights, loadedWeights);
    }
}

// Update each slider's display text
function updateSliderAndDisplay(position, slider) {
    const attribute = slider.id.split('-')[1].charAt(0).toUpperCase() + slider.id.split('-')[1].slice(1); // Convert to camel case
    const displayElement = document.getElementById(`${position}-${attribute.toLowerCase()}Display`);
    if (displayElement) {
        displayElement.textContent = slider.value;
    }
    updateTotal(position); // Update the total score
}

export function resetSliders() {
    Object.keys(positionWeights).forEach(position => {
        // Reset to defaultPositionWeights for each position
        positionWeights[position] = { ...defaultPositionWeights[position] };

        // Update the sliders and display values in the DOM for each attribute of the position
        Object.keys(positionWeights[position]).forEach(attribute => {
            const slider = document.getElementById(`${position}-${attribute.toLowerCase()}`);
            if (slider) {
                // Update the slider's value to the default value
                slider.value = positionWeights[position][attribute];

                // Update the display span to show the default value
                const displayElement = document.getElementById(`${position}-${attribute.toLowerCase()}Display`);
                if (displayElement) {
                    displayElement.textContent = positionWeights[position][attribute];
                }
            }
        });

        // Recalculate and update the total score display for the position
        updateTotal(position);
    });

    // Save the updated positionWeights to localStorage
    savePositionWeights();
}







