import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById('root')).render(
     <ThemeProvider>
      <StrictMode>
      <App />

      </StrictMode>


    </ThemeProvider>

)
