function getMatchStatus(match) {
    const status = {}
    status.scoreStr = match.scoreline || ""
    status.finished = typeof match.finished === 'boolean' ? match.finished : false;
    status.started = typeof match.started === 'boolean' ? match.started : false;
    status.cancelled = match.cancelled || false
    status.awarded = match.awarded || false
    status.extraTime = match.extraTime || false
    status.penalties = match.penalties || false
    if (status.penalties) status.penaltiesScoreStr = match.penaltiesScore
    if (status.awarded === true) {
        status.statusShort = "W.O";
    } else if (status.cancelled === true) {
        status.statusShort = "CA";
    } else if (status.started === true) {
        if (status.finished === true) {
            status.statusShort = "FT";
        } else if (status.extraTime === true) {
            status.statusShort = "AET";
        } else if (status.finished === false) {
            status.statusShort = "Live";
        } else {
            status.statusShort = "Unknown";
        }
    } else {
        if (match.timestamp) {
            status.statusShort = { date: formatMatchTimestamp(match.timestamp).date, time: formatMatchTimestamp(match.timestamp).time };
        } else {
            status.statusShort = "";
        }
    }
    return status
}
export default getMatchStatus