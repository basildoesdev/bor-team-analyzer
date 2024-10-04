const version = 0.64;
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
const tab5Name = document.getElementById('tab-5-btn');
const option1Name = document.getElementById('option1');
const option2Name = document.getElementById('option2');
const option3Name = document.getElementById('option3');
const option4Name = document.getElementById('option4');
const option5Name = document.getElementById('option5');
const managerInfo = document.getElementById('manager-infos');
const clubInfo = document.getElementById('club-infos');
// const lineupInfo = document.getElementById('lineup-infos');
const settingsInfo = document.getElementById('settings-infos');

const corsProxy = 'https://corsproxy.io/?';
const apiUriBase = 'https://classic-api.blackoutrugby.com/?d=1038&dk=2yysSrd2fZxuOu5y&';

let PLAYERS_DATA = [], CLUB_DATA = [], MEMBER_DATA = [];
let isPremium = false;
let refresh;
let _accessKey;
let member_id;


submitBtn.addEventListener('click', () => {
    isSaveKey.checked ? localStorage.setItem('key', accessKey.value): " ";
    initApiCalls(true);
});

window.onload = function(){
    localStorage.getItem('key') ? initApiCalls(true) : " ";
}

function devDataLogs(){
    console.log('Player Data');
    console.log(PLAYERS_DATA);
    console.log('Club Data');
    console.log(CLUB_DATA);
    console.log('Member Data');
    console.log(MEMBER_DATA);
}

function isKeyValid(key){
    const regex = /^m=\d+&mk=[a-f0-9]{40}$/i;
    return regex.test(key);
}

function checkKeyInput(){
    if(isKeyValid(accessKey.value)){
        accessKey.style.color = 'green';
        submitBtn.style.backgroundColor = '#e73d3d';
        submitBtn.disabled = false;
        keyValidDisplay.innerHTML ='<p>Access Key:<span class="green"> (Valid Key Format) </span></p>';
    }else{
        accessKey.style.color = 'red';
        submitBtn.style.backgroundColor = '#a39999';
        submitBtn.disabled = true;
        keyValidDisplay.innerHTML = '<p>Access Key:<span class="red"> (Invalid Key Format) </span></p>';
    }
}

async function initApiCalls(initcall){
    
    form.style.display = 'none';

    if (initcall){
       
        accessKey.value ? _accessKey = accessKey.value : _accessKey = localStorage.getItem('key');
        // console.log(_accessKey)
        accessKey.value = '';
        member_id = _accessKey.split('=')[1].split('&')[0];
    }
    
    const url_member = corsProxy + encodeURIComponent(`${apiUriBase}r=m&memberid=${member_id}&${_accessKey}&json=1&timestamp=${new Date().getTime()}`);
    await collectData(url_member, 'member');
    // console.log(`${apiUriBase}r=m&memberid=${member_id}&${_accessKey}&json=1&timestamp=${new Date().getTime()}`);
    let team_id = MEMBER_DATA[0].teamid;
    MEMBER_DATA[0].premium == '1' ? isPremium = true : isPremium = false;
    const url_players = corsProxy + encodeURIComponent(`${apiUriBase}r=p&teamid=${team_id}&${_accessKey}&json=1&timestamp=${new Date().getTime()}`);
    const url_club = corsProxy + encodeURIComponent(`${apiUriBase}r=t&teamid=${team_id}&${_accessKey}&json=1&timestamp=${new Date().getTime()}`);

    await collectData(url_players, 'players');
    await collectData(url_club, 'club');

//    devDataLogs();
    displayClubandManagerInfo();
}

async function fetchData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok'); badKeyDay()
        return await response.json();
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

function badKeyDay(){
    infoDisplay.innerHTML += "<h3 class='red'> Bad Key .. 😢</h3><button id='reload'> Reload </button>";

    let reload = document.getElementById('reload');
    
    reload.addEventListener('click', () =>{
        localStorage.clear();
        location.reload(true);
    })
}

