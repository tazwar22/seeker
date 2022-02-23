import React from 'react'
import {useState, useEffect, useRef} from 'react'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import * as tt from '@tomtom-international/web-sdk-maps' //Get everything


const Map = () => {
    const mapElement = useRef();
    const [mapOb, setMap] = useState({});
    const [currpos, setCurrpos] = useState({latitude:49.26609680307735, longitude:-123.24254063087011})
  
    // Function to parse given location
    const parseLatLong = (latLongStr)=>{
      console.log(latLongStr);
      const latLong = latLongStr.split(", ");
      setCurrpos({latitude:latLong[0], longitude:latLong[1]});
    }
  
    useEffect(()=>{
      //Grab the API key form the .env file
      const KEY = process.env.REACT_APP_TT_API_KEY;
      // console.log(KEY);
      // console.log(currpos)
      //Construct a map
      let tomMap = tt.map({
        key: KEY,
        container: mapElement.current,
        zoom:12,
        center: [currpos.longitude,  currpos.latitude]
      });
  
      setMap(tomMap);
      // console.log(mapOb);
  
      //Add a marker
      const addMarker = ()=>{
        const popupOffset = {bottom : [0, -30]};
        const popup = new tt.Popup({offset : popupOffset}).setHTML("You!");
  
        //Make an HTML element
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
  
        const marker = new tt.Marker({
          element:markerElement,
          draggable:true
        });
  
        //Specify initial position
        marker.setLngLat([currpos.longitude, currpos.latitude]);
        // console.log(tomMap);
        marker.addTo(tomMap);
  
         //Add dragging interaction
        marker.on('dragend', ()=>{
          // console.log("Finished moving");
          // console.log(marker.getLngLat());
          const newPos = marker.getLngLat();
          setCurrpos({longitude:newPos.lng, latitude:newPos.lat});
        })
  
        marker.setPopup(popup).togglePopup();
      }
  
      //CALL the function
      addMarker();
      // console.log(mapOb)
  
      return () => tomMap.remove();
    }, [currpos]);
  
    if (mapOb){
      return (
        //Only return the map if it's loaded
        <div className="App">
  
        <div className='locSearch'>
            <h2>Search</h2>
            <input type="text" id="latlong" placeholder='49.266, -123.241' 
            onChange={(e)=>{parseLatLong(e.target.value)}}>
            </input>
        </div>
        <div ref={mapElement} className='tomMap'> </div>
        </div>  
      );
    }else{
      return <h1>Loading...</h1>
    }
}

export default Map