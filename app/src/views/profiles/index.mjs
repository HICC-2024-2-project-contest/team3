import { APIGetRequest } from '/modules/request.mjs';

(async () => {
  const data = await APIGetRequest(`user/${pid}`).catch((e) => {
    throw e;
  });

  const user = data.user;

  document.querySelector('#profiles-index-name').innerHTML = user.username;
  document.querySelector(
    '#profiles-index-image'
  ).src = `https://www.gravatar.com/avatar/${await hash(
    'SHA-256',
    user.email
  )}?s=120&d=identicon`;
  document.querySelector('#profiles-profile-data').innerHTML =
    JSON.stringify(user);
})();

(async () => {
  const data = await APIGetRequest(`user/${pid}/followers`).catch((e) => {
    throw e;
  });

  console.log(data);
})();

document
  .querySelector('#profiles-button-profile')
  .setAttribute('selected', true);
