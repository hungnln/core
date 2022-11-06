import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react'

function Mapbox({ currentAddress, onChangeLocation }) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoibmd1eWVuaHVuZzA5MDgiLCJhIjoiY2w5bGExZnZ6MHY5bTNwbWd4eHV2aW5lNCJ9.VitcdZOLOTeyJJEGjD0h4Q';
    // const map = new mapboxgl.Map({
    //     container: 'map', // container id
    //     // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    //     style: 'mapbox://styles/mapbox/streets-v11',
    //     center: [-74.5, 40], // starting position
    //     zoom: 9 // starting zoom
    // });
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(currentAddress?.longitude || 0);
    const [lat, setLat] = useState(currentAddress?.latitude || 0);
    const [zoom, setZoom] = useState(9);
    // map.current.on('click', (e) => {
    //     console.log(e, 'check location');
    // });
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            // setLng(map.current.getCenter().lng.toFixed(4));
            // setLat(map.current.getCenter().lat.toFixed(4));
            // setZoom(map.current.getZoom().toFixed(10));
        });
        map.current.on('click', (e) => {
            onChangeLocation(e)
        });
    });
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom
        });
    });
    return (
        <div>
            <div ref={mapContainer} className="map-container" style={{ height: '200px' }} />
        </div>
    )
}

export default Mapbox