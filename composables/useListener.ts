import { onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database'
import { storeToRefs } from 'pinia'
export const useListener = () => {
  const { $ref } = useNuxtApp()
  const { room } = storeToRefs(useRoom())
  const { getGamersFromDatabase } = useDatabaseFB()
  const { setGamers } = useGamers()
  const { getDicesDB } = useGame()
  const dice = useDice()

  onChildAdded($ref(`games/${room.value}/gamers`), async () => {
    if (!room.value) return
    const data = await getGamersFromDatabase(room.value)
    if (data) setGamers(data)
  })
  onChildChanged($ref(`games/${room.value}/gamers`), async () => {
    if (!room.value) return
    const data = await getGamersFromDatabase(room.value)
    if (data) setGamers(data)
  })
  onChildChanged($ref(`games/${room.value}/dice`), async () => {
    if (!room.value) return
    const data = await getGamersFromDatabase(room.value)
    if (data) setGamers(data)
  })

  onChildAdded($ref(`games/${room.value}/dice`), async () => {
    await getDicesDB()
  })
  onChildChanged($ref(`games/${room.value}/dice`), async () => {
    await getDicesDB()
  })
  onChildRemoved($ref(`games/${room.value}/dice`), async () => {
    dice.users.pop()
  })
}
