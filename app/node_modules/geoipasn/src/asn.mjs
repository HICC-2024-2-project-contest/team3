import fs from 'fs';
import IP from '@amuject/ip';

import path from 'path';
import { fileURLToPath } from 'url';
const ___filename = fileURLToPath(import.meta.url);
const ___dirname = path.dirname(___filename);
const ip2as = JSON.parse(
  fs.readFileSync(path.resolve(___dirname, '../data/IPv4-ASN.json'))
);
const as2name = JSON.parse(
  fs.readFileSync(path.resolve(___dirname, '../data/ASN-name.json'))
);

/**
 * @async
 * @function query
 * @desc Get AS infrmation about ip address
 * @param {string} ip
 */
function query(ip) {
  if (typeof ip === 'string') {
    ip = new IP(ip);
  }

  let result = {
    ip: ip,
    number: null,
    name: '',
  };

  if (!ip2as || !as2name) {
    return result;
  }

  const [ip1, ip2] = ip.label.split(/\.(\d+\.\d+\.\d+)$/s);

  if (!ip1) {
    return result;
  }

  for (const ip2s in ip2as[ip1]) {
    if (ip.in(new IP(ip1 + '.' + ip2s))) {
      result.number = ip2as[ip1][ip2s];
      result.name = as2name[result.number];
      break;
    }
  }

  return result;
}

export default query;

export { query };
