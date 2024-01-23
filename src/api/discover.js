export async function discover(api) {
  return await (await fetch(api, {
    method: 'GET'
  })).json()
}

export async function discoverList() {
  return await (await fetch('https://raw.githubusercontent.com/weekend-project-space/eywa-chat/main/public/discover.json', {
    method: 'GET'
  })).json()
}
