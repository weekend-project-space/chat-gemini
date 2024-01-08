import * as chatReposiotry from '@/repo/chatRepository'
import * as chatItemReposiotry from '@/repo/chatItemRepository'

export async function newChat(chatItems) {
  const chatItem = chatItems[0]
  console.log(chatItem)
  const chat = await chatReposiotry.get(chatItem.contactId)
  if (chat) {
    chat.time = new Date().getTime()
    return await chatReposiotry.save(chat)
  } else {
    await chatItemReposiotry.batchAdd(chatItems)
    return await chatReposiotry.save({
      contactId: chatItem.contactId,
      name: chatItem.contactName,
      time: new Date().getTime()
    })
  }
}

export async function saveChatItem(chatItem) {
  await chatItemReposiotry.save(chatItem)
  const chat = await chatReposiotry.get(chatItem.contactId)
  chat.time = new Date().getTime()
  return await chatReposiotry.save(chat)
}
