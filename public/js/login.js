/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    showAlert('success', 'Logged in successfully 😎');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};
// err.response.data.msg;
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    // location.reload(true); //to force a reload from server and not from the browser cache
    window.setTimeout(() => {
      location.assign('/login');
    }, 0);
  } catch (err) {
    showAlert('error');
  }
};
