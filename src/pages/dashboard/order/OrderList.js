import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@mui/material/styles';
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Tab,
    Tabs
} from '@mui/material';
import useSettings from 'src/hooks/useSettings';
import { deleteOrder, getOrderListByAdmin, getOrderListByShopId } from 'src/redux/slices/order';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Scrollbar from 'src/components/Scrollbar';
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { OrderListHead, OrderListToolbar, OrderMoreMenu } from 'src/components/_dashboard/order/list';
import Label from 'src/components/Label';
import SearchNotFound from 'src/components/SearchNotFound';
import { useDispatch, useSelector } from 'src/redux/store';
import { token } from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
// redux

// routes

// hooks

// components


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'receiver', label: 'receiver', alignRight: false },
    { id: 'createAt', label: 'Created At', alignRight: false },
    { id: 'shipper', label: 'Shipper', alignRight: false },
    { id: 'priceShip', label: 'Price Ship', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' }
];
const ADMIN_TABLE_HEAD = [
    { id: 'shop', label: 'Shop', alignRight: false },
    { id: 'createAt', label: 'Created At', alignRight: false },
    { id: 'shipper', label: 'Shipper', alignRight: false },
    { id: 'priceShip', label: 'Price Ship', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' }
]

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_order) => _order.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function OrderList() {
    const { themeStretch } = useSettings();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { orderList } = useSelector((state) => state.order)
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { user } = useAuth();
    const isAdmin = user.role === 'Admin'

    useEffect(() => {
        if (isAdmin) {
            dispatch(getOrderListByAdmin())
        } else {
            const userId = localStorage.getItem('userId')
            dispatch(getOrderListByShopId(userId));
        }
    }, [dispatch]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = orderList.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const handleDeleteOrder = (orderId) => {
        dispatch(deleteOrder(orderId));
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

    const filteredOrders = applySortFilter(orderList, getComparator(order, orderBy), filterName);

    const isOrderNotFound = filteredOrders.length === 0;

    const [value, setValue] = useState('one');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Page title="Order: List | Minimal-UI">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Order List"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Order', href: PATH_DASHBOARD.order.root },
                        { name: 'List' }
                    ]}
                    action={
                        !isAdmin && (
                            <Button
                                variant="contained"
                                component={RouterLink}
                                to={PATH_DASHBOARD.order.newOrder}
                                startIcon={<Icon icon={plusFill} />}
                            >
                                New Order
                            </Button>
                        )
                    }
                />

                <Card>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        sx={{ px: 2 }}
                    >
                        <Tab value="one" icon={<Label sx={{ mr: 1 }}
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color='success'
                        >
                            {sentenceCase('20')}
                        </Label>} label='All'
                        />
                        <Tab value="two" icon={<Label sx={{ mr: 1 }}
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color='error'
                        >
                            {sentenceCase('19')}
                        </Label>} label='Fail'
                        />
                    </Tabs>
                    <OrderListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <OrderListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={isAdmin ? ADMIN_TABLE_HEAD : TABLE_HEAD}
                                    rowCount={orderList.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                // onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { id, destinationAddress,shopId, receiverName, receiverPhone, priceShip, createdAt, status, shipperId, note } = row;
                                        // const isItemSelected = selected.indexOf(name) !== -1;

                                        return (
                                            <TableRow
                                                hover
                                                key={id}
                                                tabIndex={-1}
                                            // role="checkbox"
                                            // selected={isItemSelected}
                                            // aria-checked={isItemSelected}
                                            >
                                                {/* <TableCell padding="checkbox">
                                                    <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                                                </TableCell> */}
                                                {isAdmin ? (
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Stack direction="column" spacing={1}>
                                                                <Typography variant="subtitle2" noWrap>
                                                                    {shopId}
                                                                </Typography>
                                                                {/* <Typography variant="body2" noWrap>
                                                                    {destinationAddress}
                                                                </Typography> */}
                                                            </Stack>
                                                        </Stack>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                                                            <Stack direction="column" spacing={1}>
                                                                <Typography variant="subtitle2" noWrap>
                                                                    {receiverName}
                                                                </Typography>
                                                                <Typography variant="body2" noWrap>
                                                                    {destinationAddress}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </TableCell>
                                                )}
                                                <TableCell align="left">{createdAt}</TableCell>
                                                <TableCell align="left">{shipperId || 'Not found'}</TableCell>

                                                <TableCell align="left">{priceShip}</TableCell>
                                                {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                                                <TableCell align="left">
                                                    <Label
                                                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                                        color={(status === 'banned' && 'error') || 'success'}
                                                    >
                                                        {sentenceCase(status)}
                                                    </Label>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <OrderMoreMenu onDelete={() => handleDeleteOrder(id)} orderId={id} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {isOrderNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={filterName} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={orderList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    );
}
