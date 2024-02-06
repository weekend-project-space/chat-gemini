<template>
  <div class="empty">
    <v-avatar color="primary" size="80">
      <v-icon icon="mdi-link" size="60"></v-icon>
    </v-avatar>
    <div class="mt-5 bold">我今天能帮你做什么？</div>

    <div class="mt-5">
      <v-btn
        prepend-icon="mdi-wechat"
        color="#FF6A42"
        href="https://zhidayingxiao.cn/to/06g6y3"
        >点击进微信交流群
      </v-btn>
      <div class="mt-3">
        <small class="tip"
          >机器人运行可能会遇到问题，为确保您正常使用，请加入<a
            href="https://zhidayingxiao.cn/to/06g6y3"
            >微信交流群</a
          >或<a
            href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=6fc5B9qUuEANrhxu_NoFxYf0E7GRv00D&authKey=usE9I3Rs9Dca8Q3aC%2BpbUyI4WjF0Eahjku8psS5%2FyJ6axVKCTJuqqFEw8vLAGv6S&noverify=0&group_code=574528625"
            >qq群:</a
          >574528625，以便第一时间解决。</small
        >
      </div>
    </div>
    <div class="mt-5">
      <v-btn variant="text" to="/discover"> 👀查看更多功能 </v-btn>
    </div>
  </div>
</template>
<style lang="less" scoped>
.empty {
  text-align: center;
  margin-top: 20vh;
  .bold {
    font-weight: 500;
    font-size: 1.5rem;
  }
  .tip {
    opacity: 0.5;
  }
}
@media screen and(max-width:768px) {
  .empty {
    margin-top: 0;
  }
}
</style>
