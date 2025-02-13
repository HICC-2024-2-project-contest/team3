import { APIGetRequest, APIDeleteRequest } from '/modules/request.mjs';

function openNavCover() {
  document.querySelector('#nav-cover').setAttribute('status', 'open');
}
function closeNavCover() {
  document.querySelector('#nav-cover').setAttribute('status', 'close');
}
function openNavMenu() {
  document.querySelector('#nav-menu').setAttribute('status', 'open');
}
function closeNavMenu() {
  document.querySelector('#nav-menu').setAttribute('status', 'close');
}
function openNavAccount() {
  document.querySelector('#nav-account').setAttribute('status', 'open');
}
function closeNavAccount() {
  document.querySelector('#nav-account').setAttribute('status', 'close');
}

document
  .querySelector('#nav-button-menu-open')
  .addEventListener('click', (event) => {
    closeNavAccount();
    openNavMenu();
    openNavCover();
  });
document
  .querySelector('#nav-button-account-open')
  .addEventListener('click', (event) => {
    closeNavMenu();
    openNavAccount();
    openNavCover();
  });
document
  .querySelector('#nav-button-menu-close')
  .addEventListener('click', (event) => {
    closeNavMenu();
    closeNavCover();
  });
document
  .querySelector('#nav-button-account-close')
  .addEventListener('click', (event) => {
    closeNavAccount();
    closeNavCover();
  });
document.querySelector('#nav-cover').addEventListener('click', (event) => {
  closeNavMenu();
  closeNavAccount();
  closeNavCover();
});
document
  .querySelector('#nav-button-logout')
  .addEventListener('click', async (event) => {
    delete localStorage.userId;
    delete localStorage.accessToken;
    delete localStorage.refreshToken;
    delete localStorage.profileImage;

    window.location.href = '/';
  });

(async () => {
  if (localStorage.userId) {
    const res = await APIGetRequest(`user/${localStorage.userId}`);
    document.querySelector('#nav .right .login').style.display = 'none';

    document.querySelector('#nav-profile-image').src =
      localStorage.profileImage;
    document.querySelector('#nav-account-profile-image').src =
      localStorage.profileImage;
    document.querySelector('#nav-account-profile-main').innerHTML =
      res.user.username;
    document.querySelector('#nav-account-profile-sub').innerHTML =
      res.user.email;
    document.querySelector(
      '#nav-button-my-profile'
    ).href = `/profiles/${localStorage.userId}`;
    document.querySelector(
      '#nav-button-my-history'
    ).href = `/profiles/${localStorage.userId}/history`;
    document.querySelector(
      '#nav-button-my-workshop'
    ).href = `/profiles/${localStorage.userId}/workshop`;
  } else {
    document.querySelector('#nav .right .account').style.display = 'none';
  }
})();
