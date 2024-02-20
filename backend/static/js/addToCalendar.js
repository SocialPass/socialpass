/**
 * Add to Calendar JS
 *
 * By SocialPass, All rights reserved
 */

function formatDate (inputDate, format)  {
	if (!inputDate) return "";
	const padZero = (value) => (value < 10 ? `0${value}` : `${value}`);
	const parts = {
		yyyy: inputDate.getFullYear(),
		MM: padZero(inputDate.getMonth() + 1),
		dd: padZero(inputDate.getDate()),
		HH: padZero(inputDate.getHours()),
		hh: padZero(inputDate.getHours() > 12 ? inputDate.getHours() - 12 : inputDate.getHours()),
		mm: padZero(inputDate.getMinutes()),
		ss: padZero(inputDate.getSeconds()),
		tt: inputDate.getHours() < 12 ? "AM" : "PM"
	};
	return format.replace(/yyyy|MM|dd|HH|hh|mm|ss|tt/g, (match) => parts[match]);
}
if (document.getElementById("date-range-for-calendar").value) {
	const dateRangeForCalendar = document.getElementById("date-range-for-calendar").value.split("|");
	const startDate = new Date(new Date(dateRangeForCalendar[0]).toLocaleString(
		"en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
	));
	const endDate = new Date(new Date(dateRangeForCalendar[1]).toLocaleString(
		"en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
	));
	const addToCalendar = document.getElementById("add-to-calendar");
	addToCalendar.setAttribute(
		"href",
		addToCalendar.getAttribute("href") +
		`&dates=${formatDate(startDate, "yyyyMMddTHHmmss")}/${formatDate(endDate, "yyyyMMddTHHmmss")}`
	);
}
