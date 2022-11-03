import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { async } from '@firebase/util';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: false,
    orderList: [],
    currentOrder: {
        destinationAddress: '',
        destinationLongitude: 231321,
        destinationLatidue: 23232,
        customer: {
            name: 'NguyenHung',
            phone: '0939398000',
        }
    },
    orderCreate: {}
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
        },
        editCustomerAddress(state, action) {
            const { newName, newAddress, newPhone } = action.payload;
            state.isLoading = false;
            state.error = false;
            const oldCustomerAddress = state.currentOrder.customerAddress;
            const newCustomerAddress = [...oldCustomerAddress, customer:{newName,newPhone},]
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
export function editCustomerAddress(values) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            dispatch(slice.actions.editCustomerAddress(values))
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

// ----------------------------------------------------------------------

