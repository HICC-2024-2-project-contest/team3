import fs from 'fs';
import IP from '@amuject/ip';
import asn from './asn.mjs';
import geoip from 'geoip-lite';

import path from 'path';
import { fileURLToPath } from 'url';
const ___filename = fileURLToPath(import.meta.url);
const ___dirname = path.dirname(___filename);
const alpha2 = JSON.parse(
  fs.readFileSync(path.resolve(___dirname, '../data/ISO-3166-1-alpha-2.json'))
);
const regions = JSON.parse(
  fs.readFileSync(
    path.resolve(___dirname, '../data/ISO-3166-1-alpha-2-regions.json')
  )
);
const serviceRanges = JSON.parse(
  fs.readFileSync(path.resolve(___dirname, '../data/IPv4-service-ranges.json'))
);

/**
 * @async
 * @function query
 * @desc Get GeoIP infrmation about ip address
 * @param {string} ip
 */
function query(ip) {
  if (typeof ip === 'string') {
    ip = new IP(ip);
  }

  let result = {
    ip: ip,
    country: {
      code: 'XX',
      name: 'Unknown',
    },
    region: null,
    city: null,
    coordinate: {
      latitude: null,
      longtitude: null,
      range: null,
    },
    timezone: null,
    time: null,
    as: {
      number: null,
      name: null,
    },
    service: null,
  };

  const match =
    /^((?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(?:[\da-f]{4}\:[\da-f]{4}\:[\da-f]{4}\:[\da-f]{4}\:[\da-f]{4}\:[\da-f]{4}\:[\da-f]{4}\:[\da-f]{4}))?$/.exec(
      ip
    );
  if (!match) {
    return result;
  }

  result.service = getService(ip);
  let bogon = ip.getBogon();
  if (bogon) {
    result.country.name = bogon;
    result.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    result.time = new Date(
      new Date().toLocaleString('en-US', { timeZone: result.timezone })
    );
  }
  bogon ? (result.country.name = bogon) : null;

  let data = geoip.lookup(ip.label);
  if (!data) {
    return result;
  }

  result.country.code = data.country;
  result.country.name = alpha2[data?.country]
    ? alpha2[data.country]
    : data.country;
  result.region = regions?.[data?.country]?.[data?.region]
    ? regions[data.country][data.region]
    : data.region;
  result.city = data?.city ? data.city : '';
  result.coordinate.latitude = data?.ll[0] ? data.ll[0] : -1;
  result.coordinate.longtitude = data?.ll[1] ? data.ll[1] : -1;
  result.coordinate.range = data?.area ? data.area : -1;
  result.timezone = data?.timezone ? data.timezone : 'UTC';
  result.time = new Date(
    new Date().toLocaleString('en-US', { timeZone: result.timezone })
  );
  let asnData = asn(ip);
  delete asnData.ip;
  result.as = asnData;

  return result;
}

query.asn = asn;

function getService(ip) {
  for (const key in serviceRanges) {
    if (ip.in(new IP(key))) {
      return serviceRanges[key];
    }
  }
  return '';
}

export default query;

export { query };
