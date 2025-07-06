'use client';
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { translationsMap } from '/lib/translations.js';
import PenaltyBox from '/components/PenaltyBox';
import formations from '/lib/formations';
import html2canvas from 'html2canvas';
import '/styles/global.css';

export default function TeamCreatorPageClient({ players }) {
    const [theme, setTheme] = useState('theme-light');
    const [language, setLanguage] = useState('es');
    const [selectedFormation, setSelectedFormation] = useState('fourthreethree');
    const [lineupMode, setLineupMode] = useState('icon');
    const [selectedPlayers, setSelectedPlayers] = useState(Array(11).fill(null));
    const [focusedPlayer, setFocusedPlayer] = useState(null);
    const [loadSavedTeams, setLoadSavedTeams] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [formationTextDisplay, setFormationTextDisplay] = useState("none");

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || 'es';
        const storedTheme = localStorage.getItem('theme') || 'theme-light';
        setLanguage(storedLanguage);
        setTheme(storedTheme);
    }, [players]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                !e.target.closest('.player') &&
                !e.target.closest('.searchbar')
            ) {
                setFocusedPlayer(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // ===============================|  FORMATION SELECT  | ===============================

    const FormationSelect = () => {
        const handleChange = (e) => setSelectedFormation(e.target.value);

        return (
            <select value={selectedFormation} onChange={handleChange} css={selectCSS}>
                {Object.entries(formations).map(([key, val]) => (
                    <option key={key} value={key}>
                        {val.formationTitle}
                    </option>
                ))}
            </select>
        );
    };

    const LineupModeSelect = () => {
        const handleChange = (e) => setLineupMode(e.target.value);

        return (
            <select value={lineupMode} onChange={handleChange} css={selectCSS}>
                <option value="icon">{translationsMap?.["icon"]?.[language]}</option>
                <option value="country">{translationsMap?.["country"]?.[language]}</option>
                <option value="position">{translationsMap?.["position"]?.[language]}</option>
            </select>
        );
    };

    const TeamNameChange = () => {

        const handleChange = (e) => {
            setTeamName(e.target.value);
        };

        useEffect(() => {
        }, []);

        return (
            <input
                type="text"
                css={inputCSS}
                value={teamName}
                onChange={handleChange}
                placeholder={translationsMap?.["enterTeamName"]?.[language]}
            />
        )
    }


    // ===============================|  SEARCH BAR  | ===============================

    let recentPlayers = JSON?.parse(localStorage.getItem('teamCreator')) || []

    const SearchBar = ({ players }) => {
        const [query, setQuery] = useState("");

        const filteredPlayers = players.filter(player => {
            if (!query) {
                let hasPlayerId = recentPlayers.map(i => {
                    return i.id == player.id
                })
                hasPlayerId = hasPlayerId.includes(true) ? true : false
                return hasPlayerId
            }
            else {
                if (player.name.toLowerCase().includes(query.toLowerCase())) {
                    return true
                }
            }
        });

        function UpdateSelectedPlayers(id, player) { // WHEN USE CLICKS ON A SEARCH RESULT 
            const team = selectedPlayers

            if (team.includes(player)) {
                team[team.indexOf(player)] = team[id]
            }
            team[id] = player
            setSelectedPlayers(team)

            if (!recentPlayers.includes(player)) {
                recentPlayers.push(player);
            }
            localStorage.setItem("teamCreator", JSON.stringify(recentPlayers))
            setFocusedPlayer(null);
        }

        return (
            <div css={searchCard} className="searchbar">
                <div css={inputeAndSearch}>
                    <span className="search-icon material-symbols-outlined">search</span>
                    <input
                        css={searchBarCSS}
                        type="text"
                        placeholder={translationsMap?.["search"]?.[language]}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div css={searchResults}>
                    {filteredPlayers.map(player => (
                        <button
                            css={searchResult}
                            className="secondary-hover search-result"
                            key={player.id}
                            onClick={() => UpdateSelectedPlayers(focusedPlayer, player)}
                        >
                            <div css={searchedPlayerContent}>
                                <span css={searchedPlayerName}>
                                    {player.name}
                                </span>
                                <span>
                                    {player.teamName}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const RenderSearchBar = () =>
        focusedPlayer !== null ? <SearchBar players={players} /> : null;

    const TeamCreatorPlayer = ({ player, coords, playerNumber, position, lineupMode }) => {
        const playerContainer = css`
        display: flex;
        flex-direction: column;
        position: absolute;
        justify-content: center;
        align-items: center;
        gap: 5px;
        height: 65px;
        width: 65px;
        transform: translate(-50%, -50%);
        text-decoration: none;
        color: var(--primary-font-color);
        background-color: transparent;
        border: none;
        cursor: pointer;
        top: ${100 - coords?.y * 2}%;
        left: ${coords?.x}%;
        `;

        const playerWrapper = css`
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        height: 45px;
        width: 45px;
        border-radius: 50%;
        background-color: var(--primary-player-bg-color);
        `;

        const playerName = css`
        width: 300%;
        text-align: center;
        cursor: default;
        font-size: 0.8rem;
        font-weight: bold;
        text-decoration: none;
        `;

        const startingPlayerName = css`
        color: var(--GLOBAL-FONT-COLOR-WHITE);
        `;

        const teamLogo = css`
        position: absolute;
        bottom: 25%;
        right: 10%;
        `;

        const positionCSS = css`
        font-weight: bold;
        `;

        const playerAvatar = css`
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        `;

        const modeEl = lineupMode === "icon" ? (<img src={player?.avatar || "/images/teamLogos/0.png"} alt={player?.teamName} width={34} height={34} css={playerAvatar} />) :
            lineupMode === "country" ? (<img src={player?.nationFlag || "/images/teamLogos/0.png"} alt={player?.nationName} width={40} height={40} />) :
                (<div css={positionCSS}>{translationsMap?.[`${position}_Short`]?.[language]}</div>)
        return (
            <button
                css={playerContainer}
                className="primary-hover player"
                onClick={() => setFocusedPlayer(playerNumber)}
            >
                <div css={playerWrapper}>
                    {modeEl}
                    <img src={player?.teamLogo || "/images/teamLogos/0.png"} alt={player?.teamName} width={17} height={17} css={teamLogo} />
                </div>
                <span css={[startingPlayerName, playerName]}>{player?.name}</span>
            </button>
        )
    };

    const RenderPlayers = ({ players }) =>
        players.map((p, i) => (
            <TeamCreatorPlayer
                key={i}
                player={p}
                coords={{
                    x: formations[selectedFormation].coords[i][0],
                    y: formations[selectedFormation].coords[i][1],
                }}
                playerNumber={i}
                position={formations[selectedFormation].positions[i]}
                lineupMode={lineupMode}
            />
        ));

    const captureFormation = css`
    display: ${formationTextDisplay};
    height: 3rem;
    justify-content: center;
    align-items: center;
    color: var(--GLOBAL-DANHAXGRADES-SCHEME);
    `;

    // ===============================|  LOADING AND SAVING FORMATIONS  | ===============================

    function saveFormation() {
        const savedFormations = JSON.parse(localStorage.getItem("teamCreatorXI")) || []
        savedFormations.push(
            {
                id: crypto.randomUUID(),
                name: teamName,
                formation: selectedFormation,
                mode: lineupMode,
                players: selectedPlayers,
            }
        )
        localStorage.setItem("teamCreatorXI", JSON.stringify(savedFormations))
    }

    const RenderSavedTeams = () => loadSavedTeams !== false ? <LoadSavedTeams /> : null;

    const LoadSavedTeams = () => {
        useEffect(() => {
            const handleClickOutside = (e) => {
                setLoadSavedTeams(false);
            };

            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }, []);

        const continaer = css`
            display: flex;
            flex-flow: column;
            justify-content: center;
            border-radius: 1.25rem;
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-height: 20rem;
            width: 30rem;
            background-color: var(--primary-card-bg);
            overflow-y: auto;
            box-shadow: 3px 6px 10px rgba(0, 0, 0, .25);
            `
        const savedTeamItem = css`
            display: grid;
            grid-template-columns: 9fr 1fr;
            align-items: center;
            justify-items: center;
            min-height: 4rem;
            border-top: solid 1px var(--secondary-divider-bg);

            > :first-child {
            border: none;
            }
            `
        const savedTeamButton = css`
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0);
            color: var(--primary-font-color);
            border: none;
            outline: none;
            cursor: pointer;
            width: 100%;
        `
        const formation = css`
            color: var(--GLOBAL-DANHAXGRADES-SCHEME);
            `
        const deleteButton = css`
            background-color: rgba(0, 0, 0, 0);
            border: none;
            outline: none;
            cursor: pointer;        

            &:hover {
            opacity: 0.7;
            }
        `


        const savedLineupsArr = JSON.parse(localStorage.getItem("teamCreatorXI")) || []
        const content = savedLineupsArr.map((team, key) => {
            return (
                <div css={savedTeamItem}
                    className='primary-hover'
                    key={key}>
                    <button
                        css={savedTeamButton}
                        onClick={() => [setSelectedPlayers(team.players), setTeamName(team.name), setLineupMode(team.mode, setSelectedFormation(team.formation)), setLoadSavedTeams(false)]}

                    >
                        <h3>{team.name || translationsMap?.["noname"]?.[language]}</h3>
                        <span css={formation}>{formations[team.formation]?.formationTitle}</span>
                    </button>
                    <button css={deleteButton} onClick={() => [deleteTeam(team.id), setSelectedPlayers((Array(11).fill(null))), setTeamName(""), setLoadSavedTeams(false)]}>
                        <img src="/images/delete.svg" alt="delete" />
                    </button>
                </div>
            )
        })
        return (
            <div css={continaer} className='saved-formations'>
                {content}
            </div>
        )
    }

    const deleteTeam = (id) => {
        console.log(id)
        const savedFormations = JSON.parse(localStorage.getItem("teamCreatorXI")) || []
        const unDeletedFormations = savedFormations.filter(team => team.id !== id)
        localStorage.setItem("teamCreatorXI", JSON.stringify(unDeletedFormations))
    }

    const captureElement = async (id) => {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Element ${id} not found`);
        const canvas = await html2canvas(el);
        return canvas;
    };

    const handleCapture = async () => {

        setFormationTextDisplay("flex")

        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        await sleep(200)

        const [canvas1, canvas2, canvas3] = await Promise.all([
            captureElement('capturename'),
            captureElement('captureformation'),
            captureElement('capturelineup'),
        ]);

        const width = Math.max(canvas1.width, canvas2.width, canvas3.width);
        const height = canvas1.height + canvas2.height + canvas3.height;

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = width;
        finalCanvas.height = height;
        const ctx = finalCanvas.getContext('2d');

        let yOffset = 0;
        [canvas1, canvas2, canvas3].forEach((c) => {
            ctx.drawImage(c, 0, yOffset);
            yOffset += c.height;
        });

        const dataURL = finalCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${translationsMap?.["dream_team"]?.[language]}.png`;
        link.click();
        setFormationTextDisplay("none")
    };

    return (
        <div className="global-content-wrapper-reversed">
            <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
            <div className="global-left-grid">
                <div css={creatorInfo}>
                    <h3 css={infoHeader}>{translationsMap?.["teamCreator"]?.[language]}</h3>
                    <p>{translationsMap?.["teamCreatorPara1"]?.[language]}</p>
                    <br />
                    <p>{translationsMap?.["teamCreatorPara2"]?.[language]}</p>
                </div>
                <div css={loadFormationWrapper}>
                    <button css={teamCreatorButton} onClick={() => setLoadSavedTeams(true)}>{translationsMap?.["loadFormation"]?.[language]}</button>
                </div>
            </div>
            <div className="global-right-grid" css={searchUIContainer}>
                <div css={teamCreator}>
                    <header css={teamCreatorHeader}>
                        <div id="capturename" css={title}>
                            <h2 css={titleText}> {teamName ? teamName : "DanHAXGrades Team Creator"}</h2>
                            <img css={titleLogo} src="/DanHAXGradeFavicon.ico" height={40} width={40} />
                        </div>
                        <div css={select}>
                            <div>
                                {FormationSelect()}
                            </div>
                            <button
                                css={resetTeam}
                                className="third-hover"
                                onClick={() => setSelectedPlayers((Array(11).fill(null)))}
                            >{translationsMap?.["resetTeam"]?.[language]}</button>
                            <div>
                                {LineupModeSelect()}
                            </div>
                        </div>
                    </header>
                    <div css={totwField} id="capturelineup">
                        <div css={bigBox}>
                            <PenaltyBox
                                width={267}
                                height={133}
                                strokeColor={'var(--primary-soccer-field-stroke)'}
                                lineWidth={4}
                            />
                        </div>
                        <RenderPlayers players={selectedPlayers} />
                    </div>
                    <div css={teamConfiguration}>
                        <button css={teamCreatorButton} onClick={() => saveFormation()}>{translationsMap?.["saveFormation"]?.[language]}</button>
                        {TeamNameChange()}
                        <button css={teamCreatorButton} onClick={() => handleCapture()}>{translationsMap?.["downloadFormation"]?.[language]}</button>
                    </div>
                </div>
                <RenderSearchBar players={players} />
                <RenderSavedTeams />
                <h3 id="captureformation" css={captureFormation}>{formations[selectedFormation].formationTitle}</h3>
            </div>
        </div>
    );
}

// 💅 STYLES
const creatorInfo = css`
  display: flex;
  flex-flow: column;
  background-color: var(--primary-card-bg);
  border-radius: 1.25rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const infoHeader = css`
  display: flex;
  height: 3rem;
`;

const teamCreator = css`
  background-color: var(--primary-card-bg);
  border-radius: 1.25rem;
`;

const teamCreatorHeader = css`
  display: flex;
  flex-flow: column;
`;

const title = css`
  display: flex;
  flex: 1;
  min-height: 4rem;
  border-bottom: solid 1px var(--primary-divider-bg);
  justify-content: center;
  align-items: center;
  padding-inline: 1rem;

> :first-child {
  text-align: start;
  width: 100%;
  }
`;

const titleLogo = css`
border-radius: 50%;
`

const titleText = css`
color: var(--GLOBAL-DANHAXGRADES-SCHEME);
`

const select = css`
  display: flex;
  flex-flow: row;
  flex: 1;
  min-height: 3.5rem;
  justify-content: center;
  align-items: center;
    >  * {
display: flex;
  width: 100%;
  justify-content: center;
  }
`;

const bigBox = css`
  position: absolute;
  bottom: -2%;
  left: 50%;
  transform: translate(-50%, 0%);
`;

const totwField = css`
  background-color: var(--primary-soccer-field-bg);
  min-width: 400px;
  height: 500px;
  position: relative;
`;

const searchCard = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-flow: column;
  background-color: var(--primary-card-bg);
  border-radius: 1.25rem;
  width: 30rem;
  height: 20rem;
                  box-shadow: 3px 6px 10px rgba(0, 0, 0, .25);
`;

const searchBarCSS = css`
background-color: var(--secondary-card-bg);
border: none;
outline: none;
height: 100%;
width: 100%;
font-size: 1.2rem;
`;

const inputeAndSearch = css`
display: flex;
border-radius: 1.25rem;
min-height: 3rem;
padding-inline: 1rem;
background-color: var(--secondary-card-bg);
margin: 1rem;
border: none;
place-items: center;
gap: 10px
`

const searchResults = css`
  display: flex;
  flex-flow: column;
max-height: 14rem;
overflow-y: scroll;
`;

const searchResult = css`
  width: 100%;
  text-align: center;
  background-color: var(--primary-card-bg);
  color: var(--primary-font-color);
  min-height: 3.5rem;
  border: none;
  cursor: pointer;
`;

const searchedPlayerContent = css`
    display: flex;
    flex-flow: column;
`

const searchedPlayerName = css`
    font-weight: bold;
`

const selectCSS = css`
font-weight: bold;
border-radius: 1.25rem;
padding: .5rem;
border: 1px solid var(--secondary-divider-bg);
background-color:  var(--primary-bg-color);
color: grey;
`

const searchUIContainer = css`
position: relative;
`

const resetTeam = css`
background-color: rgba(0, 0, 0, 0);
border: none;
color: var(--GLOBAL-DANHAXGRADES-SCHEME);
cursor: pointer;
width: 300px;
`

const teamConfiguration = css`
display: flex;
justify-content: space-evenly;
align-items: center;
background-color:  var(--primary-bg-color);
border-radius: 1.25rem;
height: 5rem;
    gap: 10%;
`

const inputCSS = css`
width: 300px;
background-color:  var(--secondary-card-bg);
color: var(--primary-font-color);
border: none;
border-radius: 1.25rem;
height: 3rem;
padding: 1rem;
`
const loadFormationWrapper = css`
display: flex;
align-items: center;
justify-content: center;
height: 5rem;
border-radius: 1.25rem;
    >  * {
    width: 100%;
}
`

const teamCreatorButton = css`
display: flex;
padding: 1rem;
justify-content: center;
align-items: center;
background-color:  var(--GLOBAL-DANHAXGRADES-SCHEME);
border: none;
color: white;
border-radius: 0.75rem;
font-size: 1rem;
cursor: pointer;

&:hover {
opacity: 0.7;
}
&:active { 
color: red
}
`