import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getOrderList } from '../../../redux/slices/order';
// routes

// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import OrderNewForm from '../../../components/_dashboard/order/OrderNewForm';
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function OrderCreate() {
    const { themeStretch } = useSettings();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { name } = useParams();
    const { orderList } = useSelector((state) => state.order);
    const isEdit = pathname.includes('edit');
    const currentOrder = orderList.find((order) => paramCase(order.name) === name);

    useEffect(() => {
        dispatch(getOrderList());
    }, [dispatch]);

    return (
        <Page title="Order: Create a new order | Minimal-UI">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Create a new order' : 'Edit order'}
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Order', href: PATH_DASHBOARD.order.root },
                        { name: !isEdit ? 'New order' : name }
                    ]}
                />

                <OrderNewForm isEdit={isEdit} currentOrder={currentOrder} />
            </Container>
        </Page>
    );
}
