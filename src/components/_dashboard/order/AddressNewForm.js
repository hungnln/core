import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
// import MuiPhoneNumber from 'material-ui-phone-number';
import { LoadingButton } from '@mui/lab';
import Mapbox from '../map/Map';
import { color } from '@mui/system';

AddressNewForm.propTypes = {
    isEdit: PropTypes.bool,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    currentAddress: PropTypes.object,
};
export default function AddressNewForm({ isEdit, currentAddress, onCancel, onChange }) {
    const { enqueueSnackbar } = useSnackbar();
    const NewAddressSchema = Yup.object().shape({
        receiverName: Yup.string().required('Receiver Name is required'),
        destinationAddress: Yup.string().required('Receiver Address is required'),
        receiverPhone: Yup.string().required('Receiver Phone is required'),
        destinationLongitude: Yup.number().required('Receiver Phone is required'),
        destinationLatitude: Yup.number().required('Receiver Phone is required'),
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            receiverName: currentAddress?.receiverName || '',
            destinationAddress: currentAddress?.destinationAddress || '',
            receiverPhone: currentAddress?.receiverPhone || '',
            destinationLongitude: currentAddress?.destinationLongitude || null,
            destinationLatitude: currentAddress?.destinationLatitude || null,
        },
        validationSchema: NewAddressSchema,
        onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
            try {
                console.log(values, 'check address values');

                onChange(values);
                onCancel();
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
        const { lng, lat } = callback?.lngLat;
        formik.setFieldValue('destinationLongitude', lng)
        formik.setFieldValue('destinationLatitude', lat)
    }
    const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps, handleChange } = formik;
    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack direction='column' spacing={3} sx={{ p: 3 }}>
                    <TextField label="Customer Name" variant="outlined"  {...getFieldProps('receiverName')}
                        error={Boolean(touched.receiverName && errors.receiverName)}
                        helperText={touched.receiverName && errors.receiverName} />
                    <TextField label="Address" variant="outlined"  {...getFieldProps('destinationAddress')}
                        error={Boolean(touched.destinationAddress && errors.destinationAddress)}
                        helperText={touched.destinationAddress && errors.destinationAddress} />
                    <TextField label="Phone" variant="outlined"  {...getFieldProps('receiverPhone')}
                        error={Boolean(touched.receiverPhone && errors.receiverPhone)}
                        helperText={touched.receiverPhone && errors.receiverPhone} />
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
                    <Mapbox currentAddress={{ address: values.destinationAddress, longitude: values.destinationLongitude, latitude: values.destinationLatitude }} onChangeLocation={handleChangeLocation} />
                    {Boolean(errors.destinationLatitude || errors.destinationLongitude) && (
                        <Typography variant='caption' sx={{ color: 'error.main' }}>Please pick a destination</Typography>

                    )}
                    <Stack direction='row' justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
                        <Button size='medium' variant="contained" color='inherit' onClick={onCancel}>Close</Button>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            {!isEdit ? 'Add Location' : 'Edit Location'}
                        </LoadingButton>
                    </Stack>
                </Stack>

            </Form>
        </FormikProvider >
    )
}