const eywa = {}

export async function loadfun(name, url) {
  if (!eywa[name]) {
    const fun = eval(await (await fetch(url)).text());
    eywa[name] = fun
  }
  return eywa[name]
}
