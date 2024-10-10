// UPDATED TO 1.0.5 //

export function getPlayerIdsAsString(playerData) {
    if (!Array.isArray(playerData)) {
        console.warn('Expected an array of player data.');
        return '';
    }
    
    return playerData
        .filter(player => player && player.id) // Ensure each player has an ID
        .map(player => player.id)
        .join(',');
}

export function normalizeValue(value, maxStat, min, max) {
    if (max === min) {
        console.warn('Max and min cannot be the same. Returning the min value.');
        return min;
    }
    
    // Ensure inputs are numbers
    if (typeof value !== 'number' || typeof maxStat !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
        console.error('Invalid input types. All parameters must be numbers.');
        return null; // Or some default value
    }

    return Math.max(1, Math.min(maxStat, ((value - min) / (max - min)) * (maxStat - 1) + 1));
}

export function trimEdges(string) {
    if (typeof string !== 'string') {
        console.error('Input must be a string.');
        return ''; // Return an empty string or throw an error
    }
    
    if (string.length <= 2) {
        console.warn('String is too short to trim. Returning original string.');
        return string; // Return the original string if too short
    }
    
    return string.slice(1, -1);
}