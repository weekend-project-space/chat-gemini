import {
  liveQuery
} from "dexie";
import {
  useObservable
} from "@vueuse/rxjs";
import {
  watch,
  ref
} from "vue";

export function useList(listAll, val = "") {
  const value = ref(val);
  const data = useObservable(liveQuery(() => listAll(val)));
  watch(value, async () => (data.value = await listAll(value.value)));
  return {
    value,
    data
  }
}
