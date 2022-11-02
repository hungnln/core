import { createContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { firebaseConfig } from 'src/config';
import { MIconButton } from 'src/components/@material-extend';
import { Icon } from '@mui/material';
import closeFill from '@iconify/icons-eva/close-fill';
import { useSnackbar } from 'notistack';
// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // const [demo, setDemo] = useState();
  const [state, dispatch] = useReducer(reducer, initialState);


  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       const accessToken = window.localStorage.getItem('accessToken');

  //       if (accessToken && isValidToken(accessToken)) {
  //         setSession(accessToken);

  //         const response = await axios.get('/api/account/my-account');
  //         const { user } = response.data;

  //         dispatch({
  //           type: 'INITIALIZE',
  //           payload: {
  //             isAuthenticated: true,
  //             user
  //           }
  //         });
  //       } else {
  //         dispatch({
  //           type: 'INITIALIZE',
  //           payload: {
  //             isAuthenticated: false,
  //             user: null
  //           }
  //         });
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       dispatch({
  //         type: 'INITIALIZE',
  //         payload: {
  //           isAuthenticated: false,
  //           user: null
  //         }
  //       });
  //     }
  //   };

  //   initialize();
  // }, []);
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        console.log("check admin token", accessToken);
        const firebaseToken = localStorage.getItem('firebaseToken')

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const x = JSON.parse(atob(accessToken.split('.')[1]))
          console.log("check admin token", x);
          if (x?.role === "Admin") {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: { role: 'Admin', displayName: 'Admin' }
              }
            });
          }
          else {
            console.log('check  firebase');
            // const response = await axios.get('/api/account/my-account');
            // const { user } = response.data;
            // const respone = await axios.post(`/api/login/firebase`, { headers: { Authorization: `Baerer ${firebaseToken}` } })
            const account = x;
            console.log(account, 'account');
            if (account) {
              dispatch({
                type: 'INITIALIZE',
                // xai tam
                payload: { isAuthenticated: true, user: { role: 'Shop', displayName: 'Shop' } }


                // payload: { isAuthenticated: true, user: { id: account.id, displayName: account.name, email: account.email, role: 'User', photoURL: account.imageURL }, isInitialized: true }
              })
            } else {
              localStorage.removeItem('firebaseToken')
              dispatch({
                type: 'INITIALIZE',
                payload: {
                  isAuthenticated: false,
                  user: null
                }
              });
            }

          }
        }

        // const response = await axios.post('/api/login/admin');

        else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);
  const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(async (token) => {
          localStorage.setItem('firebaseToken', token)
          setSession(token)
          const respone = await axios.post(`/api/login/firebase`)
          if (respone.data.statusCode === 200) {
            const { account } = respone.data.result
            dispatch({
              type: 'LOGINGOOGLE',
              payload: { user: { id: account.id, displayName: account.name, email: account.email, role: 'User', photoURL: account.imageURL } }
            });
          }

        })


      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated: false, user: null }
        });
      }
    })
  };
  const login = async (userName, password, isAdmin) => {
    const response = await axios.post(`/api/v1.0/authorizes?isShop=${!isAdmin}&isAdmin=${isAdmin}&isShipper=false`, {
      userName,
      password
    });
    console.log(response, 'test api');
    enqueueSnackbar('Login success', {
      variant: 'success',
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
    const { token, user } = response.data.data;

    setSession(token);
    dispatch({
      type: 'LOGIN',
      payload: {
        // user
        user: isAdmin ? { role: 'Admin', displayName: 'Admin' } : { role: 'Shop', displayName: 'Shop' }
      }
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  // const logout = async () => {
  //   setSession(null);
  //   dispatch({ type: 'LOGOUT' });
  // };
  const logout = async () => {
    console.log("logout");
    setSession(null);
    localStorage.removeItem('firebaseToken')
    await firebase.auth().signOut();
    dispatch({ type: 'LOGOUT' });
  };
  const resetPassword = () => { };

  const updateProfile = () => { };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
        loginWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
