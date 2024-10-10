//UPDATED 1.0.5 //
export const version = '1.0.5';

// Element references
export const Elements = {
    versionTitle: document.getElementById('version-title-dispaly') || console.warn('Version title display element not found'),
    info: document.getElementById('information') || console.warn('Information element not found'),
    dataDisplay: document.getElementById('player-card-container') || console.warn('Player card container not found'),
    dataDisplayAvg: document.getElementById('averages') || console.warn('Averages display not found'),
    sortListDisplay: document.getElementById('sort-list-display') || console.warn('Sort list display not found'),
    form: document.getElementById('team-analyzer-form') || console.warn('Team analyzer form not found'),
    submitBtn: document.getElementById('submit') || console.warn('Submit button not found'),
    accessKey: document.getElementById('access-key') || console.warn('Access key element not found'),
    isSaveKey: document.getElementById('save-key') || console.warn('Save key element not found'),
    keyValidDisplay: document.getElementById('key-valid-display') || console.warn('Key valid display not found'),
    infoContainer: document.getElementById('info-container') || console.warn('Info container not found'),
    infoDisplay: document.getElementById('information') || console.warn('Info Display not found'),
    tab1Name: document.getElementById('tab-1-btn') || console.warn('Tab 1 button not found'),
    tab2Name: document.getElementById('tab-2-btn') || console.warn('Tab 2 button not found'),
    tab3Name: document.getElementById('tab-3-btn') || console.warn('Tab 3 button not found'),
    tab4Name: document.getElementById('tab-4-btn') || console.warn('Tab 4 button not found'),
    option1Name: document.getElementById('option1') || console.warn('Option 1 element not found'),
    option2Name: document.getElementById('option2') || console.warn('Option 2 element not found'),
    option3Name: document.getElementById('option3') || console.warn('Option 3 element not found'),
    option4Name: document.getElementById('option4') || console.warn('Option 4 element not found'),
    managerInfo: document.getElementById('manager-infos') || console.warn('Manager info element not found'),
    clubInfo: document.getElementById('club-infos') || console.warn('Club info element not found'),
    settingsInfo: document.getElementById('settings-infos') || console.warn('Settings info element not found'),
};

// Global variables
export let globals = {
    PLAYER_DATA: [],
    CLUB_DATA: [],
    MEMBER_DATA: [],
    PLAYER_STATISTICS_DATA: [],
    _mainKey: 0,
    _memberid: 0,
    _teamid: 0,
    _globals: {
        season: 0,
        round: 0,
        day: 0,
    },
    refresh: 0,
    isPremium: false,
    totalWeightsSum: 0,
    trophies: false,
};
