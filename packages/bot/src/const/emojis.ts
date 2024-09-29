import { parseEmoji, type PartialEmoji } from 'discord.js'

const emojis = {
  vote: '<:Vote:1290031552834830337>',
  book: '<:book:1290030244287217787>',
  kofi: '<:kofi:1290030436705370235>',
  kannaAwave: '<:kannawave:1275989866794192897>',
  sparkles: '<a:sparkles:1275991218383224832>',
  heartVar1: '<:heart:1275997495704686713>'
}
export function getEmoji(emoji: keyof typeof emojis) {
  const emojiSelected = emojis[emoji]
  return parseEmoji(emojiSelected) as PartialEmoji
}

export default emojis