import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { async } from '@firebase/util';
import { PackageStatus } from 'src/config';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: false,
    orderList: {
        data: [],
        paginated: {
            pageIndex: 0,
            pageSize: 0,
            totalCount: 0,
            totalPage: 0
        }
    },
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
            const {data,paginated} = state.orderList
            const newTotalCount = paginated.totalCount + 1 || 1
            const newData = [...data, action.payload]
            const newOrderList = {
                data: newData,
                paginated: {
                    ...paginated,
                    totalCount: newTotalCount
                }
            };
            console.log('new list', newOrderList);
            // const newOrderList = [...state.orderList, action.payload];
            state.orderList = newOrderList;
        },
        changeCurrentPackageStatus(state, action) {
            state.isLoading = false;
            state.error = false;
            const newPackageStatus = action.payload;
            state.currentOrder = { ...state.currentOrder, status: newPackageStatus }
            const newPackageList = state.orderList.data.map(order => {
                if (order.id === state.currentOrder.id) {
                    return { ...order, status: newPackageStatus }
                }
                return order
            })
            state.orderList.data = newPackageList
        }



    }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteOrder } = slice.actions;

// ----------------------------------------------------------------------
export function getOrderListBySenderId(senderId, status, pageIndex, pageSize) {
    if (status) {
        return async (dispatch) => {
            dispatch(slice.actions.startLoading());
            try {
                const response = await axios.get(`/api/v1.0/packages?senderId=${senderId}&status=${status}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
                console.log('responese', response);
                dispatch(slice.actions.getOrderList(response.data));
            } catch (error) {
                dispatch(slice.actions.hasError(error));
            }
        };
    }
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/v1.0/packages?senderId=${senderId}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
            console.log('responese', response);
            dispatch(slice.actions.getOrderList(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export function getOrderListByAdmin(status, pageIndex, pageSize) {
    if (status) {
        return async (dispatch) => {
            dispatch(slice.actions.startLoading());
            try {
                const response = await axios.get(`/api/v1.0/packages?status=${status}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
                console.log('responese', response);
                dispatch(slice.actions.getOrderList(response.data));
            } catch (error) {
                dispatch(slice.actions.hasError(error));
            }
        };
    }
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/v1.0/packages?pageIndex=${pageIndex}&pageSize=${pageSize}`);
            console.log('responese', response);
            dispatch(slice.actions.getOrderList(response.data));
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
            console.log('check create', response);
            dispatch(slice.actions.createOrder(response.data.data));
            callback({ success: response.data.success, message: response.data.message })

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
            const response = await axios.put(`/api/v1.0/packages/approve?packageId=${id}`);
            callback({ response: response.data })
            dispatch(slice.actions.changeCurrentPackageStatus(PackageStatus.approved))
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
            const response = await axios.put(`/api/v1.0/packages/reject?packageId=${id}`);
            callback({ response: response.data })
            dispatch(slice.actions.changeCurrentPackageStatus(PackageStatus.reject))

        } catch (error) {
            callback(error.response.data)
            dispatch(slice.actions.hasError(error));
        }
    }
}
export function confirmDeliverySuccess(id, callback) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.put(`/api/v1.0/packages/sender-confirm-delivery-success?packageId=${id}`);
            callback({ response: response.data })
            dispatch(slice.actions.changeCurrentPackageStatus(PackageStatus.confirmDeliverySuccess))

        } catch (error) {
            callback(error.response.data)
            dispatch(slice.actions.hasError(error));
        }
    }
}
export function cancelPackage(id, callback) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.put(`/api/v1.0/packages/sender-cancel?packageId=${id}`);
            callback({ response: response.data })
            dispatch(slice.actions.changeCurrentPackageStatus(PackageStatus.senderCancel))

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

