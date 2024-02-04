export async function share(data) {
  return 'https://zhidayingxiao.cn/to/' + await (await fetch(`https://zhidayingxiao.cn/v1/share`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })).text()
}
