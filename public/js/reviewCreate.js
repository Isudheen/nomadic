/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const reviewPost = async (review, rating, tour, user) => {
  try {
    const url = `/api/v1/tours/${tour}/reviews`;
    await axios({
      method: 'POST',
      url,
      data: {
        review,
        rating,
        tour,
        user,
      },
    });
    showAlert('success', 'Review Created ✨✨');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
