import mapboxgl from 'mapbox-gl';
import React from 'react'

function map() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoibmd1eWVuaHVuZzA5MDgiLCJhIjoiY2w5bGExZnZ6MHY5bTNwbWd4eHV2aW5lNCJ9.VitcdZOLOTeyJJEGjD0h4Q';
    const map = new mapboxgl.Map({
        container: 'map', // container id
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40], // starting position
        zoom: 9 // starting zoom
    });
    map.on('click', (e) => {
        console.log(e, 'check location');
    });
    return (
        <>
            <div id="map" >{ }</div>
            <pre id="info">{ }</pre>
        </>
    )
}

export default map