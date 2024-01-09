<template>
  <div class="warp-sm mt-5">
    <v-card flat>
      <v-list density="compact" nav>
        <div class="mb-3">
          <div class="justify-between">
            <span>Discover</span> <span>{{ name }}</span>
          </div>
          <input
            class="search-input mt-1"
            type="text"
            placeholder="search"
            v-model="value"
          />
        </div>
        <v-list-item
          v-for="item in d"
          :title="item[actKey]"
          :value="item[promptKey]"
          :key="item[actKey]"
          :to="toUrl(item)"
          :subtitle="item[promptKey]"
        >
          <template v-slot:prepend>
            <v-avatar color="primary" size="small">
              {{ item[actKey].substring(0, 1) }}
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>
<script setup>
import { discover, discoverList } from "@/api/discover";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const data = ref([]);
const value = ref("");
const actKey = ref("act");
const promptKey = ref("prompt");
const name = ref("");
onMounted(loadData);
watch(route, loadData);
async function loadData() {
  const array = (await discoverList()).filter((o) => o.key == route.params.id);
  if (array.length) {
    const item = array[0];
    data.value = await discover(item.url);
    actKey.value = item.act || "act";
    promptKey.value = item.prompt || "prompt";
    name.value = item.name;
  }
}
const d = computed(() => {
  const r = data.value.filter(
    (o) =>
      o[promptKey.value].toLowerCase().indexOf(value.value.toLowerCase()) >
        -1 ||
      o[actKey.value].toLowerCase().indexOf(value.value.toLowerCase()) > -1
  );
  return r.slice(0, r.length > 60 ? 60 : r.length);
});
function toUrl(item) {
  return `/setup?name=${item[actKey.value]}&prompt=${item[promptKey.value]}`;
}
</script>
<style lang="less" scoped>
.search-input {
  width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 1rem;
  height: 2rem;
  line-height: 2rem;
  padding-inline-start: 1rem;
}
.justify-between {
  display: flex;
  justify-content: space-between;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  display: flex;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  margin: 0.5rem 0.2rem;
}
</style>
