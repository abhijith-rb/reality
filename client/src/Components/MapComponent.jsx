import React from 'react';
import GoogleMapReact from "google-map-react"

const Marker = ({text})=> <div className='marker' style={{color:"red",fontSize:"20px",fontWeight:"bold"}}>{text}</div>

const MapComponent = ({center,zoom,markers}) => {
  return (
    <div style={{height:"400px",width:"100%"}}>
        <GoogleMapReact
            bootstrapURLKeys={{
                key:process.env.REACT_APP_MAP_KEY
            }}
            defaultCenter={center}
            defaultZoom={zoom}
        >

        {markers.map((marker, index)=>(
            <Marker key={index} lat={marker.lat} lng={marker.lng} text={marker.text}/>
        ))

        }

        </GoogleMapReact>

    </div>
  )
}

export default MapComponent