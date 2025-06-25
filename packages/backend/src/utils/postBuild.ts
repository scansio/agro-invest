import { BASE_PATH, createIndexHtmlRecursively } from '../common'

export const run = async () => {
  await createIndexHtmlRecursively(BASE_PATH)
}
