import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getOrderDetail, getOrderListByAdmin } from '../../../redux/slices/order';
// routes

// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import OrderNewForm from '../../../components/_dashboard/order/OrderNewForm';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { token } from 'src/utils/axios';
import OrderPreviewForm from 'src/components/_dashboard/order/OrderPreviewForm';
import useAuth from 'src/hooks/useAuth';
import _ from 'lodash';
import LoadingScreen from 'src/components/LoadingScreen';

// ----------------------------------------------------------------------

export default function OrderPreview() {
    const { themeStretch } = useSettings();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const { currentOrder } = useSelector((state) => state.order);
    const isEdit = pathname.includes('edit');
    // const currentOrder = orderList.find((order) => order.id === id);
    useEffect(() => {
        dispatch(getOrderDetail(id))
    }, [dispatch]);
    useEffect(() => {
        const delay = setTimeout(() => {
            if (!_.isEmpty(currentOrder)) {
                setLoading(false);
            }

        }, 2000)
        return () => {
            clearTimeout(delay)
        }
    }, [currentOrder])

    useEffect(() => {
        const getDetail = setInterval(() => {
            dispatch(getOrderDetail(id))
        }, 10000);
        return () => clearTimeout(getDetail);
    }, [])
    return (
        <Page title="Package: Preview package | Ship Convenient">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                {loading ?
                    <LoadingScreen sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                    : (<>
                        <HeaderBreadcrumbs
                            heading='Package Detail'
                            links={[
                                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                                { name: 'Package', href: PATH_DASHBOARD.order.root },
                                { name: id }
                            ]}
                        />
                        <OrderPreviewForm currentOrder={currentOrder} />
                    </>)
                }


            </Container>
        </Page>
    );
}
