import {
  defineStore
} from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    chats: [], // name,prompt
    currentChatName: '',
    barBtns: [], // icon,to
    contact: {}, // name,prompt
  }),
  actions: {
    pushChat(chat) {
      if (!this.chats.filter((i) => i.name == chat.name).length) {
        this.chats.push(JSON.parse(JSON.stringify(chat)))
      }
      this.chats.filter((i) => i.name == chat.name)[0].time = new Date().getTime()
      this.currentChatName = chat.name
    },
    setBarBtns(btns) {
      this.barBtns = btns
    },
    setContact(contact) {
      this.contact = contact
    }
  },
})
