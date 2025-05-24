//GLOBAL VARIABLES
const pathParts = window.location.pathname.split("/");
const leagueID = parseInt(pathParts[2]);
const matchDay = 1
var pageTheme = "theme-dark";
const nameMap = {
    "Boston United": "Boston UTD",
    "Atletico Madrid": "Atletico",
    "Aguilas Cementeras": "Cementeras",
    "Inter de Barcelona": "Inter Barca",
    "Paris Saint Germain": "PSG",
    "Antuna Raiders": "Antuna"
};
const translations = {
    matchday: {
        en: "Matchday",
        es: "Jornada"
    },
    tots: {
        en: "Team of the season",
        es: "Equipo de la temporada"
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
function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000); // in seconds

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${diff < 7200 ? "" : "s"} ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${diff < 172800 ? "" : "s"} ago`;

    // if more than 7 days ago, show the date
    return past.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}



fetch(`https://danhaxgrades.glitch.me/api/leagues/${leagueID}`)
    .then((response) => response.json())
    .then((API) => {
        const tableDetails = API.table.data
        const table = API.table.table
        const leagueFixtures = API.fixtures
        console.log(API)

        const leagueDetails = API.leagueDetails
        const leaugeName = leagueDetails.name
        const leaugeLogo = leagueDetails.logo
        document.title = leaugeName
        document.getElementById("cardleaguename").textContent = leaugeName
        document.getElementById("cardleaguelogo").src = leaugeLogo
        console.log(leagueDetails)

        // ===============================|  OVERVIEW FIXTURES  | ===============================
        //
        //
        function overviewLeagueFixtures(matchDayStart) {
            const overviewFixturesContainer = document.getElementsByClassName("fixtures-content")[0]
            const matchDayFixtures = API.fixtures.filter(matches => matches.leagueRound == matchDayStart)
            var fixturesLength = matchDayFixtures.length > 3 ? 3 : matchDayFixtures.length

            for (let game = 1; game < fixturesLength + 1; game++) {
                const matchInfo = matchDayFixtures[game]
                var homeTeam = matchInfo.home
                var awayTeam = matchInfo.away
                var fixtureItem = document.createElement("a"); fixtureItem.className = "overview-fixture-item"
                fixtureItem.href = matchInfo.pageUrl

                function overviewTeamandLogo(team) {
                    var teamItem = document.createElement("div"); teamItem.className = "overview-fixtures-team"
                    var teamName = document.createElement("span"); teamName.textContent = nameMap[team.teamName] || team.teamName;
                    var teamLogo = document.createElement("img"); teamLogo.src = team.logo
                    teamLogo.height = 30; teamLogo.width = 30

                    teamItem.appendChild(teamLogo)
                    teamItem.appendChild(teamName)
                    fixtureItem.appendChild(teamItem)
                }

                const { matchDate, matchTime } = formatMatchTimestamp(matchInfo.timestamp);
                function overviewfindDate() {
                    var dateAndTime = document.createElement("div"); dateAndTime.className = "overview-fixtures-date-and-time"
                    var date = document.createElement("span"); date.className = "overview-fixtures-date"; date.innerText = matchDate
                    if (matchInfo.status.started || matchInfo.status.awarded) {
                        var timeOrScoreline = document.createElement("span"); timeOrScoreline.innerText = `${matchInfo.home.score} - ${matchInfo.away.score}`
                    } else {
                        var timeOrScoreline = document.createElement("span"); timeOrScoreline.innerText = matchTime
                    }

                    dateAndTime.appendChild(timeOrScoreline)
                    dateAndTime.appendChild(date)
                    fixtureItem.appendChild(dateAndTime)
                }

                overviewTeamandLogo(homeTeam)
                overviewfindDate()
                overviewTeamandLogo(awayTeam)

                overviewFixturesContainer.appendChild(fixtureItem)
            }
        }
        overviewLeagueFixtures(leagueDetails.currentMatchday) //ADD THE FIXTURES ON THE OVERVIEW SECTION


        // ===============================|  STANDINGS  | ===============================
        //
        //
        function standings(groupNum, tableContainerValue) {
            const qualTranslationsMap = {
                "knockouts": {"en": "Knockouts", "es": "Fase eliminatoria"}
            }
            const group = table[groupNum]

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
                let groupName = document.createElement("h4")
                groupName.textContent = `Group ${groupNum + 1}`; groupName.className = "group-name"

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
                    positionMetric.innerText = i + 1;
                    tableItem.appendChild(positionMetric);

                    let teamAndLogoGridItem = document.createElement("div");
                    let teamlogoGridItem = document.createElement("img");
                    let teamname = document.createElement("span");

                    teamAndLogoGridItem.className = "lineup-team";

                    teamlogoGridItem.src = group[i].teamLogo;
                    teamlogoGridItem.width = 20;
                    teamlogoGridItem.height = 20;
                    teamname.innerText = group[i].teamName;

                    tableItem.href = `/teams/${group[i].teamId}`;

                    teamAndLogoGridItem.appendChild(teamlogoGridItem);
                    teamAndLogoGridItem.appendChild(teamname);
                    tableItem.appendChild(teamAndLogoGridItem);

                    const tableMetrics = ["matchesPlayed", "pts", "wins", "draws", "losses", "gdStr", "gd"]
                    for (const metric in group[i]) {
                        if (tableMetrics.includes(metric)) {
                            let gridItemMetric = document.createElement("span");
                            gridItemMetric.innerText = group[i][metric]
                            tableItem.appendChild(gridItemMetric);
                        }
                    }
                }
                let tableLegend = document.createElement("div"); tableLegend.className = "table-legend"
                tableContainer.appendChild(tableLegend)
                for (let i = 0; i < tableDetails.tableLegend.length; i++) {
                    const legendInfo = tableDetails.tableLegend[i]
                let legendItem = document.createElement("div"); legendItem.className= "table-legend-item"
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
        standings(0, 0);

        function addGroupSelect() {
            const selectionContianer = document.getElementById("tableselect")
            const select = document.createElement("select")
            select.id = "groupselection"
            //ADDS SELECTI AND THE OPTIONS
            for (let group = 0; group < table.length; group++) {
                var selectOption = document.createElement("option")
                selectOption.innerText = `${tableDetails?.leagueName} Group ${group + 1}`
                selectOption.value = group
                select.appendChild(selectOption)
            }
            selectionContianer.appendChild(select)
        }
        addGroupSelect()

        //NOTICES A CHANGE IN THE GROUP SELECT, COMMITS THE ACTION
        document.getElementById("groupselection")
            .addEventListener("change", function () {
                standings(Number(document.getElementById("groupselection").value), 0)
            })

        for (let groupIndex = 0; groupIndex < table.length; groupIndex++) {
            standings(groupIndex, 1);
        }


        // ===============================|  FIXTURES  | ===============================
        //
        //
        const totalMatchdays = leagueFixtures.reduce((max, match) => {
            return Math.max(max, match.leagueRound || 0);
        }, 0);
        const fixturesContainer = document.getElementsByClassName("fixtures-info")[0]
        var fixturesTitleContainer = document.getElementsByClassName("fixtures-browse")[0]
        var fixturesPage = 1

        function addFixtures(firstMatch) {
            const fixturesMatchdayFixtures = leagueFixtures.filter(match => match.leagueRound === firstMatch)
            for (let match = 0; match < fixturesMatchdayFixtures.length; match++) {
                const fixturesMatch = fixturesMatchdayFixtures[match]

                let fixturesItem = document.createElement("a")
                fixturesItem.className = "fixtures-item"
                fixturesItem.href = fixturesMatch.pageUrl

                let fixturesItemMatchDayNum = document.getElementById("fixturesmatchday");
                fixturesItemMatchDayNum.innerText = `Matchday ${firstMatch}`

                let fixturesItemHeader = document.createElement("div"); fixturesItemHeader.className = "fixtures-item-header"

                const { matchDate, matchTime } = formatMatchTimestamp(fixturesMatch.timestamp);

                let fixturesDetailsItemDate = document.createElement("div")
                fixturesDetailsItemDate.className = "fixtures-item-date"
                fixturesDetailsItemDate.innerText = matchDate

                let fixturesDetailsItemContent = document.createElement("div")
                fixturesDetailsItemContent.className = "fixtures-item-content"

                function fixtureTeams(team, teamClass) {
                    let fixturesDetailsItemContentTeam = document.createElement("div")
                    fixturesDetailsItemContentTeam.className = teamClass

                    let fixturesTeamAwayName = document.createElement("div")

                    const displayName = nameMap[team.teamName] || team.teamName;
                    fixturesTeamAwayName.innerText = displayName

                    let fixturesDetailsItemContentTeamLogo = document.createElement("img")
                    fixturesDetailsItemContentTeamLogo.src = team.logo
                    fixturesDetailsItemContentTeamLogo.height = 30; fixturesDetailsItemContentTeamLogo.width = 30

                    fixturesDetailsItemContentTeam.appendChild(fixturesDetailsItemContentTeamLogo)
                    fixturesDetailsItemContentTeam.appendChild(fixturesTeamAwayName)
                    fixturesDetailsItemContent.appendChild(fixturesDetailsItemContentTeam)
                }

                let fixtureScorelineOrTime = document.createElement("div")
                if (fixturesMatch.status.started) {
                    fixtureScorelineOrTime.className = "fixtures-scoreline"
                    fixtureScorelineOrTime.innerText = (fixturesMatch.home.score + "-" + fixturesMatch.away.score)
                } else if (matchTime) {
                    fixtureScorelineOrTime.className = "fixtures-date"
                    fixtureScorelineOrTime.innerText = matchTime
                } else {
                    fixtureScorelineOrTime.className = "fixtures-date"
                    fixtureScorelineOrTime.innerText = ""
                }

                fixtureTeams(fixturesMatch.home, "fixtures-team-home")

                fixturesDetailsItemContent.appendChild(fixtureScorelineOrTime)

                fixtureTeams(fixturesMatch.away, "fixtures-team-away")

                fixturesItemHeader.appendChild(fixturesDetailsItemDate)
                fixturesItem.appendChild(fixturesItemHeader)
                fixturesItem.appendChild(fixturesDetailsItemContent)
                fixturesContainer.appendChild(fixturesItem)
            }

        }
        addFixtures(1)

        function forwardFixtures() {
            if (fixturesPage < totalMatchdays) {
                fixturesPage += 1
                fixturesContainer.innerHTML = ""
                addFixtures(fixturesPage)
            }
        }
        function rewindFixtures() {
            if (fixturesPage > 1) {
                fixturesPage -= 1
                fixturesContainer.innerHTML = ""
                addFixtures(fixturesPage)
            }
        }

        let fixturesTitleContent = document.createElement("div")
        if (savedLang == "en") {
            fixturesTitleContent.innerText = "Fixtures"
        } else {
            fixturesTitleContent.innerText = "Partidos"
        }

        let moreFixturesButton = document.createElement("button")
        moreFixturesButton.onclick = forwardFixtures
        moreFixturesButton.className = "fixtures-button-arrow"
        moreFixturesButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="fixtures-arrow-svg" width="24" height="24" fill="none" stroke="black" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>`

        let rewindFixturesButton = document.createElement("button")
        rewindFixturesButton.onclick = rewindFixtures
        rewindFixturesButton.className = "fixtures-button-arrow"
        rewindFixturesButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="black" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>`
        fixturesTitleContainer.appendChild(rewindFixturesButton)
        fixturesTitleContainer.appendChild(fixturesTitleContent)
        fixturesTitleContainer.appendChild(moreFixturesButton)


        // ===============================|  OVERVIEW-STATS / STATS  | ===============================
        //
        //
        const tots = API.topPlayerStats.totw
        function appendTots(matchday) {
            const totwForMatchday = tots[matchday]

            if (totwForMatchday) {
                const totsContainer = document.getElementsByClassName("tots-players-container")[0]
                const bestPlayer = [tots].sort((a, b) => b.matchRating - a.matchRating).slice(0, 1)[0]
                console.log(bestPlayer)
                for (let player = 0; player < 11; player++) {

                    let totsPlayer = document.createElement("div"); totsPlayer.className = "tots-player-wrapper"
                    totsPlayer.style.left = `${totwForMatchday[player].coords.x}%`;
                    totsPlayer.style.top = `${totwForMatchday[player].coords.y}%`;

                    let totsPlayerContent = document.createElement("a"); totsPlayerContent.className = "tots-player"
                    totsPlayerContent.href = `/players/${totwForMatchday[player].playerId}`

                    let totsPlayerName = document.createElement("span"); totsPlayerName.className = "tots-player-name"
                    totsPlayerName.innerText = totwForMatchday[player].playerName

                    let totsMatchRating = document.createElement("span"); totsMatchRating.className = "tots-player-matchRating"
                    totsMatchRating.innerText = (totwForMatchday[player].matchRating).toFixed(1)

                    let totsPlayerClub = document.createElement("img"); totsPlayerClub.className = "tots-player-club"
                    totsPlayerClub.src = totwForMatchday[player].teamLogo; totsPlayerClub.height = 15; totsPlayerClub.width = 15

                    if (bestPlayer.playerId == totwForMatchday[player].playerId) {
                        totsMatchRating.classList.add("blue")
                    } else {
                        if (totwForMatchday[player].matchRating < 5.5) {
                            totsMatchRating.classList.add("red")
                        } else if (totwForMatchday[player].matchRating < 7) {
                            totsMatchRating.classList.add("orange")
                        } else {
                            totsMatchRating.classList.add("green")
                        }
                    }
                    totsPlayerContent.appendChild(totsPlayerClub)
                    totsPlayerContent.appendChild(totsMatchRating)
                    totsPlayer.appendChild(totsPlayerContent)
                    totsPlayer.appendChild(totsPlayerName)
                    totsContainer.appendChild(totsPlayer)
                }
            }
        }

        if (API.leagueDetails.leagueStatus == "finished") {
            appendTots("matchdayTOTS")
        } else {
            appendTots(API.leagueDetails.currentMatchday - 2)
        }

        function addTotwSelect() {
            const selectionContianer = document.getElementsByClassName("tots-title")[0]
            const select = document.createElement("select")
            select.id = "totwselection"
            //ADDS SELECTI AND THE OPTIONS
            for (let matchDay = 1; matchDay < API.leagueDetails.currentMatchday; matchDay++) {
                var selectOption = document.createElement("option")
                selectOption.innerText = `${translations.matchday[savedLang]} ${matchDay}`
                selectOption.value = matchDay
                select.appendChild(selectOption)
            }
            if (API.leagueDetails.leagueStatus == "finished") {
                var selectOptionTOTS = document.createElement("option")
                selectOptionTOTS.innerText = translations.tots[savedLang]
                selectOptionTOTS.value = "TOTS"
                select.appendChild(selectOptionTOTS)
            }
            select.value = API.leagueDetails.currentMatchday

            if (API.leagueDetails.leagueStatus == "finished") {
                select.value = "TOTS"
            } else {
                select.value = API.leagueDetails.currentMatchday - 1
            }

            selectionContianer.appendChild(select)
        }

        addTotwSelect()

        document.getElementById("totwselection")
            .addEventListener("change", function () {
                document.getElementsByClassName("tots-players-container")[0].innerHTML = ""
                appendTots((document.getElementById("totwselection").value) - 1)
            })


        const topPlayerStats = API.topPlayerStats
        const statsSectionNames = [
            {
                en: "Top stats",
                es: "Top estadísticas"
            },
            {
                en: "Shooting",
                es: "Tiros"
            },
            {
                en: "Passing and touches",
                es: "Pases y toques"
            },
            {
                en: "Defense",
                es: "Defensa"
            },
            {
                en: "Goalkeeping",
                es: "Estadísticas de portero"
            }
        ]
        const topStatsObj = [
            [
                {
                    metricName: {
                        en: "Top scorer",
                        es: "Goles"
                    },
                    value: topPlayerStats.topGoals,
                },
                {
                    metricName: {
                        en: "Assists",
                        es: "Asistencias"
                    },
                    value: topPlayerStats.topAssists,
                },
                {
                    metricName: {
                        en: "HAXGrade Rating",
                        es: "Puntuación HAXGrade"
                    },
                    value: topPlayerStats.topMatchRatings,
                },
            ],
            [
                {
                    metricName: {
                        en: "Goals + Assists",
                        es: "Goles y asistencias"
                    },
                    value: topPlayerStats.topGa,
                },
                {
                    metricName: {
                        en: "Goals per 20",
                        es: "Goles en 20"
                    },
                    value: topPlayerStats.topGoalsRate,
                },
                {
                    metricName: {
                        en: "Shots on Target per 20",
                        es: "Tiras a puerta por 20"
                    },
                    value: topPlayerStats.topShotsOnTarget,
                },
                {
                    metricName: {
                        en: "Big Chances Missed",
                        es: "Grandes oportunidades perdidas"
                    },
                    value: topPlayerStats.topBcm,
                },
            ],
            [
                {
                    metricName: {
                        en: "Accurate passes per 20",
                        es: "Pases precisos por 20"
                    },
                    value: topPlayerStats.topPassesCompletedRate,
                },
                {
                    metricName: {
                        en: "Assists per 20",
                        es: "Asistencias por 30"
                    },
                    value: topPlayerStats.topAssistsRate,
                },
                {
                    metricName: {
                        en: "Chances created",
                        es: "Oportunidades creadas"
                    },
                    value: topPlayerStats.topChancesCreated,
                },
                {
                    metricName: {
                        en: "Passing accuracy",
                        es: "Precisión de pase"
                    },
                    value: topPlayerStats.topPassingA,
                },
                {
                    metricName: {
                        en: "Chances created per 20",
                        es: "Oportunidades creadas por 20"
                    },
                    value: topPlayerStats.topChancesCreatedRate,
                },
                {
                    metricName: {
                        en: "Touhces per 20",
                        es: "Toques por 20"
                    },
                    value: topPlayerStats.topTouchesRate,
                },
            ],
            [
                {
                    metricName: {
                        en: "Defensive actions per 20",
                        es: "Acciones defensivas por 20"
                    },
                    value: topPlayerStats.topDefensiveActionsRate,
                },
                {
                    metricName: {
                        en: "Duels won per 20",
                        es: "Duelos ganados por 20"
                    },
                    value: topPlayerStats.topDuelsWonRate,
                },
                {
                    metricName: {
                        en: "Duels won percentage",
                        es: "Porcentaje de duelos ganadas"
                    },
                    value: topPlayerStats.topDuelsP,
                },
            ],
            [
                {
                    metricName: {
                        en: "Saves per 20",
                        es: "Paradas por 20"
                    },
                    value: topPlayerStats.topSavesRate,
                },
                {
                    metricName: {
                        en: "Save percentage",
                        es: "Porcentaje de paradas"
                    },
                    value: topPlayerStats.topSavePercentage,
                },
                {
                    metricName: {
                        en: "Goals conceded per 20",
                        es: "Goles concedidos por 20"
                    },
                    value: topPlayerStats.topGoalsConcededRate,
                },
                {
                    metricName: {
                        en: "Recovories per 20",
                        es: "Recuperaciones por 20"
                    },
                    value: topPlayerStats.topRecoveryRate,
                },
            ],
        ]
        function leagueStats(containerClassName, statSection) {
            const overviewStatsContainer = document.getElementsByClassName(`${containerClassName}stats-content`)[0]

            if (containerClassName == "") {
                var statsSectionHeader = document.createElement("h4"); statsSectionHeader.className = "overview-stats-section-header"; statsSectionHeader.innerText = statsSectionNames[statSection][savedLang] || statsSectionNames[statSection]["en"]
                overviewStatsContainer.appendChild(statsSectionHeader)
            }

            let overviewStatsSection = document.createElement("div"); overviewStatsSection.className = `${containerClassName}stats-section`
            for (let metric = 0; metric < topStatsObj[statSection].length; metric++) {
                let statMetric = topStatsObj[statSection][metric]
                let overviewStatsItem = document.createElement("div"); overviewStatsItem.className = `${containerClassName}stats-item`
                let overviewStatsItemHeader = document.createElement("div"); overviewStatsItemHeader.innerText = statMetric.metricName[savedLang] || statMetric.metricName["en"]
                overviewStatsItemHeader.className = "stats-item-header"
                let overviewStatsItemContent = document.createElement("div"); overviewStatsItemContent.className = `${containerClassName}stats-item-content`

                let topStatsValue = topStatsObj[statSection][metric].value
                for (let player = 0; player < topStatsValue.length; player++) {
                    let playerInfo = topStatsValue[player]

                    let overviewStatsPlayer = document.createElement("a"); overviewStatsPlayer.className = "overview-stats-player"
                    overviewStatsPlayer.href = `/players/${playerInfo.playerId}`

                    let overviewStatsPlayerDetails = document.createElement("div"); overviewStatsPlayerDetails.className = "overview-stats-player-details"

                    let playerStatsValueContainer = document.createElement("div"); playerStatsValueContainer.className = "player-stat-value"

                    let playerStatsValueContent = document.createElement("div"); playerStatsValueContent.className = "player-stat-value-content"
                    playerStatsValueContent.innerText = playerInfo.value; playerStatsValueContent.style.backgroundColor = playerInfo.teamColor

                    let teamNameAndLogo = document.createElement("div"); teamNameAndLogo.className = "stats-team-name-logo"

                    let teamname = document.createElement("span"); teamname.className = "stats-team-name"
                    teamname.textContent = nameMap[playerInfo.teamName] || playerInfo.teamName

                    let teamlogo = document.createElement("img"); teamlogo.height = 15; teamlogo.width = 15
                    teamlogo.src = playerInfo.teamLogo

                    let playername = document.createElement("span"); playername.innerText = playerInfo.playerName

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

        // ===============================|  NEWS  | ===============================
        //
        // 
        fetch("https://raw.githubusercontent.com/DanielBlz3/exanon-data/refs/heads/main/news.json")
            .then((response) => response.json())
            .then((newsData) => {

                function renderMainNews() {
                    let leagueNews = newsData.news.filter(eachnews => eachnews.locations.league.includes(Number(leagueID)))
                    let newsLength = leagueNews.length
                    for (let newsIndex = 0; newsIndex < newsLength; newsIndex++) {
                        const newsInfo = leagueNews[newsIndex]
                        var mainNewsContainer = document.getElementsByClassName("main-news")[0]

                        let newsItem = document.createElement("a"); newsItem.className = "news-item"
                        newsItem.href = newsInfo.href

                        let newsText = document.createElement("div"); newsText.className = "news-text"

                        let newsThumbNail = document.createElement("img"); newsThumbNail.className = "news-thumbnail"
                        newsThumbNail.src = newsInfo.thumbnail;

                        let newsTitle = document.createElement("span"); newsTitle.className = "news-title"
                        newsTitle.innerText = newsInfo.title

                        let newsAuthorAndDate = document.createElement("div"); newsAuthorAndDate.className = "news-details"

                        let newsAuthor = document.createElement("span")
                        newsAuthor.innerText = `${newsInfo.author} - `
                        let newsDate = document.createElement("span")
                        newsDate.innerText = timeAgo(newsInfo.date)

                        newsAuthorAndDate.appendChild(newsAuthor)
                        newsAuthorAndDate.appendChild(newsDate)
                        newsText.appendChild(newsTitle)
                        newsText.appendChild(newsAuthorAndDate)
                        newsItem.appendChild(newsText)
                        newsItem.appendChild(newsThumbNail)
                        mainNewsContainer.appendChild(newsItem)

                    }
                }
                renderMainNews()
            })


        // ===============================|  SIGNINGS  | ==============================
        //
        // 
        const signings = API.signings
        const signingsContianer = document.getElementsByClassName("signings-content")[0]
        for (let signing = 0; signing < API.signings.length; signing++) {
            const singingInfo = signings[signing]

            let signingsItem = document.createElement("div"); signingsItem.className = "signings-item"

            let signingsplayerInfo = document.createElement("span"); signingsplayerInfo.className = "signing-player-details"

            let signingsplayerName = document.createElement("a"); signingsplayerName.textContent = singingInfo.playerName; signingsplayerName.className = "signing-playername"; signingsplayerName.href = singingInfo.pageUrl

            let signingscurrentTeam = document.createElement("a"); signingscurrentTeam.className = "signing-team"
            signingscurrentTeam.href = `/teams/${singingInfo.to}`
            let signingGreenArrow = document.createElement("div");
            signingGreenArrow.innerHTML = `
            <div class="arrow-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="fixtures-arrow-svg" width="20" height="20" fill="none" stroke="black" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          `;
            let signingscurrentTeamName = document.createElement("span"); signingscurrentTeamName.textContent = singingInfo.currentTeamName
            let signingscurrentTeamLogo = document.createElement("img"); signingscurrentTeamLogo.src = singingInfo.currentTeamLogo
            signingscurrentTeamLogo.height = 20; signingscurrentTeamLogo.width = 20

            let signingsplayerPosition = document.createElement("span"); signingsplayerPosition.innerText = singingInfo.signingsPosition
            signingsplayerPosition.className = "signings-player-position"
            let signingsformerTeam = document.createElement("a"); signingsformerTeam.href = `/teams/${singingInfo.from}`
            signingsformerTeam.className = "signing-team old-team"
            let signingsformerTeamName = document.createElement("span"); signingsformerTeamName.textContent = singingInfo.formerTeamName
            let signingsformerTeamLogo = document.createElement("img"); signingsformerTeamLogo.src = singingInfo.formerTeamLogo
            signingsformerTeamLogo.height = 20; signingsformerTeamLogo.width = 20

            let signingsnationLogo = document.createElement("img"); signingsnationLogo.src = singingInfo.nationLogo
            signingsnationLogo.width = 20; signingsnationLogo.height = 20

            let signingsdate = document.createElement("span"); signingsdate.textContent = singingInfo.date

            signingscurrentTeam.appendChild(signingGreenArrow)
            signingscurrentTeam.appendChild(signingscurrentTeamLogo)
            signingscurrentTeam.appendChild(signingscurrentTeamName)

            signingsplayerInfo.appendChild(signingsplayerName)
            signingsplayerInfo.appendChild(signingscurrentTeam)
            signingsItem.appendChild(signingsplayerInfo)

            signingsformerTeam.appendChild(signingsformerTeamLogo)
            signingsformerTeam.appendChild(signingsformerTeamName)

            signingsItem.appendChild(signingsformerTeam)
            signingsItem.appendChild(signingsplayerPosition)

            signingsItem.appendChild(signingsnationLogo)

            signingsItem.appendChild(signingsdate)
            signingsContianer.appendChild(signingsItem)
        }
    })

// ===============================|  MISC  | ===============================
//
//
function showSection(sectionId) {
    const validSections = ["overview", "stats", "standings", "fixtures", "signings", "news"];

    if (!validSections.includes(sectionId)) {
        sectionId = "overview";
    }

    document.querySelectorAll(".section").forEach(div => {
        div.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "flex";

    document.querySelectorAll(".section-button").forEach(btn => {
        btn.classList.remove("toggled-section");
    });
    document.getElementById(`${sectionId}Button`).classList.add("toggled-section");

    // Push updated URL
    history.pushState({ section: sectionId }, "", updateURL(sectionId));
}

function updateURL(sectionId) {
    const pathParts = window.location.pathname.split("/");
    const leagueID = pathParts[2] || "2"; // e.g. /leagues/2/overview → ["", "leagues", "2", "overview"]
    return `/leagues/${leagueID}/${sectionId}/`;
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


function theme() {
    pageTheme = localStorage.getItem("theme") || "theme-light";

    if (pageTheme) {
        if (pageTheme === "theme-dark") {
            pageTheme = "theme-light";
        } else if (pageTheme == "theme-light") {
            pageTheme = "theme-dark";
        }
        console.log(pageTheme);
        document.body.className = pageTheme;
        localStorage.setItem("theme", pageTheme);
    }
}

window.onload = function () {
    let savedTheme = localStorage.getItem("theme") || "theme-light";
    document.body.className = savedTheme;
};