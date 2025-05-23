//GLOBAL VARIABLES
const pathParts = window.location.pathname.split("/");
const matchId = parseInt(pathParts[2]);
var pageTheme = localStorage.getItem("theme") || "theme-light";
var gameInfo
window.addEventListener("load", function () {
    if (window.location.hash) {
        history.replaceState(
            null,
            null,
            window.location.pathname + window.location.search
        );
    }
});

document.body.className = pageTheme;
function theme() {
    pageTheme = pageTheme === "theme-dark" ? "theme-light" : "theme-dark";
    document.body.className = pageTheme;
    localStorage.setItem("theme", pageTheme);
    location.reload();
}

//===================================|NAME, LOGO, FORMATION AND SCORELINE|===============================//
//                                                                                                       //
//
var jsonToFetch = matchId >= 100
    ? "/exanoncs3.json"
    : matchId >= 35
        ? "/exanonls3.json"
        : matchId >= 5 ? "/exanonpts3.json"
            : console.error("Invalid match ID");

if (jsonToFetch) {
    Promise.all([
        fetch(jsonToFetch).then(res => res.json()),
        fetch('/playersStorage.json').then(res => res.json()),
        fetch('/exanonLeagues.json').then(res => res.json()),
        fetch(`/api/matchDetails/${matchId}`).then(res => res.json())
    ])
        .then(([gameData, playerData, teamData, gameDetails]) => {
            var gameInfoRaw = gameData.games.find(gameNum => gameNum.gameId == matchId)
            if (!gameInfoRaw) {
                window.location.href = "/404.html"; // if you made a 404.html file
            }

            gameInfo = {
                teamNames: gameInfoRaw.teamnames,
                scoreline: gameInfoRaw.scoreline,
                formations: gameInfoRaw.formation,
                goalScorers: gameInfoRaw.goalscorers,
                gamePlayers: gameInfoRaw.playerslist,
                gameStatus: gameInfoRaw.gamestatus,
                started: gameInfoRaw.started,
                gameFinishedStatus: gameInfoRaw.finished
            }

            const homeMatchDetails = gameDetails.general.home
            const awayMatchDetails = gameDetails.general.away
            const homeId = homeMatchDetails.id
            const awayId = awayMatchDetails.id
            const homeTeamName = homeMatchDetails.name
            const awayTeamName = awayMatchDetails.name
            const homePlayers = gameDetails.lineup.home.players
            const awayPlayers = gameDetails.lineup.away.players
            const homeLogo = homeMatchDetails.logo || "https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/logoless?v=1742054547120"
            const awayLogo = awayMatchDetails.logo || "https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/logoless?v=1742054547120"

            function addTeamNames(teamName, attr) {
                const hasAttr = document.querySelectorAll(`[data-team-name="${attr}"]`);
                for (let element of hasAttr) {
                    element.innerText = teamName;
                }
            }
            addTeamNames(homeTeamName, "home")
            addTeamNames(awayTeamName, "away")

            document.getElementById("homeTeamLink").href = `/teams/${homeId}`
            document.getElementById("awayTeamLink").href = `/teams/${awayId}`

            document.getElementById("tabtitle").innerText = gameDetails.general.matchName;
            document.getElementById("scoreline").innerText = gameDetails.matchStatus.scoreStr;
            document.getElementById("gamestatus").innerText = gameDetails.matchStatus.statusShort

            //GIVES THEM THEIR LOGO

            function addTeamLogos(teamLogo, attr) {
                const hasAttr = document.querySelectorAll(`[data-team-logo="${attr}"]`);
                for (let element of hasAttr) {
                    element.src = teamLogo;
                }
            }
            addTeamLogos(homeLogo, "home")
            addTeamLogos(awayLogo, "away")

            document.getElementsByClassName("homeFormation")[0].textContent = gameDetails.lineup.home.formationTitle
            document.getElementsByClassName("awayFormation")[0].textContent = gameDetails.lineup.away.formationTitle

            function matchRatingColor(id, variable) {
                let element = document.getElementById(id);
                if (!element) return;

                if (variable < 5.5) {
                    element.classList.add("red");
                } else if (variable < 6.949) {
                    element.classList.add("orange");
                } else {
                    element.classList.add("green");
                }
                return element;
            }

            matchRatingColor("homerating", Number(gameDetails.lineup.home.rating))
            matchRatingColor("awayrating", Number(gameDetails.lineup.away.rating))

            document.getElementById("homerating").textContent = gameDetails.lineup.home.rating
            document.getElementById("awayrating").textContent = gameDetails.lineup.away.rating

            var gameInfoRaw = gameData.games.find(gameNum => gameNum.gameId == matchId)           

            const homemanager = gameInfoRaw.managers[0];
            const awaymanager = gameInfoRaw.managers[1];
            document.getElementById("manager1").innerText = homemanager;
            document.getElementById("manager2").innerText = awaymanager;

            //========================================|APPENDING PLAYERS|=================================//
            //                                                                                                             //
            // 
            const matchField = document.getElementsByClassName("lineups")[0];
            function appendStarters(team) {
                const playersObj = team === "home"
                    ? gameDetails.lineup.home.players
                    : gameDetails.lineup.away.players;

                const sortedPlayers = Object
                    .values(playersObj)
                    .filter(p => p.playerNumber <= 10)       // only keep #1–10
                    .sort((a, b) => a.playerNumber - b.playerNumber);

                sortedPlayers.forEach(player => {
                    const playerContainer = document.createElement("a");
                    playerContainer.href = `#player=${player.id}`; //GENERATES LINK FOR PLAYER-UI
                    playerContainer.className = "player-container player-hover"
                    if (team == "home") {
                        playerContainer.style.top = `${player.coords.y}%`
                        playerContainer.style.left = `${player.coords.x}%`
                    } else {
                        playerContainer.style.top = `${100 - player.coords.y}%`
                        playerContainer.style.left = `${100 - player.coords.x}%`
                    }

                    let playerContent = document.createElement("div")
                    playerContent.className = "player"
                    let playerName = document.createElement("span");
                    playerName.className = "player-name"; playerName.textContent = player.name;

                    let playerImage = document.createElement("img");
                    playerImage.src = "https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/noicon.png?v=1740716552808";
                    playerImage.height = 30; playerImage.width = 30

                    let playerMatchRating = document.createElement("span");
                    playerMatchRating.textContent = player.matchRatingRounded

                    if (player.isMvp) {
                        playerMatchRating.className = "matchratingOnPlayer blue";
                    } else {
                        if (player.matchRating < 5.5) {
                            playerMatchRating.className = "matchratingOnPlayer red";
                        } else if (player.matchRating < 6.949) {
                            playerMatchRating.className = "matchratingOnPlayer orange";
                        } else {
                            playerMatchRating.className = "matchratingOnPlayer green";
                        }
                    }

                    let playerEvents = document.createElement("div");
                    playerEvents.setAttribute("data-events-player", player.id);

                    function appendEvents(icon, leftOrRight, initialX, y, metric, iteration) {
                        for (let i = 0; i < player.stats[metric]; i++) {
                            let event = document.createElement("div")
                            event.textContent = icon; event.className = "player-event";
                            event.style.bottom = `${y}%`; event.style[leftOrRight] = `${initialX + (iteration * i)}px`
                            event.style.zIndex = 8 - i
                            playerEvents.appendChild(event);
                            if (metric === "ownGoals") event.style.filter = "hue-rotate(110deg) saturate(1)";

                        }
                    }

                    appendEvents("⚽", "right", 5, 27.5, "goals", -10)
                    appendEvents("🅰️", "left", 5, 27.5, "assists", -10)
                    appendEvents("⚽", "right", 5, 27.5, "ownGoals", -10)

                    playerContent.appendChild(playerImage);
                    playerContent.appendChild(playerMatchRating);
                    playerContent.appendChild(playerEvents);

                    playerContainer.appendChild(playerContent);
                    playerContainer.appendChild(playerName);

                    matchField.appendChild(playerContainer);
                });
            }
            console.log(gameDetails.matchStatus.statusShort)
            if (gameDetails.matchStatus.statusShort == "W.O") {
                document.getElementById("lineups").remove()
                document.getElementById("stats").remove()
            } else {
                appendStarters("home")
                appendStarters("away")
            }

            function appendSubsitutes(team) {
                if (team === "home") {
                    playersObj = gameDetails.lineup.home.players;
                    var bench = document.getElementById("homeSubs");
                } else {
                    playersObj = gameDetails.lineup.away.players;
                    var bench = document.getElementById("awaySubs");
                }
                const sortedPlayers = Object
                    .values(playersObj)
                    .filter(p => p.playerNumber >= 11)
                    .sort((a, b) => a.playerNumber - b.playerNumber);

                sortedPlayers.forEach(player => {
                    const benchItem = document.createElement("li");
                    const playerContainer = document.createElement("a");
                    playerContainer.href = `#player=${player.id}`; //GENERATES LINK FOR PLAYER-UI
                    playerContainer.className = "subsitute player-hover"

                    let playerContent = document.createElement("div")
                    playerContent.className = "player"
                    let playerName = document.createElement("span");
                    playerName.className = "bench-player-name"; playerName.textContent = player.name;

                    let playerImage = document.createElement("img");
                    playerImage.src = "https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/noicon.png?v=1740716552808";
                    playerImage.height = 30; playerImage.width = 30

                    let playerMatchRating = document.createElement("span");
                    playerMatchRating.textContent = player.matchRatingRounded
                    if (player.matchRating < 5.5) {
                        playerMatchRating.className = "matchratingOnPlayer red";
                    } else if (player.matchRating < 7.0) {
                        playerMatchRating.className = "matchratingOnPlayer orange";
                    } else {
                        playerMatchRating.className = "matchratingOnPlayer green";
                    }

                    let playerEvents = document.createElement("div");
                    playerEvents.setAttribute("data-events-player", player.id);

                    playerContent.appendChild(playerImage);
                    playerContent.appendChild(playerMatchRating);
                    playerContent.appendChild(playerEvents);

                    playerContainer.appendChild(playerContent);
                    playerContainer.appendChild(playerName);

                    benchItem.appendChild(playerContainer);
                    bench.appendChild(benchItem);
                });
            }
            appendSubsitutes("home")
            appendSubsitutes("away")


            //===============================| STATS TAB |===============================
            //
            //                                                                           
            var gameInfoRaw = gameData.games.find(gameNum => gameNum.gameId == matchId)

            const translations = {
                "shots": {
                    en: "Shots on target",
                    es: "Tiros a puerta"
                },
                "keyPasses": {
                    en: "Key passes",
                    es: "Pases clave"
                },
                "passesC": {
                    en: "Passes completed",
                    es: "Pases completados"
                },
                "bcm": {
                    en: "Big chances ,issed",
                    es: "Grandes oportunidades perdidas"
                },
                "touches": {
                    en: "Touches",
                    es: "Toques"
                },
                "defensiveActions": {
                    en: "Defensive actions",
                    es: "Acciones defensivas"
                },
                "bigErrors": {
                    en: "Errors leading to goal",
                    es: "El error ha llevado a gol"
                },
                "duelsWon": {
                    en: "Duels won",
                    es: "Duelos ganados"
                },
                "passingA": {
                    en: "Passing accuracy",
                    es: "Pases precisos"
                },
                "duelsP": {
                    en: "Duels percentage",
                    es: "% de Duelos"
                },
                "possession": {
                    en: "Possession",
                    es: "Posesión"
                }
            };

            const container = document.getElementById("gamestats")
            function getTotalStatsForDisplay(metric, values, type, higlighted) {

                let statsElementList = document.createElement("li");
                statsElementList.className = "top-stats-item"

                function statValue(teamSide) {
                    const themeForHiglight = pageTheme === "theme-light" ? "LightTheme" : "DarkTheme"
                    const team = teamSide === 0 ? "home" : "away"
                    const highlightedBg = gameDetails.general[team][`bg${themeForHiglight}`]
                    const highlightedTextColor = gameDetails.general[team][`fontColor${themeForHiglight}`]
                    let statsElement = document.createElement("div");
                    statsElement.textContent = type === "number" ? values[teamSide] : type === "percentage" ? `${values[teamSide]}%` : values[teamSide]
                    statsElement.className = `top-stats-value`
                    if (higlighted === teamSide) {
                        statsElement.style.backgroundColor = highlightedBg
                        statsElement.style.color = highlightedTextColor
                    }
                    return statsElement
                }

                //APPENDS THE METRIC NAME "SHOTS ON TARGET" "KEY PASSES" ARE EXAMPLES
                let metricName = document.createElement("div"); metricName.textContent = translations[metric][savedLang];
                metricName.className = "top-stats-metric-name"

                statsElementList.appendChild(statValue(0))
                statsElementList.appendChild(metricName)
                statsElementList.appendChild(statValue(1))

                container.appendChild(statsElementList)
            }

            for (let metric = 0; metric < gameDetails.topStats.length; metric++) {
                const metricObj = gameDetails.topStats[metric]
                getTotalStatsForDisplay(metricObj["key"], metricObj["stats"], metricObj["type"], metricObj["highlighted"])
            }


            //===============================| PLAYER RATINGS / ADDING SUBSITUTES |===============================
            //
            //
            var gameInfoRaw = gameData.games.find(gameNum => gameNum.gameId == matchId)

            //DISPLAYS THE GOALSCORERS NEATLY IN THE IN THE SCOREBOARD
            let goalscorer = null;
            function gameGoalscorersDisplayOnBoard(team, locationinJSON,) {
                for (let index = 0; index < gameInfo.goalScorers[locationinJSON].length; index++) {
                    document.getElementById(team).innerText += `${gameInfo.goalScorers[locationinJSON][index]}\n`;
                    goalscorer = gameInfo.goalScorers[locationinJSON][index];
                }
            }

            gameGoalscorersDisplayOnBoard(
                "goalscorershome",
                0,
                "homeplayers",
                "homeplayer"
            );
            gameGoalscorersDisplayOnBoard(
                "goalscorersaway",
                1,
                "awayplayers",
                "awayplayer"
            );


            // FUNCTION FOR THE MATCHRATING UI SHOWER
            function showPlayerStats() {
                document
                    .querySelectorAll(".player-ui")
                    .forEach((ui) => {
                        ui.style.display = "none";
                    });

                const hash = window.location.hash; // 
                const playermatchId = Number(new URLSearchParams(hash.slice(1)).get("player"));

                console.log(playermatchId)
                if (playermatchId) {
                    let playerUI = document.getElementById("ui");
                    let playerUIOverlay = document.getElementsByClassName("player-ui-overlay")[0];

                    playerUI = document.getElementById("ui");

                    if (playerUI) {
                        playerUIOverlay.style.display = "flex"; // Show the UI
                        playerUI.style.display = "flex"; // Show the UI
                        document.body.classList.add("no-scroll")
                    }
                    history.replaceState(
                        null,
                        null,
                        window.location.pathname + window.location.search
                    );
                }

                document.addEventListener("click", function (e) {
                    if (!e.target.closest(".player-ui") && !e.target.closest(".player-link")) {
                        document
                            .querySelectorAll(".player-ui,.player-ui-overlay")
                            .forEach((ui) => (ui.style.display = "none"));
                        document.body.classList.remove("no-scroll")
                        history.replaceState("", document.title, url); // Remove hash from URL
                    }
                });
                window.addEventListener("load", showPlayerStats);
                window.addEventListener("hashchange", showPlayerStats);


                //===============================|PLAYER-UI|===============================
                //                                                                                
                //           
                //DEFAULT MATCH RATING IS ALWAYS 6.0
                let stats
                var playerId = playermatchId

                class playerStats {
                    constructor(stats) {
                        this.goals = stats.goals || 0;
                        this.shots = stats.shots || 0;
                        this.assists = stats.assists || 0;
                        this.secondAssists = stats.secondAssists || 0;
                        this.keyPasses = stats.keyPasses || 0;
                        this.defensiveActions = stats.defensiveActions || 0;
                        this.errors = stats.errors || 0;
                        this.bigErrors = stats.bigErrors || 0;
                        this.ownGoals = stats.ownGoals || 0;
                        this.bcm = stats.bcm || 0;
                        this.duelsWon = stats.duelsWon || 0;
                        this.duelsLost = stats.duelsLost || 0;
                        this.duelsP = stats.duelsP || 0;
                        this.passesC = stats.passesC || 0;
                        this.passingA = stats.passingA || 0;
                        this.touches = stats.touches || 0;
                        this.saves = stats.saves || 0;
                        this.goalsConceded = stats.goalsConceded || 0;
                        this.gkPunches = stats.gkPunches || 0;
                        this.gkRecovery = stats.gkRecovery || 0;
                        this.actedAsSweeper = stats.actedAsSweeper || 0;
                        this.bonus = stats.bonus || 0;
                        this.minutes = stats.minutes || 0;
                        this.lastManTackles = stats.lastManTackles || 0;
                        this.clearancesOffTheLine = stats.clearancesOffTheLine || 0;
                    }
                }

                const isInHomeTeam = Object.values(gameDetails.lineup.home.players).find(players => players.id === playermatchId)
                const isInAwayTeam = Object.values(gameDetails.lineup.away.players).find(players => players.id === playermatchId)
                console.log(isInHomeTeam, isInAwayTeam)

                if (isInHomeTeam) {
                    var clickedPlayerStats = isInHomeTeam
                } else if (isInAwayTeam) {
                    var clickedPlayerStats = isInAwayTeam
                } else {
                    console.error("Can't find clicked  player")
                }

                var isGk = clickedPlayerStats.isGoalkeeper
                try {

                    stats = new playerStats(clickedPlayerStats.stats)
                    const position =
                        isGk === true
                            ? "GK"
                            : clickedPlayerStats.position && clickedPlayerStats.position.trim() !== ""
                                ? clickedPlayerStats.position
                                : "N/A";

                    document.getElementById("positionplayerui").innerText = position;

                    document.getElementById("countryplayeruitext").innerText = clickedPlayerStats?.nationName || "N/A"
                    document.getElementById("countryplayeruiimg").src = clickedPlayerStats?.nationFlag || "https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/logoless?v=1742054547120"

                    let {
                        goals,
                        shots,
                        assists,
                        secondAssists,
                        keyPasses,
                        defensiveActions,
                        errors,
                        bigErrors,
                        ownGoals,
                        bcm,
                        duelsWon,
                        duelsLost,
                        passesC,
                        touches,
                        bonus,
                        saves,
                        goalsConceded,
                        gkPunches,
                        gkRecovery,
                        actedAsSweeper,
                        minutes,
                        lastManTackles,
                        clearancesOffTheLine,
                        duelsP,
                        passingA,
                    } = stats || {};

                    let chancesCreated = keyPasses + assists
                    const playeruiname = document.getElementById("playeruiname"); playeruiname.innerText = clickedPlayerStats.name
                    playeruiname.href = `/players/${playerId}`
                    const playerUiRating = document.getElementById("ratingdisplay");
                    const clickedPlayerRating = clickedPlayerStats.matchRating
                    const isMvp = clickedPlayerStats.isMvp
                    //SETS THE MATCH RATING IN THE PLAYRE UI TO EITHER GREEN, ORANGE, OR RED
                    if (isMvp) {
                        playerUiRating.className =
                            "ratingdisplayonplayerui blue";
                    } else {
                        if (clickedPlayerRating > 6.949) {
                            playerUiRating.className =
                                "ratingdisplayonplayerui green";
                        } else if (clickedPlayerRating > 5.5) {
                            playerUiRating.className =
                                "ratingdisplayonplayerui orange";
                        } else {
                            playerUiRating.className =
                                "ratingdisplayonplayerui red";
                        }
                    }
                    playerUiRating.textContent = clickedPlayerStats.matchRatingRounded


                    const statTranslations = {
                        "Stats": { en: "Stats", es: "Estadísticas" },
                        "Shooting": { en: "Shooting", es: "Tiras" },
                        "Passing": { en: "Passing", es: "Pases" },
                        "Possession": { en: "Possession", es: "Posesión" },
                        "Defense": { en: "Defense", es: "Defensa" },
                        "Distribution": { en: "Distribution", es: "Distribución" },
                        "GkStats": { en: "Goalkeeping", es: "Estadísticas de portero" },

                        "Minutes": { en: "Minutes Played", es: "Minutos jugados" },

                        "goals": { en: "Goals", es: "Goles" },
                        "sOT": { en: "Shots on target", es: "Tiras a puerta" },
                        "bCM": { en: "Big chances missed", es: "Grandes oportunidades perdidas" },

                        "passesC": { en: "Passing accuracy", es: "Pases precisos" },
                        "assists": { en: "Assists", es: "Asistencias" },
                        "cC": { en: "Chances created", es: "Oportunidades creadas" },

                        "touches": { en: "Touches", es: "Toques" },

                        "defensiveA": { en: "Defensive actions", es: "Acciones defensivas" },
                        "errors": { en: "Errors", es: "Errores" },
                        "errorLTG": { en: "Error leading to goal", es: "El error ha llevado a gol" },
                        "ownGoals": { en: "Own goals", es: "Autogoles" },
                        "duelsW": { en: "Duels won", es: "Duelos ganados" },
                        "duelsL": { en: "Duels lost", es: "Duelos perdidos" },
                        "duelsP": { en: "Duels percentage", es: "% de Duelos ganados " },
                        "lastManTackle": { en: "Last Man Tackles", es: "Entradas salvadoras" },
                        "clearanceLine": { en: "Clearances off the line", es: "Despejes en la línea" },

                        "Acted as Sweeper": { en: "Acted as sweeper", es: "Actuó como Líbero" },
                        "GK Recovery": { en: "Recovories", es: "Recuperación de portero" },
                        "Saves": { en: "Saves", es: "Paradas" },
                        "Goals Conceded": { en: "Goals conceded", es: "Goles concedidos" },
                        "GK Punches": { en: "GK punches", es: "Golpes de Portero" }
                    };

                    if (isGk === true) {
                        console.log(isGk)
                        var groupedStats = {
                            "Stats": [
                                [statTranslations["Minutes"][savedLang], minutes]
                            ],
                            "Distribution": [
                                [statTranslations["touches"][savedLang], touches],
                                [statTranslations["passesC"][savedLang], passingA]
                            ],
                            "GkStats": [
                                ...(bigErrors > 0 ? [[statTranslations["errorLTG"][savedLang], bigErrors]] : []),
                                ...(ownGoals > 0 ? [[statTranslations["ownGoals"][savedLang], ownGoals]] : []),
                                [statTranslations["Saves"][savedLang], saves.toFixed(0)],
                                [statTranslations["Goals Conceded"][savedLang], goalsConceded],
                                [statTranslations["Acted as Sweeper"][savedLang], actedAsSweeper],
                                [statTranslations["GK Recovery"][savedLang], gkRecovery],
                                [statTranslations["GK Punches"][savedLang], gkPunches],
                                ...(errors > 0 ? [[statTranslations["errors"][savedLang], errors]] : []),
                            ]
                        };
                    } else {
                        console.log(isGk)
                        var groupedStats = {
                            "Stats": [
                                [statTranslations["Minutes"][savedLang], minutes]
                            ],
                            "Shooting": [
                                [statTranslations["goals"][savedLang], parseInt(goals).toFixed(0)],
                                [statTranslations["sOT"][savedLang], shots],
                                ...(bcm > 0 ? [[statTranslations["bCM"][savedLang], bcm]] : []),
                            ],
                            "Passing": [
                                [statTranslations["passesC"][savedLang], `${passingA}`],
                                [statTranslations["assists"][savedLang], parseInt(assists).toFixed(0)],
                                [statTranslations["cC"][savedLang], (chancesCreated).toFixed(0)]
                            ],
                            "Possession": [
                                [statTranslations["touches"][savedLang], touches]
                            ],
                            "Defense": [
                                ...(bigErrors > 0 ? [[statTranslations["errorLTG"][savedLang], bigErrors]] : []),
                                ...(ownGoals > 0 ? [[statTranslations["ownGoals"][savedLang], ownGoals]] : []),
                                ...(lastManTackles > 0 ? [[statTranslations["lastManTackle"][savedLang], lastManTackles]] : []),
                                ...(clearancesOffTheLine > 0 ? [[statTranslations["clearanceLine"][savedLang], clearancesOffTheLine]] : []),
                                [statTranslations["defensiveA"][savedLang], defensiveActions],
                                ...(errors > 0 ? [[statTranslations["errors"][savedLang], errors]] : []),
                                [statTranslations["duelsW"][savedLang], duelsWon],
                                [statTranslations["duelsL"][savedLang], duelsLost],
                                [statTranslations["duelsP"][savedLang], duelsP],
                            ]
                        };
                    }
                    function appendGroupedStats(statsObj) {
                        const container = document.getElementsByClassName("player-ui-stats")[0];
                        container.innerHTML = "";

                        for (const section in statsObj) {
                            const header = document.createElement("h3");
                            if (section == "Stats") header.style.fontSize = "1.5rem"
                            header.textContent = statTranslations[section][savedLang];
                            container.appendChild(header);

                            statsObj[section].forEach(([label, val]) => {
                                const statSpan = document.createElement("span");
                                statSpan.classList.add("stat-line");
                                statSpan.innerHTML = `${label}: ${val}`;
                                container.appendChild(statSpan);
                            });
                        }
                    }
                    appendGroupedStats(groupedStats);

                    // VALUES THAT HAVE PLAYER FACTS
                    let statValues = {
                        "duelsWon": null,
                        "duelsLost": null,
                        "defensiveActions": null,
                        "keyPasses": null,
                        "touches": null,
                        "passesC": null,
                        "shots": null,
                        "passingA": null,
                        "bigErrors": null,
                        "ownGoals": null,
                    }
                    /*DISPLAYS THE METRIC, PLAYER WITH THE HIGHEST, THE VALUE OF IT,
                    AND THE TEXT THAT COMES AFTER IN ENGLISH/ESPANOL*/
                    let playerBestStatsObject = {
                        shots: {
                            descen: "had the most shots on target", //ENGLISH TEXT CONTEXT THAT APPEARS IN PLAYER FACTS BEFORE THE STAT
                            desces: "tuvo el mayor número de tiras a puerta", //SPANISH TEXT CONTEXT THAT APPEARS IN PLAYER FACTS BEFORE THE STAT
                            player: [], //THE PLAYER(S) DEPENDING ON IF ITS AN ARRAY METRIC OR REGULAR VARIABLE
                            value: 0, //DISPLAYS THE HIGHEST OF EACH, FOR EX: MESSI HAD THE MOST SHOTS ON TARGET (VALUE)
                        },
                        duelsWon: {
                            descen: "had the most duels won", desces: "tuvo el mayor número de duelos ganó",
                            player: [], value: 0,
                        },
                        duelsLost: {
                            descen: "had the most duels lost", desces: "tuvo el mayor número de duelos perdidos",
                            player: [], value: 0,
                        },
                        defensiveActions: {
                            descen: "had the most defensive actions", desces: "tuvo el mayor número de acciones defensivas",
                            player: [], value: 0,
                        },
                        keyPasses: {
                            descen: "had the most chances created", desces: "tuvo el mayor número de oportunidades creada",
                            player: [], value: 0,
                        },
                        touches: {
                            descen: "had the most touches", desces: "tuvo el mayor número de toques",
                            player: [], value: 0,
                        },
                        passesC: {
                            descen: "had the most passes completed", desces: "completó el mayor número de pases",
                            player: [], value: 0,
                        },
                        passingA: {
                            descen: "was the player who made the most accuracte passes", desces: "ha sido el jugador que ha realizado los pases más precisos.",
                            player: [], value: 0,
                        },
                        bigErrors: {
                            descen: "made an error that led to a goal for",
                            desces: {
                                start: "ha cometido un error que ha provocado que", //COMES BEFORE THE VALUE || ONLY FOR THE SPANISH VERSION THIS IS NEEDED
                                end: "marque un gol.", //COMES AFTER THE VALUE, || ONLY FOR THE SPANISH VERSION THIS IS NEEDED
                            },
                            player: [], value: 0,
                        },
                        ownGoals: {
                            descen: "had an own goal.",
                            desces: " ha marcado un gol en propia meta.",
                            player: [], value: 0,
                        },
                    }
                    function findHighestMetric() {
                        function findBestPlayerForEachStatPerTeam(team) {
                            for (const key in statValues) {
                                if (team == "homeplayers") playerBestStatsObject[key].player = []                             //ONLY SETS AS AN ARRAY ONCE, SO IT DOES NOT RESET FRO AWAY SQUAD
                                if (key !== "bigErrors" && key !== "ownGoals") {
                                    team = Object.values(team)
                                    for (let player = 0; player < team.length; player++) {
                                        temporaryPlayerStatsInfo = team[player]
                                        if (key == "keyPasses") //KEY PASSES DOES NOT WORK THE SAME WAY AS ITS CONVERTED TO CHANCES CREATED WHICH IS KEY PASSES + ASSISTS 
                                        {
                                            if (temporaryPlayerStatsInfo[key] + temporaryPlayerStatsInfo.assists > playerBestStatsObject[key].value) {
                                                playerBestStatsObject[key].value = temporaryPlayerStatsInfo[key] + temporaryPlayerStatsInfo.assists
                                                playerBestStatsObject[key].player = []
                                                playerBestStatsObject[key].player.push(`${`${team}s`}${player + 1}`)
                                            } else if (temporaryPlayerStatsInfo[key] + temporaryPlayerStatsInfo.assists == playerBestStatsObject[key].value) { //IF TWO OR MORE PLAYERS SHARE THE BEST STAT, IT DOES NOT DISPLAY AT ALL
                                                playerBestStatsObject[key].player.push(`${`${team}s`}${player + 1}`)
                                            }
                                        } else if (key == "passingA") //PASSING ACCURACY IS ALSO AN EXCEPTION AS IT IS A PRECENTAGE 
                                        {
                                            if (temporaryPlayerStatsInfo.passesC > 5) { //ONLY APPLYS FOR PLAYERS WHO HAVE 5+ PASES
                                                if (playerBestStatsObject[key].value < (temporaryPlayerStatsInfo.passesC / (temporaryPlayerStatsInfo.passesC + (temporaryPlayerStatsInfo.touches - temporaryPlayerStatsInfo.passesC - temporaryPlayerStatsInfo.shots - temporaryPlayerStatsInfo.defensiveActions - temporaryPlayerStatsInfo.ownGoals - temporaryPlayerStatsInfo.bcm - temporaryPlayerStatsInfo.duelsWon - temporaryPlayerStatsInfo.duelsLost)) * 100)) {
                                                    playerBestStatsObject[key].value = Math.round(temporaryPlayerStatsInfo.passesC / (temporaryPlayerStatsInfo.passesC + (temporaryPlayerStatsInfo.touches - temporaryPlayerStatsInfo.passesC - temporaryPlayerStatsInfo.shots - temporaryPlayerStatsInfo.defensiveActions - temporaryPlayerStatsInfo.ownGoals - temporaryPlayerStatsInfo.bcm - temporaryPlayerStatsInfo.duelsWon - temporaryPlayerStatsInfo.duelsLost)) * 100)
                                                    playerBestStatsObject[key].player = []
                                                    playerBestStatsObject[key].player.push(`${`${team}s`}${player + 1}`)
                                                }
                                            }
                                        } else {
                                            if (temporaryPlayerStatsInfo[key] > playerBestStatsObject[key].value) {
                                                playerBestStatsObject[key].value = temporaryPlayerStatsInfo[key]
                                                playerBestStatsObject[key].player = []
                                                playerBestStatsObject[key].player.push(`${`${team}s`}${player + 1}`)
                                            } else if (temporaryPlayerStatsInfo[key] == playerBestStatsObject[key].value) {
                                                playerBestStatsObject[key].player.push(`${`${team}s`}${player + 1}`)
                                            }
                                        }
                                    }
                                } else { //THESE OTHER STATS DO NOT RECORD THE HIGHEST VALUE, BUT RATHER IF ANY PLAYER HAS A VALUE 1< FOR THE STAT
                                    if (team == "homeplayers") playerBestStatsObject[key].player = []                             //ONLY SETS AS AN ARRAY ONCE, SO IT DOES NOT RESET FRO AWAY SQUAD
                                    for (let player = 0; player < gameInfoRaw.playerslist[team].length; player++) {
                                        temporaryPlayerStatsInfo = gameInfoRaw.playerslist[team][player]
                                        if (temporaryPlayerStatsInfo[key] > 0) playerBestStatsObject[key].player.push(`${`${team}s`}${player + 1}`)
                                    }
                                }
                            }
                        }
                        findBestPlayerForEachStatPerTeam(homePlayers)
                        findBestPlayerForEachStatPerTeam(awayPlayers)
                    }
                    findHighestMetric()

                    let playerUi = document.getElementById("playerfactholder")
                    let playerFactsContainer = document.createElement("div")
                    playerFactsContainer.id = "player-fact"
                    playerFactsContainer.className = "player-fact"
                    playerUi.innerText = ""

                    let playerFactTitle = document.createElement("div")
                    playerFactTitle.className = "player-fact-title"
                    playerFactTitle.innerText = "Player Facts"
                    playerFactsContainer.appendChild(playerFactTitle)

                    for (const metric in playerBestStatsObject) { //CHECKS IF THE PLAYER CLICKED IS IN THE OBJECT FOR ANY OF THE STATS
                        let playerFactItem = document.createElement("div")
                        playerFactItem.id = `${playerBestStatsObject}playerfact${metric}`
                        playerFactItem.className = "player-fact-item"
                        let playerTeam = playermatchId.substring(0, 4) // HOME AND AWAY BOTH HAVE 4 LETTERS, SO playerTEAM IS EITHER HOME OR AWAY
                        var oppositeTeam = playerTeam == "home" ? awayTeamName : homeTeamName
                        if (metric == "bigErrors" || metric == "ownGoals") {
                            if (playerBestStatsObject[metric].player.includes(playermatchId)) {
                                if (metric == "bigErrors") {
                                    if (localStorage.getItem('language') == "en") {
                                        playerFactItem.innerText = `${playerData.player[playerId].playername} ${playerBestStatsObject[metric][`desc${savedLang}`]} ${oppositeTeam}`
                                    } else {
                                        playerFactItem.innerText = `${playerData.player[playerId].playername} ${playerBestStatsObject[metric][`desc${savedLang}`].start} ${oppositeTeam} ${playerBestStatsObject[metric][`desc${savedLang}`].end}`
                                    }

                                } else {
                                    playerFactItem.innerText = `${playerData.player[playerId].playername} ${playerBestStatsObject[metric][`desc${savedLang}`]}`
                                }
                                playerFactsContainer.appendChild(playerFactItem)
                                playerUi.prepend(playerFactsContainer)
                            }
                        } else {
                            if (playerBestStatsObject[metric].player.includes(playermatchId)) {
                                if (metric == "passingA") { //PASSING ACCURACT IS AN EXCEPTION
                                    if (localStorage.getItem('language') == "en") {
                                        playerFactItem.innerText = `${playerData.player[playerId].playername} ${playerBestStatsObject[metric][`desc${savedLang}`]} (${playerBestStatsObject[metric].value}% for those who completed 5+ passes)`
                                    } else {
                                        playerFactItem.innerText = `${playerData.player[playerId].playername} ${playerBestStatsObject[metric][`desc${savedLang}`]} (${playerBestStatsObject[metric].value}%) de los que completaron 5+ pases.`
                                    }
                                } else {
                                    playerFactItem.innerText = `${playerData.player[playerId].playername} ${playerBestStatsObject[metric][`desc${savedLang}`]} (${playerBestStatsObject[metric].value}) en el partido.`
                                }
                                playerFactsContainer.appendChild(playerFactItem)
                                playerUi.prepend(playerFactsContainer)
                            }
                        }
                    }
                    console.log(isGk)
                    // Default lang fallback         

                } catch (error) {
                    console.error(error)
                }
            }

            // Run function when page loads
            window.addEventListener("DOMContentLoaded", showPlayerStats);
            // Run function when hash changes (clicking another player)
            window.addEventListener("hashchange", showPlayerStats);


            //===============|STATS TAB - SET BACKGROUND COLOR ON METRIC IF TEAM HAS HIGHER VALUE / + OTHER STUFF FROM THE "FIXTURES" JSON|===============
            //                                                                                                                                  
            //             
            let statsForColors = {
                posession: 0,
                shots: 0,
                bcm: 0,
                passesC: 0,
                passingA: 0,
                touches: 0,
                metricPasses: 0,
                defensiveActions: 0,
                bigErrors: 0,
                duelsWon: 0,
                duelsP: 0,
                duelsLost: 0,
            }

            //FINDS THE HOMETEAM VIA JSON
            let homeTeam = teamData.teams.find(team => team?.teamname === homeTeamName)
            let awayTeam = teamData.teams.find(team => team?.teamname === awayTeamName)

            //GIVES THE TEAMS THEIR COLORS WHAT WILL BE DISPLAYED IN STATS, DEFAULT COLORS BEING RED AND BLUE
            let hometeamcolor = "red"
            let awayteamcolor = "blue"

            if (homeTeam) hometeamcolor = homeTeam.color
            if (awayTeam) awayteamcolor = awayTeam.color

            function metricFill(team, variable, metric) {
                document.getElementById(`${team}${metric}`).style.backgroundColor = variable
                document.getElementById(`${team}${metric}`).style.color = "white"
            }

            for (let key in statsForColors) {
                if (document.getElementById(`home${key}`) && document.getElementById(`away${key}`)) {
                    let homeValue = parseInt(document.getElementById(`home${key}`).textContent.trim()) || 0;
                    let awayValue = parseInt(document.getElementById(`away${key}`).textContent.trim()) || 0;
                    if (homeValue > awayValue) {
                        metricFill(
                            key === "bcm" || key === "bigErrors" ? "away" : "home",
                            key === "bcm" || key === "bigErrors" ? awayteamcolor : hometeamcolor,
                            key
                        );
                    } else if (homeValue < awayValue) {
                        metricFill(
                            key !== "bcm" || key !== "bigErrors" ? "away" : "home",
                            key !== "bcm" || key !== "bigErrors" ? awayteamcolor : hometeamcolor,
                            key
                        );
                    }
                }
            }
        })
} else {
    window.location.href = "/404.html"
}


//|==================================|BUTTONS/TABS|==================================
//                                                                                  
//                                                                                 

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(div => div.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

window.onload = function () {
    let savedTheme = localStorage.getItem("theme") || "theme-light";
    document.body.className = savedTheme;
};
