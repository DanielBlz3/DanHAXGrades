export default function formatMatchTimestamp(isoString) {
        if (isoString) {
            const dateObj = new Date(isoString);

            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1;
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');

            const formattedDate = `${day}/${month}`;
            const formattedTime = `${hours}:${minutes} PM`;

            return {
                date: formattedDate,
                time: formattedTime
            };
        } else {
            return {
                date: "TBD",
                time: "TBD"
            }
        }
    }