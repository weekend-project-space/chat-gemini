<template>
  <div class="empty">
    <!-- <v-avatar color="primary" size="80"  variant="outlined"> -->
    <div class="logo-warp mx-auto">
      <img src="/logo.png" style="width: 80px" alt="" />
    </div>
    <!-- </v-avatar> -->
    <div class="mt-5 bold">我今天能帮你做什么？</div>

    <div class="mt-5">
      <small class="tip"
        >机器人运行可能会遇到问题，为确保您正常使用，请加入<a
          href="https://zhidayingxiao.cn/to/06g6xX"
          >微信交流群</a
        >，以便第一时间解决。ctrl+d收藏网站</small
      >
      <div class="mt-5">
        <v-btn
          color="primary"
          prepend-icon="mdi-wechat"
          href="https://zhidayingxiao.cn/to/06g6xX"
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
}
.empty {
  text-align: center;
  margin-top: 21vh;
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
