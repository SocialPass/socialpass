/**
 * Generate ICS File
 *
 * By SocialPass, All rights reserved
 */
function generateICSFile(startDate, endDate, eventTitle, eventLocation) {
	const formatICSDate = (date) => {
		const padZero = (value) => (value < 10 ? `0${value}` : `${value}`);
		return `${date.getFullYear()}${padZero(date.getMonth() + 1)}${padZero(date.getDate())}T${padZero(date.getHours())}${padZero(date.getMinutes())}${padZero(date.getSeconds())}Z`;
	};

	const formattedStartDate = formatICSDate(startDate);
	const formattedEndDate = formatICSDate(endDate);

	const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formattedStartDate}
DTEND:${formattedEndDate}
SUMMARY:${eventTitle}
LOCATION:${eventLocation}
END:VEVENT
END:VCALENDAR`;

	const blob = new Blob([icsContent], { type: 'text/calendar' });
	const filename = `${eventTitle}.ics`;
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(blob, filename);
	} else {
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

function generateICSFileOnClick() {
	if (document.getElementById("date-range-for-calendar").value) {
		const dateRangeForCalendar = document.getElementById("date-range-for-calendar").value.split("|");
		const startDate = new Date(new Date(dateRangeForCalendar[0]).toLocaleString(
			"en-US", { timeZone: 'UTC' } // Convert start date to UTC
		));
		const endDate = new Date(new Date(dateRangeForCalendar[1]).toLocaleString(
			"en-US", { timeZone: 'UTC' } // Convert end date to UTC
		));
		generateICSFile(startDate, endDate, eventTitle, eventLocation);
	}
}
