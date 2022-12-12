import { Icon } from '@iconify/react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Link, Container, Typography, Stack } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import { VerifyCodeForm } from '../../components/authentication/verify-code';
import { firebase } from 'src/contexts/JWTContext';
import { useEffect, useRef, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));
const window = {
  recaptchaVerifier: undefined
};
// ----------------------------------------------------------------------

export default function VerifyCode({ onCancel }) {
  const navigate = useNavigate()
  // const { sendSMSOTP } = useAuth()
  const [result, setResult] = useState();
  // const { registerUser } = useSelector(state => state.user)
  const registerUser = JSON.parse(sessionStorage.getItem('user_register_information'));
  const { phoneNumber } = registerUser || '';
  const [isShow, setShow] = useState(false);
  const [counter, setCounter] = useState(5);
  const countRef = useRef(null)
  const sendSMSOTP = () => {
    if (phoneNumber === '') return
    console.log(phoneNumber, 'phoneNumber');
    firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
      .then((result) => {
        console.log('result', result);
        setResult(result);
        delete window.recaptchaVerifier;
        // return firebase.auth.PhoneAuthProvider.credential(verificationId,
        //   verificationCode);
      })
      .catch((err) => {
        delete window.recaptchaVerifier;

        // window.recaptchaVerifier.clear();

      });


  }

  const handleResetCounter = () => {
    setCounter(5);
    setShow(false);
  }
  useEffect(() => {
    if (registerUser == null) {
      navigate(PATH_DASHBOARD.root)
    } else {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
          'size': 'invisible',
          'callback': (response) => {
            console.log('check response', response);

          }
        });
      }
      sendSMSOTP()
    }

    return () => {
      console.log('clear');
      delete window.recaptchaVerifier;
      sessionStorage.removeItem('user_register_information')
      // window.recaptchaVerifier.clear();

    }

  }, [])
  useEffect(() => {
    console.log(window.recaptchaVerifier, 'window.recaptchaVerifier');
  }, [window.recaptchaVerifier])
  useEffect(() => {
    countRef.current = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
      if (counter <= 0) {
        setShow(true)
        clearInterval(countRef.current)
      }

    }, 1000);
    return () => clearInterval(countRef.current)
  }, [counter]);


  return (
    <RootStyle title="Verify | Minimal UI">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Button
            size="small"
            component={RouterLink}
            to={PATH_AUTH.register}
            startIcon={<Icon icon={arrowIosBackFill} width={20} height={20} />}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Typography variant="h3" paragraph>
            Please check your phone!
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            We have send a 6-digit confirmation code to {phoneNumber}, please enter the code in below box to verify your
            phone number.
          </Typography>

          <Box sx={{ mt: 5, mb: 3 }}>
            <VerifyCodeForm onCancel={onCancel} OTPCode={result} registerUser={registerUser} />
          </Box>
          <Stack direction='row' alignItems='center' justifyContent='center'>
            <Typography variant="body2" align="center">

              Don’t have a code? &nbsp;


            </Typography>
            <Button variant="subtitle2" underline="none" id='sign-in-button' disabled={!isShow} onClick={handleResetCounter}>
              Resend code
            </Button>
          </Stack>

        </Box>
      </Container>
    </RootStyle>
  );
}
