import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// material
import { Box, Divider, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import {
  addRecipients,
  onSendMessage,
  getConversation,
  getParticipants,
  markConversationAsRead,
  resetActiveConversation
} from '../../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import ChatHeaderCompose from './ChatHeaderCompose';
import { HttpTransportType, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const conversationSelector = (state) => {
  const { conversations, activeConversationId } = state.chat;
  const conversation = activeConversationId ? conversations.byId[activeConversationId] : null;
  if (conversation) {
    return conversation;
  }
  const initState = {
    id: '',
    messages: [],
    participants: [],
    unreadCount: 0,
    type: ''
  };
  return initState;
};

export default function ChatWindow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hubConnection = useRef(null);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { conversationKey } = useParams();
  const { contacts, recipients, participants, activeConversationId } = useSelector((state) => state.chat);
  const conversation = useSelector((state) => conversationSelector(state));

  const mode = conversationKey ? 'DETAIL' : 'COMPOSE';
  const displayParticipants = participants.filter((item) => item.id !== '8864c717-587d-472a-929a-8e5f298024da-0');
  const connectHub = async () => {
    try {
      await hubConnection.current?.start();
      if (hubConnection.current?.state === HubConnectionState.Connected) {
        console.log('hello');

        // await hubConnection.current?.invoke('RegisterUser', user?.id, user?.role);
        // await hubConnection.current?.invoke('SendMessage', 'd5cfc6d5-8714-4205-a963-7b07ba70417c', 'hello', 'text')
      }
    } catch (error) {
      console.warn(error);
    }
  };
  useEffect(() => {
    const getDetails = async () => {
      dispatch(getParticipants(conversationKey));
      try {
        await dispatch(getConversation(conversationKey));
      } catch (error) {
        console.error(error);
        navigate(PATH_DASHBOARD.chat.new);
      }
    };
    if (conversationKey) {
      getDetails();
    } else if (activeConversationId) {
      dispatch(resetActiveConversation());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  useEffect(() => {
    if (activeConversationId) {
      dispatch(markConversationAsRead(activeConversationId));
    }
  }, [dispatch, activeConversationId]);
  useEffect(() => {
    hubConnection.current = new HubConnectionBuilder().withUrl(`https://b86c-118-69-233-167.ap.ngrok.io/chat`, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    }).configureLogging(LogLevel.Information).build()
    hubConnection.current?.on('MessageReceive', (message) => console.log('message', message))
    connectHub()
  }, [])
  const handleAddRecipients = (recipients) => {
    dispatch(addRecipients(recipients));
  };
  const connect = async (value) => {
    const { message } = value
    try {
      if (hubConnection.current?.state === HubConnectionState.Connected) {
        await hubConnection.current?.invoke('SendMessage', 'd5cfc6d5-8714-4205-a963-7b07ba70417c', message, 'text')
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSendMessage = async (value) => {
    try {
      connect(value)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack sx={{ flexGrow: 1, minWidth: '1px' }}>
      {mode === 'DETAIL' ? (
        <ChatHeaderDetail participants={displayParticipants} />
      ) : (
        <ChatHeaderCompose
          recipients={recipients}
          contacts={Object.values(contacts.byId)}
          onAddRecipients={handleAddRecipients}
        />
      )}

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Stack sx={{ flexGrow: 1 }}>
          <ChatMessageList conversation={conversation} />

          <Divider />

          <ChatMessageInput
            conversationId={activeConversationId}
            onSend={handleSendMessage}
            disabled={pathname === PATH_DASHBOARD.chat.new}
          />
        </Stack>

        {mode === 'DETAIL' && <ChatRoom conversation={conversation} participants={displayParticipants} />}
      </Box>
    </Stack>
  );
}
