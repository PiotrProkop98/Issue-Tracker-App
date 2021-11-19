require('./bootstrap');

import react from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const element = <App />;

ReactDOM.render(element, document.getElementById('root'));