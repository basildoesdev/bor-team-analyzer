// MOSTLY UPDATED 1.0.5
import { Elements, globals } from "./globalStore.js"; 
import { normalizeValue  } from "./helpersFunctions.js";
import { suggestedPosition, weightSuggestion, calculatePerformance, evaluatePlayerPosition,  } from "./algorithmFunctions.js";
import { getSettingsInfo, setRanges, loadSavedPositionWeights } from "./settingsUiFunctions.js";

 //#region // NEEDS OPTIMIZATION //
export function logTeamData() {
    Elements.dataDisplay.innerHTML = '';
    Elements.dataDisplayAvg.innerHTML = '';
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
        // console.log(element.bidteamname);[24].bidteamname
        Elements.dataDisplay.innerHTML += `
            <div class='card parent'>
                <div class='red injury'>${isDateInPast(element.injured) ? " ❗ Injured until: " + formatDateString(element.injured) + " ❗": " "} </div>
                <div class='blue'>
                        ${element.listed ? "💲 Current Price: $" + Number(element.price).toLocaleString()
                        + (element.bidteamname ? ' | Bidder : '+ element.bidteamname : ' | No Bids')  + " |  Deadline: " + formatDateString(element.listed) + " 💲": " "} 
                </div>
                <div class='child'><img src='https://www.blackoutrugby.com/images/trans.gif'/> <span class='name'>${element.name}</span><img class='nat-img' src='https://www.blackoutrugby.com/images/flagz/${element.nationality.toLowerCase()}.gif'/></span> 
                    | <span class='age'> ${element.age}.yo </span>
                    | <span class='form'>Form: ${element.form}</span> | <span class='energy'>Energy: ${globals.isPremium ? element.energy/10 : element.energy} </span>
                    | <span class='csr'> CSR: ${Number(element.csr).toLocaleString()}</span> | <span class='performance'>
                    Performance Rating: ${globals.isPremium? element.form + ((element.energy/10)/2) : element.form + (element.energy/2)} (${globals.isPremium ? (element.form + (element.energy/10) / 2 + element.csr / 1000).toFixed(0) : (element.form + element.energy / 2 + element.csr / 1000).toFixed(0)})</span>
                    <div>
                        <span class='physicals'>${element.weight}kg | ${element.height}cm | ${getEmoji('aggression', element.aggression)} | ${getEmoji('discipline', element.discipline)}</span> 
                    </div>
                    <div class='position'>Weight suggests: ${weightSuggestion(element.weight)}</div>
                </div>
                <div class='skills'>
                    <div class='stats-container'>
                        <div class='stats-category'>
                            <h5>Suggestions</h5>
                            <div class='stats-spacer'>
                                <span>${suggestedPos[0].position} </span><span>${suggestedPos[0].score.toFixed(1)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>${suggestedPos[1].position} </span><span>${suggestedPos[1].score.toFixed(1)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>${suggestedPos[2].position} </span><span>${suggestedPos[2].score.toFixed(1)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>${suggestedPos[3].position} </span><span>${suggestedPos[3].score.toFixed(1)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>${suggestedPos[4].position} </span><span>${suggestedPos[4].score.toFixed(1)}</span>
                            </div>
                        </div>
                        <div class='stats-category'>
                        <h5><br></h5>
                            <div class='stats-spacer'>
                                <span>Stamina: </span> <span class="stat-value">${colorizeNumber(element.stamina)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>Attack: </span> <span class="stat-value">${colorizeNumber(element.attack)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>Technique: </span> <span class="stat-value">${colorizeNumber(element.technique)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>Jumping: </span> <span class="stat-value">${colorizeNumber(element.jumping)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>Agility:</span> <span class="stat-value">${colorizeNumber(element.agility)}</span>
                            </div>
                        </div>
                        <div class='stats-category'>
                        <h5><br></h5>
                            <div class='stats-spacer'>
                                <span>Handling: </span> <span class="stat-value">${colorizeNumber(element.handling)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>Defense: </span> <span class="stat-value">${colorizeNumber(element.defense)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>Strength: </span> <span class="stat-value">${colorizeNumber(element.strength)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>Speed: </span> <span class="stat-value">${colorizeNumber(element.speed)}</span>
                            </div>
                            <div class='stats-spacer'>
                                <span>Kicking:</span> <span class="stat-value">${colorizeNumber(element.kicking)}</span>
                            </div>
                        </div>
                    </div>
                 </div>
                

                 


                
                
                <div class='physicals'>Exclusions: ${evaluatePlayerPosition(element.weight, element.height)}</div>
                <div id=${element.id} class='statistics'> </div>

        </div>
        
        <div id="stats-${element.id}" class="hidden-stats card" style="display: none;">
        <h4>Statistics for ${element.name}</h4>
    
        <div class="stats-container">
            <div class="stats-category">
                <h5>Caps</h5>
                <div class='stats-spacer'>
                    <span>League:</span> <span class="stat-value">${element.leaguecaps}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Cup:</span> <span class="stat-value">${element.cupcaps}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Friendly:</span> <span class="stat-value">${element.friendlycaps}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Under 20:</span> <span class="stat-value">${element.undertwentycaps}</span>
                </div>
                <div class='stats-spacer'>
                    <span>National:</span> <span class="stat-value">${element.nationalcaps}</span>
                </div>
            </div>

            <div class="stats-category">
                <h5>Points</h5>
                <div class='stats-spacer'>
                    <span>Tries:</span> <span class="stat-value">${element.tries}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Conversions:</span> <span class="stat-value">${element.conversions}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Penalties:</span> <span class="stat-value">${element.penalties}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Dropgoals:</span> <span class="stat-value">${element.dropgoals}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Total Points:</span> <span class="stat-value">${element.totalpoints}</span>
                </div>
            </div>

            <div class="stats-category">
                <h5>Attack</h5>
                <div class='stats-spacer'>
                    <span>Meters Gained:</span> <span class="stat-value">${element.metresgained}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Linebreaks:</span> <span class="stat-value">${element.linebreaks}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Intercepts:</span> <span class="stat-value">${element.intercepts}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Try Assists:</span> <span class="stat-value">${element.tryassists}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Beaten Defenders:</span> <span class="stat-value">${element.beatendefenders}</span>
                </div>
            </div>

            <div class="stats-category">
                <h5>Kicking</h5>
                <div class='stats-spacer'>
                    <span>Kicks: </span> <span class="stat-value">${element.kicks}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Good Kicks: </span> <span class="stat-value">${element.goodkicks}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Meters Kicked: </span> <span class="stat-value">${element.kickingmetres}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Avg Meters Kicked: </span> <span class="stat-value">${element.avkickingmetres}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Kickes out on full:</span> <span class="stat-value">${element.kicksoutonthefull}</span>
                </div>
                <div class='stats-spacer'>
                    <span>Good U&U:</span> <span class="stat-value">${element.goodupandunders}</span>
                </div>
            </div>

            </div>

            
        </div>
    </div>`
        
            styleInjuryorSell(isDateInPast(element.injured), element.listed ,i)
    });

    const playerNames = document.querySelectorAll('.statistics');

    playerNames.forEach(name => {
        name.addEventListener('click', function() {
            const playerId = this.id; // Get the ID of the clicked player
            const statsDiv = document.getElementById(`stats-${playerId}`); // Select the corresponding stats div

            // Toggle the 'show' class
            if (statsDiv.classList.contains('show')) {
                statsDiv.classList.remove('show'); // Hide stats
                statsDiv.style.display = 'none'; // Ensure it's hidden in the DOM
            } else {
                statsDiv.classList.add('show'); // Show stats
                statsDiv.style.display = 'block'; // Show the stats in the DOM
            }
        });
    });

    // Select the statistics element
    const statsElement = document.querySelector('.statistics');

    // Add click event listener
    statsElement.addEventListener('click', function() {
        // Toggle the rotate class
        this.classList.toggle('rotate');
    });


    
    function styleInjuryorSell(injury_value, sell_value, index) {
        const parentElement = document.querySelectorAll('.parent')[index]; // Selects the current parent element
        if (injury_value) {
            parentElement.classList.add('injured');
        }
        if (sell_value){
            parentElement.classList.add('sell');
        }
        if (sell_value && injury_value){
            parentElement.classList.add('sell-and-injured')
            parentElement.classList.remove('sell')
            parentElement.classList.remove('injured')
        }
    }

    const avg = globals.PLAYER_DATA.length;
    Elements.dataDisplayAvg.style.marginTop = '10px';
    Elements.dataDisplayAvg.innerHTML = `
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
    
        Elements.sortListDisplay.innerHTML = `<div class='card'>
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

    Elements.dataDisplay.innerHTML = '';
    logTeamData();
    document.getElementById("sortOption").value = sortBy;
}
//#endregion
 
