import { APIGetRequest, APIPostRequest } from '/modules/request.mjs';

let user = {};
(async () => {
  user = (
    await APIGetRequest(`user/${pid}`).catch((e) => {
      throw e;
    })
  ).user;

  document.querySelector('#profiles-index-name').innerHTML = user.username;
  document.querySelector(
    '#profiles-index-image'
  ).src = `https://www.gravatar.com/avatar/${await hash(
    'SHA-256',
    user.email
  )}?s=120&d=identicon`;
  document.querySelector('#profiles-profile-data').innerHTML =
    JSON.stringify(user);

  const followers = (
    await APIGetRequest(`user/${localStorage.userId}/followers`).catch((e) => {
      throw e;
    })
  ).followers;

  const refinedFollowers = [];

  for (const f of Object.values(followers)) {
  }

  if (!followers.includes(user.userId)) {
    document
      .querySelector('#button-profiles-index-follow')
      .addEventListener('click', async () => {
        await APIPostRequest(`user/${pid}/follow`, {
          targetUserId: user.userId,
        }).catch((e) => {
          throw e;
        });
      });
  } else {
    ocument.querySelector('#button-profiles-index-follow').innerHTML =
      '언팔로우';
    document
      .querySelector('#button-profiles-index-follow')
      .addEventListener('click', async () => {
        await APIPostRequest(`user/${pid}/unfollow`, {
          targetUserId: user.userId,
        }).catch((e) => {
          throw e;
        });
      });
  }
})();

(async () => {
  const data = await APIGetRequest(`user/${pid}/followers`).catch((e) => {
    throw e;
  });

  console.log(data);
})();

(async () => {})();

document
  .querySelector('#profiles-button-profile')
  .setAttribute('selected', true);

document
  .querySelector('#button-profiles-index-block')
  .addEventListener('click', async () => {
    const data = await APIPostRequest(`user/${pid}/followers`).catch((e) => {
      throw e;
    });

    console.log(data);
  });

document
  .querySelector('#button-profiles-index-report')
  .addEventListener('click', async () => {
    const data = await APIPostRequest(`user/${pid}/followers`).catch((e) => {
      throw e;
    });

    console.log(data);
  });
