import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert, Typography, Autocomplete, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { MIconButton } from '../../@material-extend';
import Mapbox from 'src/components/_dashboard/map/Map';
import { values } from 'lodash';
import { PATH_AUTH, PATH_DASHBOARD } from 'src/routes/paths';
import { Navigate, useNavigate } from 'react-router';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from 'src/config';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import GoogleMaps from 'src/components/_dashboard/map/GoogleMaps';
import MuiPhoneNumber from 'material-ui-phone-number';
import { DialogAnimate } from 'src/components/animate';
import VerifyCode from 'src/pages/authentication/VerifyCode';
import { useDispatch } from 'react-redux';
import { registerUser } from 'src/redux/slices/user';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorState, setErrorState] = useState();
  const dispatch = useDispatch();
  const RegisterSchema = Yup.object().shape({
    displayName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    phoneNumber: Yup.string().length(12).required('Phone is required'),
    // address: Yup.string().required('Address is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    // longitude: Yup.number().required('Longlat is required'),
    // latitude: Yup.number().required('Longlat is required'),
    userName: Yup.string().required('User Name is required'),


  });
  const [isOpenModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '',
      email: '',
      phoneNumber: '',
      photoUrl: 'string',
      displayName: '',
      address: '',
      longitude: null,
      latitude: null,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        sessionStorage.setItem('user_register_information', JSON.stringify(values))
        // dispatch(registerUser(values))
        navigate(PATH_AUTH.verify)
        // await register(values, error => {
        //   setErrors({ afterSubmit: error.message })
        //   setErrorState(error)
        //   if (error.success) {
        //     enqueueSnackbar(error.message, { variant: 'success' });
        //     navigate(PATH_AUTH.login)
        //   }
        // });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
    }
  });
  const handleChangeLocation = useCallback((callback) => {
    const { lng, lat } = callback.geometry.location;
    const address = callback.formatted_address;
    formik.setFieldValue('longitude', lng);
    formik.setFieldValue('latitude', lat);
    formik.setFieldValue('address', address);


  })
  const handleChangePhoneNumber = (value) => {
    formik.setFieldValue('phoneNumber', value);
  }
  const handleCloseModal = () => {
    setOpenModal(!isOpenModal)
  }

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, handleChange } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
          <TextField
            fullWidth
            label="User Name"
            {...getFieldProps('userName')}
            error={Boolean(touched.userName && errors.userName)}
            helperText={touched.userName && errors.userName}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>


            <TextField
              fullWidth
              autoComplete='name'
              label="Display Name"
              {...getFieldProps('displayName')}
              error={Boolean(touched.displayName && errors.displayName)}
              helperText={touched.displayName && errors.displayName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Email"
            {...getFieldProps('email')}

            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}

            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          {/* <TextField
            fullWidth
            autoComplete="phone"
            type=""
            label="Phone Number"
            {...getFieldProps('phoneNumber')}

            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
          /> */}
          <MuiPhoneNumber label="Phone Number" {...getFieldProps('phoneNumber')} variant="outlined" defaultCountry='vn' onChange={handleChangePhoneNumber}
            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
          />
          {/* <Autocomplete
            fullWidth
            autoComplete="address"
            label="Address"
            name='address'
            {...getFieldProps('address')}

            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
          /> */}
          {/* <GoogleMaps onChangeLocation={handleChangeLocation} touched={touched} errors={errors} /> */}

          {/* {Boolean(touched.address) && (
            <Mapbox onChangeLocation={handleChangeLocation} />
          )
          }
          {Boolean(errors.longitude || errors.latitude) && (
            <Typography variant='caption' sx={{ color: 'error.main' }}>Please pick a destination</Typography>

          )} */}

          <LoadingButton id='sign-in-button' fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
          {/* <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
            <DialogTitle>Verify phone number</DialogTitle>

            <VerifyCode onCancel={handleCloseModal} registerAccount={values}/>
          </DialogAnimate> */}
        </Stack>
      </Form>
    </FormikProvider>
  );
}
