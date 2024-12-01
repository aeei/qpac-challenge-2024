const clientId = "72262";
const redirectUri = "https://qpac-challenge-2024.netlify.app";
// const redirectUri = "http://localhost:8888";
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
            // ).innerText = `Total Ride Distance: ${data.totalDistance.toFixed(
            //   2
            // )} km`;
          ).innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <!-- Circle border -->
  <circle cx="100" cy="100" r="95" fill="none" stroke="#D32F2F" stroke-width="10" />
  <!-- Inner text -->
  <text x="50%" y="40%" text-anchor="middle" fill="#D32F2F" font-size="18" font-family="Arial, sans-serif" font-weight="bold">
    QPAC 2024
  </text>
  <text x="50%" y="50%" text-anchor="middle" fill="#D32F2F" font-size="14" font-family="Arial, sans-serif">
    2024-09-01 ~ 2024-11-30
  </text>
  <text x="50%" y="60%" text-anchor="middle" fill="#D32F2F" font-size="16" font-family="Arial, sans-serif" font-weight="bold">
    ${data.totalDistance.toFixed(2)}km 달성
  </text>
</svg>
          `;
        });
    })
    .catch((err) => console.error(err));
}