//#region // UPDATED TO 1.0.5 // 
export function logClubData() {
    Elements.infoContainer.classList.remove('hide');

    // Display game date information
    const gameDateDisplay = document.getElementById('game-date');
    gameDateDisplay.innerHTML = `Season: ${globals._globals.season}, Round: ${globals._globals.round}, Day: ${globals._globals.day}`;
    gameDateDisplay.classList.remove('hide');

    // Set up refresh button
    const refresh = document.getElementById('refresh');
    refresh.classList.remove('hide');

    refresh.addEventListener('click', () => {
        Elements.dataDisplay.innerHTML = '';
        Elements.dataDisplayAvg.innerHTML = '';
        loadSavedPositionWeights();
        setRanges();
        window.location.reload();
    });

    // Extract relevant data from globals
    const [{ username }] = globals.MEMBER_DATA;
    const [{ name, country_iso }] = globals.CLUB_DATA;
    const playersCount = globals.PLAYER_DATA.length;

    // Construct the content to be displayed
    const managerName = `<h3>Manager: ${username} ${globals.isPremium ? "⭐" : ""}</h3>`;
    const clubName = `<h3>Club: ${name} <img class='nat-img' src='https://www.blackoutrugby.com/images/flagz/${country_iso.toLowerCase()}.gif'/></h3>`;
    const squadCount = `<h3>Squad (${playersCount})</h3>`;
    const settingsLabel = `<h3>🔧 Settings</h3>`;

    // Function to apply content to multiple elements
    const applyContent = (elements, content) => {
        elements.forEach(element => {
            element.innerHTML = content;
        });
    };

    // Update tab names and options with the same content
    applyContent([Elements.tab1Name, Elements.option1Name], managerName);
    applyContent([Elements.tab2Name, Elements.option2Name], clubName);
    applyContent([Elements.tab3Name, Elements.option3Name], squadCount);
    applyContent([Elements.tab4Name, Elements.option4Name], settingsLabel);
}

