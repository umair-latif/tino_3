/*
 main.jsx is the entry point that:
+ prepares React and ReactDom
+ prepares clint-side routing (browser navigation)
+ injects the App component into the 'root' element
*/
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//To manage the navigation of App without reloading the page
import { BrowserRouter } from 'react-router-dom';

//App is the React app UI and logic
import App from './App.jsx'

//root = main content area
//rendering App in root:
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
