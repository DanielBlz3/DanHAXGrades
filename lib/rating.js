function getPlayerRating(playerInfo, isGK) {
    class playerStats {
        constructor(stats) {
            this.goals = stats.goals || 0;
            this.shots = stats.shots || 0;
            this.bcm = stats.bcm || 0;
            this.passesC = stats.passesC || 0;
            this.assists = stats.assists || 0;
            this.keyPasses = stats.keyPasses || 0;
            this.secondAssists = stats.secondAssists || 0;
            this.touches = stats.touches || 0;
            this.defensiveActions = stats.defensiveActions || 0;
            this.errors = stats.errors || 0;
            this.bigErrors = stats.bigErrors || 0;
            this.ownGoals = stats.ownGoals || 0;
            this.duelsWon = stats.duelsWon || 0;
            this.duelsLost = stats.duelsLost || 0;
            this.lastManTackles = stats?.lastManTackles || 0;
            this.clearancesOffTheLine = stats?.clearancesOffTheLine || 0;
            this.saves = stats?.saves || 0;
            this.goalsConceded = stats?.goalsConceded || 0;
            this.gkPunches = stats?.gkPunches || 0;
            this.gkRecovery = stats?.gkRecovery || 0;
            this.actedAsSweeper = stats?.actedAsSweeper || 0;
            this.bonus = stats.bonus || 0;
        }
    }

    const stats = new playerStats(playerInfo)
    let nonAccuratePasses = stats.touches - (stats.passesC + stats.shots + stats.defensiveActions + stats.ownGoals + stats.bcm + stats.duelsWon + stats.duelsLost);
    nonAccuratePasses = Math.max(0, nonAccuratePasses);

    let duelsPercentage = stats.duelsWon + "/" + (stats.duelsWon + stats.duelsLost) + "  (" + ((stats.duelsWon / (stats.duelsWon + stats.duelsLost)) * 100).toFixed(1) + ")%";
    let passingAccuracy = stats.passesC + "/" + (stats.passesC + nonAccuratePasses) + "  (" + ((stats.passesC / (stats.passesC + nonAccuratePasses)) * 100).toFixed(1) + ")%";
    stats.passingA = passingAccuracy
    stats.duelsP = duelsPercentage

    const {
        goals,
        shots,
        bcm,
        passesC,
        assists,
        keyPasses,
        secondAssists,
        touches,
        defensiveActions,
        errors,
        bigErrors,
        ownGoals,
        duelsWon,
        duelsLost,
        lastManTackles,
        clearancesOffTheLine,
        saves,
        goalsConceded,
        gkPunches,
        gkRecovery,
        actedAsSweeper,
        bonus
    } = stats || {}

    if (isGK === true) {
        var matchRating = 6.0 + (
            goals * 2 + // WORTH MORE FOR GOALKEEPERS
            assists * 1 + // SAME
            keyPasses * 0.35 + // SAME
            errors * -0.3 + // ERROR LEADING TO A SHOT
            bigErrors * -0.7 + //ERROR LEADING TO GOAL
            ownGoals * -0.5 +
            duelsWon * 0.08 +
            duelsLost * -0.08 +
            saves * 0.3 +
            goalsConceded * -0.3 +
            gkPunches * 0.15 + //SYNONYMOUS TO CROSS HITS/PUNCHES
            gkRecovery * 0.05 + //WHEN KEEPER WINS THE BALL FOR HIS TEAM OR RECEIVES THE BALL FROM THE OPPOSITION
            actedAsSweeper * 0.2 + // SUCCESSFUL SWEEPER ACTS
            bonus * 0.1)
        if (goalsConceded == 0) matchRating += 0.5;
    } else {
        var matchRating = 6.0 + (shots * 0.15 +
            goals * 1.0 +
            assists * 0.5 +
            keyPasses * 0.2 + //PASS IN WHCIH RESULTS TO A SHOT, (BLOCKED SHOTS TOO DEPENDING ON HOW EARLY THE SHOT WAS BLOCKED)
            secondAssists * 0.3 + //PRE-ASSIST, NON-ASSIST ACTION THAT INFLUENCES A GOAL, SHOT OR PASS THAT DIRECTLY LEADS TO AN OWN GOAL 
            defensiveActions * 0.15 +
            lastManTackles * 0.3 + //TACKLES THAT PREVENT A CLEAR GOALSCORING OPPURTUNITY
            clearancesOffTheLine * 0.45 + // ALMOST A "SAVE" BUT FOR AN OUTFIELDER
            errors * -0.3 +
            bigErrors * -0.7 +
            ownGoals * -0.5 +
            bcm * -0.3 + //BIG CHANCE MISSED
            duelsWon * 0.15 +
            duelsLost * -0.1 +
            (passesC * 0.05 + nonAccuratePasses * -0.03 + passesC / 75) +
            bonus * 0.1)
    }
    return Math.max(0.1, Math.min(10, Math.round(matchRating * 100) / 100))
}

export default getPlayerRating