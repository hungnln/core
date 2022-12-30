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
        const accessToken = localStorage.getItem(ACCESSTOKEN);
        const firebaseToken = localStorage.getItem(FIREBASETOKEN);
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const x = JSON.parse(atob(accessToken.split('.')[1]))
          const { id } = x
          const response = await axios.get(`/api/v1.0/accounts/${id}`);
          if (response.data.statusCode === 200) {
            const account = response.data.data;
            const { userName, status, role, infoUser, balance } = account
            if (role === userRole.admin) {
              console.log('login admin');
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
                    status
                  },
                  isInitialized: true
                }
              });
            } else {
              dispatch({
                type: 'INITIALIZE',
                payload: {
                  isAuthenticated: true,
                  user: {
                    id,
                    displayName: userName,
                    firstName: infoUser.firstName,
                    lastName: infoUser.lastName,
                    email: infoUser.email,
                    role,
                    photoURL: null,
                    phone: infoUser.phone,
                    routes: infoUser.routes,
                    balance,
                    status
                  },
                  isInitialized: true
                }
              })
            }
          }
        }
        else if (firebaseToken && isValidToken(firebaseToken)) {
          const response = await axios.post(`/api/v1.0/authorizes/firebase`, { token: firebaseToken })
          const account = response.data.data;
          const { id, infoUser, status, balance, role } = account;
          if (response.data.statusCode === 200) {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: {
                  id,
                  displayName: infoUser.userName,
                  firstName: infoUser.firstName,
                  lastName: infoUser.lastName,
                  email: infoUser.email,
                  role,
                  photoURL: null,
                  phone: infoUser.phone,
                  routes: infoUser.routes,
                  balance,
                  status
                },
                isInitialized: true
              }
            })
          }
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
            const { infoUser, status, balance, role } = account;
            dispatch({
              type: 'LOGINGOOGLE',
              payload: {
                user: {
                  id: infoUser.id,
                  displayName: infoUser.firstName + infoUser.lastName,
                  firstName: infoUser.firstName,
                  lastName: infoUser.lastName,
                  email: infoUser.email,
                  role,
                  photoURL: null,
                  phone: infoUser.phone,
                  routes: infoUser.routes,
                  balance,
                  status
                }
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
  const login = async (userName, password, callback) => {
    try {
      const response = await axios.post(`/api/v1.0/authorizes`, {
        userName,
        password
      });

      const { token, account } = response.data.data;
      const { id, infoUser, status, balance, role } = account;
      if (status === userStatus.active) {
        setSession(token);
        if (infoUser != null) {
          // Login bằng tài khoản người dùng
          dispatch({
            type: 'LOGIN',
            payload: {
              user: {
                id,
                displayName: userName,
                firstName: infoUser.firstName,
                lastName: infoUser.lastName,
                email: infoUser.email,
                role,
                photoURL: null,
                phone: infoUser.phone,
                routes: infoUser.routes,
                balance,
                status
              }
            }
          });
        } else {
          // Login bằng tài khoản admin
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
              }
            }
          });
        }

        enqueueSnackbar('Login success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });

      } else {
        // inactive user
        callback('Tài khoản tạm khóa')


      }

    } catch (error) {
      console.log(error);
      callback('Tên tài khoản hoặc mật khẩu không đúng')

    }
  };

  const register = async (values, callback) => {
    try {
      const response = await axios.post('/api/v1.0/shops/register', values);
      // const { accessToken, user } = response.data;
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
