import { defineStore, storeToRefs } from 'pinia'

export const useRoom = defineStore('RoomPinia', {
  state: () => ({
    room: <number | null>null,
    admin: <string | null>null,
    title: <string | null>null,
    edition: <string | null>null,
  }),
  getters: {
    isValidRoom({ room }) {
      const { user } = storeToRefs(useUser())
      return user.value !== null && room !== null && user.value.room === room
    },
    isAdmin({ admin }) {
      const { uid } = storeToRefs(useUser())
      return admin === uid.value
    },
  },
  actions: {
    setRoom(room: number) {
      this.room = room
    },
    deleteRoom() {
      const { user } = storeToRefs(useUser())
      if (user.value) delete user.value['room']
      this.room = null
      this.admin = null
      this.title = null
      this.edition = null
    },
  },
})
