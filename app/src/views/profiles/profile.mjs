import { APIGetRequest } from '/modules/request.mjs';

async function init() {
  const data = await APIGetRequest(`user/${pid}`).catch((e) => {
    throw e;
  });

  const user = data.user;

  document.querySelector('#profiles-profile-data').innerHTML =
    JSON.stringify(user);
}

init();

document
  .querySelector('#profiles-button-profile')
  .setAttribute('selected', true);
