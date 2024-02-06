async (args, {
  next
}) => {
  const d = await (
    await fetch(
      "http://localhost:3390/v1/proxy?url=" + args.url
    )
  ).text();
  if (args.summarize) {
    next('总结一下：' + d, true)
  }
  return {
    content: d,
  }
};
