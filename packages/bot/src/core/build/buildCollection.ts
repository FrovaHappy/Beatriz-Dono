import { Collection } from 'discord.js'
import path from 'node:path'
import { readdirSync } from 'node:fs'

interface Base<B> {
  name: B
}

/**
 * This function is used to build a collection of Builder from a specified folder.
 *
 * @template G - The type of the key in the collection.
 * @template T - The type of the values in the collection.
 */
export default async function BuildCollection<G, T extends Base<G>>(
  pointFolder: string,
  Constructor: new (...args: any[]) => T
): Promise<Collection<G, T>> {
  const collection = new Collection<G, T>()
  const foldersPath = path.join(__dirname, '../../services', pointFolder)
  const folders = ((): string[] | null => {
    console.log(`Scanning ${foldersPath} folders:`)
    try {
      return readdirSync(foldersPath)
    } catch (error) {
      return null
    }
  })()
  if (!folders) return collection

  const folderError = []
  for (const folder of folders) {
    const relativePath = path.join(foldersPath, folder)
    try {
      const command = require(relativePath).default
      if (command instanceof Constructor) {
        collection.set(command.name, command)
      } else {
        throw new Error('The folder/file does not instance of Construct.')
      }
    } catch (error: any) {
      folderError.push({ folder, message: error.message as string })
    }
  }
  console.log(`· ${collection.size} ${pointFolder} correctly scanned.`)
  if (folderError.length > 0) {
    console.log(
      `· ${folderError.length} ${pointFolder} with invalid structure:\n`,
      folderError.map(f => `  ∷ ${f.folder}: ${f.message.replaceAll('\n', '\n     ')}.`).join('\n ')
    )
  }

  return collection
}
