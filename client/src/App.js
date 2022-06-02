import './App.css';
import Map from './components/Map';
import axios from 'axios';
import { Typography } from '@mui/material';

const backendPort = 5001;
const backendUrl = `http://localhost:${backendPort}`;
axios.defaults.baseURL = backendUrl;

function App() {

  return (
    <div  className="App">
      <Typography variant='h2'>Seeker</Typography>
      <Map />
    </div>
    )
}

export default App;
