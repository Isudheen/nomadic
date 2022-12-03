/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async (
  name,
  email,
  mobile,
  password,
  passwordConfirm
) => {
  try {
    showAlert('success', 'Creating your new shiny✨ account');
    await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        mobile,
        password,
        passwordConfirm,
      },
    });

    showAlert('success', 'Account created successfully 😎');
    window.setTimeout(() => {
      location.assign(`/mobile-otp-verify/${mobile}`);
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.msg);
  }
};
