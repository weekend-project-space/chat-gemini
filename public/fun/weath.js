async (args, {
  h
}) => {
  const d = await (
    await fetch(
      "https://widget-api.qweather.net/s6/plugin/location?key=085791e805a24491b43b06cf58ab31e7&qweather_mark=tSmZ3tj1lTxozaO9UqjFutAMfk5uPZRi&lang=zh"
    )
  ).json();
  const w = await (
    await fetch(
      `https://widget-api.qweather.net/s6/plugin/sticker?key=085791e805a24491b43b06cf58ab31e7&location=CN${d.basic.cid}&lang=zh`
    )
  ).json();
  return h(
    "div",
    d.basic.location + "：" + w.now.cond_txt + "；" + w.rain.txt
  );
};
