require('./bootstrap');

import react from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { Router } from 'react-router-dom';

const element = <App />;

ReactDOM.render(element, document.getElementById('root'));