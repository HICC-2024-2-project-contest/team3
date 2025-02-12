export default function responseHeaders(headers) {
  return function (req, res, next) {
    for (const key in headers) {
      const value = headers[key];

      // Array of Access-Control-Allow-Origin values
      if (key == 'Access-Control-Allow-Origin' && value instanceof Array) {
        if (value.includes(req.headers.origin)) {
          res.header('Access-Control-Allow-Origin', req.headers.origin);
        } else {
          res.header('Access-Control-Allow-Origin', null);
        }
      }
      // Normal
      else {
        res.header(key, value);
      }
    }
    next();
  };
}
