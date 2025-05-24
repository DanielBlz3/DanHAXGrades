//GLOBAL VARIABLES
const pathParts = window.location.pathname.split("/");
const teamID = parseInt(pathParts[2]);
const matchDay = 4;
var group = 1;
const nameMap = {
    "Boston United": "Boston UTD",
    "Atletico Madrid": "Atletico",
    "Aguilas Cementeras": "Cementeras",
    "Inter de Barcelona": "Inter Barca",
    "Paris Saint Germain": "PSG",
    "Antuna Raiders": "Antuna"
};
if (savedLang == "en") {
    var positionTransMap = {
        "ST": "ST",
        "LW": "LW",
        "RW": "RW",
        "AM": "AM",
        "LM": "LM",
        "RM": "RM",
        "CM": "CM",
        "LWB": "LWB",
        "RWB": "RWB",
        "DM": "DM",
        "LB": "LB",
        "RB": "RB",
        "CB": "CB",
        "GK": "GK",
        "Unknown": "Unknown",
    }
} else {
    var positionTransMap = {
        "ST": "D",
        "LW": "EI",
        "RW": "ED",
        "AM": "MCO",
        "LM": "II",
        "RM": "ID",
        "CM": "MC",
        "LWB": "LWB",
        "RWB": "RWB",
        "DM": "MCD",
        "LB": "LI",
        "RB": "LD",
        "CB": "DFC",
        "GK": "P",
        "Unknown": "Desconocido",
    }
}
function formatMatchTimestamp(isoString) {
    if (isoString) {
        const dateObj = new Date(isoString);

        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');

        const formattedDate = `${day}/${month}`;
        const formattedTime = `${hours}:${minutes} PM`;

        return {
            matchDate: formattedDate,
            matchTime: formattedTime
        };
    } else {
        return {
            matchDate: "TBD",
            matchTime: "TBD"
        }
    }
}