export function displayClubandManagerInfo() {
    const { username, realname, email, dateregistered, lastclick, teams } = globals.MEMBER_DATA[0];
    const { name, nickname_1, country_iso, bank_balance, ranking_points, prev_ranking_points, members,
        contentment, regional_rank, minor_sponsors, national_rank, total_salary, world_rank,
        stadium, stadium_capacity, stadium_corporate, stadium_covered, stadium_members, stadium_uncovered,
        stadium_standing, prev_regional_rank, prev_national_rank, prev_world_rank } = globals.CLUB_DATA[0];

    const formattedBalance = formatBankBalance(bank_balance);
    const registerDate = formatDateString(dateregistered);
    const lastClick = formatDateString(lastclick);

    // Manager Info
    Elements.managerInfo.innerHTML = `
        <div class='card'>
            <h3>Manager Information</h3>
            <div>Manager: ${username} | (${realname}) | Email: ${email}</div>
            <div>Premium: ${globals.isPremium ? '⭐' : getPremiumInfoLink()}</div>
            <div>Managed Teams: ${teams.length}</div>
            <div>Registered: ${registerDate}</div>
            <div>Last Click: ${lastClick}</div>
        </div>`;

    // Club Info
    Elements.clubInfo.innerHTML = `
        <div class='card'>
            <div class="club-name-title">
                ${name} <span class='physicals'>'${nickname_1}'
                <img class='nat-img' src='https://www.blackoutrugby.com/images/flagz/${country_iso.toLowerCase()}.gif'/></span>
            </div>
            <hr/><br/>
            <div class="stats-container">
                ${generateStatsHTML(formattedBalance, members, contentment, minor_sponsors, total_salary, 
                    ranking_points, prev_ranking_points, regional_rank, prev_regional_rank, national_rank, 
                    prev_national_rank, world_rank, prev_world_rank, stadium, stadium_capacity, stadium_corporate, 
                    stadium_members, stadium_covered, stadium_uncovered, stadium_standing)}
            </div>
        </div>
        <div class='card'>
            <div class="club-name-title">
                <h2>Trophies</h2>
            </div>
            <hr/><br/>
            ${cabinetBuilder()}
        </div>`;

    Elements.settingsInfo.innerHTML = getSettingsInfo();
    setRanges();
}

