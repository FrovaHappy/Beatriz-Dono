import { getI18n } from '@/i18n'
import messageHasOcurredAnError from '@/shared/message.hasOcurredAnError'
import type { MessageOptions } from '@/types/main'
import formatterText from '@libs/formatterText'
import { Collection, Colors, EmbedBuilder, type Locale, type Snowflake } from 'discord.js'

interface Props {
  id: Snowflake
  cooldown: number
  type: string
  name: string
  locale: Locale
}
/**
 * @returns `true` if the commands/buttons have access to execute
 */
export default function isCooldownEnable(props: Props): MessageOptions | undefined {
  const { config } = globalThis
  const { id, cooldown, type, name, locale } = props
  const i18n = getI18n(locale, 'general')
  const { cooldowns } = globalThis
  const cooldownName = `${type}-${name}`
  if (!cooldowns.has(cooldownName)) {
    cooldowns.set(cooldownName, new Collection())
  }

  const now = Date.now()
  try {
    const timestamps = cooldowns.get(cooldownName)
    if (!timestamps) throw new Error()
    const cooldownAmount = cooldown * 1000

    if (timestamps.has(id)) {
      const expirationTime = Math.round(((timestamps.get(id) ?? 0) + cooldownAmount) / 1000)
      return {
        embeds: [
          new EmbedBuilder({
            title: i18n.errorCooldown.title,
            description: formatterText(i18n.errorCooldown.description, { slot0: `<t:${expirationTime}:R>` }),
            color: Colors.Orange,
            footer: { text: i18n.errorCooldown.footer }
          })
        ]
      }
    }
    timestamps.set(id, now)
    setTimeout(() => {
      timestamps.delete(id)
    }, cooldownAmount)
    return
  } catch (e) {
    console.error(e)
    return messageHasOcurredAnError(locale, `cooldowns: ${cooldownName}`)
  }
}
