import * as chatReposiotry from '@/repo/chatRepository'
import * as chatItemReposiotry from '@/repo/chatItemRepository'


export async function newChat(name) {
  return await chatReposiotry.save({
    promptId: undefined,
    name: name,
    time: new Date().getTime()
  })
}

export async function createChat(chatItems) {
  const chatItem = chatItems[0]
  let chat = await chatReposiotry.getByPromptId(chatItem.promptId)
  chat = chat ? chat : await chatReposiotry.getByName(chatItem.name)
  if (chat) {
    chat.time = new Date().getTime()
    chat.promptId = chatItem.promptId
    await chatReposiotry.save(chat)
    return chat.id
  } else {
    const id = await chatReposiotry.save({
      promptId: chatItem.promptId,
      name: chatItem.name,
      time: new Date().getTime(),
      type: chatItem.content.includes('${') ? 'app' : 'chat'
    })
    chatItems.forEach(item => {
      item.chatId = id
    });
    await chatItemReposiotry.batchAdd(chatItems)
    return id;
  }
}

export async function saveChatItems(chatItems) {
  await chatItemReposiotry.batchAdd(chatItems)
  const chat = await chatReposiotry.get(chatItems[0].chatId)
  chat.time = new Date().getTime()
  return await chatReposiotry.save(chat)
}


export async function delChat(chatId) {
  await chatReposiotry.del(chatId)
  return await chatItemReposiotry.del(chatId)
}
