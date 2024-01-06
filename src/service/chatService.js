import * as chatReposiotry from '@/repo/chatReposiotry'
import * as chatItemReposiotry from '@/repo/chatItemReposiotry'
import * as contactReposiotry from '@/repo/contactReposiotry'

export async function save(chatItem) {
  await chatItemReposiotry.save(chatItem)
  const contact = await contactReposiotry.get(chatItem.contactId)
  return await chatReposiotry.save({
    contactId: contact.id,
    name: contact.name,
    time: new Date().getTime()
  })
}
