/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51MbL8EKH1cPkuYbBfSUzN9ecysdLfOw60Exz4FiGj0BDQwlzy1CLzenXnts5hat8stYyCTLuje8rcZXA6WqXrR6H00r0zFfRv1'
  );

  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    //console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
