import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getOrderDetail, getOrderListByAdmin, getOrderListByShopId } from '../../../redux/slices/order';
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

// ----------------------------------------------------------------------

export default function OrderPreview() {
    const { themeStretch } = useSettings();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { id } = useParams();
    const { currentOrder } = useSelector((state) => state.order);
    const isEdit = pathname.includes('edit');
    // const currentOrder = orderList.find((order) => order.id === id);
    useEffect(() => {
        dispatch(getOrderDetail(id))
    }, [dispatch]);

    return (
        <Page title="Order: Create a new order | Minimal-UI">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading='Packages Detail'
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Order', href: PATH_DASHBOARD.order.root },
                        { name: id }
                    ]}
                />

                <OrderPreviewForm currentOrder={currentOrder} />
            </Container>
        </Page>
    );
}
