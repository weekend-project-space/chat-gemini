async () => {
  return '现在时间是：' + new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai'
  })
};
