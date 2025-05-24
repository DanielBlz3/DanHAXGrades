/*GLOBAL VARIABLES*/
const pathParts = window.location.pathname.split("/");
const playerID = parseInt(pathParts[2]);
var settingsStatus = "closed"
var playerTrophyInfo = null

const translationsMap = {
    "goals": { "en": "Goals", "es": "Goles" },
    "assists": { "en": "Assists", "es": "Asistencias" },
    "ownGoals": { "en": "Own goals", "es": "Autogoles" },
    "appearances": { "en": "Appearances", "es": "Partidos" },
    "minutes": { "en": "Minutes played", "es": "Minutos jugados" },
    "matchRating": { "en": "Matchrating", "es": "Puntuación" },
    "matchrating": { "en": "Matchrating", "es": "Puntuación" }, //CASE
    "shots": { "en": "Shots on target", "es": "Tiros a puerta" },
    "defensiveActions": { "en": "Defensive actions", "es": "Acciones defensivas" },
    "saves": { "en": "Saves", "es": "Paradas" },
    "goalsConceded": { "en": "Goals Conceded", "es": "Goles en contra" },
    "gkSavePercentage": { "en": "Save percentage", "es": "Porcentaje de paradas" },
    "bigErrors": { "en": "Errors leading to Goal", "es": "El error ha llevado a gol" },
    "playername": { "en": "Name", "es": "Nombre" },
    "nationName": { "en": "Country", "es": "País" },
    "nationContinent": { "en": "Continent", "es": "Continente" },
    "shirtNum": { "en": "Shirt #", "es": "Camiseta" },
    "league": { "en": "League", "es": "Liga" },
    "marketvalue": { "en": "Market value", "es": "Valor de mercado" },
    "position": { "en": "Position", "es": "Posición" },
    "primary": { "en": "Primary", "es": "Primaria" },
    "others": { "en": "Others", "es": "Otros" },
    "shooting": { en: "Shooting", es: "Tiras" },
    "passing": { en: "Passing", es: "Pases" },
    "possession": { en: "Possession", es: "Posesión" },
    "defense": { en: "Defense", es: "Defensa" },
    "distribution": { en: "Distribution", es: "Distribución" },
    "gkStats": { en: "Goalkeeping", es: "Estadísticas de portero" },
    "bcm": { en: "Big chances missed", es: "Grandes oportunidades perdidas" },
    "passesC": { en: "Passes completed", es: "Pases precisos" },
    "passes": { en: "Passes completed", es: "Pases precisos" },
    "passingA": { en: "Passing accuracy", es: "Precisión de pase" },
    "chancesCreated": { en: "Chances created", es: "Oportunidades creadas" },
    "touches": { en: "Touches", es: "Toques" },
    "errors": { en: "Errors", es: "Errores" },
    "duelsWon": { en: "Duels Won", es: "Duelos ganados" },
    "duelsP": { en: "Duels Won %", es: "Duelos ganados %" },
    "actedAsSweeper": { en: "Acted as Sweeper", es: "Actuó como líbero" },
    "gkRecovery": { en: "Recovery", es: "Recuperaciónes" },
    "gkPunches": { en: "Punches", es: "Golpes de portero" },
    "Match Stats": { en: "Match Stats", es: "Estadísticas partidos" },
    "Season Performance": { en: "Season Performance", es: "Rendimiento de temporada" },
    "Per 20": { en: "Per 20", es: "Por 20" },
    "Total": { en: "Total", es: "Total" },
    "Player Ratings": { en: "Player Ratings", es: "Valoración de Jugadores" },
    "Stats compared to other players": { en: "Stats compared to other players", es: "Valoración de Jugadores" },
    "Shooting": { en: "Shooting", es: "Tiros" },
    "Passing": { en: "Passing", es: "Pases" },
    "Touches": { en: "Touches", es: "Toques" },
    "Duels": { en: "Duels", es: "Duelos" },
    "Defense": { en: "Defense", es: "Defensa" },
    "Sweeper": { en: "Sweeper", es: "Líbero" },
    "Goals conceded": { en: "Goals conceded", es: "Goles en contra" },
    "Saving": { en: "Saving", es: "Paradas" },
    "Distribution": { en: "Distribution", es: "Distribución" },
    "Error proneness": { en: "Error proneness", es: "Propensión a errores" },
    "trophies": { en: "Trophies", es: "Trofeos" },
    "career": { en: "Career", es: "Trayectoria" },
    "club": { en: "Club", es: "Equipo" },
    "faqPara1": { en: "The Player Ratings Chart emphasizes a player's statistical strengths and weaknesses, in comparison to players of similar positions.", es: "La Tabla de Valoración de Jugadores destaca los puntos fuertes y débiles estadísticos de un jugador, en comparación con jugadores de posiciones similares." },
    "faqPara2": { en: "Each stat is based off of per 90 stats and includes matches from the league and the cup.", es: "Cada estadística se basa en estadísticas por 90 e incluye partidos de la liga y la copa." },
    "faqPara3": { en: "Players are compared to positional peers, and then placed into a percentile ranking. For example, a player with a 90% percentile ranking on Defensvie Actions means that they have more defensive actions than 90% of players in similar positions.", es: "Los jugadores se comparan con sus compañeros de posición y luego se colocan en una clasificación percentil. Por ejemplo, un jugador con un percentil del 90% en Acciones Defensivas significa que tiene más acciones defensivas que el 90% de los jugadores en posiciones similares." },
    "northAmerica": { en: "North America", es: "Norteamérica" },
    "southAmerica": { en: "South America", es: "Sudamérica" },
    "europe": { en: "Europe", es: "Europa" },
}

function isDark(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness < 50;
}

function isLight(rgbString) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = rgb;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness >= 200;
}

