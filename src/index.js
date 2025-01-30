import React from 'react'; // Import React to use JSX and React functionality
import ReactDOM from 'react-dom/client'; // Import ReactDOM to render components into the DOM
import './index.css'; // Import the CSS file for styling
import App from './App'; // Import the main App component
import reportWebVitals from './reportWebVitals'; // Import reportWebVitals to measure app performance

// Create a root element to render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root element
root.render(
  <React.StrictMode>
    {/* StrictMode helps identify potential problems in the app */}
    <App /> 
  </React.StrictMode>
);

// Measure performance in your app (optional)
// reportWebVitals can be used to log or send performance data to an analytics endpoint
reportWebVitals();
