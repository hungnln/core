import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { Field, FieldArray, Form, FormikProvider, useFormik } from 'formik';
// material
import { DateTimePicker, DesktopDatePicker, LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Paper, Divider, Button, InputAdornment, IconButton, DialogTitle, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Avatar } from '@mui/material';
// utils
import { fCurrency, fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from 'src/components/Label';
import { UploadAvatar } from '../../upload';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Icon } from '@iconify/react';
import { DialogAnimate } from 'src/components/animate';
import AddressNewForm from './AddressNewForm';
import { useDispatch, useSelector } from 'react-redux';
import { getShopbyId } from 'src/redux/slices/shop';
import product from 'src/redux/slices/product';
import { approvedPackages, cancelPackage, confirmDeliverySuccess, createOrder, getOrderDetail, rejectPackages } from 'src/redux/slices/order';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import { sentenceCase } from 'change-case';
import { format } from 'date-fns';
import { PackageStatus, userRole } from 'src/config';
import useAuth from 'src/hooks/useAuth';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';
// ----------------------------------------------------------------------

OrderPreviewForm.propTypes = {
  currentOrder: PropTypes.object
};

export default function OrderPreviewForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState()
  const theme = useTheme();
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar();
  const { currentOrder } = useSelector(state => state.order)
  const { user } = useAuth();
  const [isOpenModal, setOpenModal] = useState(false)
  const isAdmin = user.role === userRole.admin
  const { startAddress, sender, senderId, deliver, deliverId, destinationAddress, receiverName, receiverPhone, createdAt, status, products, priceShip, note, volume, weight, distance } = currentOrder;
  function subtotal(items) {
    return items?.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }
  const packagesSubtotal = subtotal(products);
  useEffect(() => {
    dispatch(getOrderDetail(id))
  }, [dispatch])
  const handleMessage = (object) => {
    if (!_.isEmpty(object)) {
      const { response } = object;
      enqueueSnackbar(response.message, { variant: response.success ? 'success' : 'error' })
    }
  }
  const handleCloseModal = () => {
    setOpenModal(!isOpenModal);
  };
  return (
    <>
      <Stack direction='row' justifyContent="space-between" spacing={2} sx={{ mb: 5 }}>
        {/* List icon ????? shop crud  */}
        <Box>
          {!isAdmin && (
            <Stack direction='row'>
              <IconButton color="primary" sx={{ py: 1 }}>
                <EditIcon />
              </IconButton>
              <IconButton color="primary" sx={{ py: 1 }}>
                <VisibilityIcon />
              </IconButton>
              <IconButton color="primary" sx={{ py: 1 }}>
                <PrintIcon />
              </IconButton>
            </Stack>
          )}
        </Box>
        {/* ----------end list icon---------- */}



        <Stack direction='row' spacing={2}>
          {/* 2 N??t Reject & Approved cho Admin khi ????n h??ng ??c shop t???o */}
          {status === PackageStatus.waiting && isAdmin && (
            <>
              <Button size='large' variant="outlined" color='error' onClick={() => { dispatch(rejectPackages(id, callback => handleMessage(callback))) }} >Reject</Button>
              <LoadingButton type="submit" variant="contained" onClick={() => { dispatch(approvedPackages(id, callback => handleMessage(callback))) }}>
                Approved
              </LoadingButton>
            </>
          )}

          {/* --------------end--------------- */}


          {/* Shop confirm ????n h??ng ??c giao th??nh c??ng  */}
          {status === PackageStatus.delivered && !isAdmin && (
            <LoadingButton type="submit" variant="contained" onClick={() => { dispatch(confirmDeliverySuccess(id, callback => handleMessage(callback))) }}>
              Confirm
            </LoadingButton>
          )}
          {/* ---------------end------------------ */}

          {/* Shop cancel ????n h??ng  */}
          {(status === PackageStatus.approved || status === PackageStatus.deliverPickup || status === PackageStatus.waiting) && !isAdmin && (
            <LoadingButton color='error' type="submit" variant="contained" onClick={() => { dispatch(cancelPackage(id, callback => handleMessage(callback))) }}>
              Cancel
            </LoadingButton>
          )}
          {/* ---------------end------------------ */}

        </Stack>






      </Stack>
      <Paper elevation={0} variant="outlined" sx={{ p: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} mb={5}>
            Logo
          </Grid>
          <Grid item xs={6} mb={5} sx={{ textAlign: 'right' }}>
            <Button onClick={handleCloseModal}
              variant='contained'
              color={(status === PackageStatus.deliveryFailed || status === PackageStatus.reject || status === PackageStatus.senderCancel && 'error') || (status === PackageStatus.waiting && 'warning') || 'success'}

              sx={{ mb: 1 }}
            >
              {_.upperCase(status)}
            </Button>
            <Typography variant='h6'>{id}</Typography>
          </Grid>
          <Grid item xs={6} mb={5}>
            <Typography variant='overline' sx={{ color: 'text.secondary', mb: 2 }}>PACKAGES FROM</Typography>
            <Typography variant='body2'>{sender?.infoUser.lastName} {sender?.infoUser.firstName}</Typography>
            <Typography variant='body2'>{startAddress}</Typography>
            <Typography variant='body2'>Phone : {sender?.infoUser.phone}</Typography>
          </Grid>
          <Grid item xs={6} mb={5}>
            <Typography variant='overline' sx={{ color: 'text.secondary', mb: 2 }}>PACKAGES To</Typography>
            <Typography variant='body2'>{receiverName}</Typography>
            <Typography variant='body2'>{destinationAddress}</Typography>
            <Typography variant='body2'>Phone : {receiverPhone}</Typography>

          </Grid>
          <Grid item xs={6} mb={5}>
            <Typography variant='overline' sx={{ color: 'text.secondary', mb: 2 }}>DATE CREATE </Typography>
            <Typography variant='body2'>{moment.utc(createdAt).utcOffset(7).format('DD-MM-YYYY HH:mm')}</Typography>

          </Grid>
          <Grid item xs={6} mb={5}>
            <Typography variant='overline' sx={{ color: 'text.secondary', mb: 2 }}>More </Typography>
            <Typography variant='body2'>Volume: {volume}</Typography>
            <Typography variant='body2'>Weight: {weight}</Typography>
            <Typography variant='body2'>Distance: {distance}</Typography>

          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.map((row, index) => (
                <TableRow
                  size='medium'
                  key={row.index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                  <TableCell align="right">{fCurrency(row.price)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={2} />
                <TableCell align="right"><Typography variant='body1'>Subtotal</Typography></TableCell>
                <TableCell align="right"><Typography variant='body1'>{fCurrency(packagesSubtotal)}</Typography></TableCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={2} />
                <TableCell align="right"><Typography variant='body1'>Ship</Typography></TableCell>
                <TableCell align="right"><Typography variant='body1'>{fCurrency(priceShip)}</Typography></TableCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={2} />
                <TableCell align="right"><Typography variant='h5'>Total</Typography></TableCell>
                <TableCell align="right"><Typography variant='h5'>{fCurrency(packagesSubtotal + priceShip)}</Typography></TableCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {/* <TableCell colSpan={2} /> */}
                <TableCell align="left" colSpan={3}>
                  <Typography variant='subtitle2'>Note</Typography>
                  <Typography variant='subtitle2'>{note}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>




        {/* <Box sx={{ p: 3 }}>
          <Typography variant='h6' sx={{ color: 'text.secondary', mb: 3 }}>Details:</Typography>

          <FieldArray name="products">

            {({ insert, remove, push }) => (
              <Stack direction="column" divider={<Divider orientation="horizontal" flexItem sx={{ my: 3, borderStyle: 'dashed' }} />} >
                {values.products.length > 0 && values.products.map((product, index) => {
                  const name = `products[${index}].name`;
                  const description = `products[${index}].description`;
                  const price = `products[${index}].price`;



                  return (
                    <Stack direction="row" spacing={3} justifyContent="flex-end" key={index}>

                      <TextField size='small' label="Name" variant="outlined" value={product.name} onChange={handleChange} name={name}
                        error={Boolean(touched?.products?.[index]?.name && errors?.products?.[index]?.name)}
                        helperText={touched?.products?.[index]?.name && errors?.products?.[index]?.name}

                      />
                      <TextField size='small' label="Description" variant="outlined" value={product.description} onChange={handleChange} name={description}
                        error={Boolean(touched?.products?.[index]?.description && errors?.products?.[index]?.description)}
                        helperText={touched?.products?.[index]?.description && errors?.products?.[index]?.description} />
                      <TextField size='small' type='number' label="Price" variant="outlined" sx={{ width: '130px' }} value={product.price} name={price} onChange={handleChange}
                        error={Boolean(touched?.products?.[index]?.price && errors?.products?.[index]?.price)}
                        helperText={touched?.products?.[index]?.price && errors?.products?.[index]?.price}
                        InputProps={{
                          shrink: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              $
                            </InputAdornment>
                          )
                        }} />

                      <Button onClick={() => remove(index)} variant="text" size='small' color="error" startIcon={<DeleteOutlinedIcon />}>Remove</Button>
                    </Stack>
                  )
                }
                )}
                <Box>
                  <TextField fullWidth multiline label="Note" variant="outlined" rows={4}  {...getFieldProps('note')} />

                </Box>
                <Stack justifyContent='space-between' direction={{ xs: 'column', md: 'row' }}>
                  <Box>
                    <Button onClick={() => push({ name: '', description: '', price: '' })} variant="text" size='small' startIcon={<AddOutlinedIcon />}>Add item</Button>
                  </Box>
                  <Box sx={{ width: '30%' }}>
                    <Stack direction='column' justifyContent='space-between'>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography variant='body1' sx={{ color: 'text.secondary' }} >Subtotal: </Typography>
                        <Typography variant='body1' sx={{ color: 'text.secondary' }} >${subTotal || 0}</Typography>

                      </Stack >
                      <Stack direction='row' v sx={{ mt: 0.5, mb: 1 }}>
                        <Typography variant='body1' sx={{ color: 'text.secondary' }} >Ship: </Typography>
                        <Typography variant='body1' sx={{ color: 'text.secondary' }} >${values.priceShip}</Typography>
                      </Stack>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography variant='h6'  >Total: </Typography>
                        <Typography variant='h6'  >${Number(subTotal + values.priceShip) || 0}</Typography>
                      </Stack>

                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            )}
          </FieldArray>
        </Box> */}

      </Paper >
      <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
        <DialogTitle>Deliver information</DialogTitle>
        {/* <AddressNewForm onCancel={handleCloseModal} currentAddress={values} onChange={handleChangeReceiverAddress} /> */}
        <Stack direction='column' spacing={3} sx={{ p: 3 }} justifyContent='center'>

          {deliver && (<>
            <Stack
              sx={{ my: 2 }}
              justifyContent="center"
              alignItems="center">
              <Avatar
                alt={deliver.userName}
                src={deliver.photoUrl}
                // src={shipper.photoUrl}
                sx={{ width: 100, height: 100 }}
              />
            </Stack>
            <Stack direction='row' justifyContent='space-between' spacing={1} sx={{ px: 4 }}>
              <Typography variant='body1'  >Display Name: </Typography>
              <Typography variant='h6' sx={{ color: 'text.secondary', ml: 1 }} >{deliver.infoUser.firstName} {deliver.infoUser.lastName} </Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between' spacing={1} sx={{ px: 4 }}>
              <Typography variant='body1'  >Email: </Typography>
              <Typography variant='h6' sx={{ color: 'text.secondary', ml: 1 }} >{deliver.infoUser.email} </Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between' spacing={1} sx={{ px: 4 }}>
              <Typography variant='body1'  >Phone Number: </Typography>
              <Typography variant='h6' sx={{ color: 'text.secondary', ml: 1 }} >{deliver.infoUser.phone} </Typography>
            </Stack>
          </>)}
          {!deliver && (
            <Stack direction='row' justifyContent='space-evenly' spacing={1} sx={{ p: 4 }}>
              <InfoIcon color='info' />
              <Typography variant='h6' sx={{ color: 'text.info', ml: 1 }} >Ch??a t??m th???y ng?????i d??ng ti???n ???????ng</Typography>
            </Stack>
          )}



        </Stack>
      </DialogAnimate>
    </>
  );
}
