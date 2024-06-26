import { useCanvasCtx, useShapeModifyCtx } from '@/app/context'
import { type Text, type Image, type Icon } from '@/types/Canvas.types'
import defaultValue from './defaultsValues'
import style from './index.module.scss'
import { useState } from 'react'
import IconPlaylistAdd from '@icons/IconPlaylistAdd'
import IconTextResize from '@icons/IconTextResize'
import IconPhoto from '@icons/IconPhoto'
import IconUserSquare from '@icons/IconUserSquare'
import IconStack from '@icons/IconStack'

export default function NewShape() {
  const [show, setShow] = useState(false)
  const [canvas, setCanvas] = useCanvasCtx()
  const [, setShapeModify] = useShapeModifyCtx()

  function onClick(defaultValue: Text | Image | Icon) {
    return () => {
      const layer = { ...defaultValue, id: Date.now() }
      canvas.layers.push(layer)
      setShapeModify(layer)
      setCanvas({ ...canvas })
      setShow(false)
    }
  }
  const showOptions = show ? style.options__show : style.options
  return (
    <div className={style.content}>
      <p>Canvas</p>
      <span className={style.countStack}>
        {canvas.layers.length} / 10 <IconStack />
      </span>

      <button className={style.newButton} onClick={() => { setShow(!show) }}>
        <IconPlaylistAdd />
        new Shape
      </button>
      <div className={showOptions}>
        <button onClick={onClick(defaultValue.TEXT)}>
          <IconTextResize />
          text
        </button>
        <button onClick={onClick(defaultValue.IMAGE)}>
          <IconPhoto /> image
        </button>
        <button onClick={onClick(defaultValue.ICON)}>
          <IconUserSquare />
          icon
        </button>
      </div>
    </div>
  )
}
