export async function discover(api) {
  return await (await fetch(api, {
    method: 'GET'
  })).json()
}

export async function discoverList() {
  return await (await fetch('/discover.json', {
    method: 'GET'
  })).json()
}
