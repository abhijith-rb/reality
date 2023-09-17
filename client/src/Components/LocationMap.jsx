import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import styled from 'styled-components';

const Marker = styled.div`
  position: relative;
  width: 32px; 
  height: 32px; 
`;

const Pin = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px; 
  height: 8px; 
  background-color: red; 
  border-radius: 50%; 
`;

const Pulse = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16px; 
  height: 16px; 
  border: 2px solid red; 
  border-radius: 50%; 
  animation: pulse-animation 2s infinite; 
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
                <Pin/>
                <Pulse/>
            </Marker>    
        </GoogleMapReact>

    </div>
  )
}

export default LocationMap;