async function collectData(requestUrl, dataType) {
    infoDisplay.innerHTML = `<h3 style="margin-top:20px;"> Requesting...</h3>`;
    const data = await fetchData(requestUrl);
    // console.log(data.status)
    
    if (dataType === 'players') PLAYERS_DATA = Object.values(data.players).sort((a, b) => b.csr - a.csr);
    else if (dataType === 'club') CLUB_DATA = Object.values(data.teams);
    else if (dataType === 'member')  MEMBER_DATA = Object.values(data.members);
  
    handleDataOutput(dataType);
    infoDisplay.innerHTML = '';
    return data;  // Return fetched data for future usage
}

function handleDataOutput(dataType) {
    if (dataType === 'players') logTeamData();
    else if (dataType === 'club') logClubData();
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
        let total = 0;
        for (let attribute in positionWeights[position]) {
            total += positionWeights[position][attribute];
        }
        console.log(`${position}: Total = ${total}`);
        
        if (total !== 9) {
            console.log(`Error: ${position} does not equal 9, it equals ${total}`);
        } else {
            console.log(`${position} is correctly balanced.`);
        }
    }
}

// checkPositionWeights(positionWeights);


function normalizeValue(value, maxStat, min, max) {
    return Math.max(1, Math.min(maxStat, ((value - min) / (max - min)) * (maxStat - 1) + 1));
}

function scorePositions(playerStats, weights, position, actual_weight, actual_height) {
    if (position === 'Tighthead Prop' && actual_weight < propMinWeight) return 0;
    if (position === 'Tighthead Prop' && actual_height > propMaxHeight) return 0;
    if (position === 'Looshead Prop' && actual_weight < propMinWeight) return 0;
    if (position === 'Looshead Prop' && actual_height > propMaxHeight) return 0;
    if (position === 'Hooker' && actual_weight < hookerMinWeight) return 0;
    if (position === 'Hooker' && actual_height > hookerMaxHeight) return 0;
    if (position === 'Lock' && actual_height < lockMinHeight) return 0;
    if (position === 'Lock' && actual_weight < lockMinWeight) return 0;
    if (position === 'Blindside Flanker' && actual_height < blindsideMinHeight) return 0;
    if (position === 'Blindside Flanker' && actual_weight < blindsideMinWeight) return 0;
    if (position === 'Openside Flanker' && actual_height > opensideMinHeight) return 0;
    if (position === 'Openside Flanker' && actual_weight < opensideMinWeight) return 0;
    if (position === 'No.8' && actual_weight < number8MinWeight) return 0;
    if (position === 'No.8' && actual_weight < number8MinHeight) return 0;
    if (position === 'Center' && actual_weight < centerMinWeight) return 0;
    return Object.keys(weights).reduce((score, stat) => {
        return score + (playerStats[stat] || 0) * weights[stat];
    }, 0);
}

let propMinWeight = 120, propMaxHeight = 190, 
    hookerMinWeight = 110, hookerMaxHeight = 185,
    lockMinHeight = 199, lockMinWeight = 105,
    blindsideMinWeight = 110, blindsideMinHeight = 195, 
    opensideMinWeight = 105, opensideMinHeight = 185, 
    number8MinWeight = 105, number8MinHeight = 185,
    centerMinWeight = 90;

