# GeoIPASN

GeoIP query tool with AS Number

GeoIP data from [geoip-lite](https://www.npmjs.com/package/geoip-lite) using [MaxMind's GeoLite2 database](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data)

ASN data from APNIC [(data-raw-table)](https://thyme.apnic.net/current/data-raw-table) [(data-used-autnums)](https://thyme.apnic.net/current/data-used-autnums)

Update GeoLite2 database to better results

```
cd node_modules/geoip-lite
npm run-script updatedb license_key=[KEY]
```

You can get free license key in [MaxMind](https://www.maxmind.com/en/accounts/current/license-key)

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
  - [GeoIP Info](#geoip-info)
  - [AS Number](#as-number)

## Installation

```
npm i geoipasn
```

## Usage

### GeoIP Info

ESM

```js
import geoip from 'geoipasn';

const data = geoip('12.34.56.78');
console.log(data);
```

CJS

```js
const geoip = require('geoipasn').default;

const data = geoip('12.34.56.78');
console.log(data);
```

<details><summary>Result</summary>

```js
{
  ip: IP { label: '12.34.56.78' },
  country: { code: 'US', name: 'United States of America' },
  region: 'Ohio',
  city: 'Dayton',
  coordinate: { latitude: 39.6438, longtitude: -84.1743, range: 5 },
  timezone: 'America/New_York',
  time: 2022-09-24T02:47:59.000Z,
  as: { number: 7018, name: 'ATT-INTERNET4' },
  service: ''
}
```

</details>

### AS Number

```js
// Get AS number of IP
const data = geoip.asn('12.34.56.78');
console.log(data);
```

<details><summary>Result</summary>

```js
{ ip: IP { label: '12.34.56.78' }, number: 7018, name: 'ATT-INTERNET4' }
```

</details>
