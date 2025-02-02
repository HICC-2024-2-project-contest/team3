import geoip from 'geoipasn';

export default function (options = {}, headerOptions = {}) {
  return function (req, res, next) {
    !req.p ? (req.p = {}) : null;

    req.client = {};

    // IP
    let ip = req.headers['cf-connecting-ip']
      ? req.headers['cf-connecting-ip']
      : req.headers['wn-connection-ip']
      ? req.headers['wn-connection-ip']
      : req.headers['x-forwarded-for']
      ? req.headers['x-forwarded-for'].split(',')[0]
      : req.socket.remoteAddress;
    ip = ip.substr(0, 7) == '::ffff:' ? ip.substr(7) : ip;
    req.client.ip = ip;

    req.client.geoip = geoip(ip);

    // user-agent
    const parsedUserAgent = parseAgent(req);
    req.client.agent = parsedUserAgent;

    // referer
    let origin = req.headers.origin;
    let referer = req.headers['referer'];
    let internalCORS = false;
    const allow = res?.getHeaders
      ? res.getHeaders()?.['access-control-allow-origin']
      : null;
    if (!referer) {
      referer = 'Direct';
    } else if (allow && allow == origin && referer.startsWith(allow)) {
      internalCORS = true;
    }

    req.client.origin = origin;
    req.client.referer = referer;
    //req.client.internalCORS = false;

    // is internal request
    if (
      req.client.agent.system != 'Unknown' &&
      req.client.agent.browser != 'Unknown'
    ) {
      //req.client.internalCORS = internalCORS;
    }

    // languages
    if (req.acceptsLanguages) {
      const lang = req.acceptsLanguages()[0];
      req.client.lang = lang;
    }

    next();
  };
}

function parseAgent(req) {
  const agent = req.headers['user-agent'];
  let browser;
  let system;

  if (!agent) {
    system = 'Unknown';
    browser = 'Unknown';
  } else {
    if (agent.indexOf('Windows') > -1) {
      system = 'Windows';
      if (/(Windows 11.0|Windows NT 11.0)/.test(agent)) {
        system = 'Windows 11';
      } else if (/(Windows 10.0|Windows NT 10.0)/.test(agent)) {
        system = 'Windows 10';
      } else if (/(Windows 8.1|Windows NT 6.3)/.test(agent)) {
        system = 'Windows 8.1';
      } else if (/(Windows 8|Windows NT 6.2)/.test(agent)) {
        system = 'Windows 8';
      } else if (/(Windows 7|Windows NT 6.1)/.test(agent)) {
        system = 'Windows 7';
      } else if (/Windows NT 6.0/.test(agent)) {
        system = 'Windows Vista';
      } else if (/(Windows XP|Windows NT 5.1)/.test(agent)) {
        system = 'Windows XP';
      } else if (/(Windows 98|Win98)/.test(agent)) {
        system = 'Windows 98';
      } else if (/(Windows 95|Win95)/.test(agent)) {
        system = 'Windows 95';
      }
    } else if (agent.indexOf('Macintosh') > -1) {
      system = 'Mac';
    } else if (agent.indexOf('iPhone') > -1) {
      system = 'iPhone';
    } else if (agent.indexOf('iPad') > -1) {
      system = 'iPad';
    } else if (agent.indexOf('iPad') > -1) {
      system = 'iPod';
    } else if (agent.indexOf('Android') > -1) {
      system = 'Android';
    } else if (agent.indexOf('Linux') > -1) {
      system = 'Linux';
    } else if (agent.indexOf('X11') > -1) {
      system = 'Unix';
    } else {
      system = 'Unknown';
    }

    if (agent.indexOf('Firefox') > -1) {
      browser = 'Firefox';
    } else if (agent.toLowerCase().indexOf('bot') > -1) {
      browser = 'Bot';
    } else if (agent.indexOf('Steam') > -1) {
      browser = 'Steam';
    } else if (agent.indexOf('Instagram') > -1) {
      browser = 'Instagram';
    } else if (
      agent.indexOf('KAKAOTALK') > -1 ||
      agent.indexOf('kakaotalk-scrap') > -1
    ) {
      browser = 'Kakaotalk';
    } else if (agent.indexOf('NAVER(inapp') > -1) {
      browser = 'Naver App';
    } else if (agent.indexOf('SamsungBrowser') > -1) {
      browser = 'Samsung Internet';
    } else if (agent.indexOf('Opera') > -1 || agent.indexOf('OPR') > -1) {
      browser = 'Opera';
    } else if (agent.indexOf('Trident') > -1 || agent.indexOf('MSIE') > -1) {
      browser = 'IE';
    } else if (agent.indexOf('Edg') > -1) {
      browser = 'Edge';
    } else if (agent.indexOf('Whale') > -1) {
      browser = 'Whale';
    } else if (agent.indexOf('Chrome') > -1) {
      browser = 'Chrome';
    } else if (agent.indexOf('Safari') > -1) {
      browser = 'Safari';
    } else {
      browser = 'Unknown';
    }
  }

  return {
    browser: browser,
    system: system,
    string: agent,
  };
}
