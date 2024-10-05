const version = 0.8;
const versionDisplay = document.getElementById('version');
const infoDisplay = document.getElementById('information');
const dataDisplay = document.getElementById('player-card-container');
const dataDisplayAvg = document.getElementById('averages');
const sortListDiplay = document.getElementById('sort-list-display');
const form = document.getElementById('team-analyzer-form');
const submitBtn = document.getElementById('submit');
const accessKey = document.getElementById('access-key');
const isSaveKey = document.getElementById('save-key');
const keyValidDisplay = document.getElementById('key-valid-display');
const infoContainer = document.getElementById('info-container');
const tab1Name = document.getElementById('tab-1-btn');
const tab2Name = document.getElementById('tab-2-btn');
const tab3Name = document.getElementById('tab-3-btn');
const tab4Name = document.getElementById('tab-4-btn');
const option1Name = document.getElementById('option1');
const option2Name = document.getElementById('option2');
const option3Name = document.getElementById('option3');
const option4Name = document.getElementById('option4');
const managerInfo = document.getElementById('manager-infos');
const clubInfo = document.getElementById('club-infos');
// const lineupInfo = document.getElementById('lineup-infos');
const settingsInfo = document.getElementById('settings-infos');


let PLAYER_DATA = [], CLUB_DATA = [], MEMBER_DATA = [];
let PLAYER_STATISTICS_DATA = []
let LAST_FIXTURE_DATA = []
let _globals = { season: '', round: '', day: '',};
let _mainKey, _memberid, _teamid;


let isPremium = false;
let refresh;


// Save key if checkbox is checked
submitBtn.addEventListener('click', () => {
    if (isSaveKey.checked) localStorage.setItem('key', accessKey.value);
});

// Initialize on window load
window.onload = () => {
    const savedKey = localStorage.getItem('key');
    if (savedKey) {
        _mainKey = savedKey.slice(-40);
        retrieveData(true);
    }
};

// Log development data
function devDataLogs() {
    console.log('Player Data:', PLAYER_DATA);
    console.log('Club Data:', CLUB_DATA);
    console.log('Member Data:', MEMBER_DATA);
}

