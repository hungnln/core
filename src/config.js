export const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APPID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  apiKey: "AIzaSyAJ6Jg9HhW6lN4hEv6OUZ_0x0eyL2LHgRQ",
  authDomain: "v-leagues.firebaseapp.com",
  projectId: "v-leagues",
  storageBucket: "v-leagues.appspot.com",
  messagingSenderId: "883654767893",
  appId: "1:883654767893:web:a3f78c749302005ce2251c",
  measurementId: "G-4KBGV5R57T"
};
export const PackageStatus = {
  waiting: 'WAITING',
  approved: 'APPROVED',
  reject: 'REJECT',
  shipperPickup: 'SHIPPER_PICKUP',
  shipperCancel: 'SHIPPER_CANCEL',
  delivery: 'DELIVERY',
  delivered: 'DELIVERED',
  deliveryFailed: 'DELIVERY_FAILED',
  shopConfirmDelivered: 'SHOP_CONFIRM_DELIVERED',
  refundSuccess: 'REFUND_SUCCESS',
  refundFailed: 'REFUND_FAILED',
  notExist: 'NOT_EXIST',
  shopCancel: 'SHOP_CANCEL'
}
export const userRole = {
  admin: 'AMDIN',
  shipper: 'SHIPPER',
  shop: 'SHOP'
}
export const DOMAIN = 'https://ship-convenient.azurewebsites.net'
export const ACCESSTOKEN = 'accessToken'
export const FIREBASETOKEN = 'firebaseToken'
export const userStatus = {
  active: 'ACTIVE',
}
export const defaultId = '00000000-0000-0000-0000-000000000000'
export const GOOGLE_MAPS_API_KEY = 'AIzaSyDyiGQYQgykVRVpeqCWXtqn5l4At9vGp04'

export const cognitoConfig = {
  userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID
};

export const auth0Config = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN
};

export const mapConfig = process.env.REACT_APP_MAP_MAPBOX;

export const googleAnalyticsConfig = process.env.REACT_APP_GA_MEASUREMENT_ID;
