import './App.css';
import Map from './components/Map';
import axios from 'axios';
import { Typography, Divider} from '@mui/material';

const backendPort = 5001;
// const backendUrl = `http://localhost:${backendPort}`;
const backendUrl = '';
axios.defaults.baseURL = backendUrl;

function App() {

  return (
    <div  className="App">
      <Typography variant='h2'>Seeker</Typography>
      <Divider sx={{ marginBottom:2, borderBottomWidth: 5, width:'50%', marginLeft:'25%'}}></Divider>
      <Map />
    </div>
    )
}

export default App;
