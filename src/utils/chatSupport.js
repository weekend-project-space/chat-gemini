import {
  createChat
} from "@/service/chatService";

export async function goChat(item, router, promptKey = 'prompt', actKey = 'name', hint = true) {
  let content = item[promptKey];
  if (hint) {
    content = `(textarea ${item.hint} = '')(${item.content.replace(
        "[PROMPT]",
        "${" + item.hint + "}"
      )})`;
  }
  const chatId = await createChat([{
    promptId: item[actKey],
    name: item[actKey],
    role: "user",
    content,
  }]);
  router.push("/chats/" + chatId);
}
