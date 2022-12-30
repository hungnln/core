import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
// material
import { Stack, Button, Divider, Typography, IconButton } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function AuthFirebaseSocials() {
  const { loginWithGoogle, loginWithFaceBook, loginWithTwitter } = useAuth();

  const handleLoginGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginFaceBook = async () => {
    try {
      await loginWithFaceBook();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginTwitter = async () => {
    try {
      await loginWithTwitter();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Divider sx={{ my: 2.5, borderStyle: 'dotted' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
      <Stack direction="row" spacing={2} justifyContent='center'>
        <IconButton color="inherit" onClick={handleLoginGoogle}>
          <Icon icon={googleFill} color="#DF3E30" height={24} />
        </IconButton>

        <IconButton color="inherit" onClick={handleLoginFaceBook}>
          <Icon icon={facebookFill} color="#1877F2" height={24} />
        </IconButton>

        <IconButton color="inherit" onClick={handleLoginTwitter}>
          <Icon icon={twitterFill} color="#1C9CEA" height={24} />
        </IconButton>
      </Stack>


    </>
  );
}
