// API functions for admin operations

// Named export to match the import in Admin.jsx
export function setPuffCounts(counts, token) {
  // Get the base URL dynamically
  const getBaseUrl = () => {
    // For browser environments
    if (typeof window !== "undefined") {
      // Extract the base URL (protocol + host)
      const baseUrl = window.location.origin;
      console.log("Using base URL:", baseUrl);
      return baseUrl;
    }
    
    // Fallback for non-browser environments
    return "";
  };

  // Construct the full API URL using relative path
  const apiUrl = `/api/stats/set`;
  console.log("Making API request to:", getBaseUrl() + apiUrl);
  console.log("With token:", token);
  console.log("And data:", counts);
  
  try {
    const response = fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(counts),
    });

    return response
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.error || "Failed to update puff counts");
          });
        }
        return res.json();
      })
      .catch(error => {
        console.error("API Error:", error);
        throw error;
      });
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
