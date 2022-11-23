/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signUp } from './signup';
import { tourEdit } from './tourUpdate';
import { userEdit } from './userUpdate';

//DOM elements
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const signUpForm = document.querySelector('.sign_up-form');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const editTour = document.querySelector('.form-tour-data');
const editUser = document.querySelector('.form-user-data-admin');

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
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirm_password').value;
    signUp(name, email, password, passwordConfirm);
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
if (editTour)
  editTour.addEventListener('submit', (e) => {
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

if (editUser)
  editUser.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const active = document.getElementById('user-active').value;
    const role = document.getElementById('user-role').value;
    const id = document.querySelector('.user_id').textContent;
    userEdit(name, email, active, role, id);
  });
