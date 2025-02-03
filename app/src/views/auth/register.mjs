import { APIPostRequest } from '/modules/request.mjs';

const input = {
  email: document.querySelector('#input-email'),
  emailVerify: document.querySelector('#input-email-verify-code'),
  username: document.querySelector('#input-username'),
  password: document.querySelector('#input-password'),
};
const button = {
  sendEmailVerifyCode: document.querySelector('#button-send-email-verify-code'),
  verifyEmail: document.querySelector('#button-verify-email'),
  register: document.querySelector('#button-register'),
};

button.sendEmailVerifyCode.addEventListener('click', async () => {
  APIPostRequest('auth/request-email-verification', {
    email: 'wnynya@gmail.com',
  });

  input.emailVerify.setAttribute('status', 'show');
  input.emailVerify.disabled = false;
  button.verifyEmail.setAttribute('status', 'show');
  button.verifyEmail.disabled = false;
});

button.verifyEmail.addEventListener('click', async () => {
  input.emailVerify.disabled = false;
  button.verifyEmail.disabled = false;
});

function register() {}
