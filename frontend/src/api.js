const API_BASE_URL = "http://localhost:5000/api"; // Change if needed

// Helper function for Fetch API
const fetchAPI = async (url, method = "GET", data = null, token = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Add token if available
    },
    ...(data && { body: JSON.stringify(data) }),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, options);
  let result;
  try {
    result = await response.json(); // Attempt to parse JSON
  } catch (error) {
    result = { error: "Invalid server response" }; // Handle non-JSON responses
  }

  if (!response.ok) {
    // If backend returns an array of errors, extract the first one
    if (result.errors && Array.isArray(result.errors)) {
        return { error: result.errors[0].msg }; 
    }
    return { 
        error: result.error || result.message || `Error ${response.status}: ${response.statusText}` 
    };
  }
  return result;
};

// Function to register a user
export const registerUser = (email, password) => fetchAPI("/auth/register", "POST", { email, password });

// Function to log in a user
export const loginUser = (email, password) => fetchAPI("/auth/login", "POST", { email, password });

// Function to get user profile
export const getUserProfile = (token) => {
    if (!token) throw new Error("No token provided"); // Ensure token exists
    return fetchAPI("/auth/me", "GET", null, token);
}

// Function to fetch events for the logged-in user
export const getEvents = (token) => fetchAPI("/events", "GET", null, token);

// Function to create an event
export const createEvent = (eventData, token) => fetchAPI("/events", "POST", eventData, token);

// Function to delete an event
export const deleteEvent = (eventData, token) => {
    if(!eventData.id) return;
    return fetchAPI(`/events/${eventData.id}`, "DELETE", null, token);
}

// Function to update an event
export const updateEvent = (eventData, token) => fetchAPI(`/events/${eventData.id}`, "PUT", eventData, token);
