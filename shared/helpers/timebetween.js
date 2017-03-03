const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function plural ( num, unit ) {
	num = ~~num;
	if ( num !== 1 ) unit += 's';
	return `${num} ${unit}`;
}
	
export default function timebetween ( a, b ) {
	const elapsed = b - a;

	if ( elapsed < HOUR ) {
		return plural( elapsed / MINUTE, 'minute' );
	} else if ( elapsed < DAY ) {
		return plural( elapsed / HOUR, 'hour' );
	} else {
		return plural( elapsed / DAY, 'day' );
	}
}