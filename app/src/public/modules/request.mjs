const baseUri = 'http://localhost:1337';

async function request(method = 'GET', path = '', contentType, data = {}) {
  const url = baseUri + '/api/v1/' + path;
  const options = {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };
  options.headers = {
    'Content-Type': contentType,
  };
  if (localStorage.accessToken) {
    options.headers.Authorization = `Bearer ${localStorage.accessToken}`;
  }
  if (!['GET', 'HEAD'].includes(method) && data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, options);
  if (200 <= res.status && res.status <= 299) {
    try {
      if (options.headers['Content-Type'] === 'text/plain') {
        return await res.text();
      } else if (options.headers['Content-Type'] === 'application/json') {
        return await res.json();
      } else {
        return await res.blob();
      }
    } catch (error) {
      return null;
    }
  } else if (res.status === 403) {
    return new Promise(async (resolve, reject) => {
      try {
        const json = await res.json();
        if (
          options.headers.Authorization &&
          json.messages[0].message === 'Token is invalid or expired'
        ) {
          refreshToken()
            .then(() => {
              resolve(request(method, path, contentType, data));
            })
            .catch(() => {
              delete localStorage.accessToken;
              delete localStorage.refreshToken;
              delete localStorage.booth;
              window.setCookie('booth', '', -10000);

              window.location.href = '/';
            });
        } else {
          reject(res);
        }
      } catch (error) {
        reject(error);
      }
    });
  } else if (res.status >= 500) {
    const serverError = await res.text();
    errorFrame(res, serverError);
    throw res;
  } else {
    throw res;
  }
}

function errorFrame(res, html) {
  const frame = document.createElement('div');
  frame.style.position = 'fixed';
  frame.style.top = '0';
  frame.style.left = '0';
  frame.style.width = '100vw';
  frame.style.height = '100vh';
  frame.style.display = 'flex';
  frame.style.flexDirection = 'column';
  frame.style.zIndex = '100000000';
  frame.style.padding = '1rem';
  frame.style.gap = '1rem';
  frame.style.background = 'red';

  const title = document.createElement('div');
  title.style.width = '100%';
  title.style.height = '2.5rem';
  title.style.display = 'flex';
  title.style.flexDirection = 'row';
  title.style.justifyContent = 'space-between';
  title.style.alignItems = 'center';
  frame.appendChild(title);

  const text = document.createElement('div');
  console.log(res);
  text.innerHTML = `${res.status} ${res.statusText}<br />${res.url}`;
  text.style.fontSize = '1rem';
  text.style.color = 'white';
  text.style.fontFamily = 'monospace';
  title.appendChild(text);

  const close = document.createElement('button');
  close.innerHTML = '닫기';
  close.setAttribute('second', '');
  close.addEventListener('click', () => {
    frame.remove();
  });
  title.appendChild(close);

  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = 'calc(100% - 3.5rem)';
  frame.appendChild(iframe);
  document.body.appendChild(frame);
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(html);
  iframe.contentWindow.document.close();
}

async function refreshToken() {
  return new Promise((resolve, reject) => {
    fetch(baseUri + '/api/auth/refresh/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        refresh: localStorage.refreshToken,
      }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          localStorage.accessToken = data.token.access;
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });
}

async function APIGetRequest(path) {
  return request('GET', path, 'application/json');
}

async function APIPostRequest(path, data) {
  return request('POST', path, 'application/json', data);
}

async function APIPatchRequest(path, data) {
  return request('PATCH', path, 'application/json', data);
}

async function APIDeleteRequest(path, data) {
  return request('DELETE', path, 'application/json', data);
}

export { APIGetRequest, APIPostRequest, APIPatchRequest, APIDeleteRequest };

export default request;
