<template>
  <div class="mx-3 my-2">
    <div class="d-flex flex">
      <v-list-subheader> 对话</v-list-subheader>
      <v-btn
        prepend-icon=" mdi-file-edit-outline"
        size="small"
        color="primary"
        @click="newChat0"
      >
        新建对话
      </v-btn>
    </div>
    <input
      class="search-input mt-2"
      type="text"
      placeholder="search"
      v-model="value"
    />
  </div>
  <div class="list">
    <v-list nav>
      <template v-for="group in chatGroupList" :key="group.name">
        <v-list-subheader
          >{{ group.name }} ({{ group.data.length }})</v-list-subheader
        >
        <v-list-item
          v-for="item in group.data"
          :title="item.name"
          :value="item.id"
          :key="item.id"
          :data-id="item.id"
          :id="'menu-' + item.id"
          :to="'/chats/' + item.id"
        >
          <template #append>
            <div
              class="actions"
              :class="{ 'action-active': item.id == actionActiveId }"
            >
              <!-- <v-btn
                size="small"
                variant="text"
                icon="mdi-delete-outline"
                @click.prevent="delChat0(item.id)"
              ></v-btn> -->
              <!-- <v-btn
                size="small"
                variant="text"
                icon="mdi-dots-horizontal"
              ></v-btn> -->

              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    @click.prevent="changeActionActiveId(item.id)"
                    v-bind="props"
                    size="small"
                    variant="text"
                    icon="mdi-dots-horizontal"
                  ></v-btn>
                </template>
                <v-list density="compact" nav>
                  <!-- <v-list-item @click="upChat(item)">
                    <v-list-item-title
                      ><v-icon size="small" class="mr-3"
                        >mdi-arrow-collapse-up</v-icon
                      >置顶对话</v-list-item-title
                    >
                  </v-list-item> -->
                  <v-list-item @click="delChat0(item.id)">
                    <v-list-item-title>
                      <v-icon size="small" class="mr-3"
                        >mdi-delete-outline</v-icon
                      >删除对话</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>
<script setup>
import { useList } from "@/compose/useQuery";
import { listAll, getByPromptId } from "@/repo/chatRepository";
import { delChat, newChat } from "@/service/chatService";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, watch, ref } from "vue";
import { useDisplay } from "vuetify";
import { format } from "@/utils/dateUtils";
const { value, data: chats } = useList(listAll);
const defaultChatText = "新对话";
const route = useRoute();
const router = useRouter();
const { mobile } = useDisplay();

const actionActiveId = ref(0);

function changeActionActiveId(id) {
  setTimeout(() => {
    actionActiveId.value = id;
  }, 10);
}

function upChat(item) {
  item.type = "aup";
}

const texts = { app: "创作", chat: "对话", aup: "置顶" };
const chatGroupList = computed(() => {
  return (
    chats.value &&
    chats.value
      .filter((o) => o.name != defaultChatText)
      .reduce((arr, item) => {
        const a = arr
          .map((o) => {
            o.type = o.type ? o.type : "app";
            return o;
          })
          .filter((a) => a.name == texts[item.type]);
        if (a.length > 0) {
          a[0].data.push(item);
        } else {
          arr.push({
            name: texts[item.type],
            data: [item],
          });
        }
        return arr;
      }, [])
      .sort()
  );
});
async function goChat() {
  actionActiveId.value = 0;
  if (route.query.promptid) {
    const chatId = (await getByPromptId(Number.parseInt(route.query.promptid)))
      .id;
    router.push("/chats/" + chatId);
  } else if (!route.path.includes("/chats/") && !mobile.value) {
    setTimeout(newChat0, 300);
  }
}

async function newChat0() {
  if (route.fullPath.includes("/chats")) {
    const newchats = chats.value.filter((o) => o.name == defaultChatText);
    if (newchats.length) {
      router.push("/chats/" + newchats[0].id);
    } else {
      createChat();
    }
  }
}

async function createChat() {
  const chatId = await newChat(defaultChatText);
  setTimeout(() => {
    router.push("/chats/" + chatId);
  }, 100);
}

async function delChat0(id) {
  await delChat(id);
  if (!mobile.value && route.params.id == id) {
    newChat0();
  }
}

function formatData(time) {
  return format(new Date(time), "yyyy-MM-dd");
}

onMounted(goChat);
watch(route, goChat);
</script>
<style lang="less" scoped>
small {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-background), 0.6);
}
.list .v-list {
  .v-btn--icon.v-btn--density-default {
    width: 30px;
    height: 30px;
  }
  .actions {
    display: none;
  }
  .v-list-item:hover {
    .actions {
      display: block;
    }
  }
  .action-active {
    display: block;
  }
  .v-list-item--active {
    .actions {
      display: block;
    }
  }
}
.search-input {
  width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 1.2rem;
  height: 2.5rem;
  line-height: 2.5rem;
  padding-inline-start: 1rem;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
