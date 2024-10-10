// UPDATED TO 1.0.5 //

import { globals, Elements, } from "./globalStore.js";
import { getPlayerIdsAsString } from "./helpersFunctions.js";
import { logClubData, logTeamData, displayClubandManagerInfo } from "./uiFunctions.js";
import { trimKey } from "./keyFunctions.js";

// API URL
const API_URL = 'https://corsproxy.io/?https://classic-api.blackoutrugby.com/';

// Fetch Rugby Data
export async function fetchRugbyData(requestType, additionalParams = {}) {
    const mailParams = {
        d: 1038,
        dk: '2yysSrd2fZxuOu5y',
        r: requestType,
        m: globals._memberid,
        mk: globals._mainKey,
        json: 1,
        ...additionalParams
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(mailParams)
        });
        const data = await response.json();

        if (data.status.trim() === 'Ok') {
            return data;  
        } else {
            // throw new Error(data.error || 'Unknown error occurred');
        }
    } catch (error) {
        throw error;  
    }
}

// Retrieve Data
export async function retrieveData(initCall) {
    if (initCall) {
        let memberKey = localStorage.getItem('key');
        globals._memberid = trimKey(memberKey);
        globals._mainKey = memberKey.slice(-40);
    }

    Elements.form.style.display = 'none';
    Elements.infoDisplay.classList.remove('hide');

    try {
        const memberData = await fetchRugbyData('m', { memberid: globals._memberid });
        globals.MEMBER_DATA = Object.values(memberData.members);
        globals._teamid = globals.MEMBER_DATA[0].teamid;

        // Set global game information
        globals._globals = {
            day: memberData.gameDate.day,
            round: memberData.gameDate.round,
            season: memberData.gameDate.season
        };

        globals.isPremium = globals.MEMBER_DATA[0].premium === '1';

        // Fetch club and trophy data
        const clubData = await fetchRugbyData('t', { teamid: globals._teamid });
        globals.CLUB_DATA = Object.values(clubData.teams);

        const clubTrophyData = await fetchRugbyData('trph', { teamid: globals._teamid });
        globals.CLUB_DATA[0].trophies = clubTrophyData ? Object.values(clubTrophyData.trophies) : [];
        globals.trophies = !!clubTrophyData;

        // Fetch player data
        const playerData = await fetchRugbyData('p', { teamid: globals._teamid });
        globals.PLAYER_DATA = Object.values(playerData.players);

        // Fetch player statistics
        const playerStatisticsData = await fetchRugbyData('ps', { playerid: getPlayerIdsAsString(globals.PLAYER_DATA) });
        globals.PLAYER_STATISTICS_DATA = Object.values(playerStatisticsData['player statistics']);

        processData();

        // Update UI
        Elements.infoDisplay.classList.add('hide');
    } catch (error) {
        console.error('Error during fetch operations:', error);
    }
}

// Process Data
async function processData() {
    // Sort player and statistics data
    globals.PLAYER_DATA.sort((a, b) => Number(a.id) - Number(b.id));
    globals.PLAYER_STATISTICS_DATA.sort((a, b) => Number(a.playerid) - Number(b.playerid));

    // Merge player and statistics data
    if (globals.PLAYER_DATA.length === globals.PLAYER_STATISTICS_DATA.length) {
        for (let i = 0; i < globals.PLAYER_DATA.length; i++) {
            Object.assign(globals.PLAYER_DATA[i], globals.PLAYER_STATISTICS_DATA[i]);

            // Fetch bidding team name if exists
            if (globals.PLAYER_DATA[i].bidteamid) {
                try {
                    let team = await fetchRugbyData('t', { teamid: globals.PLAYER_DATA[i].bidteamid });
                    globals.PLAYER_DATA[i].bidteamname = team.teams[globals.PLAYER_DATA[i].bidteamid]?.name || 'Error fetching team';
                } catch (error) {
                    console.error(`Error fetching team for player ${globals.PLAYER_DATA[i].name}`, error);
                    globals.PLAYER_DATA[i].bidteamname = 'Error fetching team';
                }
            }
        }
    }

    globals.PLAYER_DATA.sort((a, b) => b.csr - a.csr);

    console.log(globals.PLAYER_DATA);

    logTeamData();
    displayClubandManagerInfo();
    logClubData();
}
