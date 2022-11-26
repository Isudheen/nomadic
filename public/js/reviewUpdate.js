/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const reviewEdit = async (review, rating, id) => {
  try {
    const url = `/api/v1/reviews/${id}`;
    await axios({
      method: 'PATCH',
      url,
      data: {
        review,
        rating,
      },
    });
    showAlert('success', 'Review Updated');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
