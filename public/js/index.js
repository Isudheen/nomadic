/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signUp } from './signup';
import { tourEdit } from './tourUpdate';
import { userEdit } from './userUpdate';
import { reviewEdit } from './reviewUpdate';
import { reviewPost } from './reviewCreate';
import { mobileOtpSend, mobileOtpLogin } from './otp';

//DOM elements
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const signUpForm = document.querySelector('.sign_up-form');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const editTourForm = document.querySelector('.form-tour-data');
const editUserForm = document.querySelector('.form-user-data-admin');
const editReviewForm = document.querySelector('.form-user-review-data');
const createReviewForm = document.querySelector('.form-user-review-create');
const otpSendForm = document.querySelector('.form-otp-send');
const otpVerifyLoginForm = document.querySelector('.form-otp-verify');
//values

//Delegation
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signUpForm)
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirm_password').value;
    signUp(name, email, mobile, password, passwordConfirm);
  });

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating....';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
if (editTourForm)
  editTourForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('tour-name').value;
    const price = document.getElementById('tour-price').value;
    const duration = document.getElementById('tour-duration').value;
    const difficulty = document.getElementById('tour-difficulty').value;
    const maxGroupSize = document.getElementById('tour-size').value;
    const summary = document.getElementById('tour-summary').value;
    const description = document.getElementById('tour-description').value;
    const slug = document.getElementById('tour-slug').value;
    const id = document.querySelector('.tour_id').textContent;
    tourEdit(
      name,
      price,
      duration,
      difficulty,
      maxGroupSize,
      summary,
      description,
      slug,
      id
    );
  });

if (editUserForm)
  editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const active = document.getElementById('user-active').value;
    const role = document.getElementById('user-role').value;
    const id = document.querySelector('.user_id').textContent;
    userEdit(name, email, active, role, id);
  });

if (editReviewForm)
  editReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = document.getElementById('user-review').value;
    const rating = document.getElementById('user-rating').value;
    const id = document.querySelector('.review_id').textContent;
    reviewEdit(review, rating, id);
  });

if (createReviewForm)
  createReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = document.getElementById('user_review_create').value;
    const rating = document.getElementById('user_rating_create').value;
    const tourId = document.querySelector('.tour_id_create').textContent;
    const userId = document.querySelector('.user_id_create').textContent;
    reviewPost(review, rating, tourId, userId);
  });

if (otpSendForm)
  otpSendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const mobile = document.getElementById('mobile').value;
    const action = document.querySelector('.otp-action');
    mobileOtpSend(mobile);
  });

if (otpVerifyLoginForm)
  otpVerifyLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const mobile = document.getElementById('mobile').value;
    const otp = document.getElementById('otp-verify').value;
    mobileOtpLogin(mobile, otp);
  });
