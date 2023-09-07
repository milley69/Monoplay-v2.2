import { onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database'
import { storeToRefs } from 'pinia'
export const useListener = () => {
  const { $ref } = useNuxtApp()
  const { room } = storeToRefs(useRoom())
  const { getGamersFromDatabase, getStreetFromDatabase, getRailroadsFromDatabase, getCompanyFromDatabase } =
    useDatabaseFB()
  const { setGamers } = useGamers()
  const { getDicesDB, getConfirmation } = useGame()
  const dice = useDice()

  /* GAMERS */
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
  onChildRemoved($ref(`games/${room.value}/gamers`), async () => {
    if (!room.value) return
    const data = await getGamersFromDatabase(room.value)
    if (data) setGamers(data)
  })

  /* DICE */
  onChildAdded($ref(`games/${room.value}/dice`), async () => {
    await getDicesDB()
  })
  onChildChanged($ref(`games/${room.value}/dice`), async () => {
    await getDicesDB()
  })
  onChildRemoved($ref(`games/${room.value}/dice`), async () => {
    dice.users.pop()
  })

  /* BOARD */
  onChildChanged($ref(`games/${room.value}/board`), async (snap) => {
    if (snap.key === 'confirmation') await getConfirmation()
    if (snap.key === 'streets') await getStreetFromDatabase()
    if (snap.key === 'railroads') await getRailroadsFromDatabase()
    if (snap.key === 'companies') await getCompanyFromDatabase()
    // await getDicesDB()
  })
}
