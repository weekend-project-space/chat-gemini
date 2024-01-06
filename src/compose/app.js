import {
  useAppStore
} from "@/store/app";
import {
  storeToRefs,
} from 'pinia'


export function useApp() {
  const store = useAppStore();
  const refs = storeToRefs(store)
  return {
    ...store,
    ...refs
  }
}