// Check if the access key input is valid
function checkKeyInput() {
    const isValidKey = /^m=(\d+)&mk=([a-fA-F0-9]{40})$/;
    const fullKey = accessKey.value;

    if (isValidKey.test(fullKey)) {
        _mainKey = fullKey.slice(-40);
        _memberid = trimKey(fullKey);
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

// Trim the key to extract member ID
function trimKey(key) {
    return key.split('=')[1].split('&')[0];
}

// Validate key format
function isKeyValid(key) {
    return /^m=\d+&mk=[a-f0-9]{40}$/i.test(key);
}

// Save new key and refresh data
function saveNewKeyandRefresh() {
    const _accessKey = document.getElementById('settings-api-key').value;
    localStorage.setItem('key', _accessKey);
    retrieveData(true);
}

function badKeyDay(){
    infoDisplay.innerHTML += "<h3 class='red'> Bad Key .. 😢</h3><button id='reload'> Reload </button>";

    let reload = document.getElementById('reload');
    
    reload.addEventListener('click', () =>{
        localStorage.clear();
        location.reload(true);
    })
}

function checkSaveKeyInput(){
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

// KEY AREAS  CLOSE //

// FETCH AREA OPEN //

async function fetchRugbyData(request_type, additionalParams = {}) {
    const url = 'https://corsproxy.io/?https://classic-api.blackoutrugby.com/?d=1038';
    const mailparams = {
        d: 1038,
        dk: '2yysSrd2fZxuOu5y',
        r: request_type,
        m: _memberid,
        mk: _mainKey,
        json: 1,
        ...additionalParams
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(mailparams)
        });
        const data = await response.json();
        
        if (data.status === 'Ok') {
            return data;  // Return data if the request is successful
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        badKeyDay();
        throw error;  // Re-throw the error to handle it in the caller
    }
}

async function retrieveData(initcall) {
    if (initcall) {
        let localKey = localStorage.getItem('key');
        _memberid = trimKey(localKey);
    }

    form.style.display = 'none';
    infoDisplay.innerHTML = `<h3 style="margin-top:20px;"> Requesting...</h3>`;

    try {
        const memberData = await fetchRugbyData('m', { memberid: _memberid });
        MEMBER_DATA = Object.values(memberData.members);
        _teamid = MEMBER_DATA[0].teamid;

        _globals = {
            day: memberData.gameDate.day,
            round: memberData.gameDate.round,
            season: memberData.gameDate.season
        };

        document.getElementById('game-date').innerHTML = `
            Season: ${_globals.season}, Round: ${_globals.round}, Day: ${_globals.day}
        `;

        const clubData = await fetchRugbyData('t', { teamid: _teamid });
        CLUB_DATA = Object.values(clubData.teams);

        const playerData = await fetchRugbyData('p', { teamid: _teamid });
        PLAYER_DATA = Object.values(playerData.players).sort((a, b) => b.csr - a.csr);

        const playerStatisticsData = await fetchRugbyData('ps', { playerid: playerStatisticsHelper(PLAYER_DATA) });
        PLAYER_STATISTICS_DATA = Object.values(playerStatisticsData['player statistics']);

        const lastFixtureData = await fetchRugbyData('f', { teamid: _teamid, last: 4 });

        // UI update calls
        logTeamData();
        displayClubandManagerInfo();
        logClubData();

        infoDisplay.innerHTML = '';
    } catch (error) {
        console.error('Error during fetch operations:', error);
    }
}

// import { retrieveData, fetchRugbyData } from "./fetchApi.js";

// Fetch using a different type with additional params

// FETCH AREA CLOSE //

// POSITIONAL ALGORITHM OPEN //

function playerStatisticsHelper(playerData) {
    // Join player IDs into a comma-separated string
    return playerData.map(player => player.id).join(',');
}

const positionWeights = {
    'Looshead Prop': { 
        'Weight': 1.11, 'Height': 0.51, 'Stamina': 1.00, 'Attack': 0.71, 'Technique': 1.01, 
        'Jumping': 0.51, 'Agility': 0.61, 'Handling': 0.91, 'Defense': 1.01, 'Strength': 1.12, 
        'Speed': 0.50, 'Kicking': 0.00
    },
    'Hooker': { 
        'Weight': 0.99, 'Height': 0.49, 'Stamina': 1.00, 'Attack': 0.69, 'Technique': 1.02, 
        'Jumping': 0.49, 'Agility': 0.68, 'Handling': 1.21, 'Defense': 0.95, 'Strength': 0.98, 
        'Speed': 0.50, 'Kicking': 0.00
    },
    'Tighthead Prop': { 
        'Weight': 1.14, 'Height': 0.52, 'Stamina': 1.00, 'Attack': 0.73, 'Technique': 1.01, 
        'Jumping': 0.52, 'Agility': 0.61, 'Handling': 0.83, 'Defense': 1.01, 'Strength': 1.13, 
        'Speed': 0.50, 'Kicking': 0.00
    },
    'Lock': { 
        'Weight': 0.90, 'Height': 1.03, 'Stamina': 1.00, 'Attack': 0.55, 'Technique': 0.84, 
        'Jumping': 1.03, 'Agility': 0.54, 'Handling': 0.94, 'Defense': 0.80, 'Strength': 0.94, 
        'Speed': 0.43, 'Kicking': 0.00
    },
    'Blindside Flanker': { 
        'Weight': 0.96, 'Height': 0.72, 'Stamina': 1.00, 'Attack': 0.67, 'Technique': 0.96, 
        'Jumping': 0.77, 'Agility': 0.66, 'Handling': 0.77, 'Defense': 0.96, 'Strength': 0.96, 
        'Speed': 0.57, 'Kicking': 0.00
    },
    'Openside Flanker': { 
        'Weight': 0.96, 'Height': 0.67, 'Stamina': 1.00, 'Attack': 0.67, 'Technique': 1.07, 
        'Jumping': 0.61, 'Agility': 0.67, 'Handling': 0.76, 'Defense': 0.96, 'Strength': 0.96, 
        'Speed': 0.67, 'Kicking': 0.00
    },
    'No.8': { 
        'Weight': 0.91, 'Height': 0.61, 'Stamina': 1.00, 'Attack': 0.71, 'Technique': 1.01, 
        'Jumping': 0.71, 'Agility': 0.62, 'Handling': 0.81, 'Defense': 1.01, 'Strength': 1, 
        'Speed': 0.61, 'Kicking': 0.00
    },
    'Kicker': { 
        'Weight': 0.46, 'Height': 0.46, 'Stamina': 1.00, 'Attack': 0.93, 'Technique': 0.64, 
        'Jumping': 0.31, 'Agility': 0.93, 'Handling': 0.93, 'Defense': 0.93, 'Strength': 0.56, 
        'Speed': 0.92, 'Kicking': 0.93
    },
    'Center': { 
        'Weight': 0.60, 'Height': 0.50, 'Stamina': 1.00, 'Attack': 1.00, 'Technique': 0.60, 
        'Jumping': 0.31, 'Agility': 0.90, 'Handling': 1.00, 'Defense': 1.00, 'Strength': 0.80, 
        'Speed': 0.90, 'Kicking': 0.39
    },
    'Wing': { 
        'Weight': 0.51, 'Height': 0.51, 'Stamina': 1.00, 'Attack': 1.02, 'Technique': 0.61, 
        'Jumping': 0.26, 'Agility': 1.02, 'Handling': 1.02, 'Defense': 1.02, 'Strength': 0.70, 
        'Speed': 1.02, 'Kicking': 0.31
    }
};

function checkPositionWeights(positionWeights) {
    for (let position in positionWeights) {
        const total = Object.values(positionWeights[position]).reduce((sum, val) => sum + val, 0);
        if (total !== 9) {
            console.log(`Error: ${position} does not equal 9, it equals ${total}`);
        } else {
            console.log(`${position} is correctly balanced.`);
        }
    }
}

function normalizeValue(value, maxStat, min, max) {
    // Normalize value between min and max
    return Math.max(1, Math.min(maxStat, ((value - min) / (max - min)) * (maxStat - 1) + 1));
}

function scorePositions(playerStats, weights, position, actualWeight, actualHeight) {
    const propHeightCheck = ['Tighthead Prop', 'Looshead Prop'].includes(position) && actualHeight > minHeightWeight.Prop.maxHeight;
    const propWeightCheck = ['Tighthead Prop', 'Looshead Prop'].includes(position) && actualWeight < minHeightWeight.Prop.minWeight;
    const hookerCheck = position === 'Hooker' && (actualWeight < minHeightWeight.Hooker.minWeight || actualHeight > minHeightWeight.Hooker.maxHeight);
    const lockCheck = position === 'Lock' && (actualHeight < minHeightWeight.Lock.minHeight || actualWeight < minHeightWeight.Lock.minWeight);
    const blindsideCheck = position === 'Blindside Flanker' && (actualHeight < minHeightWeight.Blindside.minHeight || actualWeight < minHeightWeight.Blindside.minWeight);
    const opensideCheck = position === 'Openside Flanker' && (actualHeight > minHeightWeight.Openside.minHeight || actualWeight < minHeightWeight.Openside.minWeight);
    const number8Check = position === 'No.8' && (actualWeight < minHeightWeight.Number8.minWeight || actualHeight < minHeightWeight.Number8.minHeight);
    const centerCheck = position === 'Center' && actualWeight < minHeightWeight.Center.minWeight;

    if (propHeightCheck || propWeightCheck || hookerCheck || lockCheck || blindsideCheck || opensideCheck || number8Check || centerCheck) {
        return 0;
    }

    return Object.keys(weights).reduce((score, stat) => {
        return score + (playerStats[stat] || 0) * weights[stat];
    }, 0);
}

// POSITIONAL ALGORITHM CLOSE //

// Minimum weight and height values
const minHeightWeight = {
    'Prop': { minWeight: 120, maxHeight: 190 },
    'Hooker': { minWeight: 110, maxHeight: 185 },
    'Lock': { minHeight: 199, minWeight: 105 },
    'Blindside': { minHeight: 195, minWeight: 110 },
    'Openside': { minHeight: 185, minWeight: 105 },
    'Number8': { minHeight: 185, minWeight: 105 },
    'Center': { minWeight: 90 }
};

function evaluatePlayerPosition(weight, height) {
    let feedback = '';

    feedback += checkPosition('Props', weight, height, minHeightWeight.Prop);
    feedback += checkPosition('Hooker', weight, height, minHeightWeight.Hooker);
    feedback += checkPosition('Lock', weight, height, minHeightWeight.Lock, true);
    feedback += checkPosition('No.6', weight, height, minHeightWeight.Blindside, true);
    feedback += checkPosition('No.7', weight, height, minHeightWeight.Openside, true);
    feedback += checkPosition('No.8', weight, height, minHeightWeight.Number8, true);
    if (weight < minHeightWeight.Center.minWeight) feedback += "Center (too light), ";

    return feedback.slice(0, -2) || ' ';
}

function checkPosition(position, weight, height, { minWeight, maxHeight, minHeight }, isForward = false) {
    let feedback = '';
    if (isForward) {
        if (height < minHeight && weight < minWeight) feedback += `${position} (too light and too short), `;
        else if (weight < minWeight) feedback += `${position} (too light), `;
        else if (height < minHeight) feedback += `${position} (too short), `;
    } else {
        if (weight < minWeight && height > maxHeight) feedback += `${position} (too light and too tall), `;
        else if (weight < minWeight) feedback += `${position} (too light), `;
        else if (height > maxHeight) feedback += `${position} (too tall), `;
    }
    return feedback;
}

function suggestedPosition(playerStats, weight, height) {
    const scores = Object.keys(positionWeights).map(position => ({
        position,
        score: scorePositions(playerStats, positionWeights[position], position, weight, height)
    }));

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, 2); 
}

function weightSuggestion(weight) {
    return weight < 100 ? 'Back' : (weight > 105 ? 'Forward' : 'Forward or Back');
}


function logClubData() {
    infoContainer.style.display = 'block';
    versionDisplay.innerHTML = `<span><h4 class='physicals'>Version : ${version}</h4></span> <span><h3 id="refresh">↻ <small>Refresh</small> </h3></span>`
    
    refresh = document.getElementById('refresh');
    
    refresh.addEventListener('click', () => {
        dataDisplay.innerHTML = '';
        dataDisplayAvg.innerHTML = '';
        retrieveData(false);
    });

    const [{ username }] = MEMBER_DATA;
    const [{ name, country_iso }] = CLUB_DATA;
    const playersCount = PLAYER_DATA.length;

    const managerName = `<h3>Manager: ${username} ${isPremium ? "⭐" : ""}</h3>`;
    const clubName = `<h3>Club: ${name} <img class='nat-img' src='https://www.blackoutrugby.com/images/flagz/${country_iso.toLowerCase()}.gif'/></h3>`;
    const squadCount = `<h3>Squad (${playersCount})</h3>`;
    const settingsLabel = `<h3>🔧 Settings</h3>`;

    const applyContent = (element, content) => {
        element.innerHTML = content;
    };

    applyContent(tab1Name, managerName);
    applyContent(tab2Name, clubName);
    applyContent(tab3Name, squadCount);
    applyContent(tab4Name, settingsLabel);

    applyContent(option1Name, managerName);
    applyContent(option2Name, clubName);
    applyContent(option3Name, squadCount);
    applyContent(option4Name, settingsLabel);
}

function logTeamData() {
    dataDisplay.innerHTML = '';
    dataDisplayAvg.innerHTML = '';
    let totalFrom = 0, totalEnergy = 0, totalKG = 0, totalCM = 0, csr = 0, age = 0, agro = 0, disc = 0, injury = 0;
    let stam = 0, att = 0, tech = 0, jump = 0, agi = 0, hand = 0, def = 0, str = 0, spee = 0, kick = 0;
    // console.log(PLAYER_DATA);
    PLAYER_DATA.forEach((element, i) => {
        totalFrom += element.form;
        totalEnergy += element.energy;
        totalCM += +element.height;
        totalKG += +element.weight;
        stam += +element.stamina;
        att += +element.attack;
        tech += +element.technique;
        jump += +element.jumping;
        agi += +element.agility;
        hand += +element.handling;
        def += +element.defense;
        str += +element.strength;
        spee += +element.speed;
        kick += +element.kicking;
        csr += +element.csr;
        age += +element.age;
        agro += +element.aggression
        disc += +element.discipline

        const playerStats = {
            Stamina: element.stamina, Attack: element.attack, Technique: element.technique, Jumping: element.jumping,
            Agility: element.agility, Handling: element.handling, Defense: element.defense, Strength: element.strength,
            Speed: element.speed, Kicking: element.kicking, Weight: +element.weight, Height: +element.height
        };

        const maxNonPhysicalStat = Math.max(
            playerStats.Stamina, playerStats.Attack, playerStats.Technique, playerStats.Jumping,
            playerStats.Agility, playerStats.Handling, playerStats.Defense, playerStats.Strength,
            playerStats.Speed, playerStats.Kicking
        );

        playerStats.Weight = normalizeValue(playerStats.Weight, maxNonPhysicalStat, 60, 140);
        playerStats.Height = normalizeValue(playerStats.Height, maxNonPhysicalStat, 160, 212);

        let actual_weight = element.weight;
        let actual_height = element.height;
    
        const suggestedPos = suggestedPosition(playerStats, actual_weight, actual_height);
        // console.log(element.name);
        dataDisplay.innerHTML += `
            <div class='card'>
                <div>${i + 1}) <span class='name'>${element.name}</span><img class='nat-img' src='https://www.blackoutrugby.com/images/flagz/${element.nationality.toLowerCase()}.gif'/></span> 
                    | <span class='age'> ${element.age}.yo </span>
                    | <span class='form'>Form: ${element.form}</span> | <span class='energy'>Energy: ${isPremium ? element.energy/10 : element.energy} </span>
                    | <span class='csr'> CSR: ${Number(element.csr).toLocaleString()}</span> | <span class='performance'>Performance Rating: ${isPremium? element.form + ((element.energy/10)/2) : element.form + (element.energy/2)} (${isPremium ? (element.form + (element.energy/10) / 2 + element.csr / 1000).toFixed(0) : (element.form + element.energy / 2 + element.csr / 1000).toFixed(0)})</span>
                    <div class='red'>${isDateInPast(element.injured) ? " ❗ Injured until: " + formatDateString(element.injured) + " ❗": " "} </div>
                    <div>
                        <span class='physicals'>${element.weight}kg | ${element.height}cm | ${getEmoji('aggression', element.aggression)} | ${getEmoji('discipline', element.discipline)}</span> 
                    </div>
                </div>
                <div class='skills'>
                    Stamina: ${colorizeNumber(element.stamina)} | Handling: ${colorizeNumber(element.handling)} | Attack: ${colorizeNumber(element.attack)} 
                    | Defense: ${colorizeNumber(element.defense)} | Technique: ${colorizeNumber(element.technique)} | Strength: ${colorizeNumber(element.strength)}
                    | Jumping: ${colorizeNumber(element.jumping)} | Speed: ${colorizeNumber(element.speed)} | Agility: ${colorizeNumber(element.agility)} | Kicking: ${colorizeNumber(element.kicking)}
                </div>
                <div class='position'>Weight suggests: ${weightSuggestion(element.weight)}</div>
                <div class='position'>Algorithm suggests: ${suggestedPos[0].position} (${suggestedPos[0].score.toFixed(1)}) or ${suggestedPos[1].position} : (${suggestedPos[1].score.toFixed(1)})</div>
                <div class='physicals'>Exclusions: ${evaluatePlayerPosition(element.weight, element.height)}</div>
                
            </div>`;
    });

    const avg = PLAYER_DATA.length;
    dataDisplayAvg.style.marginTop = '10px';
    dataDisplayAvg.innerHTML = `
        <div class='card' style='text-align:center;'>
            <div class="team-avg-title-text">Team Averages</div>
            <div><span class='age'> ${Math.floor(age / avg)}.yo</span> | <span class='form'>Form: ${Math.floor(totalFrom / avg)}</span> | <span class='energy'>Energy: ${isPremium ? Math.floor((totalEnergy/10) / avg) : Math.floor((totalEnergy) / avg) } </span>
            | <span class='csr'>CSR: ${Math.floor(csr / avg).toLocaleString()}</span>| <span class='performance'>Performance Rating: ${isPremium ? Math.floor((totalEnergy/10) / 2 + totalFrom) / avg : Math.floor((totalEnergy / 2 + totalFrom) / avg )}</span></div>
            <div>
                <span class='physicals'>${Math.floor(totalKG / avg)}kg | ${Math.floor(totalCM / avg)}cm | ${getEmoji('aggression', Math.floor(agro / avg))} | ${getEmoji('discipline', Math.floor(disc / avg))}</span>
            </div>
            <span class='skills'>Stamina: ${colorizeNumber(Math.floor(stam / avg))} | Handling: ${colorizeNumber(Math.floor(hand / avg))} | Attack: ${colorizeNumber(Math.floor(att / avg))}
                | Defense: ${colorizeNumber(Math.floor(def / avg))} | Technique: ${colorizeNumber(Math.floor(tech / avg))} | Strength: ${colorizeNumber(Math.floor(str / avg))}
                | Jumping: ${colorizeNumber(Math.floor(jump / avg))} | Speed: ${colorizeNumber(Math.floor(spee / avg))} | Agility: ${colorizeNumber(Math.floor(agi / avg))} 
                | Kicking: ${colorizeNumber(Math.floor(kick / avg))}</span>
        </div>`;
    
        sortListDiplay.innerHTML = `
                <select id="sortOption" class="sort-tab-dropdown" onchange="sortPlayers()">
                    <option value="name">Name</option>
                    <option value="csr" selected>CSR</option>
                    <option value="age">Age</option>
                    <option value="form">Form</option>
                    <option value="energy">Energy</option>
                    <option value="performance">Performance</option>
                    <option value="height">Height</option>
                    <option value="weight">Weight</option>
                    <option value="stamina">Stamina</option>
                    <option value="handling">Handling</option>
                    <option value="attack">Attack</option>
                    <option value="defense">Defense</option>
                    <option value="technique">Technique</option>
                    <option value="strength">Strength</option>
                    <option value="jumping">Jumping</option>
                    <option value="speed">Speed</option>
                    <option value="agility">Agility</option>
                    <option value="kicking">Kicking</option>
                </select>`;
}

export function sortPlayers() {
    const sortBy = document.getElementById("sortOption").value;
    const descendingFields = ['csr', 'age', 'form', 'energy', 'height', 'weight', 'stamina', 'handling', 'attack', 'defense', 'technique', 'strength', 'jumping', 'speed', 'agility', 'kicking'];

    PLAYER_DATA.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'performance') return (calculatePerformance(b) ?? 0) - (calculatePerformance(a) ?? 0);
        if (descendingFields.includes(sortBy)) return (b[sortBy] ?? 0) - (a[sortBy] ?? 0);
        return 0;
    });

    dataDisplay.innerHTML = '';
    logTeamData();
    document.getElementById("sortOption").value = sortBy;
}

