import { useState } from 'react';
import { readImageFile } from './utils/image';
import { genImage } from './utils/canvas';
import download from './utils/download';
import './App.css';
import domtoimage from 'dom-to-image';
// import Logo from './logo.svg';

function App() {
  const [imageSrc, setImageSrc] = useState('');
  const [description, setDescription] = useState('在这里留下作品的精彩故事吧！');

  const onReadImageLoad = () => {}
  const onReadImageError = () => {}
  const onReadImageDone = (e) => {
    console.log(e);
  }

  const handleImageChange = (e) => {
    console.log(e);
    console.log(e.target.files);
    const files = e.target.files || [];
    const file = files[0];
    if (file) {
      const src = URL.createObjectURL(file);
      setImageSrc(src);
      readImageFile({
        file: files[0],
        onLoad: onReadImageLoad,
        onError: onReadImageError,
      })
        .then(onReadImageDone)
        .catch((e) => {
          console.error(e);
          this.Toast(e.message);
        });
    }
  }
  
  const handleDescriptionChange = (e) => {
    // console.log(e);
    setDescription(e.target.value);
  }

  const handleSaveClick = () => {
    const el = document.querySelector('.preview-box');
    if (!el) {
      window.alert('作品还未制作好，请稍后重试');
      return;
    }
    // domtoimage.toJpeg(el).then((dataUrl) => {
    //   download(dataUrl, Date.now(), 'image/jpg');
    // }).catch((e) => {
    //   window.alert(e.message);
    // });
    download(genImage({
      ratio: '4:6',
      image: document.querySelector('.image'),
      des: description,
    }), Date.now(), 'image/jpeg')
  }

  return (
    <div className="app">
      <section className='box'>
        <div className='left'>
          <div className='preview-box'>
            <img className='image' src={imageSrc} alt=""></img>
            <div className='description'>{description}</div>
          </div>
          {/* <canvas id="canvas"></canvas> */}
        </div>
        <div className='right'>
          <div className='content'>
            <input className='line choose' type='file' accept='image/*' onChange={handleImageChange}></input>
            <textarea className='line description' type='textarea' onChange={handleDescriptionChange}></textarea>
            <button className='line save' onClick={handleSaveClick}>保存作品</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
