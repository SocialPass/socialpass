("use strict");

const url = "https://analytics.socialpass.io";

// Get the diff in hours
let diff = 24;
try {
  const now = new Date();
  const statsSent = new Date(localStorage.getItem("socialpass:stats-sent"));
  diff = (now.getTime() - statsSent.getTime()) / 1000;
  diff /= (60 * 60);
  diff = Math.abs(Math.round(diff));
} catch {
  diff = 24;
}

// Send if 24 hours have passed (so once a day)
if (diff >= 24) {
  fetch(url, { method: "GET" });
  localStorage.setItem("socialpass:stats-sent", String(new Date()));
}
