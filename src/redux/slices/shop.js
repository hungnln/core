import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { async } from '@firebase/util';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: false,
    shop: {},

};

const slice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        getShop(state, action) {
            state.isLoading = false;
            state.error = false;
            state.shop = action.payload;
        },



    }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow } = slice.actions;

// ----------------------------------------------------------------------
export function getShopbyId(shopId) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/v1.0/shops/${shopId}`);
            dispatch(slice.actions.getShop(response.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}


// ----------------------------------------------------------------------

