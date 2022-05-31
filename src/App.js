import { useEffect, useState } from 'react';
// import domtoimage from 'dom-to-image';
import { readImageFile } from './utils/image';
import { genImage } from './utils/canvas';
import download from './utils/download';
import './App.css';
import ImagePreview from './components/ImagePreview/ImagePreview';

let img = null;

function App() {
  const [imageData, setImageData] = useState('');
  const [description, setDescription] = useState('在这里留下作品的精彩故事吧！');

  const onReadImageLoad = () => {}
  const onReadImageError = (e) => {
    window.alert(e.message);
  }
  const onReadImageDone = (data) => {
    // console.log(data);
    img = data.img;
    renderImg();
  }

  const renderImg = () => {
    if (!img) {
      console.error('作品还未制作好，请稍后重试');
      return;
    }
    const imageData = genImage({
      ratio: '4:6',
      image: img,
      des: description,
      font: '60px STSongti-SC-Regular'
    });
    setImageData(imageData);
  }

  const handleImageChange = (e) => {
    console.log(e);
    console.log(e.target.files);
    const files = e.target.files || [];
    const file = files[0];
    if (file) {
      readImageFile({
        file,
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
    setDescription(e.target.value);
  }

  const handleSaveClick = () => {
    if (!img) {
      console.error('作品还未制作好，请稍后重试');
      return;
    }
    download(genImage({
      ratio: '4:6',
      image: img,
      des: description,
      font: '60px STSongti-SC-Regular'
    }), Date.now(), 'image/jpeg')
  }

  useEffect(renderImg, [imageData, description]);

  return (
    <div className="app">
      <section className='box'>
        <div className='left'>
          <ImagePreview src={imageData}></ImagePreview>
        </div>
        <div className='right'>
          <div className='content'>
            <input className='line choose' type='file' accept='image/*' onChange={handleImageChange}></input>
            <textarea className='line description' type='textarea' onChange={handleDescriptionChange} value={description}></textarea>
            <button className='line save' onClick={handleSaveClick}>保存作品</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
