<template>
  <div class="empty">
    <!-- <v-avatar color="primary" size="80"  variant="outlined"> -->
    <div class="logo-warp mx-auto">
      <v-icon icon="mdi-link" size="60"></v-icon>
    </div>
    <!-- </v-avatar> -->
    <div class="mt-5 bold">我今天能帮你做什么？</div>

    <div class="mt-5">
      <small class="tip"
        >机器人运行可能会遇到问题，为确保您正常使用，请加入<a
          href="https://zhidayingxiao.cn/to/06g6y3"
          >微信交流群</a
        >或<a
          href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=6fc5B9qUuEANrhxu_NoFxYf0E7GRv00D&authKey=usE9I3Rs9Dca8Q3aC%2BpbUyI4WjF0Eahjku8psS5%2FyJ6axVKCTJuqqFEw8vLAGv6S&noverify=0&group_code=574528625"
          >qq群:</a
        >574528625，以便第一时间解决。</small
      >
      <div class="mt-5">
        <v-btn
          color="primary"
          prepend-icon="mdi-wechat"
          href="https://zhidayingxiao.cn/to/06g6y3"
          >点击👆进微信交流群
        </v-btn>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.logo-warp {
  width: 80px;
  height: 80px;
  padding: 9px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 50%;
}
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