function evaluatePlayerPosition(element_weight, element_height, element_aggression) {
    let positionFeedback = '';

    // Props
    if (element_weight < propMinWeight && element_height > propMaxHeight) positionFeedback += "Props (too light and too tall), ";
    else if (element_weight < propMinWeight) positionFeedback += "Props (too light), ";
    else if (element_height > propMaxHeight) positionFeedback += "Props (too tall), ";
    
    // Hookers 
    if (element_weight < hookerMinWeight && element_height > hookerMaxHeight) positionFeedback += "Hooker (too light and too tall), ";
    else if (element_weight < hookerMinWeight) positionFeedback += "Hooker (too light), ";
    else if (element_height > hookerMaxHeight) positionFeedback += "Hooker (too tall), ";
    
    // Locks
    if (element_height < lockMinHeight && element_weight < lockMinWeight) positionFeedback += "Lock (too light and too Short), ";
    else if (element_weight < lockMinWeight) positionFeedback += "Lock (too light), ";
    else if (element_height < lockMinHeight) positionFeedback += "Lock (too short), ";

    //Blindside 
    if (element_height < blindsideMinHeight && element_weight < blindsideMinWeight) positionFeedback += "No.6 (too light and too Short), ";
    else if (element_height < blindsideMinWeight) positionFeedback += "No.6 (too light), ";
    else if (element_height < blindsideMinHeight) positionFeedback += "No.6  (too short), ";
    
    //Openside 
    if (element_height < opensideMinHeight && element_weight < opensideMinWeight) positionFeedback += "No.7 (too light and too Short), ";
    else if (element_height < opensideMinWeight) positionFeedback += "No.7 (too light), ";
    else if (element_height < opensideMinHeight) positionFeedback += "No.7  (too short), ";

    //Number8
    if (element_height < number8MinHeight && element_weight < number8MinWeight) positionFeedback += "No.8 (too light and too Short), ";
    else if (element_height < number8MinWeight) positionFeedback += "No.8 (too light), ";
    else if (element_height < number8MinHeight) positionFeedback += "No.8  (too short), ";

    //Center
    if (element_weight < centerMinWeight) positionFeedback += "Center (too light)  ";

    return positionFeedback.slice(0, -2) || ' ';
}

function suggestedPosition(playerStats, actual_weight, actual_height) {
    const scores = Object.keys(positionWeights).map(position => {
        const score = scorePositions(playerStats, positionWeights[position], position, actual_weight, actual_height);
        // console.log(`${position} : ${score}`);
        return { position, score };
    });
   
    scores.sort((a, b) => b.score - a.score);
    // return scores; 
    return scores.slice(0, 2); 
}

function weightSuggestion(weight){
    if(weight < 100) return 'Back';
    else if( weight > 105) return 'Forward';
    else return 'Forward or Back';
}

function logClubData() {
    infoContainer.style.display = 'block';
    versionDisplay.innerHTML = `<span><h4 class='physicals'>Version : ${version}</h4></span> <span><h3 id="refresh">↻ <small>Refresh</small> </h3></span>`
    
    refresh = document.getElementById('refresh');
    
    refresh.addEventListener('click', () => {
        dataDisplay.innerHTML = '';
        dataDisplayAvg.innerHTML = '';
        initApiCalls(false);
    });

    const [{ username }] = MEMBER_DATA;
    const [{ name, country_iso }] = CLUB_DATA;
    const playersCount = PLAYERS_DATA.length;

    const managerName = `<h3>Manager: ${username} ${isPremium ? "⭐" : ""}</h3>`;
    const clubName = `<h3>Club: ${name} <img class='nat-img' src='https://www.blackoutrugby.com/images/flagz/${country_iso.toLowerCase()}.gif'/></h3>`;
    const squadCount = `<h3>Squad (${playersCount})</h3>`;
    const lineupLabel = `<h3>Lineup</h3>`;
    const settingsLabel = `<h3>🔧 Settings</h3>`;

    const applyContent = (element, content) => {
        element.innerHTML = content;
    };

    applyContent(tab1Name, managerName);
    applyContent(tab2Name, clubName);
    applyContent(tab3Name, squadCount);
    applyContent(tab4Name, lineupLabel);
    applyContent(tab5Name, settingsLabel);

    applyContent(option1Name, managerName);
    applyContent(option2Name, clubName);
    applyContent(option3Name, squadCount);
    applyContent(option4Name, lineupLabel);
    applyContent(option5Name, settingsLabel);
}

