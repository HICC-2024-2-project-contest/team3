import {
  APIGetRequest,
  APIPostRequest,
  APIPutRequest,
} from '/modules/request.mjs';

const input = {
  username: document.querySelector('#input-username'),
  bio: document.querySelector('#input-bio'),
  email: document.querySelector('#input-email'),
};
const button = {
  save: document.querySelector('#button-save'),
};

(async () => {
  const data = await APIGetRequest(`user/${localStorage.userId}`);

  input.username.value = data.user.username;
  input.username.setAttribute('original', data.user.username);
  input.bio.value = data.user.description;
  input.bio.setAttribute('original', data.user.description);
  input.email.value = data.user.email;
  document.querySelector(
    '#settings-profile-image'
  ).src = `https://www.gravatar.com/avatar/${await hash(
    'SHA-256',
    data.user.email
  )}?s=360&d=identicon`;
})();

input.username.addEventListener('keyup', () => {
  updateInputs();
});
input.bio.addEventListener('keyup', () => {
  updateInputs();
});

function updateInputs() {
  let updated = false;
  let inputs = [input.username, input.bio];
  for (const i of inputs) {
    if (i.getAttribute('original') != i.value) {
      updated = true;
    }
  }

  button.save.disabled = !updated;
}

button.save.addEventListener('click', async () => {
  await APIPutRequest(`user/${localStorage.userId}`, {
    username: input.username.value,
    description: input.bio.value,
  }).catch((error) => {
    throw error;
  });

  noty('변경사항이 저장되었습니다.');

  setTimeout(() => {
    window.location.reload();
  }, 1000);
});
