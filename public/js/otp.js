import axios from 'axios';
import { showAlert } from './alerts';

export const mobileOtpSend = async (mobile, action) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/mobileOtpSend',
      data: {
        mobile,
      },
    });

    showAlert('success', 'OTP Send Successfully');
    window.setTimeout(() => {
      location.assign(`/mobile-otp-verify/${mobile}`);
    }, 1000);
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.msg);
  }
};

export const mobileOtpLogin = async (mobile, otp) => {
  try {
    await axios({
      method: 'POST',
      url: '/api/v1/users/mobileOtpLogin',
      data: {
        mobile,
        otp,
      },
    });
    showAlert('success', 'OTP verification success 😎');
    window.setTimeout(() => {
      location.assign('/');
    }, 1000);
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.msg);
  }
};
