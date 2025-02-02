# @amuject/ip

**IP module for calculation (demical, subnet) / check bogon.**

## Table of Content

- [Installation](#installation)
- [Use IP](#use-ip)
- [Simple Example](#simple-example)
- [API](#api)
  - Class: [`IP`](#class-ip)
    - [`new IP(value)`](#new-ipvalue)
    - [`ip.toString()`](#iptostring)
    - [`ip.toDemical()`](#iptodemical)
    - [`ip.is4()`](#ipis4)
    - [`ip.is6()`](#ipis6)
    - [`ip.to6()`](#ipto6)
    - [`ip.hasSubnet()`](#iphassubnet)
    - [`ip.getSubnet()`](#ipgetsubnet)
    - [`ip.getSubnetIPs()`](#ipgetsubnetips)
    - [`ip.in(from[, to])`](#ipinfrom-to)
    - [`ip.isBogon()`](#ipisbogon)
    - [`ip.getBogon()`](#ipgetbogon)

## Installation

```
npm i @wnynya/ip
```

## Use IP

ESM

```js
import IP from '@wnynya/ip';
const ip = new IP('127.0.0.1');
```

CJS

```js
const IP = require('@wnynya/ip');
const ip = new IP('127.0.0.1');
```

Typescript

```js
import IP from '@wnynya/ip';
const ip: IP = new IP('127.0.0.1');
```

## Simple Example

```js
// Convert IPv4 string to demical & check IP is bogon.
import IP from '@wnynya/ip'; // ESM

const ip = new IP('127.0.0.1');

console.log(ip.toDemical()); // true
console.log(ip.isBogon()); // true

console.log(ip.in(new IP('127.0.0.1', '127.0.0.255'))); // true
console.log(ip.in(new IP('127.0.1.0/24'))); // false
```

# API

## Class: `IP`

### `new IP(value)`

- `value` `<string|number|bigint>` IP value.

### `ip.toString()`

- Returns: `<string>`

Returns full string of IP.

### `ip.toDemical()`

- Returns: `<bigint>`

Returns demical value of IP.

### `ip.is4()`

- Returns: `<boolean>`

Check IP is IPv4.

### `ip.is6()`

- Returns: `<boolean>`

Check IP is IPv6.

### `ip.to6()`

- Returns: `<IP>`

Convert IPv4 `IP` to IPv6 `IP`

### `ip.hasSubnet()`

- Returns: `<boolean>`

Check IP has subnet mask (suffix).

### `ip.getSubnet()`

- Returns: `<Object>`

Returns subnet range.

### `ip.getSubnetIPs()`

- Returns: `<IP[]>`

Returns array of subnet range IPs.

### `ip.in(from[, to])`

- `from` `<IP>` IP value.
- `to` `<IP>` IP value.

- Returns: `<boolean>`

Check IP is in range.
If `from` IP has subnet range, Check IP is in subnet range.

### `ip.isBogon()`

- Returns: `<boolean>`

Check IP is bogon.

### `ip.getBogon()`

- Returns: `<string>`

If IP is bogon, returns reason of bogon.
