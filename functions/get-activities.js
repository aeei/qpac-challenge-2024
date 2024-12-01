const fetch = require("node-fetch");

async function fetchActivitiesPage(accessToken, page = 1, perPage = 200) {
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}&before=1732978800&after=1725116400`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${page}: ${response.statusText}`);
  }

  const activities = await response.json();
  return activities;
}

async function fetchAllActivities(accessToken) {
  const perPage = 200;
  let page = 1;
  let allActivities = [];
  let activities;

  do {
    // Fetch one page of activities
    activities = await fetchActivitiesPage(accessToken, page, perPage);
    allActivities = allActivities.concat(activities);
    page += 1;
  } while (activities.length === perPage); // Continue fetching while the current page is full

  return allActivities;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const accessToken = event.headers.authorization;

  try {
    // Fetch all activities with pagination
    const activities = await fetchAllActivities(accessToken);

    // Filter Ride type activities
    const rideActivities = activities.filter(
      (activity) => activity.type === "Ride"
    );

    // Calculate total distance
    const totalDistance = rideActivities.reduce(
      (sum, activity) => sum + activity.distance,
      0
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ totalDistance: totalDistance / 1000 }), // Convert to km
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch activities",
        details: error.message,
      }),
    };
  }
};
