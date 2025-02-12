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

async function init() {
  if (true) {
    document.querySelector('#nav .right .login').style.display = 'none';

    document.querySelector('#nav-profile-image').src;
    document.querySelector('#nav-account-profile-image').src;
    document.querySelector('#nav-account-profile-main').innerHTML =
      'ㅁㅈㄹㅈㅁㄹㅁㅈ';
    document.querySelector('#nav-account-profile-sub').innerHTML = 'ㅁㄴㅇㄴㅁ';
    document.querySelector('#nav-button-my-profile').href;
    document.querySelector('#nav-button-my-games').href;
  } else {
    document.querySelector('#nav .right .account').style.display = 'none';
  }
}

init();
