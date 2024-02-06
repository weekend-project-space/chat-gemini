async (args, {
  next
}) => {
  const d = await (
    await fetch(
      "https://zhidayingxiao.cn/v1/proxy?url=" + args.url
    )
  ).text();
  if (args.summarize) {
    next('总结一下：' + d, true)
  }
  return {
    content: d,
  }
};
