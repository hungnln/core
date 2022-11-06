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
    currentOrder: {},
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
            state.isLoading = false;
            state.error = false;
            state.currentOrder = { ...state.currentOrder, ...action.payload }
        },
        getOrderDetail(state, action) {
            state.isLoading = false;
            state.error = false;
            state.currentOrder = action.payload;
        },
        createOrder(state, action) {
            state.isLoading = false;
            state.error = false;
            const newOrderList = [...state.orderList, action.payload];
            state.orderList = newOrderList;
        },
        changePackagesStatus(state, action) {
            state.isLoading = false;
            state.error = false;

        }



    }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteOrder } = slice.actions;

// ----------------------------------------------------------------------
export function getOrderListByShopId(shopId) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/v1.0/packages?shopId=${shopId}`);
            console.log('responese', response);
            dispatch(slice.actions.getOrderList(response.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export function getOrderListByAdmin() {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/v1.0/packages`);
            console.log('responese', response);
            dispatch(slice.actions.getOrderList(response.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export function getOrderDetail(orderId) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/v1.0/packages/${orderId}`);
            console.log('responese', response);

            if (response.status === 200) {
                dispatch(slice.actions.getOrderDetail(response.data.data))
            }
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
export function createOrder(values, callback) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.post(`/api/v1.0/packages`, values);
            if (response.data.status === 200) {
                dispatch(slice.actions.createOrder(response.data.data));
                callback({ isError: response.data.success })
            }
        } catch (error) {
            callback(error.response.data)
            dispatch(slice.actions.hasError(error));
        }
    }
}
export function approvedPackages(id, callback) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.put(`/api/v1.0/packages/approve?packageId?=${id}`);
            // dispatch(slice.actions.createOrder(response.data.data));
            callback({ response: response.data })
        } catch (error) {
            callback(error.response.data)
            dispatch(slice.actions.hasError(error));
        }
    }
}
export function rejectPackages(id, callback) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.put(`/api/v1.0/packages/reject?packageId?=${id}`);
            // dispatch(slice.actions.createOrder(response.data.data));
            callback({ response: response.data })
        } catch (error) {
            callback(error.response.data)
            dispatch(slice.actions.hasError(error));
        }
    }
}
// export function createOrder(values, callback) {
//     return async (dispatch) => {
//         dispatch(slice.actions.startLoading());
//         try {
//             const response = await axios.post(`/api/v1.0/packages`, values);
//             if (response.data.status === 200) {
//                 dispatch(slice.actions.createOrder(response.data.data));
//                 callback({ IsError: response.data.success })
//             }
//         } catch (error) {
//             callback(error.response.data)
//             dispatch(slice.actions.hasError(error));
//         }
//     }
// }

// ----------------------------------------------------------------------

