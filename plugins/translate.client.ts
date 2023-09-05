export default defineNuxtPlugin((nuxtApp) => {
  const translateIt = (word: string) => {
    switch (word) {
      case 'blue':
        return 'синий'
      case 'brown':
        return 'коричневый'
      case 'green':
        return 'зеленый'
      case 'lightBlue':
        return 'голубой'
      case 'orange':
        return 'оранжевый'
      case 'pink':
        return 'розовый'
      case 'red':
        return 'красный'
      case 'yellow':
        return 'желтый'
      case 'house':
        return 'дом'
      case 'hotel':
        return 'отель'

      default:
        return word
    }
  }

  return {
    provide: {
      translateIt: (word: string) => translateIt(word),
    },
  }
})
