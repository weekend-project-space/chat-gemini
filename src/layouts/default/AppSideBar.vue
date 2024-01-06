<template>
  <template v-if="mobile">
    <v-bottom-navigation v-if="showBtn" grow>
      <v-btn
        v-for="bar in bars"
        :value="bar.icon"
        :key="bar.icon"
        :to="bar.value"
      >
        <v-icon :icon="bar.icon"></v-icon>
        <span v-text="bar.name"></span>
      </v-btn>
    </v-bottom-navigation>
  </template>
  <template v-else>
    <v-navigation-drawer rail>
      <v-list>
        <v-list-item
          prepend-icon=" mdi-account-circle-outline"
          title="Me"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="bar in bars"
          :key="bar.icon"
          :prepend-icon="bar.icon"
          :title="bar.name"
          :value="bar.icon"
          :to="bar.value"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer width="300" v-model="drawer">
      <component :is="comp" />
    </v-navigation-drawer>
  </template>
</template>
<script setup>
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
defineProps(["comp"]);
import { useRoute } from "vue-router";
const route = useRoute();
const showBtn = computed(() => route.meta.index);
const drawer = ref(true);
const { mobile } = useDisplay();
const bars = [
  { icon: "mdi-message-outline", name: "Chats", value: "chats" },
  { icon: "mdi-contacts-outline", name: "Contacts", value: "contacts" },
  { icon: "mdi-compass-outline", name: "Discover", value: "discover" },
];
</script>
