/* eslint-disable no-var */
import type { Collection } from 'discord.js'
import type { ButtonNames, CommandNames, MenuNames, ModalNames } from './const/interactionsNames'
import type { Config } from './core/config'
import type { Button } from './shared/BuildButtons'
import type { Command } from './shared/BuildCommand'
declare global {
  var commands: Collection<CommandNames | string, Command>
  var buttons: Collection<ButtonNames | string, Button>
  var menus: Collection<MenuNames | string, Menu>
  var modals: Collection<ModalNames | string, Modal>
  var cooldowns: Collection<string, Collection<string, number>>
  var config: Config
}
