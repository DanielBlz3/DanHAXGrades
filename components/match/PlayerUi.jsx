const RenderPlayerUi = ({ groupedStats }) => {
    
        return (
            visible && playerData ? (
                <>
                    <div css={playerUiOverlay} className="player-ui-overlay" style={{ display: 'flex' }}></div>
                    <div css={playerUi} className="player-ui" style={{ display: 'flex' }}>
                        <div css={playerUiHeader}>
                            <a css={playerUiName} href={`/players/${playerData.id}`}> {playerData.name} </a>
                            <div css={headerMetric}>
                                <div css={headerMetricItem}>
                                    <span>{playerData.position}</span>
                                    <span css={playerUiBioMetric}>{translationsMap?.["position"]?.[language]}</span>
                                </div>
                                <div css={headerMetricItem}>
                                    <span css={getRatingClass(playerStats?.["1"].matchRating, playerStats?.["1"].isMvp)}> {playerStats?.["1"].matchRatingRounded} </span>
                                    <span css={playerUiBioMetric}>{translationsMap?.["matchRating"]?.[language]}</span>
                                </div>
                                <div css={headerMetricItem}>
                                    <div css={playerUiNationality}>
                                        <img height="17" width="17" src={playerData.nationFlag} />
                                        <span >{playerData.nationName}</span>
                                    </div>
                                    <span css={playerUiBioMetric}>{translationsMap?.["country"]?.[language]}</span>
                                </div>
                            </div>
                        </div>
                        <div css={playerUiMain}>
                            <div css={playerUiStats}>
                                {Object.entries(groupedStats).map(([section, stats]) => (
                                    <div key={section} css={statGroup}>
                                        <h3 css={statGroupTitle}>
                                            {translationsMap?.[section]?.[language]}
                                        </h3>
                                        {stats.map(([label, value], i) => (
                                            <span key={i} css={statLine}>
                                                {label}: {value}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : null

        );
    };

export default RenderPlayerUi