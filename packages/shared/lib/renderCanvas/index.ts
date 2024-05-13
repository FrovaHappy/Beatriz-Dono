import { type Base, type Layer, type Text, type TextBase, type User, type Image, type Icon } from '@type/Canvas'
import { renderText } from './renderText'
import { renderImage } from './renderImage'
import { renderIcon } from './renderIcon'

export default function renderCanvas(
  layers: Layer[],
  base: Base & TextBase,
  user: User,
  ctx: CanvasRenderingContext2D,
  Path2DInstance: typeof Path2D,
  images: Record<string, HTMLImageElement>
) {
  ctx.clearRect(0, 0, base.width, base.height)
  ctx.save()
  if (base.color) {
    ctx.fillStyle = base.color
    ctx.fillRect(0, 0, base.width, base.height)
  }
  ctx.restore()
  for (const layer of layers) {
    switch (layer.type) {
      case 'text':
        renderText(layer as Text, ctx, user, base)
        break
      case 'image':
        renderImage(layer as Image, ctx, base, images[layer.id])
        break
      case 'icon':
        renderIcon(layer as Icon, ctx, base, Path2DInstance, images[layer.id])
        break
    }
  }
  return ctx
}
