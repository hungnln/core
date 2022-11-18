export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
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
}
export const userRole = {
  admin: 'ADMIN',
  shipper: 'SHIPPER',
  shop: 'SHOP'
}
export const defaultId = '00000000-0000-0000-0000-000000000000'

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
