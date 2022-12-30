import { useEffect, useRef } from 'react';
// material
import { Card, Container } from '@mui/material';
// redux
import { useDispatch } from '../../redux/store';
import { getConversations, getContacts } from '../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ChatSidebar, ChatWindow } from '../../components/_dashboard/chat';
import { HttpTransportType, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  const { user } = useAuth();

  useEffect(() => {
    dispatch(getConversations());
    dispatch(getContacts());
  }, [dispatch]);


  // const connectHub = async () => {
  //   try {
  //     await hubConnection.current?.start();
  //     if (hubConnection.current?.state === HubConnectionState.Connected) {
  //       console.log('hello');

  //       await hubConnection.current?.invoke('RegisterUser', user?.id, user?.role);
  //       await hubConnection.current?.invoke('SendMessage', 'd5cfc6d5-8714-4205-a963-7b07ba70417c', 'hello', 'text')
  //     }
  //   } catch (error) {
  //     console.warn(error);
  //   }
  // };
  const sendMessage = () => {

  }

  return (
    <Page title="Chat | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Chat"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Chat' }]}
        />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <ChatSidebar />
          <ChatWindow />
        </Card>
      </Container>
    </Page>
  );
}
