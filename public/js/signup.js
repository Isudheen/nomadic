/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    showAlert('success', 'Creating your new shiny✨ account');
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    showAlert('success', 'Account created successfully 😎');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};
