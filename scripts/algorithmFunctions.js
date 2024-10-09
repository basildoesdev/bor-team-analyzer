import { globals } from "./globalStore.js";

export let positionWeights = 0;

export let defaultPositionWeights = {
    'Looshead Prop': { 
        "Weight": 1.42, "Height": 0.51, "Stamina": 1, "Attack": 0.71, "Technique": 1.34, 
        "Jumping": 0, "Agility": 0.2, "Handling": 0.91, "Defense": 1.01, "Strength": 1.4, 
        "Speed": 0.5, "Kicking": 0 },
    'Hooker': { 
        "Weight": 1.13, "Height": 0.49, "Stamina": 1, "Attack": 0.69, "Technique": 1.34, 
        "Jumping": 0, "Agility": 0.3, "Handling": 1.34, "Defense": 0.95, "Strength": 1.26, 
        "Speed": 0.5, "Kicking": 0 },
    'Tighthead Prop': { 
        "Weight": 1.4, "Height": 0.52, "Stamina": 1, "Attack": 0.73, "Technique": 1.35, 
        "Jumping": 0, "Agility": 0.2, "Handling": 0.83, "Defense": 1.01, "Strength": 1.46, 
        "Speed": 0.5, "Kicking": 0 },
    'Lock': { 
        "Weight": 0.9, "Height": 1.03, "Stamina": 1, "Attack": 0.55, "Technique": 0.84, 
        "Jumping": 1.26, "Agility": 0.2, "Handling": 1.05, "Defense": 0.8, "Strength": 0.94, 
        "Speed": 0.43, "Kicking": 0 },
    'Blindside Flanker': { 
        "Weight": 0.96, "Height": 0.72, "Stamina": 1, "Attack": 0.67, "Technique": 0.96, 
        "Jumping": 0.77, "Agility": 0.53, "Handling": 0.77, "Defense": 1.09, "Strength": 0.96, 
        "Speed": 0.57, "Kicking": 0 },
    'Openside Flanker': { 
        "Weight": 0.96, "Height": 0.67, "Stamina": 1, "Attack": 0.67, "Technique": 1.25, 
        "Jumping": 0.4, "Agility": 0.53, "Handling": 1.08, "Defense": 0.96, "Strength": 0.96, 
        "Speed": 0.52, "Kicking": 0 },
    'No.8': { 
        "Weight": 0.91, "Height": 0.61, "Stamina": 1, "Attack": 0.9, "Technique": 1.01, 
        "Jumping": 0.62, "Agility": 0.62, "Handling": 0.81, "Defense": 1.01, "Strength": 1, 
        "Speed": 0.51, "Kicking": 0 },
    'Scrum Half': { 
        "Weight": 0, "Height": 0, "Stamina": 1, "Attack": 1.31, "Technique": 0.64, 
        "Jumping": 0, "Agility": 1.33, "Handling": 1.34, "Defense": 1.12, "Strength": 0.56, 
        "Speed": 1.1, "Kicking": 0.6 },
    'Fly Half': { 
        "Weight": 0, "Height": 0, "Stamina": 1, "Attack": 1.19, "Technique": 0.64, 
        "Jumping": 0, "Agility": 1.08, "Handling": 1.17, "Defense": 1.12, "Strength": 0.56, 
        "Speed": 0.92, "Kicking": 1.32 },
    'Center': { 
        "Weight": 0.35, "Height": 0, "Stamina": 1, "Attack": 1.29, "Technique": 0.6, 
        "Jumping": 0, "Agility": 1.17, "Handling": 1.2, "Defense": 1.33, "Strength": 0.8, 
        "Speed": 1.26, "Kicking": 0 },
    'Wing': { 
        "Weight": 0, "Height": 0, "Stamina": 1, "Attack": 1.36, "Technique": 0.61, 
        "Jumping": 0, "Agility": 1.38, "Handling": 1.27, "Defense": 1.31, "Strength": 0.7, 
        "Speed": 1.37, "Kicking": 0 },
    'Fullback': { 
        "Weight": 0, "Height": 0, "Stamina": 1, "Attack": 1.02, "Technique": 0.61, 
        "Jumping": 0.26, "Agility": 1.14, "Handling": 1.18, "Defense": 1.28, "Strength": 0.43, 
        "Speed": 1.29, "Kicking": 0.79 }
  };
  

if (localStorage.getItem('positionWeights')){
    // console.log('applued logged weights')
    positionWeights = JSON.parse(localStorage.getItem('positionWeights'))
}else{
    positionWeights = defaultPositionWeights;
}
// console.log(positionWeights)

export function checkPositionWeights(positionWeights) {
    for (let position in positionWeights) {
        const total = Object.values(positionWeights[position]).reduce((sum, val) => sum + val, 0);
        if (total !== 9) {
            console.log(`Error: ${position} does not equal 9, it equals ${total}`);
        } else {
            console.log(`${position} is correctly balanced.`);
        }
    }
}

// checkPositionWeights(positionWeights);

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

export const minHeightWeight = {
    'Prop': { minWeight: 120, maxHeight: 190 },
    'Hooker': { minWeight: 110, maxHeight: 185 },
    'Lock': { minHeight: 199, minWeight: 105 },
    'Blindside': { minHeight: 195, minWeight: 110 },
    'Openside': { minHeight: 185, minWeight: 105 },
    'Number8': { minHeight: 185, minWeight: 105 },
    'Center': { minWeight: 90 }
};

export function evaluatePlayerPosition(weight, height) {
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

export function suggestedPosition(playerStats, weight, height) {
    const scores = Object.keys(positionWeights).map(position => ({
        position,
        score: scorePositions(playerStats, positionWeights[position], position, weight, height)
    }));

    scores.sort((a, b) => b.score - a.score);
    // return scores.slice(0, 2);
    return scores; 
}

export function weightSuggestion(weight) {
    return weight < 100 ? 'Back' : (weight > 105 ? 'Forward' : 'Forward or Back');
}

export function calculatePerformance(player) {
    // console.log(player.energy /100)
    return globals.isPremium ? player.form + (player.energy / 10) / 2 : player.form + player.energy / 2 ;
        // ? player.form + (player.energy / 10) / 2 + player.csr / 1000 
        // : player.form + player.energy / 2 + player.csr / 1000;
}