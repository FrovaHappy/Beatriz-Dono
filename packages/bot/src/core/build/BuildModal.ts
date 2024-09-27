import type { ModalNames } from '@/const/interactionsNames'
import type { MessageOptions, Resolve, Scope } from '@/types/main'
import type { ModalBuilder, ModalSubmitInteraction, PermissionResolvable } from 'discord.js'
import PERMISSIONS_BASE from '../../const/PermissionsBase'
import isCooldownEnable from './shared/isCooldownEnable'
import requiresBotPermissions from './shared/requiresBotPermissions'

/**
 * #### Constructor
 * * ` data `: The modalBuilder.customId(name) not is required.
 * * ` update `: If is true, the message where the event was triggered will be updated, otherwise it will send a new message.
 */
class BuildModal {
  name: ModalNames
  scope: Scope
  ephemeral: boolean
  resolve: Resolve
  permissions: PermissionResolvable[]
  cooldown: number
  data: ModalBuilder
  execute: (e: ModalSubmitInteraction) => Promise<MessageOptions>

  constructor(props: Partial<BuildModal> & Pick<BuildModal, 'name' | 'execute' | 'data' | 'permissions'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? config.cooldown
    this.ephemeral = props.ephemeral ?? false
    this.resolve = props.resolve ?? 'reply'
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }

  static async runInteraction(i: ModalSubmitInteraction) {
    const modal: Modal = globalThis.modals.get(i.customId)

    const getMessage = async () => {
      if (!modal) return { content: 'No se encontró el modal' }
      const messageRequirePermissions = requiresBotPermissions({
        permissions: modal.permissions,
        bot: i.guild?.members.me,
        nameInteraction: i.customId,
        type: 'modal'
      })
      if (messageRequirePermissions) return messageRequirePermissions
      // TODO: add require user permission
      // TODO: add scope validation

      const messageCooldown = isCooldownEnable({
        id: i.user.id,
        cooldown: modal.cooldown,
        name: modal.name,
        type: 'modal'
      })
      if (messageCooldown) return { content: messageCooldown }
      try {
        return await modal.execute(i)
      } catch (error) {
        console.error(error)
        return { content: `Error executing ${modal.name}` }
      }
    }

    try {
      if (modal.resolve === 'defer') await i.deferReply({ ephemeral: modal.ephemeral })

      const message = await getMessage()
      if (!message) return
      if (modal.resolve === 'defer') return await i.editReply(message)
      return await i.reply(message)
    } catch (error) {
      console.error(error)
      return { content: `Error executing ${modal.name}` }
    }
  }
}
export type Modal = InstanceType<typeof BuildModal>
export default BuildModal
