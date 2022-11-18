import mapboxgl, { Marker } from 'mapbox-gl';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function Mapbox({ currentAddress, onChangeLocation }) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoibmd1eWVuaHVuZzA5MDgiLCJhIjoiY2w5bGExZnZ6MHY5bTNwbWd4eHV2aW5lNCJ9.VitcdZOLOTeyJJEGjD0h4Q';

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(currentAddress?.longitude ||
        106.77226561968932
    );
    const [lat, setLat] = useState(currentAddress?.latitude ||
        10.850226152163437,
    );
    // const [lng, setLng] = useState(-70.9);
    // const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(15);
    // useEffect(() => {
    //     if (!map.current) return; // wait for map to initialize
    //     map.current.on('click', (e) => {
    //         console.log('click')
    //         onChangeLocation(e)
    //     });
    // });
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom,

        });
        if (currentAddress) {
            new mapboxgl.Marker({ color: '#63df29', scale: 1.5 })
                .setLngLat([currentAddress.longitude, currentAddress.latitude])
                .addTo(map.current);
        }
        map.current.on('click', (e) => {
            console.log('e', e);
            new mapboxgl.Marker({ color: '#63df29', scale: 1.5 })
                .setLngLat([e.lngLat.lng, e.lngLat.lat])
                .addTo(map.current);
            onChangeLocation(e)
        });


    });
    return (
        <div>
            <div ref={mapContainer} className="map-container" style={{ height: '200px' }} />
        </div>
    )
}

export default Mapbox