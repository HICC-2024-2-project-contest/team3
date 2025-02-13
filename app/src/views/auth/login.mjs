import { APIGetRequest, APIPostRequest } from '/modules/request.mjs';

const input = {
  email: document.querySelector('#input-email'),
  password: document.querySelector('#input-password'),
};
const button = {
  login: document.querySelector('#button-login'),
};

button.login.addEventListener('click', login);
document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key === 'Enter') {
    login();
  }
});

function login() {
  if (!input.email.value) {
    input.email.focus();
    return;
  }

  if (!input.password.value) {
    input.password.focus();
    return;
  }

  APIPostRequest('user/login', {
    email: input.email.value,
    password: input.password.value,
  })
    .catch((e) => {
      console.error(e);
    })
    .then(async (res) => {
      localStorage.userId = res.userId;
      localStorage.accessToken = res.accessToken;
      localStorage.refreshToken = res.refreshToken;

      const data = await APIGetRequest(`user/${localStorage.userId}`);

      localStorage.profileImage = `https://www.gravatar.com/avatar/${await hash(
        'SHA-256',
        data.user.email
      )}?s=120&d=identicon`;

      noty('로그인 성공');

      window.location.href = '/';
    });
}

window.addEventListener('load', () => {
  input.email.focus();
});
