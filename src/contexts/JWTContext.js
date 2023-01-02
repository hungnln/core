import { createContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { ACCESSTOKEN, firebaseConfig, FIREBASETOKEN, userRole, userStatus } from 'src/config';
import { MIconButton } from 'src/components/@material-extend';
import { Icon } from '@mui/material';
import closeFill from '@iconify/icons-eva/close-fill';
import { useSnackbar } from 'notistack';
import user from 'src/redux/slices/user';
import { Navigate, useNavigate } from 'react-router';
import { PATH_AUTH, PATH_DASHBOARD } from 'src/routes/paths';
import { getApp, getApps, initializeApp } from "firebase/app";
import { browserPopupRedirectResolver, browserSessionPersistence, getAuth, initializeAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
firebase.auth().languageCode = 'it';

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
  sendSMSOTP: () => Promise.resolve(),
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem(ACCESSTOKEN);
        const firebaseToken = localStorage.getItem(FIREBASETOKEN);
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const x = JSON.parse(atob(accessToken.split('.')[1]))
          const { id } = x
          const response = await axios.get(`/api/v1.0/accounts/${id}`);

          const account = response.data.data;
          const { userName, status, role, infoUser, balance } = account
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: {
                id,
                displayName: userName,
                role,
                photoURL: null,
                balance,
                status,
                infoUser
              },
              isInitialized: true
            }
          });
          // if (role === userRole.admin) {
          //   console.log('login admin');
          //   dispatch({
          //     type: 'INITIALIZE',
          //     payload: {
          //       isAuthenticated: true,
          //       user: {
          //         id,
          //         displayName: userName,
          //         role,
          //         photoURL: null,
          //         balance,
          //         status,
          //         infoUser
          //       },
          //       isInitialized: true
          //     }
          //   });
          // } else {
          //   dispatch({
          //     type: 'INITIALIZE',
          //     payload: {
          //       isAuthenticated: true,
          //       user: {
          //         id,
          //         displayName: userName,           
          //         role,
          //         photoURL: null,                
          //         balance,
          //         status
          //       },
          //       isInitialized: true
          //     }
          //   })
          // }

        }
        else if (firebaseToken && isValidToken(firebaseToken)) {
          const response = await axios.post(`/api/v1.0/authorizes/firebase`, { token: firebaseToken })
          const account = response.data.data;
          const { id, infoUser, status, balance, role, userName } = account;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: {
                id,
                displayName: userName,
                role,
                photoURL: null,
                balance,
                status,
                infoUser
              },
              isInitialized: true
            }
          });
        }
        else {
          localStorage.removeItem(FIREBASETOKEN);
          localStorage.removeItem(ACCESSTOKEN);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        localStorage.removeItem(FIREBASETOKEN);
        localStorage.removeItem(ACCESSTOKEN);
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
          const respone = await axios.post(`/api/v1.0/authorizes/firebase`, { token })
          if (respone.data.statusCode === 200) {
            const { account } = respone.data.data
            const { infoUser, status, balance, role, userName, id } = account;
            dispatch({
              type: 'LOGINGOOGLE',
              payload: {
                user: {
                  id,
                  displayName: userName,
                  role,
                  photoURL: null,
                  balance,
                  status,
                  infoUser
                },
              }
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
  const sendSMSOTP = async (phoneNumber, callback) => {
    // console.log('send OTP 1');

    // const appVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    //   'size': 'invisible',
    //   'callback': (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.

    //   }
    // })
    // firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    //   .then((result) => {
    //     callback(result);
    //     // return firebase.auth.PhoneAuthProvider.credential(verificationId,
    //     //   verificationCode);
    //   })
    //   .catch((err) => {
    //     alert(err);
    //     appVerifier.reset()
    //   });
    // ;
  }

  const login = async (userName, password, callback) => {
    try {
      const response = await axios.post(`/api/v1.0/authorizes`, {
        userName,
        password
      });

      const { token, account } = response.data.data;
      const { id, infoUser, status, balance, role } = account;
      setSession(token);
      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            id,
            displayName: userName,
            role,
            photoURL: null,
            balance,
            status,
            infoUser
          }
        }
      });
      // enqueueSnackbar('Login success', {
      //   variant: 'success',
      //   action: (key) => (
      //     <MIconButton size="small" onClick={() => closeSnackbar(key)}>
      //       <Icon icon={closeFill} />
      //     </MIconButton>
      //   )
      // });
      enqueueSnackbar(response.data.message, { variant: 'success' })


    } catch (error) {
      console.log(error);
      callback('Tên tài khoản hoặc mật khẩu không đúng')

    }
  };


  const register = async (values, callback) => {
    try {
      console.log('check register', values);
      const response = await axios.post('/api/v1.0/accounts', values);
      const { accessToken, user } = response.data;
      callback(response.data)
      // window.localStorage.setItem('accessToken', accessToken);
    } catch (error) {
      callback(error.response.data)
    }
    // dispatch({
    //   type: 'REGISTER',
    //   payload: {
    //     user
    //   }
    // });
  };

  // const logout = async () => {
  //   setSession(null);
  //   dispatch({ type: 'LOGOUT' });
  // };
  const logout = async () => {
    console.log("logout");
    setSession(null);
    localStorage.removeItem('accessToken')
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
        sendSMSOTP,
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

export { AuthContext, AuthProvider, firebase };
