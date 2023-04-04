/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './leaflet';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { newPost } from './postHandle';
import { uploadPhotos } from './gallery';

// DOM ELEMENTS

const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('form.form-user-data');
const userPasswordForm = document.querySelector('form.form-user-password');
const bookBtn = document.getElementById('book-tour');
const postContentEditor = document.getElementById('post-content-editor');
const postContentViewer = document.getElementById('post-content-viewer');
const photoForm = document.querySelector('form.form-uploadPhotos');

// DELEGATION
if (leaflet) {
  const locations = JSON.parse(leaflet.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  console.log('here')
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // VALUEs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (photoForm){
  console.log('here')
  photoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    const files = document.getElementById('imageUpload').files;
    for (let i = 0; i < files.length; i++) {
      form.append('photos', files[i]);
    }
    const il = document.getElementById('imageLabel');
    form.append('type', il.options[il.selectedIndex].text );
    uploadPhotos(form);
  });
}
  

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn-save-password').textContent = 'Save password';
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

if(postContentEditor){
  const postForm = document.querySelector('form.form-post');
  var simplemde = new EasyMDE(postContentEditor);
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // VALUEs
    const form = new FormData();
    const slug = document.getElementById('post-slug');
    if(slug)
      form.append('slug', slug.value);
    form.append('title', document.getElementById('post-title').value);
    const imageCover = document.getElementById('image-input').files[0];
    if(imageCover)
      form.append('imageCover', imageCover);
    form.append('content', simplemde.value());

    for (let [name, value] of form) {
      console.log(`${name} = ${value}`);
    }

    newPost(form);

  });
}

if(postContentViewer){
  var simplemde = new EasyMDE({
    element: postContentViewer, 
    toolbar: false,
    spellChecker: false,
    status: false,
    minHeight: '600px',

  });
  simplemde.togglePreview();
}
