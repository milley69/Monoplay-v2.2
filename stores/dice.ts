import { defineStore, storeToRefs } from 'pinia'

/* experiment: Pinia with composition api */
export const useDice = defineStore('dicePinia', () => {
  const { uid } = storeToRefs(useUser())
  const { reloadDiceDB, addDiceDB, removeDiceDB } = useGame()

  const users = ref(<string[]>[])

  const getSize = computed(() => users.value.length)
  const isYourDice = computed(() => users.value[0] === uid.value)

  const addDices = (data: string[]) => (users.value = data)
  const checkDice = (uid: string) => users.value.includes(uid)
  const addDice = async (uid: string) => {
    if (checkDice(uid)) return
    users.value.push(uid)
    await addDiceDB(uid)
  }
  const removeDice = async () => {
    await played()
    users.value.pop()
    await removeDiceDB()
  }
  const played = async () => {
    const tempUid = users.value[0]
    users.value.shift()
    addDice(tempUid)
    await reloadDiceDB(users.value)
  }

  return { users, getSize, isYourDice, addDices, addDice, played, removeDice, checkDice }
})
/* I didn't like it 😕 */
