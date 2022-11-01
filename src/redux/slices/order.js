import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: false,
    orderList: [],
    currentOrder: {},
    orderCreate:{}
};

const slice = createSlice({
    name: 'order',
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
        getOrderList(state, action) {
            state.isLoading = false;
            state.error = false;
            state.orderList = action.payload;
        }



    }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteOrder } = slice.actions;

// ----------------------------------------------------------------------

export function getProfile() {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/user/profile');
            dispatch(slice.actions.getProfileSuccess(response.data.profile));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export function getOrderList() {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/v1.0/orders');
            dispatch(slice.actions.getOrderListSuccess(response.data.result));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

