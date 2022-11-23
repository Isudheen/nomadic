/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const userEdit = async (name, email, active, role, id) => {
  try {
    const url = `/api/v1/users/${id}`;
    console.log(name, email, active, role, id);
    await axios({
      method: 'PATCH',
      url,
      data: {
        name,
        email,
        active,
        role,
      },
    });
    showAlert('success', 'User Updated');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
