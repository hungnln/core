import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { OutlinedInput, FormHelperText, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// utils
import fakeRequest from '../../../utils/fakeRequest';
import useAuth from 'src/hooks/useAuth';
import { useState } from 'react';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

import { concat } from 'lodash';
import { useSelector } from 'react-redux';
import { async } from '@firebase/util';

// ----------------------------------------------------------------------

// eslint-disable-next-line consistent-return
function maxLength(object) {
  if (object.target.value.length > object.target.maxLength) {
    return (object.target.value = object.target.value.slice(0, object.target.maxLength));
  }
}

export default function VerifyCodeForm({ onCancel, OTPCode,registerUser }) {
  const navigate = useNavigate();
  // const { sendSMSOTP } = useAuth()
  const { enqueueSnackbar } = useSnackbar();
  const [errorState, setErrorState] = useState();
  const { register } = useAuth();
  const [check, setCheck] = useState(false)
  const isMountedRef = useIsMountedRef();
  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.number().required('Code is required'),
    code2: Yup.number().required('Code is required'),
    code3: Yup.number().required('Code is required'),
    code4: Yup.number().required('Code is required'),
    code5: Yup.number().required('Code is required'),
    code6: Yup.number().required('Code is required')
  });

  const formik = useFormik({
    initialValues: {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: ''
    },
    validationSchema: VerifyCodeSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const stringOTP = values.code1.toString() + values.code2.toString() + values.code3.toString() + values.code4.toString() + values.code5.toString() + values.code6.toString()
        validateOTP(stringOTP)  
      }
      catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
    }
  });
  const handleRegister = async () => {
    await register(registerUser, error => {
      // setErrors({ afterSubmit: error.message })
      // setErrorState(error)
      if (error.success) {
        enqueueSnackbar(error.message, { variant: 'success' });
        navigate(PATH_AUTH.login)
      } else {
        enqueueSnackbar(error.message, { variant: 'error' });
        navigate(PATH_AUTH.register)

      }
    });
  }
  const validateOTP = (otp) => {
    if (otp === null) return;
    OTPCode.confirm(otp).then((result) => {
      setCheck(true)
      console.log('otp true');
      handleRegister()
      sessionStorage.removeItem('user_register_information')
    })
      .catch((err) => {
        setCheck(false)
        enqueueSnackbar('Incorect code', { variant: 'error' });
      })
  }

  const { values, errors, isValid, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} justifyContent="center">
          {Object.keys(values).map((item) => (
            <OutlinedInput
              key={item}
              {...getFieldProps(item)}
              type="number"
              placeholder="-"
              onInput={maxLength}
              error={Boolean(touched[item] && errors[item])}
              inputProps={{
                maxLength: 1,
                sx: {
                  p: 0,
                  textAlign: 'center',
                  width: { xs: 36, sm: 56 },
                  height: { xs: 36, sm: 56 }
                }
              }}
            />
          ))}
        </Stack>

        <FormHelperText error={!isValid} style={{ textAlign: 'right' }}>
          {!isValid && 'Code is required'}
        </FormHelperText>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
          Verify
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
