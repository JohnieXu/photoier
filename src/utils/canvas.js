/**
 * 常用比例
 */
export class Ratio {
  static 11 = '1:1'
  static 46 = '4:6'
  static 64 = '6:4'
  static 169 = '16:9'
  static 916 = '9:16'
}

export class Type {
  static vertical = 'vertical'
  static horizontal = 'horizontal'
}

export const getRatio = (str, defaultRatio = 4/6) => {
  if (!str) { return defaultRatio }
  const arr = str.split(':')
  if (arr.length < 2) {
    return defaultRatio
  }
  return arr[0] / arr[1]
}

class ImageRender {
  constructor({ ratio = Ratio[46], baseSize = 2000, padding =  140 }) {
    ratio = getRatio(ratio)
    this.ratio = ratio
    this.padding = padding
    this.type = ratio > 1 ? Type.horizontal : Type.vertical

    let width, height
    if (this.type === Type.horizontal) {
      width = baseSize
      height = baseSize / ratio
    } else {
      width = ratio * baseSize
      height = baseSize
    }
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    this.canvasWidth = width
    this.canvasHeight = height
    this.canvas = canvas
    this.canvasCtx = ctx

    this.imageWidth = width - padding * 2 // 内部图片宽度
    this.imageHeight = 0
  }
  renderBackground() {
    this.canvasCtx.fillStyle = '#fff'
    this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    return this
  }
  renderImage({ ratio, image } = {}) {
    ratio = getRatio(ratio)
    const imageHeight = this.imageWidth / ratio
    this.imageHeight = imageHeight
    this.imageRatio = ratio
    console.log('padding imageWidth imageHeight', this.padding, this.imageWidth, this.imageHeight)
    this.canvasCtx.drawImage(image, this.padding, this.padding, this.imageWidth, this.imageHeight)
    return this
  }
  // 合成文字
  renderText(text = '', {
    fillStyle = '#222',
    font = '60px STSongti-SC-Bold',
    textAlign = 'left'
  } = {}) {
    const fillLine = ({ text, ctx, left, top } = {}) => {
      if (text && ctx) {
        ctx.fillStyle = fillStyle
        ctx.font = font
        ctx.textBaseline = 'top'
        ctx.fillText(text, left, top)
      }
    }
    if (text) {
      const lines = text.split('\n')
      const textGap = 40
      const textHeight = 60 + textGap
      const textTop = (this.canvasHeight - this.imageHeight - this.padding * 2 - lines.length * textHeight) / 2 // 文字距离图片高度
      // const textTop = (this.canvasHeight - this.imageHeight - padding - lines.length * textHeight) / 2 // 文字距离图片高度
      lines.forEach((text, i) => {
        fillLine({
          text,
          ctx: this.canvasCtx,
          left: this.padding,
          top: this.padding + this.imageHeight + textTop + i * textHeight
        })
      })
    }
    return this
  }
  renderRights(rights = '©JohnieXu ALL RIGHTS RESERVED', {
    fillStyle = '#666',
    font = '20px san-serif',
    textAlign = 'center'
  } = {}) {
    const ctx = this.canvasCtx
    ctx.fillStyle = fillStyle
    ctx.font = font
    ctx.textBaseline = 'top'
    ctx.textAlign = textAlign
    ctx.fillText(rights, this.canvasWidth / 2, this.canvasHeight - 20 - 140)
    return this
  }
  render(quality = 1.0) {
    return this.canvas.toDataURL('image/jpeg', quality)
  }
}

const getInnerRatio = (str, defaultRatio = 1/1) => {
  if (!str) { return defaultRatio }
  return defaultRatio
}

/**
 * 使用 canvas 合成生成图片 base64 数据
 * @param {Object} param0
 * @param {String} param0.ratio 图片比例
 * @param {CanvasImageSource} image 图片
 * @param {String} des 描述文字
 * @param {String} font 描述文字样式
 */
export const genImageV2 = ({ ratio = Ratio[46], image, des = '', font = '60px STSongti-SC-Bold' } = {}) => {
  const imageRender = new ImageRender({
    ratio,
    baseSize: 2000,
    padding: 140,
  })
  console.log(imageRender)
  const base64 = imageRender.renderBackground().renderImage({ ratio: Ratio[11], image }).renderText(des, { font }).renderRights().render()
  return base64
}

/**
 * 使用 canvas 合成生成图片 base64 数据
 * @param {Object} param0
 * @param {String} param0.ratio 图片比例
 * @param {CanvasImageSource} image 图片
 * @param {String} des 描述文字
 * @param {String} font 描述文字样式
 */
export const genImage = ({ ratio = Ratio[46], image, des = '', font = '60px STSongti-SC-Bold' } = {}) => {
  const baseHeight = 2000 // 基础高度（像素）
  // canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 计算总尺寸
  ratio = getRatio(ratio)
  const width = ratio * baseHeight
  const height = baseHeight
  canvas.width = width
  canvas.height = height

  // 计算内部图片尺寸
  const innerRatio = getInnerRatio()
  const padding = 140
  const innerWidth = width - padding * 2
  const innerHeight = innerWidth / innerRatio
  
  // 绘制背景
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)

  // 合成图片
  console.log('padding innerWidth innerHeight', padding, innerWidth, innerHeight)
  ctx.drawImage(image, padding, padding, innerWidth, innerHeight)

  // 合成文字
  const fillLine = ({
    text, ctx, left, top
  } = {}) => {
    if (text && ctx) {
      ctx.fillStyle = '#222'
      ctx.font = font
      ctx.textBaseline = 'top'
      ctx.fillText(text, left, top)
    }
  }
  if (des) {
    const lines = des.split('\n')
    const textGap = 40
    const textHeight = 60 + textGap
    const textTop = (height - innerHeight - padding * 2 - lines.length * textHeight) / 2 // 文字距离图片高度
    // const textTop = (height - innerHeight - padding - lines.length * textHeight) / 2 // 文字距离图片高度
    lines.forEach((text, i) => {
      fillLine({
        text,
        ctx,
        left: padding,
        top: padding + innerHeight + textTop + i * textHeight
      })
    })
  }
  
  // 版权
  const rights = '©JohnieXu ALL RIGHTS RESERVED'
  ctx.fillStyle = '#666'
  ctx.font = '20px san-serif'
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(rights, width / 2, height - 20 - 140)
    
  return canvas.toDataURL('image/jpeg', 1.0)
}
