import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Field, FieldArray, Form, FormikProvider, useFormik } from 'formik';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { DateTimePicker, DesktopDatePicker, LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Paper, Divider, Button, InputAdornment, IconButton } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import { Icon } from '@iconify/react';
// ----------------------------------------------------------------------

OrderNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentOrder: PropTypes.object
};

export default function OrderNewForm({ isEdit, currentOrder }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewOrderSchema = Yup.object().shape({

  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      products: [
        {
          id: '',
          name: '',
          description: '',
          price: 0,
        },
      ]
    },
    validationSchema: NewOrderSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.order.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps, handleChange } = formik;

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
                  <Button variant="text" size='small' startIcon={<EditLocationAltIcon />}>Change</Button>
                </Stack>
                <Typography variant='subtitle2'>name</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1, mb: 0.5 }}>4642 Demetris Lane Suite 407 - Edmond, AZ / 60888</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>0939398000</Typography>
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
                  <Button variant="text" size='small' startIcon={<EditLocationAltIcon />}>Change</Button>
                </Stack>
                <Typography variant='subtitle2'>name</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1, mb: 0.5 }}>4642 Demetris Lane Suite 407 - Edmond, AZ / 60888</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>0939398000</Typography>
              </Stack>
            </Box>
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ p: 3 }} spacing={3}>
            <TextField disabled label="Pakage number" variant="outlined" defaultValue="232323-dsdsd-23sadasds-2sadsad" />
            <TextField label="Status" variant="outlined" defaultValue="Finding Shipper" />
            <TextField type='number' label="Volume" variant="outlined" defaultValue="1" sx={{ width: '100px' }}
              InputProps={{
                shrink: true,
              }} />
            <TextField type='number' label="Weight" variant="outlined" defaultValue="10" sx={{ width: '130px' }}
              InputProps={{
                shrink: true,
                endAdornment: (
                  <InputAdornment position="end">
                    kg
                  </InputAdornment>
                )
              }} />



            <DateTimePicker
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
            />
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

                        <TextField size='small' label="Name" variant="outlined" value={product.name} onChange={handleChange} name={name} />

                        <TextField size='small' label="Description" variant="outlined" value={product.description} onChange={handleChange} name={description} />

                        <TextField size='small' type='number' label="Price" variant="outlined" sx={{ width: '130px' }} value={product.price} name={price} onChange={handleChange}
                          InputProps={{
                            shrink: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            )
                          }} />

                        <Button onClick={() => remove(index)} variant="text" size='small' color="error" startIcon={<EditLocationAltIcon />}>Remove</Button>
                      </Stack>
                    )
                  }
                  )}
                  <Stack justifyContent='space-between' direction={{ xs: 'column', md: 'row' }}>
                    <Box>
                      <Button onClick={() => push({ name: '', description: '', price: 0 })} variant="text" size='small' startIcon={<EditLocationAltIcon />}>Add</Button>
                    </Box>
                    <Box sx={{ width: '30%' }}>
                      <Stack direction='column' justifyContent='space-between'>
                        <Stack direction='row' justifyContent='space-between'>
                          <Typography variant='body1' sx={{ color: 'text.secondary' }} >Subtotal: </Typography>
                          <Typography variant='body1' sx={{ color: 'text.secondary' }} >$350.05</Typography>

                        </Stack >
                        <Stack direction='row' justifyContent='space-between' sx={{ mt: 0.5, mb: 1 }}>
                          <Typography variant='body1' sx={{ color: 'text.secondary' }} >Ship: </Typography>
                          <Typography variant='body1' sx={{ color: 'text.secondary' }} >$1.05</Typography>
                        </Stack>
                        <Stack direction='row' justifyContent='space-between'>
                          <Typography variant='h6'  >Total: </Typography>
                          <Typography variant='h6'  >$500</Typography>
                        </Stack>

                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              )}
            </FieldArray>
          </Box>

        </Paper >
      </Form>
    </FormikProvider >
  );
}
