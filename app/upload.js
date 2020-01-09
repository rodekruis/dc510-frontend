import axios from 'axios';
import { IMAGES_DIR, API_HOST } from './constants';

const UPLOAD_ENDPOINT = API_HOST + '/api/upload';

function upload(image) {
  const formData = new FormData();
  formData.append('image', {
    uri: IMAGES_DIR + '/' + image,
    name: image,
    type: 'image/jpg'
  });
  return axios.post(UPLOAD_ENDPOINT, formData).then(r => r.data);
}

export default upload;
