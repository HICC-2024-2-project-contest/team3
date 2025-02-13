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
  const email = input.email.value;
  input.email.message = '';
  if (!email.match(/[\w\d_-]+@[\w\d_-]+.[\w\d_-]+/)) {
    input.email.message = '이메일을 올바르게 입력해주세요';
    input.email.focus();
    return;
  }
  APIPostRequest('auth/request-email-verification', {
    email: input.email.value,
  })
    .catch((e) => {
      console.error(e);
    })
    .then((res) => {
      input.emailVerify.setAttribute('status', 'show');
      input.emailVerify.disabled = false;
      button.verifyEmail.setAttribute('status', 'show');
      button.verifyEmail.disabled = false;

      noty(
        '이메일 확인 코드가 전송되었습니다. <br>이메일 확인 코드를 입력해주세요.'
      );
      input.emailVerify.focus();
    });
});

button.verifyEmail.addEventListener('click', async () => {
  input.emailVerify.disabled = false;
  button.verifyEmail.disabled = false;

  APIPostRequest('auth/verify-email', {
    email: input.email.value,
    token: input.emailVerify.value,
  })
    .catch((e) => {
      console.error(e);
    })
    .then((res) => {
      input.username.disabled = false;
      input.password.disabled = false;
      button.register.disabled = false;
    });
});

button.register.addEventListener('click', async () => {
  APIPostRequest('user/register', {
    email: input.email.value,
    password: input.password.value,
    username: input.username.value,
    description: '신규 회원입니다.',
  })
    .catch((e) => {
      console.error(e);
    })
    .then((res) => {
      console.log(res);
    });
});
