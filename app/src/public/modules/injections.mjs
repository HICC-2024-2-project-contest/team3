/*

🥺 와니가ー 좋아하는ー 프론트ー 인젝션ー 🥵

＿人人人人人人人人人人人人人人人＿
＞　グローバルで「汚染」させる　＜
￣Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y^Y￣

*/

window.Math.rem = (n = 1) => {
  return n * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

function vh() {
  document.documentElement.style.setProperty(
    '--vh',
    window.innerHeight * 0.01 + 'px'
  );
}
window.addEventListener('resize', vh);
vh();

window.getCookie = (name) => {
  let cookies = document.cookie
    ? ((s) => {
        const o = {};
        for (const c of s.split(';')) {
          const v = c.split('=');
          o[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        }
        return o;
      })(document.cookie)
    : {};
  return cookies[name];
};

window.setCookie = (name, value, expire) => {
  var expires = '';
  if (expire) {
    var date = new Date();
    date.setTime(date.getTime() + expire);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

Date.prototype.toJSONLocal = (function () {
  function addZ(n) {
    return (n < 10 ? '0' : '') + n;
  }
  return function () {
    return (
      this.getFullYear() +
      '-' +
      addZ(this.getMonth() + 1) +
      '-' +
      addZ(this.getDate())
    );
  };
})();

window.hash = async (algo = 'SHA-512', message) => {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(algo, new TextEncoder().encode(message))
    ),
    (byte) => byte.toString(16).padStart(2, '0')
  ).join('');
};
