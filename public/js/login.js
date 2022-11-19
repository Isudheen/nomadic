/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
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

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if ((res.data.status = 'success')) location.reload(true); //to force a reload from server and not from the browser cache
  } catch (err) {
    showAlert('error');
  }
};