fetch(`https://danhaxgrades.glitch.me/api/teams/${teamID}`).then((res) => res.json())
    .then((API) => {
          appendHeader()

        const teamDetails = API.details
        const teamDesc = API.teamDesc
        const mainLeague = teamDetails?.mainLeague
        const teamName = teamDetails.name;
        const leaguesInfo = API.leagueInfo
        const teamBgColor = pageTheme === "theme-light" ? teamDetails.bgLightTheme : teamDetails.bgDarkTheme
        const teamFontColor = pageTheme === "theme-light" ? teamDetails.fontColorLightTheme : teamDetails.fontColorDarkTheme

        function addTeamDescription() {
            document.getElementById("manager").textContent = teamDesc.manager;
            document.getElementById("colors").textContent = teamDesc.colors;
            document.getElementById("jerseyshome").textContent = teamDesc.jerseys[0]; document.getElementById("jerseysaway").textContent = teamDesc.jerseys[1]; document.getElementById("jerseysthird").textContent = teamDesc.jerseys[2];
        }
        addTeamDescription()

        document.getElementById("teamnameontab").textContent = teamName; document.getElementById("teamnameoncard").textContent = teamName;
        document.getElementById("teamlogooncard").src = teamDetails.logo;
        document.getElementById("teamcard").style.backgroundColor = teamBgColor;
        document.getElementById("teamcard").style.color = teamFontColor;

        const nextMatch = API.overview.nextMatch
        function appendNextMatch() {
                const nextMatchTeam = nextMatch.isHomeTeam === true ? nextMatch.away : nextMatch.home
                const nextMatchName = nextMatchTeam.teamName
                const opponentsDisplayName = nameMap[nextMatchName] || nextMatchName;
                const matchTimeStamp = formatMatchTimestamp(nextMatchName.timestamp)

                document.getElementById("nextFixture").textContent = opponentsDisplayName;
                document.getElementById("time").textContent = matchTimeStamp.matchTime;
                document.getElementById("date").textContent = matchTimeStamp.matchDate;
                document.getElementById("logonextmatch").src = teamDetails.logo;

                const displayName = nameMap[teamName] || teamName;
                document.getElementById("teamnameonnextfixture").textContent = displayName;

                const nextMatchHeaderContainer = document.getElementsByClassName("next-match-header")[0]
                let matchComp = document.createElement("a"); matchComp.className = "next-match-competition"
                matchComp.href = `/leagues/${nextMatch.leagueId}`

                const leauge = leaguesInfo[nextMatch.leagueId]
                let compLogo = document.createElement("img"); compLogo.src = leauge.logo;
                compLogo.height = 25; compLogo.width = 25
                let compName = document.createElement("span"); compName.textContent = leauge.shortName

                matchComp.appendChild(compName)
                matchComp.appendChild(compLogo)
                nextMatchHeaderContainer.appendChild(matchComp)
                document.getElementById("opponentslogonextmatch").src = nextMatchTeam.logo;

                document.getElementById("nextmatchlink").href = nextMatch.pageUrl
        }
        
        if (mainLeague && nextMatch) {
            appendNextMatch()
        } else {
            console.warn(`Can't perform "nextMatch": Team has no main league, Team Id: ${teamID}`)
        }
        const formContainer = document.getElementById("formdetailscontainer");
        const form = API.overview.teamForm
        function addFormMatch(matchNum) {
            const forMatch = form[matchNum]
            const opponents = forMatch.isHomeTeam === true ? forMatch.away : forMatch.home

            let forMatchEl = document.createElement("div");
            forMatchEl.className = "form-game";

            let matchLink = document.createElement("a");
            matchLink.href = forMatch.pageUrl; matchLink.className = "form-game-link";

            let scoreline = document.createElement("div");
            scoreline.textContent = forMatch.scoreStr; scoreline.className = "scoreline";

            const scoreColor = forMatch.result === "w" ? "green-scoreline" : forMatch.result === "d" ? "grey-scoreline" : "red-scoreline"
            scoreline.classList.add(scoreColor);

            let opponentsLogo = document.createElement("img");
            opponentsLogo.src = opponents.logo; opponentsLogo.width = 35;

            forMatchEl.appendChild(scoreline);
            forMatchEl.appendChild(opponentsLogo);
            matchLink.appendChild(forMatchEl);
            formContainer.appendChild(matchLink);
        }
        if (mainLeague) {
            for (let match = 0; match < form.length; match++) {
                addFormMatch(match)
            }
        } else {
            console.warn(`Can't perform "addFormMatch": Team has no main league, Team Id: ${teamID}`)
        }

        function tableParams(tableContainerValue, tableSection) {
            function addTable(league) {
                const tableData = API.table.find(t => t.data.leagueId === league)
                const table = tableData.table
                const tableDetails = tableData.data
                const tableLength = tableDetails.tableLength
                const qualTranslationsMap = {
                    "knockouts": { "en": "Knockouts", "es": "Fase eliminatoria" }
                }
                function findTeamGroup(tableData, targetTeamName) {
                    return tableData.find(group =>
                        group.some(team => team.teamName.toLowerCase() === targetTeamName.toLowerCase())
                    );
                }
                const group = findTeamGroup(table, teamName)

                let tableInfo = "null";

                if (savedLang == "es") {
                    tableInfo = ["#", "", "J", "G ", "E", "P", "+|-", "DG", "PTS"];
                } else {
                    tableInfo = ["#", "", "M", "W ", "D", "L", "+|-", "GD", "PTS"];
                }

                let tableContainer = document.getElementsByClassName("league-table-main")[tableContainerValue];
                if (tableContainerValue == 0) {
                    tableContainer.innerHTML = "";
                }

                function addTableValues() {
                    let tableHeader = document.createElement("div");
                    tableHeader.className = "table-header";
                    let groupName = document.createElement("a")
                    groupName.textContent = tableDetails.leagueName; groupName.className = "group-name"
                    groupName.href = tableDetails.leagueURL
                    groupName.style.display = "flex"
                    groupName.style.textDecoration = "none"
                    groupName.style.justifyContent = "center"

                    tableContainer.appendChild(groupName);
                    tableContainer.appendChild(tableHeader);

                    for (let i = 0; i < tableInfo.length; i++) {
                        let tableInfoItem = document.createElement("span");
                        tableInfoItem.textContent = tableInfo[i];
                        tableHeader.appendChild(tableInfoItem);
                    }

                    for (let i = 0; i < group.length; i++) {
                        let tableItem = document.createElement("a");
                        tableItem.className = "league-table-item";
                        tableContainer.appendChild(tableItem);

                        if (group[i].color) {
                            tableItem.classList.add("qualifier");
                            tableItem.style.setProperty('--qual-background-color', group[i].color);
                        }

                        let positionMetric = document.createElement("span");
                        positionMetric.textContent = i + 1;
                        tableItem.appendChild(positionMetric);

                        let teamAndLogoGridItem = document.createElement("div");
                        let teamlogoGridItem = document.createElement("img");
                        let teamNameEl = document.createElement("span");

                        teamAndLogoGridItem.className = "team-logo-name";

                        teamlogoGridItem.src = group[i].teamLogo;
                        teamlogoGridItem.width = 20;
                        teamlogoGridItem.height = 20;
                        teamNameEl.textContent = group[i].teamName;

                        tableItem.href = `/teams/${group[i].teamId}`;

                        if (group[i].teamName === teamName) tableItem.classList.add("focused-team")

                        teamAndLogoGridItem.appendChild(teamlogoGridItem);
                        teamAndLogoGridItem.appendChild(teamNameEl);
                        tableItem.appendChild(teamAndLogoGridItem);

                        const tableMetrics = ["matchesPlayed", "pts", "wins", "draws", "losses", "gdStr", "gd"]
                        for (const metric in group[i]) {
                            if (tableMetrics.includes(metric)) {
                                let gridItemMetric = document.createElement("span");
                                gridItemMetric.textContent = group[i][metric]
                                tableItem.appendChild(gridItemMetric);
                            }
                        }
                    }
                    let tableLegend = document.createElement("div"); tableLegend.className = "table-legend"
                    tableContainer.appendChild(tableLegend)
                    for (let i = 0; i < tableDetails.tableLegend.length; i++) {
                        const legendInfo = tableDetails.tableLegend[i]
                        let legendItem = document.createElement("div"); legendItem.className = "table-legend-item"
                        qualText = document.createElement("span"); qualText.textContent = qualTranslationsMap[legendInfo.key][savedLang]
                        qualColor = document.createElement("span"); qualColor.className = "qual-color"
                        qualColor.style.backgroundColor = legendInfo.color

                        legendItem.appendChild(qualText)
                        legendItem.appendChild(qualColor)
                        tableLegend.appendChild(legendItem)
                    }
                }
                addTableValues()
            }
            if (tableSection === "standings")
                for (let groupIndex = 0; groupIndex < API.table.length; groupIndex++) {
                    addTable(API.table[groupIndex].data.leagueId);
                } else {
                addTable(mainLeague);
            }
        }
        tableParams(0, "overview")
        tableParams(1, "standings")

        const teamFixtures = (API.fixtures).reverse()
        const fixturesLength = teamFixtures.length
        const finishedFixtures = teamFixtures.filter(g => g.hasStarted)
        const fixturesContainer = document.getElementsByClassName("fixtures-info")[0]
        var fixturesTitleContainer = document.getElementsByClassName("fixtures-browse")[0]
        var fixturesPage = finishedFixtures.length > 4 ? finishedFixtures.length - 4 :  1


        function addFixtures(fixturesMatchday) {
            const pageLength = fixturesMatchday + 10 > fixturesLength ? fixturesLength : fixturesMatchday + 10
            for (let fixturesGameNum = fixturesMatchday; fixturesGameNum < pageLength; fixturesGameNum++) {
                const match = teamFixtures[fixturesGameNum]
                if (match) {
                    let fixturesItem = document.createElement("a")
                    fixturesItem.className = "fixtures-item"
                    fixturesItem.href = match.pageUrl

                    let fixturesItemHeader = document.createElement("div"); fixturesItemHeader.className = "fixtures-item-header"

                    let fixturesDetailsItemDate = document.createElement("div")
                    fixturesDetailsItemDate.className = "fixtures-item-date"
                    fixturesDetailsItemDate.textContent = formatMatchTimestamp(match.timestamp).matchDate

                    const leauge = leaguesInfo[match.leagueId]
                    let fixturesItemCompetition = document.createElement("div"); fixturesItemCompetition.className = "fixtures-item-competition"

                    let fixturesItemCompetitionName = document.createElement("span")
                    fixturesItemCompetitionName.textContent = leauge.shortName
                    let fixturesItemCompetitionLogo = document.createElement("img")
                    fixturesItemCompetitionLogo.src = leauge.logo
                    fixturesItemCompetitionLogo.height = 25; fixturesItemCompetitionLogo.width = 25

                    let fixturesDetailsItemContent = document.createElement("div")
                    fixturesDetailsItemContent.className = "fixtures-item-content"

                    function fixtureTeams(teamSide, teamClass) {
                        let fixturesDetailsItemContentTeam = document.createElement("div")
                        fixturesDetailsItemContentTeam.className = teamClass

                        let fixturesDetailsItemContentTeamName = document.createElement("div")

                        const teamInfo = match[teamSide]
                        const displayName = teamInfo.teamName || teamInfo.teamName;
                        fixturesDetailsItemContentTeamName.textContent = displayName

                        let fixturesDetailsItemContentTeamLogo = document.createElement("img")

                        fixturesDetailsItemContentTeamLogo.src = teamInfo.logo

                        fixturesDetailsItemContentTeamLogo.height = 30
                        fixturesDetailsItemContentTeamLogo.width = 30

                        fixturesDetailsItemContentTeam.appendChild(fixturesDetailsItemContentTeamLogo)
                        fixturesDetailsItemContentTeam.appendChild(fixturesDetailsItemContentTeamName)
                        fixturesDetailsItemContent.appendChild(fixturesDetailsItemContentTeam)
                    }

                    fixtureTeams("home", "fixtures-team-home")

                    let fixtureScorelineOrTime = document.createElement("div")
                    if (match.result) {
                        fixtureScorelineOrTime.className = match.result === "w" ? "fixtures-scoreline green-scoreline" : match.result === "d" ? "fixtures-scoreline grey-scoreline" : "fixtures-scoreline red-scoreline"
                        fixtureScorelineOrTime.textContent = match.scoreStr

                    } else if (match.timestamp) {
                        fixtureScorelineOrTime.className = "fixtures-date"
                        fixtureScorelineOrTime.textContent = formatMatchTimestamp(match.timestamp).matchTime
                    } else {
                        fixtureScorelineOrTime.className = "fixtures-date"
                        fixtureScorelineOrTime.textContent = "TBD"
                    }


                    fixturesDetailsItemContent.appendChild(fixtureScorelineOrTime)

                    fixtureTeams("away", "fixtures-team-away")

                    fixturesItemCompetition.appendChild(fixturesItemCompetitionName)
                    fixturesItemCompetition.appendChild(fixturesItemCompetitionLogo)
                    fixturesItemHeader.appendChild(fixturesDetailsItemDate)
                    fixturesItemHeader.appendChild(fixturesItemCompetition)
                    fixturesItem.appendChild(fixturesItemHeader)
                    fixturesItem.appendChild(fixturesDetailsItemContent)
                    fixturesContainer.appendChild(fixturesItem)
                }
            }
        }
        addFixtures(fixturesPage)


        function forwardFixtures() {
            if (teamFixtures.length > fixturesPage + 10) {
                fixturesPage += 10
                fixturesContainer.innerHTML = ""
                addFixtures(fixturesPage)
            }
        }
        function rewindFixtures() {
            if (fixturesPage > 1) {
                fixturesPage -= 10
                fixturesContainer.innerHTML = ""
                addFixtures(fixturesPage)
            }
        }

        if (teamFixtures.length > 10) {
            let moreFixturesButton = document.createElement("button")
            moreFixturesButton.onclick = forwardFixtures
            moreFixturesButton.className = "fixtures-button-arrow"
            moreFixturesButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="fixtures-arrow-svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>`

            let fixturesTitleContent = document.createElement("div")
            if (savedLang == "en") {
                fixturesTitleContent.textContent = "Fixtures"
            } else {
                fixturesTitleContent.textContent = "Partidos"
            }

            let rewindFixturesButton = document.createElement("button")
            rewindFixturesButton.onclick = rewindFixtures
            rewindFixturesButton.className = "fixtures-button-arrow"
            rewindFixturesButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>`
            fixturesTitleContainer.appendChild(rewindFixturesButton)
            fixturesTitleContainer.appendChild(fixturesTitleContent)
            fixturesTitleContainer.appendChild(moreFixturesButton)
        }


        const lastLineupData = API.overview.lastLineUp
        function appendTots() {
            const lastLineupPlayers = Object.entries(lastLineupData.players)
            if (lastLineupPlayers.length) {
                const lastLineupContainer = document.getElementsByClassName("last-squad-players-container")[0]
                const bestPlayer = lastLineupPlayers.sort((a, b) => b[1].matchRating - a[1].matchRating).slice(0, 1)[0]
                console.log(bestPlayer)
                for (let player = 0; player < 11; player++) {
                    const focusedPlayerArr = lastLineupPlayers.find(players => players[1].playerNumber === player)
                    if (focusedPlayerArr) {
                        var focusedPlayer = focusedPlayerArr[1]
                    } else {
                        console.error(`Cant find player number: ${player}, in last lineup`)
                    }
                    let llPlayer = document.createElement("div"); llPlayer.className = "last-squad-player-wrapper"
                    llPlayer.style.left = `${focusedPlayer.coords.y}%`;
                    llPlayer.style.bottom = `${(focusedPlayer.coords.x * 2) - 13}%`;

                    let llPlayerContent = document.createElement("a"); llPlayerContent.className = "last-squad-player"
                    llPlayerContent.href = `/players/${focusedPlayer.id}`

                    let llPlayerName = document.createElement("span"); llPlayerName.className = "last-squad-player-name"
                    llPlayerName.innerText = focusedPlayer.name

                    let playerMatchRating = document.createElement("span"); playerMatchRating.className = "last-squad-player-matchRating"
                    playerMatchRating.innerText = (focusedPlayer.matchRating).toFixed(1)

                    let llPlayerClub = document.createElement("img"); llPlayerClub.className = "last-squad-player-nation"
                    llPlayerClub.src = focusedPlayer.nationFlag; llPlayerClub.height = 15; llPlayerClub.width = 15

                    if (bestPlayer.playerId == focusedPlayer.id) {
                        playerMatchRating.classList.add("blue")
                    } else {
                        if (focusedPlayer.matchRating < 5.5) {
                            playerMatchRating.classList.add("red")
                        } else if (focusedPlayer.matchRating < 7) {
                            playerMatchRating.classList.add("orange")
                        } else {
                            playerMatchRating.classList.add("green")
                        }
                    }
                    llPlayerContent.appendChild(llPlayerClub)
                    llPlayerContent.appendChild(playerMatchRating)
                    llPlayer.appendChild(llPlayerContent)
                    llPlayer.appendChild(llPlayerName)
                    lastLineupContainer.appendChild(llPlayer)
                }
            }
        }

        if (lastLineupData && lastLineupData?.players) {
            appendTots()
        } else {
            console.warn("LAST LINEUP NOT FOUND")
        }


        const playerStats = API.playerStats
        const statsSectionNames = [
            {
                "en": "Top stats", "es": "Top estadísticas"
            },
            {
                "en": "Shooting", "es": "Tiros"
            },
            {
                "en": "Passing and touches", "es": "Pases y toques"
            },
            {
                "en": "Defense", "es": "Defensa"
            },
            {
                "en": "Goalkeeping", "es": "Estadísticas de portero"
            }
        ]
        const topStatsObj = [
            [
                {
                    metricName: {
                        "en": "Top scorer", "es": "Goles"
                    }, value: playerStats.topGoals,
                },
                {
                    metricName: {
                        "en": "Assists", "es": "Asistencias"
                    }, value: playerStats.topAssists,
                },
                {
                    metricName: {
                        "en": "HAXGrade Rating", "es": "Puntuación HAXGrade"
                    }, value: playerStats.topMatchRatings,
                },
            ],
            [
                {
                    metricName: {
                        "en": "Goals + Assists", "es": "Goles y asistencias"
                    }, value: playerStats.topGa,
                },
                {
                    metricName: {
                        "en": "Goals per 20", "es": "Goles en 20"
                    }, value: playerStats.topGoalsRate,
                },
                {
                    metricName: {
                        "en": "Shots on Target per 20", "es": "Tiras a puerta por 20"
                    }, value: playerStats.topShotsOnTarget,
                },
                {
                    metricName: {
                        "en": "Big Chances Missed", "es": "Grandes oportunidades perdidas"
                    }, value: playerStats.topBcm,
                },
            ],
            [
                {
                    metricName: {
                        "en": "Accurate passes per 20", "es": "Pases precisos por 20"
                    }, value: playerStats.topPassesCompletedRate,
                },
                {
                    metricName: {
                        "en": "Assists per 20", "es": "Asistencias por 30"
                    }, value: playerStats.topAssistsRate,
                },
                {
                    metricName: {
                        "en": "Chances created", "es": "Oportunidades creadas"
                    }, value: playerStats.topChancesCreated,
                },
                {
                    metricName: {
                        "en": "Passing accuracy", "es": "Precisión de pase"
                    }, value: playerStats.topPassingA,
                },
                {
                    metricName: {
                        "en": "Chances created per 20", "es": "Oportunidades creadas por 20"
                    }, value: playerStats.topChancesCreatedRate,
                },
                {
                    metricName: {
                        "en": "Touhces per 20", "es": "Toques por 20"
                    }, value: playerStats.topTouchesRate,
                },
            ],
            [
                {
                    metricName: {
                        "en": "Defensive actions per 20", "es": "Acciones defensivas por 20"
                    }, value: playerStats.topDefensiveActionsRate,
                },
                {
                    metricName: {
                        "en": "Duels won per 20", "es": "Duelos ganados por 20"
                    }, value: playerStats.topDuelsWonRate,
                },
                {
                    metricName: {
                        "en": "Duels won percentage", "es": "Porcentaje de duelos ganadas"
                    }, value: playerStats.topDuelsP,
                },
            ],
            [
                {
                    metricName: {
                        "en": "Saves per 20", "es": "Paradas por 20"
                    }, value: playerStats.topSavesRate,
                },
                {
                    metricName: {
                        "en": "Save percentage", "es": "Porcentaje de paradas"
                    }, value: playerStats.topSavePercentage,
                },
                {
                    metricName: {
                        "en": "Goals conceded per 20", "es": "Goles concedidos por 20"
                    }, value: playerStats.topGoalsConcededRate,
                },
                {
                    metricName: {
                        "en": "Recovories per 20", "es": "Recuperaciones por 20"
                    }, value: playerStats.topRecoveryRate,
                },
            ],
        ]
        function leagueStats(containerClassName, statSection) {
            const overviewStatsContainer = document.getElementsByClassName(`${containerClassName}stats-content`)[0]

            if (containerClassName == "") {
                var statsSectionHeader = document.createElement("h4"); statsSectionHeader.className = "overview-stats-section-header"; statsSectionHeader.textContent = statsSectionNames[statSection][savedLang] || statsSectionNames[statSection]["en"]
                overviewStatsContainer.appendChild(statsSectionHeader)
            }

            let overviewStatsSection = document.createElement("div"); overviewStatsSection.className = `${containerClassName}stats-section`
            for (let metric = 0; metric < topStatsObj[statSection].length; metric++) {
                let statMetric = topStatsObj[statSection][metric]
                let overviewStatsItem = document.createElement("div"); overviewStatsItem.className = `${containerClassName}stats-item`
                let overviewStatsItemHeader = document.createElement("div"); overviewStatsItemHeader.textContent = statMetric.metricName[savedLang] || statMetric.metricName["en"]
                overviewStatsItemHeader.className = "stats-item-header"
                let overviewStatsItemContent = document.createElement("div"); overviewStatsItemContent.className = `${containerClassName}stats-item-content`

                let topStatsValue = topStatsObj[statSection][metric].value
                for (let player = 0; player < topStatsValue.length; player++) {
                    const playerInfo = topStatsValue[player]

                    let overviewStatsPlayer = document.createElement("a"); overviewStatsPlayer.className = "overview-stats-player"
                    overviewStatsPlayer.href = `/players/${playerInfo.playerId}`

                    let overviewStatsPlayerDetails = document.createElement("div"); overviewStatsPlayerDetails.className = "overview-stats-player-details"

                    let playerStatsValueContainer = document.createElement("div"); playerStatsValueContainer.className = "player-stat-value"

                    let playerStatsValueContent = document.createElement("div"); playerStatsValueContent.className = "player-stat-value-content"
                    playerStatsValueContent.textContent = playerInfo.value; playerStatsValueContent.style.backgroundColor = teamBgColor; playerStatsValueContent.style.color = teamFontColor

                    let teamNameAndLogo = document.createElement("div"); teamNameAndLogo.className = "stats-team-name-logo"

                    let teamname = document.createElement("span"); teamname.className = "stats-team-name"
                    teamname.textContent = nameMap[playerInfo.teamName] || playerInfo.teamName

                    let teamlogo = document.createElement("img"); teamlogo.height = 15; teamlogo.width = 15
                    teamlogo.src = playerInfo.teamLogo

                    let playername = document.createElement("span"); playername.textContent = playerInfo.playerName

                    let divider = document.createElement("div")
                    divider.className = "divider"

                    teamNameAndLogo.appendChild(teamlogo)
                    teamNameAndLogo.appendChild(teamname)
                    overviewStatsPlayerDetails.appendChild(playername)
                    overviewStatsPlayerDetails.appendChild(teamNameAndLogo)
                    playerStatsValueContainer.appendChild(playerStatsValueContent)
                    overviewStatsPlayer.appendChild(overviewStatsPlayerDetails)
                    overviewStatsPlayer.appendChild(playerStatsValueContainer)
                    overviewStatsItemContent.appendChild(overviewStatsPlayer)
                    overviewStatsItemContent.appendChild(divider)
                }
                overviewStatsItem.appendChild(overviewStatsItemHeader)
                overviewStatsItem.appendChild(overviewStatsItemContent)
                overviewStatsSection.appendChild(overviewStatsItem)
                overviewStatsContainer.appendChild(overviewStatsSection)
            }
        }
        leagueStats("overview-", 0)

        for (let metricSection = 0; metricSection < topStatsObj.length; metricSection++) {
            leagueStats("", metricSection)
        }

        const transfers = API.transfers
        const transfersContainer = document.getElementsByClassName("transfers-content")[0]
        for (let transfer = 0; transfer < transfers.length; transfer++) {
            const singingInfo = transfers[transfer]

            let transfersItem = document.createElement("div"); transfersItem.className = "transfers-item"

            let transfersplayerInfo = document.createElement("span"); transfersplayerInfo.className = "transfer-player-details"

            let transfersplayerName = document.createElement("a"); transfersplayerName.textContent = singingInfo.playerName; transfersplayerName.className = "transfer-playername"; transfersplayerName.href = singingInfo.pageUrl

            let transferscurrentTeam = document.createElement("a"); transferscurrentTeam.className = "transfer-team"
            transferscurrentTeam.href = `/teams/${singingInfo.to}`
            let transferGreenArrow = document.createElement("div");
            transferGreenArrow.innerHTML = `
            <div class="arrow-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="fixtures-arrow-svg" width="20" height="20" fill="none" stroke="black" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          `;
            let transferscurrentTeamName = document.createElement("span"); transferscurrentTeamName.textContent = singingInfo.currentTeamName
            let transferscurrentTeamLogo = document.createElement("img"); transferscurrentTeamLogo.src = singingInfo.currentTeamLogo
            transferscurrentTeamLogo.height = 20; transferscurrentTeamLogo.width = 20

            let transfersplayerPosition = document.createElement("span"); transfersplayerPosition.textContent = positionTransMap[singingInfo.signingsPosition]
            transfersplayerPosition.className = "transfers-player-position"
            let transfersformerTeam = document.createElement("a"); transfersformerTeam.href = `/teams/${singingInfo.from}`
            transfersformerTeam.className = "transfer-team old-team"
            let transfersformerTeamName = document.createElement("span"); transfersformerTeamName.textContent = singingInfo.formerTeamName
            let transfersformerTeamLogo = document.createElement("img"); transfersformerTeamLogo.src = singingInfo.formerTeamLogo
            transfersformerTeamLogo.height = 20; transfersformerTeamLogo.width = 20

            let transfersnationLogo = document.createElement("img"); transfersnationLogo.src = singingInfo.nationLogo
            transfersnationLogo.width = 20; transfersnationLogo.height = 20

            let transfersdate = document.createElement("span"); transfersdate.textContent = singingInfo.date

            transferscurrentTeam.appendChild(transferGreenArrow)
            transferscurrentTeam.appendChild(transferscurrentTeamLogo)
            transferscurrentTeam.appendChild(transferscurrentTeamName)

            transfersplayerInfo.appendChild(transfersplayerName)
            transfersplayerInfo.appendChild(transferscurrentTeam)
            transfersItem.appendChild(transfersplayerInfo)

            transfersformerTeam.appendChild(transfersformerTeamLogo)
            transfersformerTeam.appendChild(transfersformerTeamName)

            transfersItem.appendChild(transfersformerTeam)
            transfersItem.appendChild(transfersplayerPosition)

            transfersItem.appendChild(transfersnationLogo)

            transfersItem.appendChild(transfersdate)
            transfersContainer.appendChild(transfersItem)
        }

        const squad = API.squad
        const squadContainer = document.getElementsByClassName("squad")[0]
        for (let player = 0; player < squad.length; player++) {
            const playerInfo = squad[player]

            let playerItem = document.createElement("a"); playerItem.className = "squad-player";
            playerItem.style.textDecoration = "none"; playerItem.href = playerInfo.pageUrl
            let playerName = document.createElement("span"); playerName.textContent = playerInfo.playerName; playerName.className = "transfer-playername"; playerName.href = playerInfo.pageUrl

            let playerPosition = document.createElement("span");

            playerInfo.positions.forEach((pos, index) => {
                playerPosition.textContent += positionTransMap[pos];
                if (index < playerInfo.positions.length - 1) {
                    playerPosition.textContent += ", ";
                }
            });

            playerPosition.className = "player-position"

            let playerNation = document.createElement("div"); playerNation.className = "squad-nation"

            let nationFlag = document.createElement("img"); nationFlag.src = playerInfo.nationFlag
            nationFlag.width = 20; nationFlag.height = 20

            let nationName = document.createElement("span"); nationName.textContent = playerInfo.nationName

            let playerValue = document.createElement("span"); playerValue.textContent = playerInfo.marketvalue

            playerItem.appendChild(playerName)
            playerNation.appendChild(nationFlag)
            playerNation.appendChild(nationName)
            playerItem.appendChild(playerNation)
            playerItem.appendChild(playerPosition)
            playerItem.appendChild(playerValue)
            squadContainer.appendChild(playerItem)
        }
  
        var seasonsForChampionStatus = [0, 0];
        var teamTrophiesWon = API.history.trophies;
        var teamTrophiesWonContainer = document.getElementsByClassName("trophies-won-info")[0];
        for (let key in teamTrophiesWon) {
            let teamTrophiesWonDetailsItem = document.createElement("div");
            teamTrophiesWonDetailsItem.className = "trophies-won-item-card";

            let teamTrophiesWonDetailsItemTitle = document.createElement("div");
            teamTrophiesWonDetailsItemTitle.className =
                "trophies-won-name";
            teamTrophiesWonDetailsItemTitle.textContent = key;

            let teamTrophiesWonDetailsItemDetails = document.createElement("ul");
            teamTrophiesWonDetailsItemDetails.className =
                "trophies-won-item-info";
            //____________________________________CHAMPION__________________________________________

            let teamTrophiesWonDetailsItemDetailsChampionButton =
                document.createElement("button");

            let teamTrophiesWonDetailsItemDetailsChampion =
                document.createElement("li");
            teamTrophiesWonDetailsItemDetailsChampion.className =
                "trophies-won-rank";
            teamTrophiesWonDetailsItemDetailsChampion.id = "champion";

            let teamTrophiesWonDetailsItemDetailsChampionTitle =
                document.createElement("span");
            teamTrophiesWonDetailsItemDetailsChampionTitle.textContent = "Winner";
            teamTrophiesWonDetailsItemDetailsChampionTitle.className =
                "trophies-won-rank-title";

            let teamTrophiesWonDetailsItemDetailsChampionCount =
                document.createElement("span");

            let teamTrophiesWonDetailsItemDetailsChampionSeasons =
                document.createElement("div");
            teamTrophiesWonDetailsItemDetailsChampionSeasons.className =
                "trophies-won-rank-seasons";
            teamTrophiesWonDetailsItemDetailsChampionSeasons.style.display = "none";
            teamTrophiesWonDetailsItemDetailsChampionCount.textContent =
                teamTrophiesWon[key].first.seasonswon.length;
            for (let i = 0; i < teamTrophiesWon[key].first.seasonswon.length; i++) {
                teamTrophiesWonDetailsItemDetailsChampionSeasons.textContent += `Season ${teamTrophiesWon[key].first.seasonswon[i]} `;
            }

            function seasonsForChampion() {
                if (seasonsForChampionStatus[0] == 0) {
                    seasonsForChampionStatus[0] = 1;
                    teamTrophiesWonDetailsItemDetailsChampionSeasons.style.display =
                        "block";
                } else {
                    seasonsForChampionStatus[0] = 0;
                    teamTrophiesWonDetailsItemDetailsChampionSeasons.style.display =
                        "none";
                }
            }
            //____________________________________RUNNER-UPS__________________________________________

            let teamTrophiesWonDetailsItemDetailsRunnerUpButton =
                document.createElement("button");

            let teamTrophiesWonDetailsItemDetailsRunnerup =
                document.createElement("li");
            teamTrophiesWonDetailsItemDetailsRunnerup.className =
                "trophies-won-rank";
            teamTrophiesWonDetailsItemDetailsRunnerup.id = "runnerup";

            let teamTrophiesWonDetailsItemDetailsRunnerupTitle =
                document.createElement("span");
            teamTrophiesWonDetailsItemDetailsRunnerupTitle.textContent = "Runner-up";
            teamTrophiesWonDetailsItemDetailsRunnerupTitle.className =
                "trophies-won-rank-title";

            let teamTrophiesWonDetailsItemDetailsRunnerupCount =
                document.createElement("span");

            let teamTrophiesWonDetailsItemDetailsRunnerupSeasons =
                document.createElement("div");
            teamTrophiesWonDetailsItemDetailsRunnerupSeasons.style.display = "none";
            teamTrophiesWonDetailsItemDetailsRunnerupSeasons.className =
                "trophies-won-rank-seasons";
            teamTrophiesWonDetailsItemDetailsRunnerupCount.textContent =
                teamTrophiesWon[key].second.seasonswon.length;
            for (let i = 0; i < teamTrophiesWon[key].second.seasonswon.length; i++) {
                teamTrophiesWonDetailsItemDetailsRunnerupSeasons.textContent += `Season ${teamTrophiesWon[key].second.seasonswon[i]} `;
            }

            function seasonsForRunnerup() {
                seasonsForChampionStatus[1] ? "block" : "none";

                if (seasonsForChampionStatus[1] == 0) {
                    seasonsForChampionStatus[1] = 1;
                    teamTrophiesWonDetailsItemDetailsRunnerupSeasons.style.display =
                        "block";
                } else {
                    seasonsForChampionStatus[1] = 0;
                    teamTrophiesWonDetailsItemDetailsRunnerupSeasons.style.display =
                        "none";
                }
            }

            teamTrophiesWonDetailsItemDetailsRunnerUpButton.addEventListener(
                "click",
                seasonsForRunnerup
            );
            teamTrophiesWonDetailsItemDetailsChampionButton.addEventListener(
                "click",
                seasonsForChampion
            );

            teamTrophiesWonDetailsItem.appendChild(teamTrophiesWonDetailsItemTitle);

            teamTrophiesWonDetailsItemDetailsRunnerUpButton.appendChild(
                teamTrophiesWonDetailsItemDetailsRunnerupCount
            );
            teamTrophiesWonDetailsItemDetailsRunnerUpButton.appendChild(
                teamTrophiesWonDetailsItemDetailsRunnerupTitle
            );
            teamTrophiesWonDetailsItemDetailsRunnerUpButton.appendChild(
                teamTrophiesWonDetailsItemDetailsRunnerupSeasons
            );

            teamTrophiesWonDetailsItemDetailsChampionButton.appendChild(
                teamTrophiesWonDetailsItemDetailsChampionCount
            );
            teamTrophiesWonDetailsItemDetailsChampionButton.appendChild(
                teamTrophiesWonDetailsItemDetailsChampionTitle
            );
            teamTrophiesWonDetailsItemDetailsChampionButton.appendChild(
                teamTrophiesWonDetailsItemDetailsChampionSeasons
            );

            teamTrophiesWonDetailsItemDetailsRunnerup.appendChild(
                teamTrophiesWonDetailsItemDetailsRunnerUpButton
            );
            teamTrophiesWonDetailsItemDetailsChampion.appendChild(
                teamTrophiesWonDetailsItemDetailsChampionButton
            );

            teamTrophiesWonDetailsItemDetails.appendChild(
                teamTrophiesWonDetailsItemDetailsChampion
            );
            teamTrophiesWonDetailsItemDetails.appendChild(
                teamTrophiesWonDetailsItemDetailsRunnerup
            );

            teamTrophiesWonDetailsItem.appendChild(teamTrophiesWonDetailsItemDetails);
            teamTrophiesWonContainer.appendChild(teamTrophiesWonDetailsItem);
        }

        const CHART = document
            .getElementById("tablepositionchart")
            .getContext("2d");
        const previousFinishes = API.history.finishes;
        // Function to get a CSS variable
        function getThemeVariable(varName) {
            return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        }
        // Get the current font color
        const fontColor = getThemeVariable("--font-default-color");

        console.log(fontColor); // ✅ "black" if theme-light is active

        const labels = ["Season 1", "Season 2", "Season 3"];

        if (previousFinishes) {
            let linegraph = new Chart(CHART, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "",
                            data: previousFinishes,
                            fill: false,
                            borderColor: teamBgColor,
                            tension: 0.1,
                            hoverRadius: 10,
                            borderWidth: 6,
                            pointBorderColor: "grey",
                            pointBackgroundColor: "rgba(230, 230, 230, 1.0)",
                            pointBorderWidth: 3,
                            pointRadius: 12,
                        },
                    ],
                },
                options: {
                    "es": {
                        y: {
                            reverse: true,
                            display: false,
                            min: 0,
                            max: 12,
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    size: 25,
                                },
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    layout: {
                        padding: {
                            bottom: 20
                        }
                    }
                },
            });
        }
    });


function showSection(sectionId) {
    const validSections = ["overview", "history", "standings", "squad", "fixtures", "stats", "transfers"]; // List of valid sections

    // If the section isn't valid, default to "overview"
    if (!validSections.includes(sectionId)) {
        sectionId = "overview";
        updateURL(sectionId);
    }


    document.querySelectorAll(".section").forEach(div => {
        div.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "flex";

    document.querySelectorAll(".team-nav-button").forEach(btn => {
        btn.classList.remove("toggled-section");
    });
    document.getElementById(`${sectionId}Button`).classList.add("toggled-section");

    history.pushState({ section: sectionId }, "", updateURL(sectionId));
}

function updateURL(sectionId) {
    const pathParts = window.location.pathname.split("/");
    const teamID = pathParts[2] || "0";
    return `/teams/${teamID}/${sectionId}/`;
}


// Handle back/forward navigation
window.addEventListener("popstate", (event) => {
    if (event.state && event.state.section) {
        showSection(event.state.section);
    }
});

// Load correct section on page load
document.addEventListener("DOMContentLoaded", () => {
    const pathParts = window.location.pathname.split("/");
    const sectionFromUrl = pathParts[3] || "overview"; // index 3 = "overview"
    showSection(sectionFromUrl);
});
