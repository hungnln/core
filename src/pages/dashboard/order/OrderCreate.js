import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getOrderDetail } from '../../../redux/slices/order';
// routes

// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import OrderNewForm from '../../../components/_dashboard/order/OrderNewForm';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { token } from 'src/utils/axios';
import _ from 'lodash';
import LoadingScreen from 'src/components/LoadingScreen';

// ----------------------------------------------------------------------

export default function OrderCreate() {
    const { themeStretch } = useSettings();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { id } = useParams();
    const { currentOrder } = useSelector((state) => state.order);
    const [loading, setLoading] = useState(true);
    const isEdit = pathname.includes('edit');
    useEffect(() => {
        if (id) {
            dispatch(getOrderDetail(id))
        }
    }, [dispatch]);
    useEffect(() => {
        if (isEdit) {
            const delay = setTimeout(() => {
                if (!_.isEmpty(currentOrder) && currentOrder.id === id) {
                    setLoading(false)
                }

            }, 500)
            return () => {
                clearTimeout(delay)
            }
        }
        setLoading(false)
    }, [currentOrder])

    return (
        <Page title="Package: Create new package | Ship Convenient">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                {loading ?
                    <LoadingScreen sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                    : (
                        <>
                            <HeaderBreadcrumbs
                                heading={!isEdit ? 'Create new package' : 'Edit package'}
                                links={[
                                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                                    { name: 'Package', href: PATH_DASHBOARD.order.root },
                                    { name: !isEdit ? 'New package' : id }
                                ]}
                            />

                            <OrderNewForm isEdit={isEdit} currentOrder={isEdit ? currentOrder : {}} />
                        </>
                    )
                }
            </Container>
        </Page>
    );
}
