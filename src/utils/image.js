import EXIF from "./exif";

function noop() {}

export const readImageFile = ({ file, onLoad = noop, onError = noop }) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (mevt) => {
      onLoad();
      let file = mevt.target;
      let result = file.result;
      choosePhoto(result).then(resolve, reject);
    };
    reader.onerror = (e) => {
      console.error(e);
      onError();
      if (["image/heic", "image/heif"].includes(file.type)) {
        reject(new Error("HEIF格式图片暂不支持"));
        return;
      }
      reject(new Error("图片加载失败"));
    };
  });
};

const choosePhoto = (result) => {
  return new Promise((resolve, reject) => {
    let mimg = new Image();
    mimg.crossOrigin = "Anonymous";
    mimg.src = result;
    mimg.onload = () => {
      let Orientation;
      let imgWidth = 0;
      let imgHeight = 0;
      try {
        EXIF.getData(mimg, function () {
          Orientation = EXIF.getTag(this, "Orientation");
          imgWidth = EXIF.getTag(this, "PixelXDimension");
          imgHeight = EXIF.getTag(this, "PixelYDimension");
        });
        // eslint-disable-next-line eqeqeq
        if (
          Orientation == 6 &&
          imgWidth == mimg.height &&
          imgHeight == mimg.width
        ) {
          Orientation = 0;
        }
      } catch (error) {
        Orientation = 0;
      }
      let kimg = new Image();
      let src = compress(mimg, Orientation);
      kimg.crossOrigin = "Anonymous";
      kimg.src = src;
      kimg.onload = async () => {
        resolve({
          img: kimg,
          imageData: src,
        });
      };
      kimg.onerror = () => {
        reject(new Error("图片加载失败"));
      };
    };
    mimg.onerror = (e) => {
      console.error(e);
      if (["image/heic", "image/heif"].some((s) => result.includes(s))) {
        reject(new Error("HEIF格式图片暂不支持"));
        return;
      }
      reject(new Error("图片加载失败"));
    };
  });
};

const compress = (img, Orientation) => {
  let canvas = document.createElement("canvas");
  // let ctx = canvas.getContext("2d");
  //瓦片canvas
  // let tCanvas = document.createElement("canvas");
  // let tctx = tCanvas.getContext("2d");
  // let initSize = img.src.length;
  let width = img.width;
  let height = img.height;
  canvas.width = width;
  canvas.height = height;

  //修复ios上传图片的时候 被旋转的问题

  switch (Orientation) {
    case 6: //需要顺时针（向左）90度旋转
      return rotateImg(img, "left", canvas);

    case 8: //需要逆时针（向右）90度旋转
      return rotateImg(img, "right", canvas);

    case 3: //需要180度旋转
      // let mdata = rotateImg(img, 'right', canvas); //转两次
      // let newImg = new Image();
      // newImg.src = mdata;
      return rotateImg(img, "180", canvas);

    default:
      return rotateImg(img, "original", canvas);
  }
};

const rotateImg = (img, direction, canvas) => {
  //最小与最大旋转方向，图片旋转4次后回到原方向
  const min_step = 0;
  const max_step = 3;
  if (img == null) return;
  // img的高度和宽度不能在img元素隐藏后获取，否则会出错
  const wh = img.height * img.width;
  let per = 1;
  let maxPix = 3500 * 3500;
  //4 096
  if (wh > maxPix) {
    per = maxPix / wh;
    per = Math.sqrt(per);
  }
  let height = img.height * per;
  let width = img.width * per;
  if (width > 3500) {
    height = Math.round((3500 * height) / width);
    width = 3500;
  }
  if (height > 3500) {
    width = Math.round((3500 * width) / height);
    height = 3500;
  }
  // img.width = width;
  // img.height = height;
  let step = 2;
  if (step == null) {
    step = min_step;
  }
  let imgType = "image/png";
  if (img.src.indexOf(imgType) > 0) {
    imgType = "image/png";
  } else {
    imgType = "image/jpeg";
  }
  // eslint-disable-next-line eqeqeq
  if (direction == "180") {
    step = 2;
  } else if (direction == "right") {
    step++;
    // 旋转到原位置，即超过最大值
    step > max_step && (step = min_step);
  } else if (direction == "original") {
    step = min_step;
  } else {
    step--;
    step < min_step && (step = max_step);
  }
  // 旋转角度以弧度值为参数
  let degree = (step * 90 * Math.PI) / 180;
  let ctx = canvas.getContext("2d");
  // eslint-disable-next-line default-case
  switch (step) {
    case 0:
      canvas.width = width;
      canvas.height = height;
      if (imgType == "image/png") {
        //
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      break;
    case 1:
      canvas.width = height;
      canvas.height = width;
      if (imgType == "image/png") {
        //
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.rotate(degree);
      ctx.drawImage(img, 0, -height, width, height);
      break;
    case 2:
      canvas.width = width;
      canvas.height = height;
      if (imgType == "image/png") {
        //
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.rotate(degree);
      ctx.drawImage(img, -width, -height, width, height);
      break;
    case 3:
      canvas.width = height;
      canvas.height = width;
      if (imgType == "image/png") {
        //
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.rotate(degree);
      ctx.drawImage(img, -width, 0, width, height);
      break;
  }
  // 生成img图片
  if (imgType == "image/png") {
    return canvas.toDataURL(imgType, 1.0);
  } else {
    // ctx.fillStyle = "#fff";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 1.0);
  }
};
