/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51M2AdzSE44uz4WeNbleyCecAqM5p7HECJrGRgQnmX6xl0ELqiqfX7maeG2eFigyWQlvH5si15SBzPuDBNqzRay2V00P0HP39nJ'
);
export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