function calculatePerformance(player) {
    return isPremium 
        ? player.form + (player.energy / 10) / 2 
        : player.form + player.energy / 2;
}

function displayClubandManagerInfo() {
    const { username, realname, email, dateregistered, lastclick, teams } = MEMBER_DATA[0];
    const { name, nickname_1, country_iso, bank_balance, ranking_points, prev_ranking_points, members, contentment, regional_rank, minor_sponsors, national_rank, total_salary, world_rank } = CLUB_DATA[0];

    const formattedBalance = formatBankBalance(bank_balance);
    const registerDate = formatDateString(dateregistered), lastClick = formatDateString(lastclick);
    const ratingPointsMovement = ranking_points > prev_ranking_points ? "📈" : "📉";

    managerInfo.innerHTML = `
        <div class='card'>
            <h3>Manager Information</h3>
            <div>Manager: ${username} | (${realname}) | Email: ${email}</div>
            <div>Premium: ${isPremium ? '⭐' : getPremiumInfoLink()}</div>
            <div>Managed Teams: ${teams.length}</div>
            <div>Registered: ${registerDate}</div>
            <div>Last Click: ${lastClick}</div>
        </div>`;

    clubInfo.innerHTML = `
        <div class='card'>
            <div class="club-name-title">
            Name: ${name} | <span class='physicals'>'${nickname_1}'
            <img class='nat-img' src='https://www.blackoutrugby.com/images/flagz/${country_iso.toLowerCase()}.gif'/>
            </div>
            <hr/>
            <br>
            <div>Bank: ${formattedBalance} | Team Salaries: <span class='red'>$${Number(total_salary).toLocaleString()}</span></div>
            <br>
            <div>Members: ${members} | ${getEmoji('contentment', contentment)}</div>
            <div>Sponsors: ${minor_sponsors}</div>
            <br>
            <div>Rankings: <span class='${getRankingClass(ranking_points, prev_ranking_points)}'>${ranking_points} ${ratingPointsMovement} | ${(ranking_points - prev_ranking_points).toFixed(4)}</span></div>
            <div>Regional: ${regional_rank}</div>
            <div>National: ${national_rank}</div>
            <div>World: ${world_rank}</div>
        </div>`;

    settingsInfo.innerHTML = getSettingsInfo();
}

