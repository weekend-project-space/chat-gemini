async (args, {
  nextGen
}) => {
  function mdFormat(txt) {
    if (txt.includes('\n\n') || txt.includes('  ')) {
      return mdFormat(txt.replaceAll('  ', '').replaceAll('[\n', '[').replaceAll('\n]', ']').replaceAll('\n\n', '\n'))
    }
    return txt
  }
  const d = await (
    await fetch(
      "https://zhidayingxiao.cn/v1/proxy?url=" + args.url
    )
  ).text();
  if (args.nextaction) {
    nextGen(args.nextaction + ":" + d, false)
  }
  return mdFormat(d)
};
