export default function (options = {}) {
  function parse(s) {
    const o = {};
    for (const c of s.split(';')) {
      const v = c.split('=');
      o[decodeURIComponent((v[0] ? v[0] : '').trim())] = decodeURIComponent(
        (v[1] ? v[1] : '').trim()
      );
    }
    return o;
  }

  return async function (req, res, next) {
    req.cookies = req?.headers?.cookie ? parse(req?.headers?.cookie) : {};
    next();
  };
}
