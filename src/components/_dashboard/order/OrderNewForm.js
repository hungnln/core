import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Field, FieldArray, Form, FormikProvider, useFormik } from 'formik';
// material
import { DateTimePicker, DesktopDatePicker, LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Paper, Divider, Button, InputAdornment, IconButton, DialogTitle } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
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
import { createOrder } from 'src/redux/slices/order';
import _ from 'lodash';
import useAuth from 'src/hooks/useAuth';
// ----------------------------------------------------------------------

OrderNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentOrder: PropTypes.object
};

export default function OrderNewForm({ isEdit, currentOrder }) {
  const shopId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { shop } = useSelector(state => state.shop)
  const { user } = useAuth();
  const [currentAddress, setCurrentAddress] = useState()
  const [isOpenModal, setOpenModal] = useState(false)
  const [errorState, setErrorState] = useState();
  const handleCloseModal = () => {
    setOpenModal(!isOpenModal);
  };
  const NewOrderSchema = Yup.object().shape({
    startAddress: Yup.string().required('Shop Address is required'),
    startLongitude: Yup.number().required('Shop startLongitude is required'),
    startLatitude: Yup.number().required('Shop startLatitude is required'),
    destinationAddress: Yup.mixed().required('Receiver destinationAddress is required'),
    destinationLongitude: Yup.number().required('Receiver destinationLongitude is required'),
    destinationLatitude: Yup.number().required('Receiver destinationLatitude is required'),
    receiverName: Yup.string().required('Receiver Name is required'),
    receiverPhone: Yup.string().required('Receiver phone is required'),
    distance: Yup.number().required('Shipping distance is required'),
    volume: Yup.number().required('Packages volume is required').moreThan(0, 'Volume must more than 0'),
    weight: Yup.number().required('Packages weight is required').moreThan(0, 'Weight must more than 0'),
    priceShip: Yup.number().required('Packages priceShip is required'),
    products: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Product name is required'),
        description: Yup.string().required('Product description is required'),
        price: Yup.number().required('Product price is required').moreThan(0, 'Price must more than 0')
      })
    ).required('Must have products')
  });

  useEffect(() => {
    dispatch(getShopbyId(shopId))
  }, [dispatch])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentOrder?.id || '',
      startAddress: currentOrder?.startAddress || shop.address,
      startLongitude: currentOrder?.startLongitude || shop.longitude,
      startLatitude: currentOrder?.startLatitude || shop.latitude,
      destinationAddress: currentOrder?.destinationAddress || '',
      destinationLongitude: currentOrder?.destinationLongitude || null,
      destinationLatitude: currentOrder?.destinationLatitude || null,
      receiverName: currentOrder?.receiverName || '',
      receiverPhone: currentOrder?.receiverPhone || '',
      distance: currentOrder?.distance || 100,
      volume: currentOrder?.volume || 0,
      weight: currentOrder?.weight || 0,
      status: currentOrder?.status || '',
      priceShip: currentOrder?.priceShip || 10000,
      photoUrl: currentOrder?.photoUrl || '',
      note: currentOrder?.note || '',
      shopId: currentOrder?.shopId || shopId,
      products: currentOrder?.products || [],
    },
    validationSchema: NewOrderSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (!isEdit) {
          dispatch(createOrder(values, (error) => setErrorState(error)))
        }
        // setSubmitting(false);
        // enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.order.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });
  useEffect(() => {
    console.log(errorState, 'check error create');
    if (!_.isEmpty(errorState)) {
      if (errorState.success) {
        formik.resetForm();
        enqueueSnackbar(errorState.message, { variant: 'success' });
        navigate(PATH_DASHBOARD.order.list);
      }
    }
  }, [errorState])
  const sumTotal = (products) => {
    if (!Array.isArray(products)) return 0;
    let sum = 0;
    products.forEach(product => {
      sum += product.price;
    });
    return sum;
  }
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps, handleChange } = formik;
  const subTotal = useMemo(() => sumTotal(values.products), [values])
  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const file = acceptedFiles[0];
  //     if (file) {
  //       setFieldValue('avatarUrl', {
  //         ...file,
  //         preview: URL.createObjectURL(file)
  //       });
  //     }
  //   },
  //   [setFieldValue]
  // );

  const handleChangeReceiverAddress = (callback) => {
    const newValues = { ...values, ...callback };
    formik.setValues(newValues)

  }
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Paper elevation={0} variant="outlined">
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3 }} divider={<Divider orientation="vertical" flexItem sx={{ ml: 5, xs: 'ml : 0' }} />} justifyContent="space-between">
            <Box sx={{ width: 1 }}>
              <Stack direction="column">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant='h6' sx={{ color: 'text.secondary' }}>From:</Typography>

                </Stack>
                <Typography variant='subtitle2'>{shop.displayName}</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1, mb: 0.5 }}>{values.startAddress}</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>{shop.phoneNumber}</Typography>
              </Stack>
            </Box>

            <Box sx={{ width: 1, ml: 5, xs: 'ml:0' }}>
              <Stack direction="column">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant='h6' sx={{ color: 'text.secondary' }}>To:</Typography>
                  <Button variant="text" size='small' startIcon={<EditLocationAltIcon />} onClick={handleCloseModal}>Change</Button>
                </Stack>
                {Boolean(errors.destinationAddress || errors.destinationLatitude || errors.destinationLongitude || errors.receiverName || errors.receiverPhone) && (
                  <Typography variant='caption' sx={{ color: 'error.main' }}>* Please fill receiver's information</Typography>
                )}
                <Typography variant='subtitle2' error={Boolean(touched.receiverName && errors.receiverName)}
                  helperText={touched.receiverName && errors.receiverName}>{values.receiverName}</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1, mb: 0.5 }}>{values.destinationAddress}</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>{values.receiverPhone}</Typography>
              </Stack>
            </Box>
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ p: 3 }} spacing={3}>
            {/* <TextField hidden label="Status" variant="outlined" value={values.status} /> */}
            <TextField type='number' label="Volume" variant="outlined" sx={{ width: '100px' }} {...getFieldProps('volume')} error={Boolean(touched.volume && errors.volume)}
              helperText={touched.volume && errors.volume}
              InputProps={{
                shrink: true,
              }} />
            <TextField type='number' label="Weight" variant="outlined" defaultValue="10" sx={{ width: '130px' }} {...getFieldProps('weight')}
              error={Boolean(touched.weight && errors.weight)}
              helperText={touched.weight && errors.weight}
              InputProps={{
                shrink: true,
                endAdornment: (
                  <InputAdornment position="end">
                    kg
                  </InputAdornment>
                )
              }} />



            {/* <DateTimePicker
              label="Create at"
              // value={value}
              // onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="Modified at"
              // value={value}
              // onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            /> */}
          </Stack>
          <Box sx={{ p: 3 }}>
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
                        <Stack direction='row' justifyContent='space-between' sx={{ mt: 0.5, mb: 1 }}>
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
          </Box>

        </Paper >
        {errorState?.isError ? enqueueSnackbar(errorState.Message, { variant: 'success' }) : ''}
        <Stack direction='row' justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          <Button size='large' variant="contained" color='inherit' >Clear</Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Create Order' : 'Save Changes'}
          </LoadingButton>
        </Stack>
        <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>Add address</DialogTitle>
          <AddressNewForm onCancel={handleCloseModal} currentAddress={values} onChange={handleChangeReceiverAddress} />
        </DialogAnimate>
      </Form>
    </FormikProvider >

  );
}
