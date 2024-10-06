
export function playerStatisticsHelper(playerData) {
    // Join player IDs into a comma-separated string
    return playerData.map(player => player.id).join(',');
}

export function normalizeValue(value, maxStat, min, max) {
    // Normalize value between min and max
    return Math.max(1, Math.min(maxStat, ((value - min) / (max - min)) * (maxStat - 1) + 1));
}