const getRatio = (str, defaultRatio = 4/6) => {
  if (!str) { return defaultRatio }
  const arr = str.split(':')
  if (arr.length < 2) {
    return defaultRatio
  }
  return arr[0] / arr[1]
}

const getInnerRatio = (str, defaultRatio = 1/1) => {
  if (!str) { return defaultRatio }
  return defaultRatio
}

/**
 * 使用 canvas 合成生成图片 base64 数据
 */
export const genImage = ({ ratio = '4:6', image, des = '', font = '60px STSongti-SC-Bold' } = {}) => {
  const baseHeight = 2000 // 基础宽度（像素）
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
  // const imageWidth = image.width
  // const imageHeight = image.height
  // const innerHeight = (height - padding * 2) * 1 / 2 // 内部图片占 1/2 高度
  // const innerWidth = innerHeight * innerRatio
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
      ctx.fillStyle = '#333'
      ctx.font = font
      ctx.textBaseline = 'top'
      ctx.fillText(text, left, top)
    }
  }
  if (des) {
    // ctx.fillStyle = '#333'
    // ctx.font = font
    // ctx.textBaseline = 'top'
    // ctx.fillText(des, padding, padding + innerHeight + padding / 2, width - padding * 2)
    const lines = des.split('\n')
    const textGap = 40
    const textHeight = 60 + textGap
    const textTop = (height - innerHeight - padding - lines.length * textHeight) / 2 // 文字距离图片高度
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
