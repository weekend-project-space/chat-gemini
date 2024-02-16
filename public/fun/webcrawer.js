async (args, {
  nextGen
}) => {
  const d = await (
    await fetch(
      "https://zhidayingxiao.cn/v1/proxy?url=" + args.url
    )
  ).text();
  if (args.summarize) {
    nextGen('总结一下：' + d, false)
  }
  return d
};
