/**
 * Main JavaScript file for SocialPass
 * This file ensures the js directory exists during the build process
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('SocialPass application initialized');
  
  // Initialize any components
  initializeComponents();
});

/**
 * Initialize application components
 */
function initializeComponents() {
  // Example component initialization
  const buttons = document.querySelectorAll('.btn');
  if (buttons.length > 0) {
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        console.log('Button clicked:', e.target.textContent);
      });
    });
  }
  
  // Add more component initializations as needed
}

/**
 * Utility function for handling API requests
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Request options
 * @returns {Promise} - Promise resolving to the API response
 */
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
} 