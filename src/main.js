const clientId = "72262";
const redirectUri = "https://qpac-challenge-2024.netlify.app";
const scope = "read,activity:read_all";

document.getElementById("login-btn").addEventListener("click", () => {
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;
  window.location.href = authUrl;
});

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

if (code) {
  fetch("/.netlify/functions/exchange-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  })
    .then((res) => res.json())
    .then((data) => {
      const accessToken = data.access_token;

      // Fetch activities
      fetch("/.netlify/functions/get-activities", {
        method: "GET",
        headers: { Authorization: accessToken },
      })
        .then((res) => res.json())
        .then((data) => {
          document.getElementById(
            "result"
          ).innerText = `Total Ride Distance: ${data.totalDistance.toFixed(
            2
          )} km`;
        });
    })
    .catch((err) => console.error(err));
}
