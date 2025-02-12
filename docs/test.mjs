function sival(code, scope) {
  return new Function(`with (this) { return ${code} }`).call(scope);
}
