function sival(code, scope) {
  return new Function(`with (this) { return ${code} }`).call(scope);
}

const code = `} while(true) {} //`;
const res = sival(code, {});
console.log(res);
