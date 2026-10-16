import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './style.css';
import './refinements.css';
import './fonts.css';
import './workshop.css';
import './industrial.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
