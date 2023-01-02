import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
// import MuiPhoneNumber from 'material-ui-phone-number';
import { LoadingButton } from '@mui/lab';
import Mapbox from '../map/Map';
import { color } from '@mui/system';
import GoogleMaps from '../map/GoogleMaps';
import { useState } from 'react';

SenderAddressNewForm.propTypes = {
    isEdit: PropTypes.bool,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    currentAddress: PropTypes.object,
};
export default function SenderAddressNewForm({ activeStep, handleBack, isEdit, currentAddress, onChange, onComplete }) {
    const { enqueueSnackbar } = useSnackbar();
    const NewAddressSchema = Yup.object().shape({
        startAddress: Yup.string().required('Sender Address is required'),
        startLongitude: Yup.number().required(),
        startLatitude: Yup.number().required(),
    });
    const [checkSubmit, setCheckSubmit] = useState(false)
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            startAddress: currentAddress?.startAddress || '',
            startLongitude: currentAddress?.startLongitude || null,
            startLatitude: currentAddress?.startLatitude || null,
        },
        validationSchema: NewAddressSchema,
        onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
            try {
                console.log(values, 'check address values');

                onChange(values);
                onComplete()
                // enqueueSnackbar(!isEdit ? 'Add success' : 'Update success', { variant: 'success' });
                // navigate(PATH_DASHBOARD.order.list);
            } catch (error) {
                console.error(error);
                setSubmitting(false);
                setErrors(error);
            }
        }
    });
    const handleChangeLocation = (callback) => {
        const { longitude, latitude, name } = callback;
        console.log('check callback', longitude, latitude, name);
        if (name !== undefined) {
            formik.setFieldValue('startLongitude', longitude);
            formik.setFieldValue('startLatitude', latitude);
            formik.setFieldValue('startAddress', name);
        }



    }
    const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps, handleChange } = formik;
    console.log('value', values);
    const handleClickSubmit = () => {
        setCheckSubmit(true);
    }
    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack direction='column' spacing={3} sx={{ p: 3 }}>
                    {/* <TextField label="Customer Name" variant="outlined"  {...getFieldProps('receiverName')}
                        error={Boolean(touched.receiverName && errors.receiverName)}
                        helperText={touched.receiverName && errors.receiverName} /> */}
                    {/* <TextField label="Address" variant="outlined"  {...getFieldProps('startAddress')}
                        error={Boolean(touched.startAddress && errors.startAddress)}
                        helperText={touched.startAddress && errors.startAddress} /> */}
                    {/* <TextField label="Phone" variant="outlined"  {...getFieldProps('receiverPhone')}
                        error={Boolean(touched.receiverPhone && errors.receiverPhone)}
                        helperText={touched.receiverPhone && errors.receiverPhone} /> */}
                    {/* <MuiPhoneNumber
                        value={values.receiverPhone}
                        name="receiverPhone"
                        autoFormat
                        variant="outlined"
                        label="Phone Number"
                        data-cy="user-phone"
                        defaultCountry='vn'
                        {...getFieldProps('receiverPhone')}
                        onChange={(event, value) => setFieldValue('receiverPhone', value)}
                    /> */}
                    {/* <Mapbox currentAddress={{ address: values.startAddress, longitude: values.startLongitude, latitude: values.startLatitude }} onChangeLocation={handleChangeLocation} /> */}
                    {/* {Boolean(errors.startLatitude || errors.startLongitude) && (
                        <Typography variant='caption' sx={{ color: 'error.main' }}>Please pick a start</Typography>

                    )} */}
                    <GoogleMaps handleSubmit={handleSubmit} checkSubmit={checkSubmit} currentGeocoding={{ address: values.startAddress, longitude: values.startLongitude, latitude: values.startLatitude }} onChangeLocation={handleChangeLocation} touched={touched.startAddress} errors={errors.startAddress} />

                    <Stack direction='row' justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
                        {/* <Button size='medium' variant="contained" color='inherit' onClick={onCancel}>Close</Button> */}
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting} onClick={handleClickSubmit}>
                            {!isEdit ? 'Add Location' : 'Edit Location'}
                        </LoadingButton>
                    </Stack>
                </Stack>

            </Form>
        </FormikProvider >
    )
}