import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const ___dirname = path.dirname(fileURLToPath(import.meta.url));

const bogonIPs = JSON.parse(
  fs.readFileSync(path.resolve(___dirname, '../data/bogon-ips.json')).toString()
);

const regexp = {
  subnet: new RegExp(/\/([0-9]+)/),
  v4String: new RegExp(
    /^((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])/
  ),
  v6String: new RegExp(
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
  ),
};

enum Type {
  IPv4,
  IPv6,
}

class IP {
  #ip: bigint = 0n;
  #subnet: bigint = 0n;
  #type: Type;

  label: string;

  constructor(ip: string | number | bigint) {
    if (typeof ip === 'string') {
      if (regexp.subnet.test(ip)) {
        const match = ip.match(regexp.subnet);
        this.#subnet = BigInt(match[1]);
        ip = ip.replace(regexp.subnet, '');
      }
      if (regexp.v4String.test(ip)) {
        this.#type = Type.IPv4;
        this.#ip = this.#IPv4StringToDemical(ip);
      } else if (regexp.v6String.test(ip)) {
        this.#type = Type.IPv6;
        this.#ip = this.#IPv6StringToDemical(this.#fullIPv6(ip));
      } else {
        throw new Error('Invaild IP');
      }
    } else if (typeof ip === 'number') {
      if (ip <= 4294967295) {
        this.#type = Type.IPv4;
      } else {
        this.#type = Type.IPv6;
      }
      this.#ip = BigInt(ip);
    } else if (typeof ip === 'bigint') {
      if (ip <= 4294967295n) {
        this.#type = Type.IPv4;
      } else if (ip <= 340282366920938463463374607431768211455n) {
        this.#type = Type.IPv6;
      } else {
        throw new Error('Invaild IP');
      }
      this.#ip = ip;
    } else {
      throw new Error('Invaild IP');
    }

    this.label = this.toString() + (this.hasSubnet() ? `/${this.#subnet}` : '');
  }

  toString() {
    return this.is4()
      ? this.#IPv4DemicalToString(this.#ip)
      : this.#IPv6DemicalToString(this.#ip);
  }

  toDemical() {
    return this.#ip;
  }

  is4() {
    return this.#type === Type.IPv4;
  }

  is6() {
    return this.#type === Type.IPv6;
  }

  to6() {
    if (this.is4()) {
      const array = this.#DemicalToIPArray(this.#ip);
      return new IP(
        '0000:0000:0000:0000:0000:ffff:' +
          array[0].toString(16).padStart(2, '0') +
          array[1].toString(16).padStart(2, '0') +
          ':' +
          array[2].toString(16).padStart(2, '0') +
          array[3].toString(16).padStart(2, '0')
      );
    } else {
      return new IP(this.#ip);
    }
  }

  hasSubnet() {
    return this.#subnet !== 0n;
  }

  getSubnet() {
    let length = 2n ** ((this.is4() ? 32n : 128n) - this.#subnet);
    let ipArray = this.#DemicalToIPArray(this.toDemical());
    let lengthArray = this.#DemicalToIPArray(new IP(length).toDemical());
    let startArray = [];
    for (let i = 0; i < ipArray.length; i++) {
      if (lengthArray[i] === 0n) {
        startArray.push(ipArray[i]);
      } else {
        let left = ipArray[i] % lengthArray[i];
        startArray.push(ipArray[i] - left);
      }
    }

    let net = this.#IPArrayToDemical(startArray);
    if (this.is4()) {
      if (length <= 2n) {
        return {
          network: new IP(net),
          range: {
            start: new IP(net),
            end: new IP(net + length - 1n),
          },
          broadcast: new IP(net + length - 1n),
        };
      } else {
        return {
          network: new IP(net),
          range: {
            start: new IP(net + 1n),
            end: new IP(net + length - 2n),
          },
          broadcast: new IP(net + length - 1n),
        };
      }
    } else {
      return {
        network: new IP(net),
        range: {
          start: new IP(net),
          end: new IP(net + length - 1n),
        },
      };
    }
  }

  getSubnetIPs() {
    const array = [];
    const subnet = this.getSubnet();
    for (
      let i = subnet.network.toDemical();
      i <= subnet.broadcast.toDemical();
      i++
    ) {
      array.push(new IP(i));
    }
    return array;
  }

  in(i1: IP, i2?: IP) {
    if (i1.hasSubnet()) {
      const subnet = i1.getSubnet();
      return (
        subnet.range.start.toDemical() <= this.#ip &&
        this.#ip < subnet.range.end.toDemical()
      );
    } else if (i2 != undefined) {
      return i1.toDemical() <= this.#ip && this.#ip < i2.toDemical();
    } else {
      return i1.toDemical() == this.#ip;
    }
  }

  getBogon() {
    for (const sub in bogonIPs) {
      const ip = new IP(sub);
      if (this.in(ip)) {
        return bogonIPs[sub];
      }
    }
    return null;
  }

  isBogon() {
    return this.getBogon() != null;
  }

  #fullIPv6(ip: string) {
    ip = ip.replace(/^:|:$/g, '');
    let ipv6 = ip.split(':');
    for (let i = 0; i < ipv6.length; i++) {
      let hex = ipv6[i];
      if (hex != '') {
        ipv6[i] = ('0000' + hex).substr(-4);
      } else {
        const hexa = [];
        for (let j = ipv6.length; j <= 8; j++) {
          hexa.push('0000');
        }
        ipv6[i] = hexa.join(':');
      }
    }
    return ipv6.join(':');
  }

  #IPArrayToDemical(array: bigint[]) {
    array.reverse();
    let i = 1n;
    let result = 0n;
    for (const n of array) {
      result += n * i;
      i *= 256n;
    }
    return result;
  }

  #DemicalToIPArray(number: bigint) {
    const array: bigint[] = [];
    let i = 256n ** (this.is4() ? 3n : 15n);
    while (i > 0n) {
      if (number < i) {
        array.push(0n);
      } else {
        let d = number / i;
        array.push(d);
        number = number - i * d;
      }
      i /= 256n;
    }
    return array;
  }

  #IPv4StringToDemical(ip: string) {
    const array: bigint[] = [];
    for (const p of ip.split('.')) {
      array.push(BigInt(p));
    }
    return this.#IPArrayToDemical(array);
  }

  #IPv6StringToDemical(ip: string) {
    const array: bigint[] = [];
    for (const p of ip.split(':')) {
      array.push(BigInt(parseInt(p[0] + p[1], 16)));
      array.push(BigInt(parseInt(p[2] + p[3], 16)));
    }
    return this.#IPArrayToDemical(array);
  }

  #IPv4DemicalToString(ip: bigint) {
    const array = this.#DemicalToIPArray(ip);
    let string = '';
    for (let i = 0; i < array.length; i++) {
      string += array[i] + (i < array.length - 1 ? '.' : '');
    }
    return string;
  }

  #IPv6DemicalToString(ip: bigint) {
    const array = this.#DemicalToIPArray(ip);
    let string = '';
    for (let i = 0; i < array.length; i++) {
      string +=
        array[i].toString(16).padStart(2, '0') +
        (i % 2 != 0 && i < array.length - 1 ? ':' : '');
    }
    return string;
  }
}

export default IP;
