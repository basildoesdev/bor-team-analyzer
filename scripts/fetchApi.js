

export async function fetchRugbyData(request_type, additionalParams = {}) {
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

export async function retrieveData(initcall) {
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