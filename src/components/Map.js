import React from 'react'
import {useState, useEffect, useRef} from 'react'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import * as tt from '@tomtom-international/web-sdk-maps' //Get everything
import * as api from '@tomtom-international/web-sdk-services'
import { faHome, faCoffee} from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import 'font-awesome/css/font-awesome.min.css';
import { library, icon } from '@fortawesome/fontawesome-svg-core';

library.add(faHome);
library.add(faCoffee);


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
        zoom:18,
        center: [currpos.longitude,  currpos.latitude],
        stylesVisibility: {poi:false} //Remove POI markers
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

        //Adds markers for a given set of points
        const addMulMarkers = (nearbyPois) => {
            for (let pid in nearbyPois.results){
                // console.log(nearbyPois.results[pid]);
                const point = nearbyPois.results[pid];
                //Unpack the point object to access the location
                let poiLoc, poiName;
                poiLoc = point.position
                poiName = point.poi.name
                // console.log(`Name: ${poiName}`);

                // Popup
                const popupOffset = {bottom : [0, -30]};
                const popup = new tt.Popup({offset : popupOffset}).setHTML(poiName);
                //Make an HTML element <FontAwesomeIcon icon={FaAmazon} />
                const markerElement = document.createElement('span', {className:''});
                markerElement.innerHTML = icon({ prefix: 'fa', iconName: 'coffee'}).html;
                markerElement.className = 'marker-poi';
                // console.log(markerElement)
                                                // document.createElement('FontAwesomeIcon', {icon:faHome}));
                // markerElement.className = 'marker-poi';

                // const markerElement = document.createElement(FontAwesomeIcon,
                //                          {'icon':faHome, className:"marker"})
                // console.log(markerElement)
                const marker = new tt.Marker({
                    element:markerElement,
                    draggable:false
                });
        
                //Specify initial position
                marker.setLngLat([poiLoc.lng, poiLoc.lat]);
                // console.log(tomMap);
                marker.addTo(tomMap);
                marker.setPopup(popup);
            }
        }

        //Function to get and plot nearby points
        async function getNearbyPoints(){
            let res = await api.services.nearbySearch({
                key: process.env.REACT_APP_TT_API_KEY,
                center: [currpos.longitude,  currpos.latitude],
                radius: 1000
            })
            console.log(res)
            addMulMarkers(res); //Add all markers to map
        }

      // console.log(mapOb)
      getNearbyPoints();

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