Promise.all([
    fetch('/exanonLeagues.json').then(res => res.json()),
    fetch(`/api/players/${playerID}`).then(res => res.json()),
])

    .then(([teamData, focusedPlayerData]) => {
        //APPEND HEADER
        appendHeader()

        const main = document.createElement("main")
        const playerHeader = document.createElement("div");
        Object.assign(playerHeader.style, {
            display: "flex",
            flexFlow: "column",
            width: "100%",
        });
        Object.assign(main.style, {
            marginTop: "4.75rem",
            justifySelf: "center",
            paddingBottom: "4rem",
        });
        const leftGrid = document.createElement("div"); leftGrid.className = "left-grid"
        Object.assign(leftGrid.style, {
            display: "flex",
            flexFlow: "column",
            gap: "1rem"
        });
        const rightGrid = document.createElement("div"); rightGrid.className = "right-grid"
        Object.assign(rightGrid.style, {
            display: "flex",
            flexFlow: "column",
            gap: "1rem"
        });
        const playerCard = document.createElement("div");

        let ratingNoteButton
        const position = focusedPlayerData.playerPositions.positions.find(position => position.isMainsPos === true)?.id || "None"
        const otherPositions = focusedPlayerData.playerPositions.positions.filter(position => position.isMainsPos === false && position.ratio >= 0.16)
        const isGk = position === "GK" ? "gk" : "nonGk"
        if (!focusedPlayerData) window.location.href = "/404.html"
        const playerTeam = focusedPlayerData?.team
        /*USES THE OTAINED PLAYERID TO LOAD THE LOGO, TEAMNAME, AND COLORS*/

        if (focusedPlayerData.teamColors) {
            var teamColorMain = focusedPlayerData.teamColors.teamColorMain || "rgb(39, 39, 39)"
            var teamColorAlt = focusedPlayerData.teamColors.teamColorAlternate || "rgb(0, 0, 0)"
        }
        const teamColor = pageTheme === "theme-light" ? teamColorMain : teamColorAlt
        const teamFontColor = isLight(teamColor) === true ? "black" : "white"

        const card = document.createElement("div"); card.className = "player-card"
        Object.assign(card.style, {
            backgroundColor: teamColor,
            borderRadius: "1em 1em 0 0",
            padding: "1rem",
            maxWidth: "100%",
            color: teamFontColor,
            margin: 0,
        })
        const cardWrapper = document.createElement("div"); cardWrapper.className = "player-card-wrapper"
        Object.assign(cardWrapper.style, {
            display: "flex",
            flexFlow: "row nowrap",
            gap: "10px",
            alignItems: "bottom",
        })
        const cardContent = document.createElement("div"); cardContent.className = "player-card-content"
        Object.assign(cardContent.style, {
            display: "flex",
            flexDirection: "column",
        })
        const cardName = document.createElement("h1"); cardName.className = "card-name"; cardName.textContent = focusedPlayerData.playername
        Object.assign(cardName.style, {
            alignContent: "center",
        })
        const cardTeam = document.createElement("div"); cardTeam.className = "card-team def-text-hover"
        Object.assign(cardTeam.style, {
            flexDirection: "row",
            display: "flex",
            justifyContent: "left",
            gap: "8px",
            color: teamFontColor,
        })

        const cardLogo = document.createElement("img"); cardLogo.className = "card-logo"
        cardLogo.width = 20; cardLogo.height = 20; cardLogo.src = focusedPlayerData.teamLogo
        cardLogo.style.display = "inline"

        const teamLink = document.createElement("a"); teamLink.textContent = focusedPlayerData.teamName
        teamLink.href = `/teams/${playerTeam}`; teamLink.style.color = teamFontColor;
        teamLink.className = "link-hover"

        cardTeam.appendChild(cardLogo)
        cardTeam.appendChild(teamLink)

        cardContent.appendChild(cardName)
        cardContent.appendChild(cardTeam)

        cardWrapper.appendChild(cardContent)

        card.appendChild(cardWrapper)
        playerCard.appendChild(card)
        playerHeader.appendChild(playerCard)
        leftGrid.appendChild(playerHeader)

        main.appendChild(leftGrid)
        main.appendChild(rightGrid)

        document.body.appendChild(main)

        if (focusedPlayerData) {
            document.documentElement.style.setProperty("--TEAMCOLOR1", teamColor);
        } else {
            window.location.href = "/404.html"
        }
        /*SETS THE TAB TITLE FOR THE PLAYER*/
        document.getElementById("playerNameTitle").innerText = focusedPlayerData.playername


        //===============================| APPENDING PLAYERINFO |===============================
        //
        //
        const playerInfo = document.createElement("div"); playerInfo.className = "player-info"
        Object.assign(playerInfo.style, {
            display: "flex",
            flexFlow: "row",
            width: "100%"
        })
        const bio = document.createElement("section"); bio.className = "player-bio"
        bio.style.backgroundColor = "var(--card-bg-main)"
        Object.assign(bio.style, {
            display: "grid",
            height: "250px",
            maxHeight: "300px",
            gridTemplateColumns: "1fr 1fr",
            borderRight: "1px solid var(--divider-bg-main)",
            borderRadius: "0 0 0 1rem",
            paddingLeft: "1rem",
            flex: 1
        })

        const positionCard = document.createElement("section"); positionCard.className = "position-card"; positionCard.style.backgroundColor = "var(--card-bg-main)"
        Object.assign(positionCard.style, {
            display: "flex",
            height: "250px",
            maxHeight: "300px",
            flexFlow: "column wrap",
            padding: "1rem",
            borderRadius: "0 0 1em 0",
            justifyContent: "center",
            gap: "10px",
            flex: 1
        })

        const statA = ["playername", "nationName", "nationContinent", "shirtNum", "league", "marketvalue"]
        for (let stat = 0; stat < statA.length; stat++) {
            const statKey = statA[stat]
            const statEl = document.createElement("div"); statEl.className = "bio-item"
            Object.assign(statEl.style, {
                display: "flex",
                flexFlow: "column",
                width: "150px",
                height: "75px",
                flexDirection: "column",
                justifyContent: "center",
                borderBottom: "1px solid var(--divider-bg-main)",
            })                                                                //CERTAIN METRIC ARE TRANSLATED, OTHERS ARE NOT
            const value = document.createElement("span"); value.textContent = ["nationContinent"].includes(statKey) ? translationsMap?.[focusedPlayerData[statKey]]?.[savedLang] : focusedPlayerData[statKey];
            const title = document.createElement("span"); title.textContent = translationsMap[statKey][savedLang]
            Object.assign(title.style, {
                fontSize: "0.8rem",
                color: "var(--GLOBAL-FONT-COLOR-GREY)",
                paddingTop: "0.3rem",
            })
            statEl.appendChild(value)
            statEl.appendChild(title)
            bio.appendChild(statEl)
        }

        /*FINDS THE PLAYER'S MAIN POSITION BASED ON VALUES IN THE JSON*/

        if (savedLang == "en") {
            var positionInitialToNameConvert = {
                ST: ["Striker", "ST"],
                LW: ["Left Winger", "LW"],
                RW: ["Right Winger", "RW"],
                AM: ["Attacking Midfielder", "AM"],
                LM: ["Left Midfielder", "LM"],
                RM: ["Right Midfielder", "RM"],
                CM: ["Center Midfielder", "CM"],
                LWB: ["Left Wing-Back", "LWB"],
                RWB: ["Right Wing-Back", "RWB"],
                DM: ["Defensive Midfielder", "DM"],
                LB: ["Left Back", "LB"],
                RB: ["Right Back", "RB"],
                CB: ["Center Back", "CB"],
                GK: ["Goalkeeper", "GK"],
                DEF: ["Defender"],
                MID: ["Midfielder"],
                FWD: ["Forward"],
            }
        } else {
            var positionInitialToNameConvert = {
                ST: ["Delantero", "D"],
                LW: ["Extremo Izquierdo", "EI"],
                RW: ["Extremo Derecho", "ED"],
                AM: ["Mediocentro Ofensivo", "MCO"],
                LM: ["Interior Izquierdo", "II"],
                RM: ["Interior Derecho ", "ID"],
                CM: ["Mediocentro", "MC"],
                LWB: ["Carrilero Izquierdo", "LWB"],
                RWB: ["Carrilero Derecho", "RWB"],
                DM: ["Mediocentro Defensivo", "MCD"],
                LB: ["Lateral Izquierdo", "LI"],
                RB: ["Lateral Derecho", "LD"],
                CB: ["Defensa Central", "DFC"],
                GK: ["Portero", "P"],
                DEF: ["Defensa"],
                MID: ["Mediocampista"],
                FWD: ["Delantero"],
            }
        }

        const positionTitle = document.createElement("h2"); positionTitle.textContent = translationsMap["position"][savedLang]
        const positionsEl = document.createElement("div"); positionsEl.className = "positions"
        const primaryPosEl = document.createElement("div"); primaryPosEl.className = "position-type"
        const otherPosEl = document.createElement("div"); otherPosEl.className = "position-type"
        const primaryPosTitle = document.createElement("div"); primaryPosTitle.className = "position-type-title"; primaryPosTitle.textContent = translationsMap["primary"][savedLang]
        const otherPosTitle = document.createElement("div"); otherPosTitle.className = "position-type-title"; otherPosTitle.textContent = translationsMap["others"][savedLang]
        const primaryPosDisp = document.createElement("div"); primaryPosDisp.className = "positions-display";
        const otherPosDisp = document.createElement("div"); otherPosDisp.className = "positions-display";
        const posImgContianer = document.createElement("div");
        Object.assign(posImgContianer.style, {
            position: "relative",
            width: "169px",
            height: "218px",

        })
        const posImg = document.createElement("img"); posImg.src = "https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/positionfield?v=1741506408303";
        posImg.width = 169; posImg.height = 218
        Object.assign(posImg.style, {
            borderRadius: "0.5rem",
            userSelect: "none",
            WebkitUserDrag: "none",
            filter: "var(--position-pitch-brightness)",
        })

        if (position) {
            let playerposition = document.createElement("div")
            playerposition.className = "position-item"; playerposition.innerText = positionInitialToNameConvert[position][1]; playerposition.title = positionInitialToNameConvert[position][0]; playerposition.classList.add(position.toLowerCase())
            playerposition.style.backgroundColor = teamColor
            primaryPosDisp.textContent = positionInitialToNameConvert[position][0]
            playerposition.style.zIndex = 10
            if (isDark(teamColor)) {
                playerposition.style.color = pageTheme === "theme-light" ? "white" : "black";
                playerposition.style.backgroundColor = pageTheme === "theme-light" ? "black" : "white";
            }

            posImgContianer.appendChild(playerposition)

            for (let position = 0; position < otherPositions?.length; position++) {
                const focusedPosition = otherPositions[position]
                let playerposition = document.createElement("div")
                playerposition.className = "position-item"; playerposition.innerText = positionInitialToNameConvert[focusedPosition.id][1]; playerposition.title = positionInitialToNameConvert[focusedPosition.id][0]; playerposition.classList.add(focusedPosition.id.toLowerCase())
                playerposition.style.backgroundColor = "grey"; playerposition.style.opacity = `${(focusedPosition.ratio * 100) + 25}%`
                playerposition.style.color = pageTheme === "theme-light" ? "white" : "black";
                playerposition.style.zIndex = 10
                otherPosDisp.textContent = position == otherPositions?.length - 1 ? `${positionInitialToNameConvert[focusedPosition.id][0]} ` : `${positionInitialToNameConvert[focusedPosition.id][0]}, ` //DOESN'T APPLY COMMA TO THE LSAT EKEMENT IN ARRAY

                posImgContianer.appendChild(playerposition)
            }
        }

        positionCard.appendChild(positionTitle)

        primaryPosEl.appendChild(primaryPosTitle)
        primaryPosEl.appendChild(primaryPosDisp)

        positionsEl.appendChild(primaryPosEl)

        otherPosEl.appendChild(otherPosTitle)
        otherPosEl.appendChild(otherPosDisp)
        positionsEl.appendChild(otherPosEl)

        positionCard.appendChild(positionsEl)

        posImgContianer.appendChild(posImg)
        positionCard.appendChild(posImgContianer)
        playerInfo.appendChild(bio)
        playerInfo.appendChild(positionCard)
        playerHeader.appendChild(playerInfo)


        const competitionStatsEl = document.createElement("div");
        Object.assign(competitionStatsEl.style, {
            backgroundColor: "var(--card-bg-main)",
            borderRadius: "1.25rem",
        })

        const playerTotalStats = focusedPlayerData.totalStats
        const competitionStats = focusedPlayerData.competitionStats
        const competitionStatsTitleContainer = document.createElement("div")
        Object.assign(competitionStatsTitleContainer.style, {
            flexFlow: "row wrap",
            maxWidth: "100%",
            borderRadius: "1.25rem 1.25rem 0 0",
        })
        const competitionStatsLink = document.createElement("a"); competitionStatsLink.href = '/leagues/2/'; competitionStatsLink.className = "def-hover";
        Object.assign(competitionStatsLink.style, {
            display: "flex",
            textDecoration: "none",
            width: "100%",
            height: "100%",
            borderBottom: "1px solid var(--divider-bg-main)",
        })
        const competitionStatsTitle = document.createElement("h2"); competitionStatsTitle.textContent = "Exanon T3 (Copa + Liga)"
        Object.assign(competitionStatsTitle.style, {
            padding: "1rem",
            alignSelf: "center",
        })
        const competitionStatsContent = document.createElement("div"); competitionStatsContent.className = "competition-stats-content"
        Object.assign(competitionStatsContent.style, {
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            height: "200px",
            maxWidth: "100%",
            padding: "1rem",
            borderRadius: "0 0 1em 1em",
            borderRight: "none",
        })

        let competitionStatsValues = []
        for (let metric = 0; metric < competitionStats.length; metric++) {
            let value = competitionStats[metric].value
            if (competitionStats[metric].id === "gkSavePercentage") {
                value = `${Math.round(competitionStats[metric].value * 100)}%` || '0%'
            }
            competitionStatsValues.push(value)
        }

        for (let metric = 0; metric < competitionStats.length; metric++) {
            const competitionStatsItem = document.createElement("div")
            Object.assign(competitionStatsItem.style, {
                minWidth: "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "var(--font-default-color)",
            })
            const value = document.createElement("span");
            const title = document.createElement("span"); title.style.color = "var(--GLOBAL-FONT-COLOR-GREY)"

            title.textContent = translationsMap[competitionStats[metric].id][savedLang] || "";
            if (competitionStats[metric].id === "matchRating") {
                value.textContent = typeof competitionStatsValues[metric] === "number" ? competitionStatsValues[metric].toFixed(2) : competitionStatsValues[metric];
                value.className = "rating";
                value.style.backgroundColor = competitionStatsValues[metric] < 5.5 ? "var(--RATING-RED)" : competitionStatsValues[metric] < 7.0 ? "var(--RATING-ORANGE)" : "var(--RATING-GREEN)";
            } else {
                value.textContent = competitionStatsValues[metric]
            }
            competitionStatsItem.appendChild(value)
            competitionStatsItem.appendChild(title)
            competitionStatsContent.appendChild(competitionStatsItem)
        }

        competitionStatsLink.appendChild(competitionStatsTitle)
        competitionStatsTitleContainer.appendChild(competitionStatsLink)
        competitionStatsEl.appendChild(competitionStatsTitleContainer)
        competitionStatsEl.appendChild(competitionStatsContent)
        leftGrid.appendChild(competitionStatsEl)

        const playerMatchesCard = document.createElement("div"); // playerMatchesCard.className = "player-matches-card";
        Object.assign(playerMatchesCard.style, {
            paddingTop: "1rem",
            borderRadius: "1.25rem",
            paddingInline: "2rem",
            backgroundColor: "var(--card-bg-main)",
        })

        const playerMathcesHeader = document.createElement("div"); // playerMathcesHeader.className = "player-matches-header"
        const playerMathcesContent = document.createElement("div");
        const playerMatchesTitle = document.createElement("h2"); playerMatchesTitle.textContent = translationsMap["Match Stats"][savedLang]

        const statsIconBar = document.createElement("div"); // statsIconBar.className= "stats-icon-bar"
        Object.assign(statsIconBar.style, {
            display: "grid",
            gridTemplateColumns: "15fr repeat(5, 1fr) 2fr",
            justifyItems: "center",
            alignItems: "center",
            paddingBlock: ".66rem",
            borderTop: "solid 1px var(--divider-bg-main)",
            borderBottom: "solid 1px var(--divider-bg-main)",
            cursor: "default",
            marginBlock: "0.5rem",
        })

        const competitionSelectWrapper = document.createElement("div"); competitionSelectWrapper.className = "competition-select-wraper"
        const competitionSelect = document.createElement("select");
        Object.assign(competitionSelect.style, {
            display: "flex",
            flexFlow: "row-reverse",
            gap: "10px",
            justifySelf: "start",
            backgroundColor: "var(--card-bg-main)",
            border: "none",
            color: "var(--font-default-color)",
            outline: "var(--font-default-color)",
        })
        const options = [
            { value: "alltheleagues", text: "Todos las ligas" },
            { value: "fixturesLiga3", text: "EXL Liga Season 3" },
            { value: "fixturesCopa3", text: "EXL Copa Season 3" }
        ];
        options.forEach(optData => {
            const option = document.createElement("option");
            option.value = optData.value;
            option.textContent = optData.text;
            competitionSelect.appendChild(option);
        });
        const recentGames = focusedPlayerData.recentGames
        function playerMathces(match) {
            if (recentGames.length) {
                if (match) {
                    let matchItem = document.createElement("a"); matchItem.className = "match-item second-hover"

                    matchItem.href = match.matchUrl
                    let minutes = document.createElement("div"); minutes.innerText = match.minutes || "N/A";
                    let matchRatingEl = document.createElement("div");
                    matchRatingEl.innerText = match.matchRating.value;
                    matchRatingEl.className = "rating";
                    matchRatingEl.style.backgroundColor = match.matchRating.backgroundColor

                    let competition = document.createElement("div"); competition.textContent = match.leagueNameShort
                    let oppositeTeam = document.createElement("div"); oppositeTeam.className = "match-item-team"
                    let oppositeTeamName = document.createElement("span"); oppositeTeamName.textContent = match.opponentTeamName
                    let oppositeTeamLogo = document.createElement("img"); oppositeTeamLogo.height = 20; oppositeTeamLogo.width = 20
                    oppositeTeamLogo.src = match.opponentsLogo

                    let scoreLine = document.createElement("div");
                    Object.assign(scoreLine.style, {
                        display: "flex",
                        flexFlow: "row",
                        justifySelf: "start",
                        gap: "3px",
                    })

                    const scoreChars = match.scoreline.split("");
                    scoreChars.forEach((char, index) => {
                        let scorelineItem = document.createElement("span");
                        scorelineItem.textContent = char;
                        console.log(match.isHome)
                        if ((match.isHome === true && index === 0) || (match.isHome === false && index === 2)) {
                            scorelineItem.style.fontWeight = "bolder";
                        } else {
                            scorelineItem.style.fontWeight = "bold";
                            scorelineItem.style.color = "grey"
                        }

                        scoreLine.appendChild(scorelineItem);
                    });

                    matchItem.appendChild(competition)
                    oppositeTeam.appendChild(oppositeTeamLogo)
                    oppositeTeam.appendChild(oppositeTeamName)
                    matchItem.appendChild(oppositeTeam)
                    matchItem.appendChild(scoreLine)
                    matchItem.appendChild(minutes)

                    const playerGameMetrics = ["goals", "assists", "touches", "passesC"];
                    for (const metric of playerGameMetrics) {
                        let playerGameStat = document.createElement("div");
                        playerGameStat.innerText = Math.round(match[metric]);
                        matchItem.appendChild(playerGameStat);
                    }
                    matchItem.appendChild(matchRatingEl)
                    playerMathcesContent.appendChild(matchItem)
                }
            } else {
                let noGamesTranslations = {
                    en: "Player stats not available",
                    es: "Estadísticas del jugador no disponibles"
                }
                statsIconBar.innerHTML = ""
                let noGames = document.createElement("div"); noGames.innerText = noGamesTranslations[savedLang]
                noGames.className = "no-games-error"
                statsIconBar.appendChild(noGames)
            }
        }

        if (recentGames) {
            for (let match = 0; match < recentGames.length; match++) {
                playerMathces(recentGames[match])
            }
        }

        if (document.getElementById("competition-matches")) {
            document.getElementById("competition-matches")
                .addEventListener("change", function () {
                    const competitionSelect = document.getElementById("competition-matches")
                    playerMathcesContent.innerHTML = ""
                    for (let match = 0; match < recentGames.length; match++) {
                        if (competitionSelect.value == "alltheleagues") {
                            playerMathces(recentGames[match])
                        } else {
                            const leaugeMatches = recentGames.filter(matches => matches.leagueKey === competitionSelect.value)
                            playerMathces(leaugeMatches[match])
                        }
                    }
                })
            const trophySVG = `
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stop-color="grey"/>
                </linearGradient>
              </defs>
              <path d="M48 6H16v6h-6a4 4 0 0 0-4 4v6a14 14 0 0 0 14 14c1.6 3.6 4.6 6.6 8 8v6H20v8h24v-8h-8v-6c3.4-1.4 6.4-4.4 8-8a14 14 0 0 0 14-14v-6a4 4 0 0 0-4-4h-6V6ZM10 16h6v8a8 8 0 0 1-6-7.8V16Zm44 0v0.2a8 8 0 0 1-6 7.8v-8h6Z"
                    fill="url(#goldGrad)" />
            </svg>
            `;
            let trophySvg = document.createElement("div");
            trophySvg.innerHTML = trophySVG;
            competitionSelect.appendChild(trophySvg);
        }
        statsIconBar.appendChild(competitionSelect)
        const matchLegend = [
            { key: "minutes", emoji: "⌚" },
            { key: "goals", emoji: "⚽" },
            { key: "assists", emoji: "🅰️" },
            { key: "touches", emoji: "🐾" },
            { key: "passes", emoji: "🧩" },
            { key: "matchrating", emoji: "⭐" }
        ]

        matchLegend.forEach(metric => {
            const legendItem = document.createElement("div");
            legendItem.className = "tooltip-activate";

            const emoji = document.createElement("div");
            emoji.id = metric.key;
            emoji.textContent = metric.emoji;

            const tooltipText = document.createElement("span");
            tooltipText.className = "tooltip-text";
            tooltipText.dataset.langEn = translationsMap[metric.key]?.en || metric.key;
            tooltipText.dataset.langEs = translationsMap[metric.key]?.es || metric.key;
            tooltipText.textContent = translationsMap[metric.key]?.[savedLang] || metric.key;

            legendItem.appendChild(emoji);
            legendItem.appendChild(tooltipText);
            statsIconBar.appendChild(legendItem);
        });

        playerMathcesHeader.appendChild(playerMatchesTitle)

        playerMathcesHeader.appendChild(statsIconBar)

        playerMatchesCard.appendChild(playerMathcesHeader)
        playerMatchesCard.appendChild(playerMathcesContent)
        leftGrid.appendChild(playerMatchesCard)

        const percentileStatsCard = document.createElement("div"); percentileStatsCard.className = "percentile-stats-card"
        Object.assign(percentileStatsCard.style, {
            display: "flex",
            flexFlow: "column",
            fontWeight: "bold",
            borderRadius: "2rem",
            paddingTop: "1rem",
            paddingInline: "1rem",
            backgroundColor: "var(--card-bg-main)",
        })
        const percentileStatsHeader = document.createElement("div"); percentileStatsHeader.className = "percentile-stats-header"
        Object.assign(percentileStatsHeader.style, {
            display: "flex",
            flexFlow: "row",
            alignOtems: "end",
        })
        const percentileStatsTitle = document.createElement("h2"); percentileStatsTitle.textContent = translationsMap["Season Performance"][savedLang]
        const percentileStatsHeaderContent = document.createElement("div"); percentileStatsHeaderContent.className = "percentile-stats-header-content"
        Object.assign(percentileStatsHeaderContent.style, {
            flex: "1",
            display: "flex",
            flexFlow: "column",
            rowGap: "10px",
            color: "var(--GLOBAL-FONT-COLOR-GREY)",
            paddingTop: "1rem",
            justifyContent: "end",
        })
        const percentileStatsButtons = document.createElement("div"); percentileStatsButtons.className = "percentile-stats-buttons-wrapper"
        Object.assign(percentileStatsButtons.style, {
            display: "flex",
            flexFlow: "row",
            justifyContent: "end",
            columnGap: "15px",
        })
        const minutesPlayed = document.createElement("span"); minutesPlayed.textContent = `${translationsMap["minutes"][savedLang]} ${playerTotalStats.minutes}`
        Object.assign(minutesPlayed.style, {
            fontSize: "1.25rem",
            display: "flex",
            justifyContent: "end",
        })
        const percentileStatsContent = document.createElement("div"); percentileStatsContent.className = "percentile-stats-content"
        percentileStatsContent.style.paddingBlock = "1rem"

        if (playerTotalStats.minutes >= 25) {
            function percentileCalcs(rank, value) {
                function updateProgress(percentile, id, elValue) {

                    if (document.getElementById(`percentileitem${id}`)) {
                        let metricValue = document.getElementById(`percentilemetricvalue${id}`)

                        if (id !== "passingA" && id !== "duelsP" && id !== "gkSavePercentage") {
                            metricValue.innerText = elValue
                        } else if (["passingA", "duelsP", "gkSavePercentage"].includes(id)) {
                            metricValue.innerText = `${Math.round(elValue * 1000) / 1000}%`
                        }

                        let toolTipText = document.getElementById(`percentiletooltiptext${id}`)
                        toolTipText.textContent = `${percentile.toFixed(1)}%`

                        let progressBar = document.getElementById(`progressBar${id}`)
                        progressBar.style.width = percentile + "%";
                        progressBar.style.backgroundColor =
                            percentile > 70 ? "rgb(46, 204, 113)" :
                                percentile > 30 ? "rgb(240, 128, 34)" :
                                    "rgb(229, 94, 91)";
                        progressBar.id = `progressBar${id}`;

                    } else {

                        const percentileStatItem = document.createElement("div");
                        percentileStatItem.className = "percentile-stats-metric second-hover"
                        percentileStatItem.style.display = "grid"
                        percentileStatItem.id = `percentileitem${id}`;

                        let metricTitle = document.createElement("span");
                        metricTitle.textContent = translationsMap[id]?.[savedLang] || "N/A"

                        let metricValue = document.createElement("span");
                        if (id !== "passingA" && id !== "duelsP" && id !== "gkSavePercentage") {
                            metricValue.innerText = elValue
                        } else if (["passingA", "duelsP", "gkSavePercentage"].includes(id)) {
                            metricValue.innerText = `${Math.round(elValue * 1000) / 1000}%`
                        }
                        metricValue.id = `percentilemetricvalue${id}`;


                        let toolTip = document.createElement("div"); toolTip.className = "tooltip-activate"
                        let toolTipText = document.createElement("span"); toolTipText.className = "tooltip-text"
                        toolTipText.textContent = `${percentile.toFixed(1)}%`
                        toolTipText.id = `percentiletooltiptext${id}`;


                        let progressBarContianer = document.createElement("div"); progressBarContianer.className = "progress-container"

                        let progressBar = document.createElement("div"); progressBar.className = "progress-bar"
                        progressBar.style.width = percentile + "%"; // Set width based on percentile
                        progressBar.style.backgroundColor =
                            percentile > 70 ? "rgb(46, 204, 113)" :
                                percentile > 30 ? "rgb(240, 128, 34)" :
                                    "rgb(229, 94, 91)";
                        progressBar.id = `progressBar${id}`;

                        progressBarContianer.appendChild(progressBar)
                        toolTip.appendChild(progressBarContianer)
                        toolTip.appendChild(toolTipText)
                        percentileStatItem.appendChild(metricTitle)
                        percentileStatItem.appendChild(metricValue)
                        percentileStatItem.appendChild(toolTip)
                        percentileStatsContent.appendChild(percentileStatItem)
                    }
                }

                for (const category in focusedPlayerData.percentileStats) {
                    if (!document.getElementById(`percentile${category}`)) {
                        let categoryTitle = document.createElement("h3"); categoryTitle.className = "percentile-stats-metric-name"
                        categoryTitle.textContent = translationsMap[category]?.[savedLang] || "N/A"
                        categoryTitle.id = `percentile${category}`
                        percentileStatsContent.appendChild(categoryTitle)
                    }
                    for (const metric in focusedPlayerData.percentileStats[category]) {
                        updateProgress(focusedPlayerData.percentileStats[category][metric][rank], metric, focusedPlayerData.percentileStats[category][metric][value]);
                    }
                }
            }

            const per20Btn = document.createElement("button"); per20Btn.textContent = translationsMap["Per 20"][savedLang]; per20Btn.className = "percentile-stats-button"
            Object.assign(per20Btn.style, {
                maxWidth: "200px",
                borderRadius: "1.25rem",
                paddingInline: "1.5rem",
                paddingBlock: ".75rem",
                fontSize: "1rem",
                textAlign: "center",
                fontWeight: "bold",
                boxShadow: "none",
                border: "none",
                outline: "none",
                cursor: "pointer",
            })
            const totalStatsBtn = document.createElement("button"); totalStatsBtn.textContent = translationsMap["Total"][savedLang]; totalStatsBtn.className = "percentile-stats-button"
            Object.assign(totalStatsBtn.style, {
                maxWidth: "200px",
                borderRadius: "1.25rem",
                paddingInline: "1.5rem",
                paddingBlock: ".75rem",
                fontSize: "1rem",
                textAlign: "center",
                fontWeight: "bold",
                boxShadow: "none",
                border: "none",
                outline: "none",
                cursor: "pointer",
            })

            per20Btn.classList.add("percentile-button-toggled")
            percentileCalcs("precentileRankPer20", "valuePer20")
            //IF PER 20 BUTTON IS CLICKED
            if (totalStatsBtn) {
                per20Btn.addEventListener('click', () => {
                    totalStatsBtn.classList.remove("percentile-button-toggled")
                    per20Btn.classList.add("percentile-button-toggled")
                    percentileCalcs("precentileRankPer20", "valuePer20")
                });

                totalStatsBtn.addEventListener('click', () => {
                    per20Btn.classList.remove("percentile-button-toggled")
                    totalStatsBtn.classList.add("percentile-button-toggled")
                    percentileCalcs("precentileRankTotal", "valueTotal")
                });
            }

            percentileStatsHeader.appendChild(percentileStatsTitle)

            percentileStatsButtons.appendChild(per20Btn)
            percentileStatsButtons.appendChild(totalStatsBtn)

            percentileStatsHeaderContent.appendChild(percentileStatsButtons)
            percentileStatsHeaderContent.appendChild(minutesPlayed)

            percentileStatsHeader.appendChild(percentileStatsHeaderContent)

            percentileStatsCard.appendChild(percentileStatsHeader)
            percentileStatsCard.appendChild(percentileStatsContent)
            leftGrid.appendChild(percentileStatsCard)



            const ratingChartCard = document.createElement("div"); ratingChartCard.className = "ratings-chart-card"
            Object.assign(ratingChartCard.style, {
                width: "100%",
                fontSize: "0.8rem",
                borderRadius: "1.25rem",
                backgroundColor: "var(--card-bg-main)",
                display: "flex",
                flexFlow: "column",
            })
            const ratingChartHeader = document.createElement("div"); ratingChartHeader.className = "ratings-chart-header"
            Object.assign(ratingChartHeader.style, {
                borderBottom: "solid 1px var(--divider-bg-main)",
                minWidth: "100%",
                display: "flex",
                flexFlow: "column",
                alignItems: "start",
                marginTop: "1rem",
                marginLeft: "1rem",
                paddingBottom: ".2rem",
                textAlign: "center",
            })
            const ratingChartTitle = document.createElement("h2"); ratingChartTitle.className = "ratings-chart-title"; ratingChartTitle.textContent = translationsMap["Player Ratings"][savedLang]
            const ratingChartNote = document.createElement("div");
            Object.assign(ratingChartNote.style, {
                marginBottom: "1rem",
                display: "flex",
                flexFlow: "row",
                width: "100%",
            })
            const ratingNoteText = document.createElement("span")

            ratingNoteButton = document.createElement("button"); ratingNoteButton.onclick = () => ratingChartStatsComparedToOtherFAQ(); ratingNoteButton.style.backgroundColor = "rgb(0, 0, 0, 0)"; ratingNoteButton.style.border = "none"
            const ratingButtonImg = document.createElement("img"); ratingButtonImg.src = "https://cdn.glitch.global/ba398850-471f-4a9e-9227-3021efac2da7/question-butotn?v=1743878872340";
            ratingButtonImg.width = 14; ratingButtonImg.height = 14

            const ratingChartContent = document.createElement("div"); ratingChartContent.className = "rating-chart-content"
            const ratingChartEl = document.createElement("div");
            Object.assign(ratingChartContent.style, {
                display: "flex",
                flexFlow: "row",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
            })

            ratingChartNote.appendChild(ratingNoteText)
            ratingChartNote.appendChild(ratingNoteButton)
            ratingNoteButton.appendChild(ratingButtonImg)

            ratingChartHeader.appendChild(ratingChartTitle)
            ratingChartHeader.appendChild(ratingChartNote)

            var ratingsChartMetricNames = focusedPlayerData.ratings.map(stat => stat.title);
            let playerRatings = focusedPlayerData?.ratings?.map(stat => Math.round(stat.value)) || [];
            if (playerRatings.length === 0) {
                playerRatings = [0, 0, 0, 0, 0];
            }
            playerRatings = playerRatings.map(r => Math.min(r, 100));
            while (playerRatings.length < 5) {
                playerRatings.push(0);
            }
            const ratingLeftSide = document.createElement("div")
            Object.assign(ratingLeftSide.style, {
                position: "relative",
                display: "flex",
                flexFlow: "column",
                width: "25%",
                height: "300px",
            })
            const ratingRightSide = document.createElement("div")
            Object.assign(ratingRightSide.style, {
                position: "relative",
                display: "flex",
                flexFlow: "column",
                width: "25%",
                height: "300px",
            })
            const ratingBottom = document.createElement("div")
            Object.assign(ratingBottom.style, {
                position: "relative",
                display: "flex",
                flexFlow: "column",
                height: "5vw",
                width: "100%",
            })

            for (let i = 5; i >= 4; i--) {
                const ratingChartItem = document.createElement("span"); ratingChartItem.className = `metric-${i}`
                const title = document.createElement("span"); title.textContent = translationsMap[ratingsChartMetricNames?.[i - 1]]?.[savedLang]
                const value = document.createElement("span"); value.textContent = playerRatings[i - 1]; value.style.fontWeight = "bold"

                ratingChartItem.appendChild(title)
                ratingChartItem.appendChild(value)
                ratingLeftSide.appendChild(ratingChartItem)
            }

            const ratingChartCanvas = document.createElement("canvas");
            ratingChartCanvas.width = 200; ratingChartCanvas.height = 200;

            for (let i = 3; i < 4; i++) {
                const ratingChartItem = document.createElement("span"); ratingChartItem.className = `metric-${i}`
                const title = document.createElement("span"); title.textContent = translationsMap[ratingsChartMetricNames?.[i - 1]]?.[savedLang]
                const value = document.createElement("span"); value.textContent = playerRatings[i - 1]; value.style.fontWeight = "bold"

                ratingChartItem.appendChild(title)
                ratingChartItem.appendChild(value)
                ratingBottom.appendChild(ratingChartItem)
            }

            ratingChartEl.appendChild(ratingChartCanvas)
            ratingChartEl.appendChild(ratingBottom)

            for (let i = 1; i < 3; i++) {
                const ratingChartItem = document.createElement("span"); ratingChartItem.className = `metric-${i}`
                const title = document.createElement("span"); title.textContent = translationsMap[ratingsChartMetricNames?.[i - 1]]?.[savedLang]
                const value = document.createElement("span"); value.textContent = playerRatings[i - 1]; value.style.fontWeight = "bold"
                ratingChartItem.appendChild(title)
                ratingChartItem.appendChild(value)
                ratingRightSide.appendChild(ratingChartItem)
            }

            ratingChartContent.appendChild(ratingLeftSide)
            ratingChartContent.appendChild(ratingChartEl)
            ratingChartContent.appendChild(ratingRightSide)

            ratingChartCard.appendChild(ratingChartHeader)
            ratingChartCard.appendChild(ratingChartContent)
            rightGrid.appendChild(ratingChartCard)

            let whatplayerstatsarecomparedtoodisplay;
            if (position) {
                switch (true) {
                    case ["ST", "FWD"].includes(position):
                        if (savedLang == "en") whatplayerstatsarecomparedtoodisplay = "Stats compared to other strikers";
                        if (savedLang == "es") whatplayerstatsarecomparedtoodisplay = "Estadísticas comparadas con otros delanteros";
                        break;
                    case ["LW", "RW", "AM"].includes(position):
                        if (savedLang == "en") whatplayerstatsarecomparedtoodisplay = "Stats compared to other attacking midfielders/wingers";
                        if (savedLang == "es") whatplayerstatsarecomparedtoodisplay = "Estadísticas comparadas con otros centrocampistas ofensivos/extremos";
                        break;
                    case ["CM", "DM", "LM", "RM", "MID"].includes(position):
                        if (savedLang == "en") whatplayerstatsarecomparedtoodisplay = "Stats compared to other midfielders";
                        if (savedLang == "es") whatplayerstatsarecomparedtoodisplay = "Estadísticas comparadas con otros centrocampistas";
                        break;
                    case ["LB", "RB", "LWB", "RWB"].includes(position):
                        if (savedLang == "en") whatplayerstatsarecomparedtoodisplay = "Stats compared to other fullbacks";
                        if (savedLang == "es") whatplayerstatsarecomparedtoodisplay = "Estadísticas comparadas con otros laterales";
                        break;
                    case ["CB", "DEF"].includes(position):
                        if (savedLang == "en") whatplayerstatsarecomparedtoodisplay = "Stats compared to other center-backs";
                        if (savedLang == "es") whatplayerstatsarecomparedtoodisplay = "Estadísticas comparadas con otros centrales";
                        break;
                    case ["GK"].includes(position):
                        if (savedLang == "en") whatplayerstatsarecomparedtoodisplay = "Stats compared to other keepers";
                        if (savedLang == "es") whatplayerstatsarecomparedtoodisplay = "Estadísticas comparadas con otros porteros";
                        break;
                    default:
                        if (savedLang == "en") whatplayerstatsarecomparedtoodisplay = "Stats compared to other players";
                        if (savedLang == "es") whatplayerstatsarecomparedtoodisplay = "Estadísticas comparadas con otros jugadores";
                }
                if (document.getElementById("whatplayerstatsarecomparedtoo")) document.getElementById("whatplayerstatsarecomparedtoo").innerText = whatplayerstatsarecomparedtoodisplay
            }


            let opacity = .8;
            const chartColor = (pageTheme === "theme-dark" && isDark(teamColor)) ? teamColorAlt : teamColor;
            const radarColor = chartColor.replace("rgb", "rgba").replace(")", `, ${opacity})`);
            const CHART = ratingChartCanvas.getContext("2d");
            const darken = (rgb, rating) => {
                const [r, g, b] = rgb.match(/\d+/g).map(Number);
                const f = Math.max(0.3, rating / 100); // darken based on rating
                return `rgba(${r * f | 0}, ${g * f | 0}, ${b * f | 0}, 0.8)`; // solid 0.8 opacity
            };

            // ===============================|  PLAYER PERCENTILE STATS CHART  | ===============================
            //
            //
            if (playerRatings && playerRatings.length == 5 && !(playerRatings.includes(null))) {
                let radarChart = new Chart(CHART, {
                    type: 'radar',
                    data: {
                        labels: ['', '', '', '', ''],
                        datasets: [
                            {
                                data: [playerRatings[0], playerRatings[0], null, null, null],
                                backgroundColor: darken(radarColor, playerRatings[0]),
                                fill: true,
                                pointBackgroundColor: false,
                                pointBorderColor: 'rgb(225, 020, 0, 0)',
                                borderWidth: 0,
                            },
                            {
                                borderWidth: 2,
                                data: [null, playerRatings[1], playerRatings[1], null, null],
                                backgroundColor: darken(radarColor, playerRatings[1]),
                                fill: true,
                                pointBackgroundColor: 'rgb(225, 0, 0, 0)',
                                pointBorderColor: 'rgb(225, 0, 0, 0)',
                                borderWidth: 0,
                            },
                            {
                                data: [null, null, playerRatings[2], playerRatings[2], null],
                                backgroundColor: darken(radarColor, playerRatings[2]),
                                fill: true,
                                pointBackgroundColor: 'rgb(225, 0, 0, 0)',
                                pointBorderColor: 'rgb(225, 0, 0, 0)',
                                borderWidth: 0,
                            },
                            {
                                data: [null, null, null, playerRatings[3], playerRatings[3]],
                                backgroundColor: darken(radarColor, playerRatings[3]),
                                borderWidth: 3,
                                fill: true,
                                pointBackgroundColor: 'rgb(225, 0, 0, 0)',
                                pointBorderColor: 'rgb(225, 0, 0, 0)',
                                borderWidth: 0,
                            },
                            {
                                data: [null, null, null, null, playerRatings[4], playerRatings[4]],
                                backgroundColor: darken(radarColor, playerRatings[4]),
                                borderWidth: 3,
                                fill: true,
                                pointBackgroundColor: 'rgb(225, 0, 0, 0)',
                                pointBorderColor: 'rgb(225, 0, 0, 0)',
                                borderWidth: 0,
                            },
                        ]
                    },
                    options: {
                        scales: {
                            r: {
                                pointLabels: {
                                    pointLabels: false,
                                },
                                display: true,
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                    display: false,
                                    count: 3,

                                },
                                grid: {
                                    display: true,
                                    lineWidth: 1.5,
                                    color: "rgba(59,59,59,1)",
                                    borderDash: [5, 5],
                                },
                                angleLines: {
                                    display: true,
                                    lineWidth: 1.5,
                                    color: "rgba(59,59,59,1)",
                                    radius: 5,
                                },
                            },
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                enabled: true
                            }
                        },
                    }
                })
            }
        }

        // ===============================|  PLAYER CAREER STATS  | ===============================
        //
        //

        const careerCard = document.createElement("div"); careerCard.className = "career-card"
        Object.assign(careerCard.style, {
            borderRadius: "1.25rem",
            display: "flex",
            flexFlow: "column",
            backgroundColor: "var(--card-bg-main)",
        })
        const careerTitle = document.createElement("h2"); careerTitle.textContent = translationsMap["career"][savedLang]; careerTitle.className = "career-title"
        Object.assign(careerTitle.style, {
            padding: "1rem",
            borderBottom: "1px solid var(--divider-bg-main)",
            marginBottom: "1rem",
        })

        const careerContent = document.createElement("div"); careerContent.className = "career-content"
        Object.assign(careerContent.style, {
            display: "flex",
            flexFlow: "column",
            gap: "1rem",
            paddingBottom: "2rem",
        })

        const carrerLegend = document.createElement("span"); carrerLegend.className = "career-item"; carrerLegend.style.fontWeight = "bold"
        const careerClub = document.createElement("div"); careerClub.textContent = translationsMap["club"][savedLang]
        carrerLegend.appendChild(careerClub)
        const careerMetricIcon = ["🏟️", "⚽", "🅰️"]
        careerMetricIcon.forEach(icon => {
            const careerIcon = document.createElement("span"); careerIcon.textContent = icon
            carrerLegend.appendChild(careerIcon)
        })
        careerContent.appendChild(carrerLegend)

        careerCard.appendChild(careerTitle)
        careerCard.appendChild(careerContent)

        const trophiesCard = document.createElement("div"); trophiesCard.className = "trophies-card"
        Object.assign(trophiesCard.style, {
            borderRadius: "1.25rem",
            display: "flex",
            flexFlow: "column",
            backgroundColor: "var(--card-bg-main)",
        })
        const trophiesTitle = document.createElement("h2"); trophiesTitle.textContent = translationsMap["trophies"][savedLang]; trophiesTitle.className = "trophies-title"
        Object.assign(trophiesTitle.style, {
            padding: "1rem",
            borderBottom: "1px solid var(--divider-bg-main)",
            marginBottom: "1rem",
        })

        const trophiesContent = document.createElement("div"); trophiesContent.className = "trophies-content"
        Object.assign(trophiesContent.style, {
            display: "flex",
            flexFlow: "column",
            gap: "1rem",
            paddingBottom: "2rem",
        })

        trophiesCard.appendChild(trophiesTitle)
        trophiesCard.appendChild(trophiesContent)

        if (focusedPlayerData.career) {
            let playerCareerInfo = focusedPlayerData.career
            for (let club = playerCareerInfo.length - 1; club > -1; club -= 1) {
                let playerCareerItem = document.createElement("a"); playerCareerItem.className = "career-item def-hover"; playerCareerItem.href = `/teams/${playerCareerInfo[club].team}`
                let matches = document.createElement("span"); matches.className = "stat-item"; matches.innerText = playerCareerInfo[club].matches || "-"
                let goals = document.createElement("span"); goals.className = "stat-item"; goals.innerText = playerCareerInfo[club].goals || "-"
                let assists = document.createElement("span"); assists.className = "stat-item"; assists.innerText = playerCareerInfo[club].assists || "-"
                let team = document.createElement("div"); team.className = "career-team"
                let teamLogo = document.createElement("img"); teamLogo.src = teamData.teams[playerCareerInfo[club].team].logo; teamLogo.height = 25; teamLogo.width = 25
                let teamNameSeasons = document.createElement("div"); teamNameSeasons.className = "career-team-text"
                let teamName = document.createElement("span"); teamName.innerText = teamData.teams[playerCareerInfo[club].team].teamname
                let seasons = document.createElement("span"); seasons.innerText = playerCareerInfo[club].seasons; seasons.className = "career-seasons"

                teamNameSeasons.appendChild(teamName)
                teamNameSeasons.appendChild(seasons)
                team.appendChild(teamLogo)
                team.appendChild(teamNameSeasons)
                playerCareerItem.appendChild(team)
                playerCareerItem.appendChild(matches)
                playerCareerItem.appendChild(goals)
                playerCareerItem.appendChild(assists)
                careerContent.appendChild(playerCareerItem)
            }
        }

        playerTrophyInfo = focusedPlayerData.trophies
        const trophyTypes = ["EXL Liga", "EXL Copa", "EXL SuperCopa", "EXL Pretemporada"]

        if (focusedPlayerData.trophies) {
            if (focusedPlayerData.trophies) {
                for (const team in playerTrophyInfo) {
                    let trophyForTeam = document.createElement("div"); trophyForTeam.id = `trophiesfor${teamData.teams[playerTrophyInfo[team].teamId].teamname}`; trophyForTeam.className = "trophies-item"
                    let trophyForTeamTitleLink = document.createElement("a"); trophyForTeamTitleLink.className = "trophies-title-link"; trophyForTeamTitleLink.href = `/teams/${playerTrophyInfo[team].teamId}`
                    let trophyForTeamTitle = document.createElement("div"); trophyForTeamTitle.className = "trophies-item-title"
                    let trophyForTeamImage = document.createElement("img"); trophyForTeamImage.src = teamData.teams[playerTrophyInfo[team].teamId].logo; trophyForTeamImage.width = 25; trophyForTeamImage.height = 25
                    let trophyForTeamTeamname = document.createElement("div"); trophyForTeamTeamname.textContent = teamData.teams[playerTrophyInfo[team].teamId].teamname
                    let trophyForTeamTeamnameAndLogoContainer = document.createElement("div"); trophyForTeamTeamnameAndLogoContainer.className = "trophy-For-Team-Teamname-And-Logo-Container"

                    trophyForTeamTeamnameAndLogoContainer.appendChild(trophyForTeamImage)
                    trophyForTeamTeamnameAndLogoContainer.appendChild(trophyForTeamTeamname)
                    trophyForTeamTitle.appendChild(trophyForTeamTeamnameAndLogoContainer)
                    trophyForTeamTitleLink.appendChild(trophyForTeamTitle)
                    trophyForTeam.appendChild(trophyForTeamTitleLink)

                    if (playerTrophyInfo[team]) {
                        for (let trophy = 0; trophy < trophyTypes.length; trophy++) {
                            if (playerTrophyInfo[team].trophieswon.indexOf(trophyTypes[trophy]) !== -1) {
                                let trophyForTeamDetails = document.createElement("div"); trophyForTeamDetails.className = "trophies-item-info"

                                let trophyForTeamDetailsPrevalance = document.createElement("span")
                                let trophieswon = playerTrophyInfo[team].trophieswon
                                trophyForTeamDetailsPrevalance.innerText = trophieswon.filter(trophies => trophies === trophyTypes[trophy]).length
                                let trophyname = document.createElement("div"); trophyname.innerText = trophyTypes[trophy]

                                trophyForTeamDetails.appendChild(trophyForTeamDetailsPrevalance)
                                trophyForTeamDetails.appendChild(trophyname)
                                trophyForTeam.appendChild(trophyForTeamDetails)
                            }
                        }
                    }
                    trophiesContent.appendChild(trophyForTeam)
                }
            }
        }
        rightGrid.appendChild(careerCard)
        rightGrid.appendChild(trophiesCard)

        const faqContainer = document.createElement("div"); faqContainer.className = "ratings-faq-container"

        Object.assign(faqContainer.style, {
            display: "none",
            borderRadius: "1.25rem",
            backgroundColor: "var(--card-bg-main)",
            maxWidth: "300px",
            maxHeight: "400px",
            zIndex: "10000",
            position: "fixed",
            overflowY: "auto",
            overflowX: "hidden",
            top: "50%",
            right: "50%",
            transform: "translate(50%, -50%)",
            padding: "1rem",
            transition: "all 0.3s ease-in-out",
        })
        const faqTitle = document.createElement("h2"); faqTitle.textContent = translationsMap?.["Player Ratings"]?.[savedLang]

        Object.assign(faqTitle.style, {
            borderBottom: "solid 1px var(--divider-bg-main)",
            paddingBottom: ".5rem",
            marginBottom: "1rem",
        })

        const faqContent = document.createElement("div"); faqContent.className = "ratings-faq-content";
        Object.assign(faqContent.style, {
            letterSpacing: "0.03rem",
        })
        const faqParagraphs = [translationsMap["faqPara1"][savedLang], translationsMap["faqPara2"][savedLang], translationsMap["faqPara3"][savedLang]]
        faqParagraphs.forEach(paragraph => {
            const faqItem = document.createElement("p"); faqItem.textContent = paragraph; faqItem.style.paddingBlock = "0.5rem"
            faqContent.appendChild(faqItem)
        })
        const overlay = document.createElement("div"); overlay.className = "overlay"
        function ratingChartStatsComparedToOtherFAQ() {
            overlay.style.display = "flex"
            document.body.classList.add("no-scroll")
            faqContainer.style.display = "block"
            faqContainer.style.opacity = "0";
            setTimeout(() => {
                faqContainer.style.transition = "opacity 0.3s ease-in-out";
                faqContainer.style.opacity = "1";
            }, 10)
        }
        faqContainer.appendChild(faqTitle)
        faqContainer.appendChild(faqContent)
        document.body.appendChild(faqContainer)
        document.body.appendChild(overlay)

        document.addEventListener("click", function (e) {
            const clickedOutsideFAQ = !faqContainer.contains(e.target);
            const clickedOutsideButton = !ratingNoteButton.contains(e.target);
            if (clickedOutsideFAQ && clickedOutsideButton) {
                overlay.style.display = "none";
                faqContainer.style.display = "none";
                document.body.classList.remove("no-scroll");
            }
        });

    })