function getSettingsInfo(){
    return `<div class='card'>
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
        🪲 Bug? pm yaya <a href='https://www.blackoutrugby.com/game/me.office.php#page=mail&newmessage=1&folder=1&tab=inbox target="_blank"'>here</a>
        </div>
        <div class='card'>
            <div class='flex-align'>
                <span>WIP Items</span>
                <span>(Version ${version})</span>
            </div>
            <div class='physicals'>
                <div>Min Prop Weight & Height ✅</div>
                <div>Min Hooker Weight & Height ✅</div>
                <div>Min Lock Height ✅</div>
                <div>Positional skill algorithm ✅</div>
                <div>Squad sort ✅</div>
            </div>
        </div>`
}

function isDateInPast(date_string){
    const inputDate = new Date(date_string);
    const currentDate = new Date();
    // console.log(inputDate > currentDate ? " True": "False")
    return inputDate > currentDate
}

function formatDateString(date_string){
    const inputDate = date_string;
    const date = new Date(inputDate);
    const readableDate = date.toLocaleString("en-US",{
        year: 'numeric',
        month: 'long',
        day:'numeric',
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit',
        timeZoneName: 'short'
    })
    return readableDate;
}

function formatBankBalance(balance) {
    return balance > 0 
        ? `<span class="form">$${Number(balance).toLocaleString()}</span>` 
        : `<span class="red">$${Number(balance).toLocaleString()}</span>`;
}

