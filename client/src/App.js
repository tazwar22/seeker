import './App.css';
import Map from './components/Map';
import axios from 'axios';

const backendPort = 5001;
const backendUrl = `http://localhost:${backendPort}`;
axios.defaults.baseURL = backendUrl;

function App() {

  return (<div>
    <h1>Seeker</h1>
    <Map />
    </div>)
}

export default App;
