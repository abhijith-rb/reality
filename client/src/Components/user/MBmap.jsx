import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import SearchBox from '@mapbox/search-js-react';
import styled from 'styled-components';
import axios from 'axios';
import Loader from '../../utils/Loader';

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MapSideBar = styled.div`
  background-color: rgba(35, 55, 75, 0.9);
color: #fff;
padding: 6px 12px;
font-family: monospace;
z-index: 1;
position: absolute;
top: 0;
left: 0;
margin: 12px;
border-radius: 4px;
`;

const MapContainer = styled.div`
  height: 400px;
  position: relative;
`;

const Searchbar = styled.input`
  z-index: 1;
position: absolute;
top: 0;
right: 0;
`;

const Ul = styled.ul`
width: 20vw;
height: auto;
max-height: 60vh;
  z-index: 7;
  position: absolute;
  top: 40px;
  right: 0;
border: 2px solid grey;
background-color: #ffffff;
color: #777;
list-style: none;
`;

const Li = styled.li`
  cursor:pointer;
  &:hover{
    color: orange;
  }
`;

const MBmap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng,setLng] = useState(-79.6);
  const [lat,setLat] = useState(43.6);
  const [zoom,setZoom] = useState(13);
  const [query,setQuery] = useState("")
  const [suggestions, setSugggetions] = useState([]);
  const [xyz,setXyz] = useState(true);
  const [place,setPlace] = useState({name:"",coords:[]});
  const [display,setDisplay] = useState({name:"test",coords:[12,24]})

  const geolocateCtrl = new mapboxgl.GeolocateControl({
    positionOptions:{
      enableHighAccuracy:true,
    },
    trackUserLocation:true,
  }) 

  useEffect(()=>{
    if(map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken:"pk.eyJ1IjoiYWotci1iIiwiYSI6ImNsbnlqajUxZTB4MHEybGxla2JybmViOWIifQ.TKkEoSF3eJQTPRtsAfYruw",
      style: "mapbox://styles/mapbox/streets-v12",
      center:[lng,lat],
      zoom: zoom
    });
    
    map.current.addControl(geolocateCtrl);

    map.current.on('geolocate',(e)=>{
      console.log("lf event trigerred")
      const userLocation = e.target.getCenter();
      console.log("userlocation", userLocation)
    })

    map.current.on('move',()=>{
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    })


    return ()=>{
      map.current.remove()
    }
  },[])

  const suggest = async()=>{
    await axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}
    &session_token=${123}&access_token=${"pk.eyJ1IjoiYWotci1iIiwiYSI6ImNsbnlqajUxZTB4MHEybGxla2JybmViOWIifQ.TKkEoSF3eJQTPRtsAfYruw"}`)
    .then((res)=>{
      console.log(res)
      console.log(res.data)
      setSugggetions(res.data.suggestions)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    console.log(query)
    suggest()
  },[query])

  const getData = async(id)=>{
    await axios.get(`https://api.mapbox.com/search/searchbox/v1/retrieve/${id}?session_token=${123}&access_token=${"pk.eyJ1IjoiYWotci1iIiwiYSI6ImNsbnlqajUxZTB4MHEybGxla2JybmViOWIifQ.TKkEoSF3eJQTPRtsAfYruw"}`)
    .then((res)=>{
      console.log(res.data)
      console.log(res.data.features)
      console.log(res.data.features[0].geometry.coordinates)
      console.log(res.data.features[0].properties.name)
      const name = res.data.features[0].properties.name;
      const coords = res.data.features[0].geometry.coordinates;
      // setPlace((prev)=>{return{...prev,name:name,coords:coords}})
      setPlace({name:name,coords:coords})
      setLng(res.data.features[0].geometry.coordinates[0])
      setLat(res.data.features[0].geometry.coordinates[1])
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  function setData(){
    localStorage.setItem("place",JSON.stringify(place))
  }

  function fetchData(){
    let placeData = JSON.parse(localStorage.getItem("place"));
    console.log(placeData)
    setDisplay(placeData);
  }

  useEffect(()=>{
    map.current.setCenter([lng,lat])
  },[lng,lat])

  // useEffect(() => {
  //   map.current.on("click", (e) => {
  //     console.log(e.lngLat)
  //     setLng(e.lngLat.lng);
  //     setLat(e.lngLat.lat);
  //     map.current.setCenter([e.lngLat.lng, e.lngLat.lat]);
  //   });
  // }, [map.current]);

  // const marker = new mapboxgl.Marker({
  //   color: "red",
  //   position: [lng, lat],
  // });
  
  // map.current.addLayer(marker);

  const handleQuery = (e)=>{
    setXyz(true)
    setQuery(e.target.value)
  }

  const setSelect = (sgn)=>{
    setXyz(false)
    setQuery(sgn.name);
    getData(sgn.mapbox_id);
  }

  return (
    <>
      <MapWrapper>
        <Searchbar placeholder='Search here' value={query} onChange={handleQuery}/>
        {xyz &&
          suggestions?.length >0 &&
          <Ul>
            {
              suggestions?.map((sgn)=>(
                // <Li onClick={()=>getData(sgn.mapbox_id)}>{sgn.name}</Li>
                <Li onClick={()=>setSelect(sgn)}>{sgn.name}</Li>
              ))
            }
          </Ul>
        } 
          
        <MapSideBar>
            Longitude: {lng} | Latitude:{lat} | Zoom: {zoom}
        </MapSideBar>
        
        <MapContainer ref={mapContainer} />

      </MapWrapper>

      <div>
        <button onClick={setData}>Add place</button>
        <button onClick={fetchData}>Fetch place</button>
        <span>{display.name} </span>
        <span> Long: {display.coords[0]}</span>
        <span> Lati: {display.coords[1]}</span>
      </div>
    </>
  )
}

export default MBmap