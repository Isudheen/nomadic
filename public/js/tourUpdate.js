/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const tourEdit = async (
  name,
  price,
  duration,
  difficulty,
  maxGroupSize,
  summary,
  description,
  slug,
  id
) => {
  try {
    const url = `/api/v1/tours/${id}`;
    await axios({
      method: 'PATCH',
      url,
      data: {
        name,
        price,
        duration,
        difficulty,
        maxGroupSize,
        summary,
        description,
        slug,
      },
    });
    showAlert('success', 'Tour Updated');
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
