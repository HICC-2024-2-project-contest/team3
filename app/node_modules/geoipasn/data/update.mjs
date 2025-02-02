'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import https from 'node:https';
import { exec, spawn } from 'node:child_process';

async function request(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options);

    req.on('response', (res) => {
      if (options.output === 'pipe') {
        resolve(res);
      } else {
        let data = '';
        res.on('data', (chunk) => {
          data += new String(chunk);
        });
        res.on('end', () => {
          if (options.headers['Content-Type'] === 'application/json') {
            data = JSON.parse(data);
          }
          resolve(data);
        });
      }
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function IPv4_ASN() {
  const name = 'IPv4-ASN.json';
  const prefix = `[${name}]`;

  console.log(prefix, `Starting update process...`);
  console.log(prefix, `Downloading data...`);

  const data = await request({
    hostname: 'thyme.apnic.net',
    port: 443,
    path: '/current/data-raw-table',
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    },
  });

  console.log(prefix, `Processing data...`);

  const json = {};
  const file = path.resolve(__dirname, name);

  let min = 100;
  for (const record of data.split('\n')) {
    if (!record) {
      continue;
    }

    let [ip, asn] = record.split('\t');
    let ips = ip.split('.');
    let ip1 = `${ips[0]}`;
    let ip2 = `${ips[1]}.${ips[2]}.${ips[3]}`;
    if (!json[ip1]) {
      json[ip1] = {};
    }
    json[ip1][ip2] = asn;
  }

  console.log(prefix, `Writing data...`);

  fs.writeFileSync(file, JSON.stringify(json));

  console.log(prefix, `Update complete\n`);
}

async function ASN_name() {
  const name = 'ASN-name.json';
  const prefix = `[${name}]`;

  console.log(prefix, `Starting update process...`);
  console.log(prefix, `Downloading data...`);

  const data = await request({
    hostname: 'thyme.apnic.net',
    port: 443,
    path: '/current/data-used-autnums',
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    },
  });

  console.log(prefix, `Processing data...`);

  const json = {};
  const file = path.resolve(__dirname, name);

  for (const record of data.split('\n')) {
    let [asn, name] = record.replace(/^ +/, '').split(/ (.+)/s);
    json[asn] = name;
  }

  console.log(prefix, `Writing data...`);

  fs.writeFileSync(file, JSON.stringify(json));

  console.log(prefix, `Update complete\n`);
}

async function geoip_lite_updatedb() {
  return new Promise((resolve) => {
    const name = 'GeoIP Database';
    const prefix = `[${name}]`;

    console.log(prefix, `Starting update process...`);

    /*
    node node_modules/geoip-lite/scripts/updatedb.js license_key=$1
  rm data/geoip-lite/*
  cp node_modules/geoip-lite/data/*.* data/geoip-lite
    */

    const geoipLiteModulePath = path.resolve(
      __dirname,
      '../node_modules/geoip-lite'
    );
    const geoipLiteModuleData = path.resolve(geoipLiteModulePath, 'data');
    const geoipLiteData = path.resolve(__dirname, 'geoip-lite');

    console.log(prefix, `Applying cached data...`);
    fs.rmSync(geoipLiteModuleData, { recursive: true, force: true });
    fs.cpSync(geoipLiteData, geoipLiteModuleData, { recursive: true });

    const child = spawn(
      `node`,
      [`scripts/updatedb.js`, `license_key=${process.argv[2]}`],
      {
        cwd: geoipLiteModulePath,
        encoding: 'utf-8',
      }
    );

    child.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    child.stderr.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log(prefix, `Updating cached data...`);
        fs.rmSync(geoipLiteData, { recursive: true, force: true });
        fs.cpSync(geoipLiteModuleData, geoipLiteData, { recursive: true });

        console.log(prefix, `Update complete\n`);
      } else {
        console.error(prefix, `Update failed\n`);
      }
      resolve();
    });
  });
}

async function run() {
  await geoip_lite_updatedb();
  await IPv4_ASN();
  await ASN_name();
}

run();
