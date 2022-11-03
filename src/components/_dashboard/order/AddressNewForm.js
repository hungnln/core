import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Box, Stack, TextField } from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';
import { LoadingButton } from '@mui/lab';

export default function AddressNewForm({ isEdit, currentAddress }) {
    const { enqueueSnackbar } = useSnackbar();
    const NewAddressSchema = Yup.object().shape({

    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            customerName: '',
            address: '',
            phone: '',
        },
        validationSchema: NewAddressSchema,
        onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
            try {
                resetForm();
                setSubmitting(false);
                enqueueSnackbar(!isEdit ? 'Add success' : 'Update success', { variant: 'success' });
                // navigate(PATH_DASHBOARD.order.list);
            } catch (error) {
                console.error(error);
                setSubmitting(false);
                setErrors(error);
            }
        }
    });
    const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps, handleChange } = formik;
    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack direction='column' spacing={3} sx={{ p: 3 }}>
                    <TextField label="Customer Name" variant="outlined" value={values.customerName} {...getFieldProps('customerName')} />
                    <TextField label="Address" variant="outlined" value={values.address} {...getFieldProps('address')} />
                    {/* <TextField label="Phone" variant="outlined" value={values.phone} {...getFieldProps('phone')} /> */}
                    <MuiPhoneNumber
                        variant="outlined"
                        name="phone"
                        label="Phone Number"
                        data-cy="user-phone"
                        defaultCountry='vn'
                        value={values.phone}
                        {...getFieldProps('phone')}
                    />
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            {!isEdit ? 'Add Location' : 'Edit Location'}
                        </LoadingButton>
                    </Box>
                </Stack>

            </Form>
        </FormikProvider >
    )
}