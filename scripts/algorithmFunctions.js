import { globals } from "./globalStore.js";

export const positionWeights = {
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
        const total = Object.values(positionWeights[position]).reduce((sum, val) => sum + val, 0);
        if (total !== 9) {
            console.log(`Error: ${position} does not equal 9, it equals ${total}`);
        } else {
            console.log(`${position} is correctly balanced.`);
        }
    }
}

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
    return scores.slice(0, 2); 
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