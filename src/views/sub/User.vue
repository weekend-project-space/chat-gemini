<template>
  <div class="warp empty">
    <div class="">
      <div class="logo-warp mx-auto">
        <img src="/logo.png" style="width: 80px" alt="" />
      </div>
    </div>

    <v-card flat min-width="320">
      <div class="d-flex justify-space-between align-center my-2">
        <p class="font-sm" v-text="surplusText"></p>
        <v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              color="primary"
              size="small"
              v-bind="activatorProps"
              text="充值"
              variant="text"
            ></v-btn>
          </template>

          <template v-slot:default>
            <v-card title="购买VIP">
              <v-img class="mt-3" src="/sl.jpg"></v-img>
              <v-card-text>
                <div class="d-flex mt-3 mb-5">
                  <v-btn text="卡密兑换" color="primary" to="/setup"></v-btn>
                  <v-spacer></v-spacer>

                  <v-btn
                    text="去购买"
                    color="primary"
                    href="https://item.taobao.com/item.htm?ft=t&id=771495870230&spm=a21dvs.23580594.0.0.47b33d0dHMMXEU"
                  ></v-btn>
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>
<script setup>
import { inject } from "vue";
const surplusText = inject("surplusText");
</script>
<style lang="less" scoped>
.logo-warp {
  width: 80px;
  height: 80px;
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
</style>