function getPremiumInfoLink() {
    return 'Nope 😢 <a href="https://www.blackoutrugby.com/game/me.account.php#page=store" target="_blank" class="premium">upgrade</a>';
}

function getRankingClass(current, previous) {
    return current > previous ? 'green' : 'red';
}

function getEmoji(type, value) {
    const emojiMap = {
        contentment: {
            1: "😡 Grim",
            2: "😠 Cynical",
            3: "🤨 Sceptical",
            4: "😞 Buoyant",
            5: "😊 Content",
            6: "🙂 Charmed",
            7: "😄 Cheery",
            8: "😁 Thrilled",
            9: "😍 Blissful",
            10: "🤩 Euphoric"
        },
        aggression: {
            1: "😳 Timid",
            2: "🙂 Conservative",
            3: "🤨 Collected",
            4: "😠 Aggressive",
            5: "😈 Psychotic"
        },
        discipline: {
            1: "😈 Rebellious",
            2: "😜 Reckless",
            3: "🤨 Collected",
            4: "😐 Controlled",
            5: "😇 Flawless"
        }
    };
    return emojiMap[type]?.[value] || "-_-";
}

function colorizeNumber(inputNumber) {
    let hue = 0; // Starting hue value
    const saturation = 70; // Saturation value
    const lightness = 50; // Lightness value
    let color;

    switch (inputNumber) {
        case 1:
            hue = 0; // Red
            break;
        case 2:
            hue = 0; // Orange
            break;
        case 3:
            hue = 0; // Yellow
            break;
        case 4:
            hue = 35; // Light green
            break;
        case 5:
            hue = 35; // Green
            break;
        case 6:
            hue = 35; // Cyan
            break;
        case 7:
            hue = 65; // Light blue
            break;
        case 8:
            hue = 65; // Blue
            break;
        case 9:
            hue = 65; // Indigo
            break;
        case 10:
            hue = 95; // Violet
            break;
        case 11:
            hue = 95; // Magenta
            break;
        case 12:
            hue = 95; // Pink
            break;
        case 13:
            hue = 155; // Light orange
            break;
        case 14:
            hue = 155; // Gold
            break;
        case 15:
            hue = 155; // Chartreuse
            break;
        case 16:
            hue = 180; // Spring green
            break;
        case 17:
            hue = 180; // Turquoise
            break;
        case 18:
            hue = 180; // Sky blue
            break;
        case 19:
            hue = 303; // Steel blue
            break;
        case 20:
            hue = 303; // Periwinkle
            break;
        case 21:
            hue = 303; // Lavender
            break;
        default:
            return 'Number is out of range. Please enter a number between 1 and 21.';
    }

    color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    return `<span style="color: ${color};">${inputNumber}</span>`;
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


