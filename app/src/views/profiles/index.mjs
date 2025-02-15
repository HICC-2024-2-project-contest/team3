import { APIGetRequest, APIPostRequest } from '/modules/request.mjs';

let user = {};
(async () => {
  if (pid === localStorage.userId) {
    document
      .querySelector('#profiles div.side .buttons')
      .setAttribute('myprofile', true);
  }

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
  )}?s=600&d=identicon`;

  const followers = (
    await APIGetRequest(`user/${localStorage.userId}/followers`).catch((e) => {
      throw e;
    })
  ).followers;

  const refinedFollowers = [];

  for (const f of Object.values(followers)) {
    if (f.followerId === localStorage.userId) {
      refinedFollowers.push(f.followingId);
    }
  }

  if (!refinedFollowers.includes(user.userId)) {
    document
      .querySelector('#button-profiles-index-follow')
      .addEventListener('click', async () => {
        await APIPostRequest(`user/${pid}/follow`, {
          targetUserId: user.userId,
        }).catch((e) => {
          throw e;
        });
        window.location.reload();
      });
  } else {
    document.querySelector('#button-profiles-index-follow').innerHTML =
      '언팔로우';
    document
      .querySelector('#button-profiles-index-follow')
      .addEventListener('click', async () => {
        await APIPostRequest(`user/${pid}/unfollow`, {
          targetUserId: user.userId,
        }).catch((e) => {
          throw e;
        });
        window.location.reload();
      });
  }

  const followers2 = (
    await APIGetRequest(`user/${user.userId}/followers`).catch((e) => {
      throw e;
    })
  ).followers;

  const refinedFollowers2 = [];
  const refinedFollowers3 = [];

  for (const f of Object.values(followers2)) {
    if (f.followingId === user.userId) {
      refinedFollowers2.push(f.followerId);
    }
    if (f.followerId === user.userId) {
      refinedFollowers3.push(f.followerId);
    }
  }

  document.querySelector(
    '#profiles-index-followers'
  ).innerHTML = `팔로워 ${refinedFollowers2.length}명 · 팔로잉 ${refinedFollowers3.length}명`;
})();

document
  .querySelector('#button-profiles-index-block')
  .addEventListener('click', async () => {
    if (confirm('정말로 이 사용자를 차단하시겠습니까?')) {
      alert('사용자가 차단되었습니다.');
      await APIPostRequest(`user/${pid}/unfollow`, {
        targetUserId: user.userId,
      }).catch((e) => {
        throw e;
      });
      window.location.reload();
    }
  });

document
  .querySelector('#button-profiles-index-report')
  .addEventListener('click', async () => {
    if (prompt('사용자 신고 사유를 입력하여 주십시오.')) {
      alert('사용자 신고가 접수되었습니다.');
    }
  });
