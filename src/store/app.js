import {
  defineStore
} from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    barBtns: [], // icon,to
  }),
  actions: {

    setBarBtns(btns) {
      this.barBtns = btns
    }
  },
})
