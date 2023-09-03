import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref } from 'firebase/database'

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    databaseURL: import.meta.env.VITE_DATABASEURL,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID,
  }

  const app = initializeApp(firebaseConfig)

  // const auth = initializeAuth(app, {
  //   persistence:
  //     typeof window === 'undefined' ? inMemoryPersistence : [indexedDBLocalPersistence, browserLocalPersistence],
  // })
  const auth = getAuth(app)

  const database = getDatabase(app)
  const analytics = getAnalytics(app)

  return {
    provide: {
      analytics,
      auth,
      ref: (path?: string) => {
        if (path) return ref(database, path)
        return ref(database)
      },
    },
  }
})
