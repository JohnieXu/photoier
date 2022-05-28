import './ImagePreview.css';

function ImagePreview(props) {
  return (
    <div className="c-image-preview">
      {
        props.src ? <img className="image" src={props.src} alt=""></img> : <div className="image image--default"></div>
      }
    </div>
  )
}

export default ImagePreview;
