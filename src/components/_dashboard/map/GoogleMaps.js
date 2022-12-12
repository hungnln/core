import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { GOOGLE_MAPS_API_KEY } from 'src/config';
import { useState, useRef, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import axios from '../../../utils/axios';

// This key was created specifically for the demo in mui.com.
// You need to create a new one for your application.

function loadScript(src, position, id) {
    if (!position) {
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };

export default function GoogleMaps({ currentAddress, onChangeLocation, touched, errors, currentGeocoding }) {
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const loaded = useRef(false);
    useEffect(() => {
        if (currentGeocoding !== undefined) {
            const { lat, lng, address } = currentGeocoding;
            if (address !== null) {
                setValue(address)
            }
        }
    }, [])
    // if (typeof window !== 'undefined' && !loaded.current) {
    //     if (!document.querySelector('#google-maps')) {
    //         loadScript(
    //             `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
    //             document.querySelector('head'),
    //             'google-maps',
    //         );
    //     }

    //     loaded.current = true;
    // }

    // const fetch = React.useMemo(
    //     () =>
    //         throttle((request, callback) => {
    //             autocompleteService.current.getPlacePredictions(request, callback);
    //         }, 200),
    //     [],
    // );

    // React.useEffect(() => {
    //     let active = true;

    //     if (!autocompleteService.current && window.google) {
    //         autocompleteService.current =
    //             new window.google.maps.places.AutocompleteService();
    //     }
    //     if (!autocompleteService.current) {
    //         return undefined;
    //     }

    //     if (inputValue === '') {
    //         setOptions(value ? [value] : []);
    //         return undefined;
    //     }

    //     fetch({ input: inputValue }, (results) => {
    //         if (active) {
    //             let newOptions = [];

    //             if (value) {
    //                 newOptions = [value];
    //             }

    //             if (results) {
    //                 newOptions = [...newOptions, ...results];
    //             }

    //             setOptions(newOptions);
    //         }
    //     });

    //     return () => {
    //         active = false;
    //     };
    // }, [value, inputValue, fetch]);
    const handleChangeSearch = async (event) => {
        try {
            const { value } = event.target;
            setSearchQuery(value)
            // console.log('value', value);
            if (value.trim().length > 0) {
                const response = await axios.get(`/api/v1.0/goongs?search=${value}`);
                console.log(response.data.data.predictions, 'cehck');
                setOptions(response.data.data.predictions);
            } else {
                setOptions([]);
            }
        } catch (error) {
            console.error(error);

        }
    };
    const getLatLngByPlaceId = async (value) => {
        try {

            const response = await axios.get(`/api/v1.0/goongs/detail?placeId=${value.place_id}`)
            const location = response.data.data.result
            onChangeLocation(location)
        }
        catch (error) {
            console.error(error);

        }
    }
    useEffect(() => {
        if (value !== null) {
            getLatLngByPlaceId(value);
        }
    }, [value])
    // Thử chuyển sang throttle 
    const debounceSearch = useCallback(throttle((nextValue) => handleChangeSearch(nextValue), 200), [])
    const handleInputOnchange = (e) => {

        // setKeyword(value);
        debounceSearch(e);
    }
    return (
        <Autocomplete


            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            // onInputChange={(event, newInputValue) => {
            //     setInputValue(newInputValue);
            // }}
            onInputChange={handleInputOnchange}
            renderInput={(params) => (
                <TextField {...params} fullWidth
                    label="Address"
                    name='address'
                    error={Boolean(touched.address && errors.address) || Boolean(touched.destinationAddress && errors.destinationAddress)}
                    helperText={touched.address && errors.address || touched.destinationAddress && errors.destinationAddress} />
            )}
            renderOption={(props, option) => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match) => [match.offset, match.offset + match.length]),
                );

                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Box
                                    component={LocationOnIcon}
                                    sx={{ color: 'text.secondary', mr: 2 }}
                                />
                            </Grid>
                            <Grid item xs>
                                {parts.map((part, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            fontWeight: part.highlight ? 700 : 400,
                                        }}
                                    >
                                        {part.text}
                                    </span>
                                ))}

                                <Typography variant="body2" color="text.secondary">
                                    {option.structured_formatting.secondary_text}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
}