function logTeamData() {
    dataDisplay.innerHTML = '';
    dataDisplayAvg.innerHTML = '';
    let totalFrom = 0, totalEnergy = 0, totalKG = 0, totalCM = 0, csr = 0, age = 0, agro = 0, disc = 0, injury = 0;
    let stam = 0, att = 0, tech = 0, jump = 0, agi = 0, hand = 0, def = 0, str = 0, spee = 0, kick = 0;
    console.log(PLAYERS_DATA);
    PLAYERS_DATA.forEach((element, i) => {
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
                <div class='physicals'>
                    Stamina: ${element.stamina} | Handling: ${element.handling} | Attack: ${element.attack} 
                    | Defense: ${element.defense} | Technique: ${element.technique} | Strength: ${element.strength}
                    | Jumping: ${element.jumping} | Speed: ${element.speed} | Agility: ${element.agility} | Kicking: ${element.kicking}
                </div>
                <div class='position'>Weight suggests: ${weightSuggestion(element.weight)}</div>
                <div class='position'>Algorithm suggests: ${suggestedPos[0].position} (${suggestedPos[0].score.toFixed(1)}) or ${suggestedPos[1].position} : (${suggestedPos[1].score.toFixed(1)})</div>
                <div class='physicals'>Exclusions: ${evaluatePlayerPosition(element.weight, element.height)}</div>
                
            </div>`;
    });

    const avg = PLAYERS_DATA.length;
    dataDisplayAvg.style.marginTop = '10px';
    dataDisplayAvg.innerHTML = `
        <div class='card' style='text-align:center;'>
            <div>Team Averages | <span class='age'> ${Math.floor(age / avg)}.yo</span> | <span class='form'>Form: ${Math.floor(totalFrom / avg)}</span> | <span class='energy'>Energy: ${isPremium ? Math.floor((totalEnergy/10) / avg) : Math.floor((totalEnergy) / avg) } </span>
            | <span class='csr'>CSR: ${Math.floor(csr / avg).toLocaleString()}</span>| <span class='performance'>Performance Rating: ${isPremium ? Math.floor((totalEnergy/10) / 2 + totalFrom) / avg : Math.floor((totalEnergy / 2 + totalFrom) / avg )}</span></div>
            <div>
                <span class='physicals'>${Math.floor(totalKG / avg)}kg | ${Math.floor(totalCM / avg)}cm | ${getEmoji('aggression', Math.floor(agro / avg))} | ${getEmoji('discipline', Math.floor(disc / avg))}</span>
            </div>
            <span class='physicals'>Stamina: ${Math.floor(stam / avg)} | Handling: ${Math.floor(hand / avg)} | Attack: ${Math.floor(att / avg)}
                | Defense: ${Math.floor(def / avg)} | Technique: ${Math.floor(tech / avg)} | Strength: ${Math.floor(str / avg)}
                | Jumping: ${Math.floor(jump / avg)} | Speed: ${Math.floor(spee / avg)} | Agility: ${Math.floor(agi / avg)} 
                | Kicking: ${Math.floor(kick / avg)}</span>
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

function sortPlayers() {
    const sortBy = document.getElementById("sortOption").value;

    PLAYERS_DATA.sort((a, b) => {
        const descendingFields = ['csr', 'age', 'form', 'energy', 'height', 'weight', 'stamina', 'handling', 'attack', 'defense', 'technique', 'strength', 'jumping', 'speed', 'agility', 'kicking'];
        
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name); 
        } 
        if (sortBy === 'performance') {
            const performanceA = calculatePerformance(a) ?? 0;
            const performanceB = calculatePerformance(b) ?? 0;
            return performanceB - performanceA; 
        }
        if (descendingFields.includes(sortBy)) {
            return (b[sortBy] ?? 0) - (a[sortBy] ?? 0); 
        }
        return 0; 
    });
    
    dataDisplay.innerHTML = '';
    logTeamData();

    document.getElementById("sortOption").value = sortBy;
   
}

function calculatePerformance(player) {
    return isPremium ? player.form + (player.energy / 10) / 2 : player.form + player.energy / 2 ;
        // ? player.form + (player.energy / 10) / 2 + player.csr / 1000 
        // : player.form + player.energy / 2 + player.csr / 1000;
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

function displayClubandManagerInfo() {
    const { username, realname, email, dateregistered, lastclick, teams } = MEMBER_DATA[0];
    const { name, nickname_1, country_iso, bank_balance, ranking_points, prev_ranking_points, members, contentment, regional_rank, minor_sponsors, national_rank, total_salary, world_rank } = CLUB_DATA[0];

    const formattedBalance = bank_balance > 0 ? `<span class="form">$${Number(bank_balance).toLocaleString()}</span>` : `<span class="red">$${Number(bank_balance).toLocaleString()}</span>`;
    const registerDate = formatDateString(dateregistered), lastClick = formatDateString(lastclick);
    const ratingPointsMovement = ranking_points > prev_ranking_points ? "📈" : "📉";

    managerInfo.innerHTML = `
        <div class='card'>
            <h3>Manager Information</h3>
            <div>Manager: ${username} | (${realname}) | Email: ${email}</div>
            <div>Premium: ${isPremium ? '⭐' : 'Nope 😢 <a href="https://www.blackoutrugby.com/game/me.account.php#page=store" target="_blank" class="premium">upgrade</a>'}</div>
            <div>Managed Teams: ${teams.length}</div>
            <div>Registered: ${registerDate}</div>
            <div>Last Click: ${lastClick}</div>
        </div>`;

    clubInfo.innerHTML = `<div class='card'>
            <div class='flex-align'>
                <span>Name: ${name} | <span class='physicals'>'${nickname_1}'</span>
                    <img class='nat-img' src='https://www.blackoutrugby.com/images/flagz/${country_iso.toLowerCase()}.gif'/>
                </span>
                <span>Bank: ${formattedBalance}</span>
            </div>
            <br>
            <div class='flex-align'>
                <span>Rankings: <span class='${ranking_points > prev_ranking_points ? 'green' : 'red'}'>${ranking_points} ${ratingPointsMovement} | ${(ranking_points - prev_ranking_points).toFixed(4)}</span></span>
                <span>Members: ${members} | <span class='physicals'>${getEmoji('contentment', contentment)}</span></span>
            </div>
            <div class='flex-align'>
                <span>Regional: ${regional_rank}</span>
                <span>Sponsors: ${minor_sponsors}</span>
            </div> 
            <div class='flex-align'>
                <span>National: ${national_rank}</span>
                <span>Team Salaries: <span class='red'>$${Number(total_salary).toLocaleString()}</span></span>
            </div>
            World: ${world_rank}
        </div>`;

    settingsInfo.innerHTML = `
        <div class='card'>
            <div class='flex-align'>
                <span>WIP Settings</span>
                <span>(Version ${version})</span>
            </div>
            <div class='physicals'>
                <div>Min Prop Weight & Height</div>
                <div>Min Hooker Weight & Height</div>
                <div>Min Lock Height</div>
                <div>Positional skill algorithm</div>
                <div>Squad sort</div>
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
        🪲 Bug? pm yaya <a href='https://www.blackoutrugby.com/game/me.office.php#page=mail&newmessage=1&folder=1&tab=inbox target="_blank"'>here</a>
        </div>`;
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

function saveNewKeyandRefresh(){
    _accessKey = document.getElementById('settings-api-key').value;
    // console.log(_accessKey)
    localStorage.setItem('key', _accessKey)
    initApiCalls(true);
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

function showTab(tabNumber) {
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

function showTabDropdown(tabNumber) {
    showTab(tabNumber); // Reuse the same logic
}


