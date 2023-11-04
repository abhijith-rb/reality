import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import styled, {keyframes} from 'styled-components';
import { LocationOn, Room } from '@mui/icons-material';

const Marker = styled.div`
  position: relative;
  width: 32px; 
  height: 32px; 
`;

const PinStyle = styled.div`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  width: 8px; 
  height: 8px; 
  background-color: red; 
  border-radius: 50%; 
`;

const PulseAnim = keyframes`
  0%{
    transform: scale(1);
  }
  50%{
    transform: scale(1.2);
  }
  100%{
    transform: scale(1);
  }
`;

const Pulse = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateX(-50%);
  width: 16px; 
  height: 16px; 
  border: 2px solid red; 
  border-radius: 50%; 
  animation: ${PulseAnim} 2s infinite;
  display :flex ;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const LocationMap = ({coordinates,setCoordinates,edit}) => {

  const onMapClick =(event)=>{
    console.log(event.lat)
    console.log(event.lng)
    setCoordinates({lat:event.lat, lng: event.lng});
  }  

  const onMarkerDragEnd = (event)=>{
    setCoordinates({lat: event.lat, lng: event.lng});
  } 

  return (
    <div style={{height:'200px', width:'100%'}}>
        <GoogleMapReact
            bootstrapURLKeys={{key:process.env.REACT_APP_MAP_KEY}}
            defaultCenter={{lat:0, lng:0}}
            defaultZoom={12}
            center={coordinates}
            onClick={edit  && onMapClick}
        >
            <Marker
                lat={coordinates?.lat}
                lng={coordinates?.lng}
                draggable={true}
                onDragend={edit && onMarkerDragEnd}
            >
                
                <Pulse>
                  <LocationOn style={{color:"red",fontSize:"48px"}}/>
                </Pulse>  
            </Marker>    
        </GoogleMapReact>

    </div>
  )
}

export default LocationMap;