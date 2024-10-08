import { version, versionDisplay, 
    infoContainer,
    dataDisplay, dataDisplayAvg, 
    sortListDiplay, tab1Name, tab2Name,tab3Name,tab4Name,
    option1Name, option2Name, option3Name, option4Name,
    managerInfo, clubInfo, settingsInfo, globals } from "./globalStore.js"; 

import { retrieveData } from "./fetchFunctions.js";    
import { normalizeValue } from "./helpersFunctions.js";
import { suggestedPosition, weightSuggestion, calculatePerformance, evaluatePlayerPosition,  } from "./algorithmFunctions.js";

// import { positionWeights } from "./algorithmFunctions.js";
import { getSettingsInfo, setRanges, loadSavedPositionWeights } from "./settingsUiFunctions.js";

export function logClubData() {
    infoContainer.classList.remove('hide');
    let gameDateDisplay = document.getElementById('game-date');
    gameDateDisplay.innerHTML = `
            Season: ${globals._globals.season}, Round: ${globals._globals.round}, Day: ${globals._globals.day}
        `;
    gameDateDisplay.classList.remove('hide');
    

    // versionDisplay.innerHTML = `<span><h4 class='physicals'>Version : ${version}</h4></span> <span><h3 id="refresh">↻ <small>Refresh</small> </h3></span>`
    let refresh = document.getElementById('refresh');
    refresh.classList.remove('hide');
    
    refresh.addEventListener('click', () => {
        dataDisplay.innerHTML = '';
        dataDisplayAvg.innerHTML = '';
        loadSavedPositionWeights();
        setRanges();
        window.location.reload();
        
    });

    const [{ username }] = globals.MEMBER_DATA;
    const [{ name, country_iso }] = globals.CLUB_DATA;
    const playersCount = globals.PLAYER_DATA.length;

    const managerName = `<h3>Manager: ${username} ${globals.isPremium ? "⭐" : ""}</h3>`;
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



export function logTeamData() {
    dataDisplay.innerHTML = '';
    dataDisplayAvg.innerHTML = '';
    let totalFrom = 0, totalEnergy = 0, totalKG = 0, totalCM = 0, csr = 0, age = 0, agro = 0, disc = 0, injury = 0;
    let stam = 0, att = 0, tech = 0, jump = 0, agi = 0, hand = 0, def = 0, str = 0, spee = 0, kick = 0;
   
    globals.PLAYER_DATA.forEach((element, i) => {
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
                    | <span class='form'>Form: ${element.form}</span> | <span class='energy'>Energy: ${globals.isPremium ? element.energy/10 : element.energy} </span>
                    | <span class='csr'> CSR: ${Number(element.csr).toLocaleString()}</span> | <span class='performance'>
                    Performance Rating: ${globals.isPremium? element.form + ((element.energy/10)/2) : element.form + (element.energy/2)} (${globals.isPremium ? (element.form + (element.energy/10) / 2 + element.csr / 1000).toFixed(0) : (element.form + element.energy / 2 + element.csr / 1000).toFixed(0)})</span>
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

    const avg = globals.PLAYER_DATA.length;
    dataDisplayAvg.style.marginTop = '10px';
    dataDisplayAvg.innerHTML = `
        <div class='card' style='text-align:center;'>
            <div class="team-avg-title-text">Team Averages</div>
            <div><span class='age'> ${Math.floor(age / avg)}.yo</span> | <span class='form'>Form: ${Math.floor(totalFrom / avg)}</span> | <span class='energy'>Energy: ${globals.isPremium ? Math.floor((totalEnergy/10) / avg) : Math.floor((totalEnergy) / avg) } </span>
            | <span class='csr'>CSR: ${Math.floor(csr / avg).toLocaleString()}</span>| <span class='performance'>Performance Rating: ${globals.isPremium ? Math.floor((totalEnergy/10) / 2 + totalFrom) / avg : Math.floor((totalEnergy / 2 + totalFrom) / avg )}</span></div>
            <div>
                <span class='physicals'>${Math.floor(totalKG / avg)}kg | ${Math.floor(totalCM / avg)}cm | ${getEmoji('aggression', Math.floor(agro / avg))} | ${getEmoji('discipline', Math.floor(disc / avg))}</span>
            </div>
            <span class='skills'>Stamina: ${colorizeNumber(Math.floor(stam / avg))} | Handling: ${colorizeNumber(Math.floor(hand / avg))} | Attack: ${colorizeNumber(Math.floor(att / avg))}
                | Defense: ${colorizeNumber(Math.floor(def / avg))} | Technique: ${colorizeNumber(Math.floor(tech / avg))} | Strength: ${colorizeNumber(Math.floor(str / avg))}
                | Jumping: ${colorizeNumber(Math.floor(jump / avg))} | Speed: ${colorizeNumber(Math.floor(spee / avg))} | Agility: ${colorizeNumber(Math.floor(agi / avg))} 
                | Kicking: ${colorizeNumber(Math.floor(kick / avg))}</span>
        </div>`;
    
        sortListDiplay.innerHTML = `<div class='card'>
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
                </select></div>`;
}

export function sortPlayers() {
    const sortBy = document.getElementById("sortOption").value;
    const descendingFields = ['csr', 'age', 'form', 'energy', 'height', 'weight', 'stamina', 'handling', 'attack', 'defense', 'technique', 'strength', 'jumping', 'speed', 'agility', 'kicking'];

    globals.PLAYER_DATA.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'performance') return (calculatePerformance(b) ?? 0) - (calculatePerformance(a) ?? 0);
        if (descendingFields.includes(sortBy)) return (b[sortBy] ?? 0) - (a[sortBy] ?? 0);
        return 0;
    });

    dataDisplay.innerHTML = '';
    logTeamData();
    document.getElementById("sortOption").value = sortBy;
}

export function displayClubandManagerInfo() {
    const { username, realname, email, dateregistered, lastclick, teams } = globals.MEMBER_DATA[0];
    const { name, nickname_1, country_iso, bank_balance, ranking_points, prev_ranking_points, members, contentment, regional_rank, minor_sponsors, national_rank, total_salary, world_rank } = globals.CLUB_DATA[0];

    const formattedBalance = formatBankBalance(bank_balance);
    const registerDate = formatDateString(dateregistered), lastClick = formatDateString(lastclick);
    const ratingPointsMovement = ranking_points > prev_ranking_points ? "📈" : "📉";

    managerInfo.innerHTML = `
        <div class='card'>
            <h3>Manager Information</h3>
            <div>Manager: ${username} | (${realname}) | Email: ${email}</div>
            <div>Premium: ${globals.isPremium ? '⭐' : getPremiumInfoLink()}</div>
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
            <div>Bank: ${formattedBalance}</div>
            <div>Team Salaries: <span class='red'>$${Number(total_salary).toLocaleString()}</span></div>
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
    setRanges();
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