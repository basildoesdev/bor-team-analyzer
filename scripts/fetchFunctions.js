import { globals, form, infoDisplay } from "./globalStore.js";
import { playerStatisticsHelper } from "./helpersFunctions.js";
import { logClubData, logTeamData, displayClubandManagerInfo, sortPlayers } from "./uiFunctions.js";
import { trimKey, badKeyDay } from "./keyFunctions.js";

// import { DEVID, DEVKEY } from "./keys.js";

async function fetchRugbyData(request_type, additionalParams = {}) {
    const url = 'https://corsproxy.io/?https://classic-api.blackoutrugby.com/';
    const mailparams = {
        d: 1038,
        dk: '2yysSrd2fZxuOu5y',
        r: request_type,
        m: globals._memberid,
        mk: globals._mainKey,
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
            return data;  
        } else {
            // throw new Error(data.error || 'Unknown error occurred');
        }
    } catch (error) {
        console.log('Error:', error);
        // badKeyDay();
        return data
        throw error;  
    }
}

export async function retrieveData(initcall) {
    if (initcall) {
        let memberKey = localStorage.getItem('key');
        globals._memberid = trimKey(memberKey);
        globals._mainKey = memberKey.slice(-40);
    }

    form.style.display = 'none';
    infoDisplay.classList.remove('hide')

    try {
        const memberData = await fetchRugbyData('m', { memberid: globals._memberid });
        globals.MEMBER_DATA = Object.values(memberData.members);
        globals._teamid = globals.MEMBER_DATA[0].teamid;

        globals._globals = {
            day: memberData.gameDate.day,
            round: memberData.gameDate.round,
            season: memberData.gameDate.season
        };
        
        globals.MEMBER_DATA[0].premium == '1' ? globals.isPremium = true : globals.isPremium = false;

        const clubData = await fetchRugbyData('t', { teamid: globals._teamid });
        globals.CLUB_DATA = Object.values(clubData.teams);

        const clubTrophyData = await fetchRugbyData('trph', {teamid: globals._teamid})
        if(clubTrophyData != undefined){
            globals.CLUB_DATA[0].trophies = Object.values(clubTrophyData.trophies);
            globals.trophies = true;
        }else{
            console.log('no trophies');
            globals.trophies = false;
        }
        

        const playerData = await fetchRugbyData('p', { teamid: globals._teamid });
        globals.PLAYER_DATA = Object.values(playerData.players).sort((a, b) => b.csr - a.csr);

        const playerStatisticsData = await fetchRugbyData('ps', { playerid: playerStatisticsHelper(globals.PLAYER_DATA) });
        globals.PLAYER_STATISTICS_DATA = Object.values(playerStatisticsData['player statistics']);

        const lastFixtureData = await fetchRugbyData('f', { teamid: globals._teamid, last: 4 });
        globals.CLUB_DATA[0].fixtures = Object.values(lastFixtureData.fixtures)
        // console.log(lastFixtureData);
        
        devDataLogs();
        
        // UI update calls
        logTeamData();
        displayClubandManagerInfo();
        logClubData();

        infoDisplay.classList.add('hide');
    } catch (error) {
        console.error('Error during fetch operations:', error);
    }
}

function devDataLogs() {
    console.log('Player Data:', globals.PLAYER_DATA);
    console.log('Club Data:', globals.CLUB_DATA);
    console.log('Member Data:', globals.MEMBER_DATA);
}