// Generate Stats HTML to reduce redundancy in club info 1.0.5
function generateStatsHTML(formattedBalance, members, contentment, minor_sponsors, total_salary, 
    ranking_points, prev_ranking_points, regional_rank, prev_regional_rank, national_rank, 
    prev_national_rank, world_rank, prev_world_rank, stadium, stadium_capacity, stadium_corporate, 
    stadium_members, stadium_covered, stadium_uncovered, stadium_standing) {
    
    const ratingPointsMovement = ranking_points > prev_ranking_points ? "📈" : "📉";
    
    return `
        <div class="stats-category">
            <h5>Finance</h5>
            <div class='stats-spacer-club'>
                <span>Bank: </span><span>${formattedBalance}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Team Salaries: </span><span class='red'>$${Number(total_salary).toLocaleString()}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Members: </span><span>${members}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Contentment: </span><span>${getEmoji('contentment', contentment)}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Sponsors: </span><span>${minor_sponsors}</span>
            </div>
        </div>
        <div class="stats-category">
            <h5>Rankings</h5>
            <div class='stats-spacer-club'>
                <span>Rating: </span><span class='${getRankingClass(ranking_points, prev_ranking_points)}'>${ranking_points} ${ratingPointsMovement}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Movement: </span><span>${(ranking_points - prev_ranking_points).toFixed(4)}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Regional: </span><span>${regional_rank} (${prev_regional_rank - regional_rank})</span>
            </div>
            <div class='stats-spacer-club'>
                <span>National: </span><span>${national_rank} (${prev_national_rank - national_rank})</span>
            </div>
            <div class='stats-spacer-club'>
                <span>World: </span><span>${world_rank} (${prev_world_rank - world_rank})</span>
            </div>
        </div>
        <div class="stats-category">
            <h5>${stadium}</h5>
            <div class='stats-spacer-club'>
                <span>Capacity: </span><span>${stadium_capacity}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Corporate: </span><span>${stadium_corporate}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Members: </span><span>${stadium_members}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Covered: </span><span>${stadium_covered}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Uncovered: </span><span>${stadium_uncovered}</span>
            </div>
            <div class='stats-spacer-club'>
                <span>Standing: </span><span>${stadium_standing}</span>
            </div>
        </div>`;
}

function cabinetBuilder(){
    if(globals.trophies){
        let trophies = `<div class='cabinet'>`;
  
    function decodeHTMLEntities(str) {
        // Create a temporary element to decode HTML entities
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = str;
        return tempDiv.innerText || tempDiv.textContent;
    }


    globals.CLUB_DATA[0].trophies.forEach(element => {
        let decodedLabel = decodeHTMLEntities(element.label)
        // console.log(decodedLabel)
        trophies += `<div class='trophy'><br/><img src='${element.image_url}' alt=''/> <br/><span class='physicals' style='font-size: x-small'>${decodedLabel}</div>` ;
        
    });

    trophies += `</div>`
    return trophies

    }else{
        return 'Not Yet';
    }
    
    
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
        // second:'2-digit',
        // timeZoneName: 'short'
    })
    return readableDate;
}

function formatBankBalance(balance) {
    return balance > 0 
        ? `<span class="form">$${Number(balance).toLocaleString()}</span>` 
        : `<span class="red">$${Number(balance).toLocaleString()}</span>`;
}

//#endregion