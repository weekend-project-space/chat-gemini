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
      <v-tooltip text="伊娃">
        <template v-slot:activator="{ props }">
          <v-list v-bind="props" nav>
            <v-avatar icon="mdi-link" color="secondary"></v-avatar>
          </v-list>
        </template>
      </v-tooltip>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="bar in bars"
          :key="bar.icon"
          :prepend-icon="bar.icon"
          :title="bar.name"
          :value="bar.value"
          :to="bar.value"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer width="300">
      <component :is="comp" />
    </v-navigation-drawer>
  </template>
</template>
<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
defineProps(["comp"]);
import { useRoute } from "vue-router";
const route = useRoute();
const showBtn = computed(() => route.meta.index);
const { mobile } = useDisplay();
const bars = [
  { icon: "mdi-message-outline", name: "Chats", value: "/chats" },
  { icon: "mdi-star-box-outline", name: "Prompts", value: "/prompts" },
  { icon: "mdi-compass-outline", name: "Discover", value: "/discover" },
];
</script>
