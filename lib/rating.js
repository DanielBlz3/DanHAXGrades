function getPlayerRating(playerInfo) {
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
            this.lastManTackles = stats.lastManTackles || 0;
            this.clearancesOffTheLine = stats.clearancesOffTheLine || 0;
            this.saves = stats.saves || 0;
            this.goalsConceded = stats.goalsConceded || 0;
            this.gkPunches = stats.gkPunches || 0;
            this.gkRecovery = stats.gkRecovery || 0;
            this.actedAsSweeper = stats.actedAsSweeper || 0;
            this.bonus = stats.bonus || 0;
        }
    }

    const stats = new playerStats(playerInfo)
    let nonAccuratePasses = stats.touches - (stats.passesC + stats.shots + stats.defensiveActions + stats.ownGoals + stats.bcm + stats.duelsWon + stats.duelsLost);
    nonAccuratePasses = Math.max(0, nonAccuratePasses);

    let duelsP = stats.duelsWon + "/" + (stats.duelsWon + stats.duelsLost) + "  (" + ((stats.duelsWon / (stats.duelsWon + stats.duelsLost)) * 100).toFixed(1) + ")%";
    let passingA = stats.passesC + "/" + (stats.passesC + nonAccuratePasses) + "  (" + ((stats.passesC / (stats.passesC + nonAccuratePasses)) * 100).toFixed(1) + ")%";
    stats.passingA = passingA
    stats.duelsP = duelsP
    const isGK = (typeof playerInfo.isGoalkeeper !== "undefined") ? playerInfo.isGoalkeeper : false;

    let {
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
        var matchRating = 6.0 + (assists * 1 +
            keyPasses * 0.35 +
            errors * -0.3 +
            bigErrors * -0.7 +
            ownGoals * -0.5 +
            duelsWon * 0.08 +
            duelsLost * -0.08 +
            saves * 0.3 +
            goalsConceded * -0.3 +
            gkPunches * 0.15 +
            gkRecovery * 0.05 +
            actedAsSweeper * 0.2 +
            bonus * 0.1)
        if (goalsConceded == 0) matchRating += 0.5;
    } else {
        var matchRating = 6.0 + (shots * 0.15 +
            goals * 1.0 +
            assists * 0.5 +
            keyPasses * 0.2 +
            secondAssists * 0.3 +
            defensiveActions * 0.2 +
            lastManTackles * 0.3 +
            clearancesOffTheLine * 0.45 +
            errors * -0.3 +
            bigErrors * -0.7 +
            ownGoals * -0.5 +
            bcm * -0.3 +
            duelsWon * 0.1 +
            duelsLost * -0.05 +
            (passesC * 0.05 + nonAccuratePasses * -0.03 + passesC / 75) +
            bonus * 0.1)
    }
    return matchRating = Math.max(0.1, Math.min(10, Math.round(matchRating * 100) / 100))
}

export default getPlayerRating