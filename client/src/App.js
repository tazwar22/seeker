import './App.css';
import Map from './components/Map';
import axios from 'axios';

const backendPort = 5001;
const backendUrl = `http://localhost:${backendPort}`;
console.log(backendUrl);
axios.defaults.baseURL = backendUrl;

function App() {
  return <Map></Map>
}

export default App;
