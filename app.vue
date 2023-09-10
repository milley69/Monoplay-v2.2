<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { User } from './types'

const { initUser } = useAuthFB()
const { setUser } = useUser()
const { user } = storeToRefs(useUser())

const onLog = () => {
  console.clear()
  console.log(
    `%c                                                  
%c   💸💸💸💸💸💸💸💸💸💸💸💸💸💸💸💸💸💸💸💸  
%c  ___  ___                        _               
  |  \\/  |                       | |              
  | .  . | ___  _ __   ___  _ __ | | __ _ _   _   
  | |\\/| |/ _ \\| '_ \\ / _ \\| '_ \\| |/ _\` | | | |  
  | |  | | (_) | | | | (_) | |_) | | (_| | |_| |  
  \\_|  |_/\\___/|_| |_|\\___/| .__/|_|\\__,_|\\__, |  
                           | |             __/ |  
                           |_|            |___/   
                                                  
%c  🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡   
                                                  
   ---                                      ---   
%c   Если ты нашел какой-то баг или уязвимость на   
   сайте, или у тебя есть другой технический      
   вопрос, пиши сюда - milleystorm@gmail.com      
%c   ---                                      ---   
%c                                                  `,
    'font-size: 13px; background: #15151B; color: #8F8F94; border-radius: 16px 16px 0px 0px',
    'font-size: 13px; background: #15151B; color: #8F8F94',
    'font-size: 13px; background: #15151B; color: white',
    'font-size: 13px; background: #15151B; color: #8F8F94',
    'font-size: 13px; background: #15151B; color: white',
    'font-size: 13px; background: #15151B; color: #8F8F94',
    'font-size: 13px; background: #15151B; color: #8F8F94; border-radius: 0px 0px 16px 16px'
  )
}

onMounted(async () => {
  onLog()
  const lsUser = localStorage.getItem('monoplay_user')
  const user: User | null = lsUser ? JSON.parse(lsUser) : null
  if (user) setUser(user)
  else await initUser()
})

watch(
  () => user.value,
  (newUser) => {
    if (newUser) localStorage.setItem('monoplay_user', JSON.stringify(newUser))
    else localStorage.removeItem('monoplay_user')
  },
  { deep: true }
)
</script>

<style>
::-webkit-scrollbar {
  width: 0;
}
.qwe {
  border: 1px solid salmon;
}
.qwe2 * {
  border: 1px solid salmon;
}
.qwe3 > * {
  border: 1px solid salmon;
}
</style>
