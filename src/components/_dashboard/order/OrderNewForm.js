import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';

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

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

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
    <div>test</div>
  );
}
