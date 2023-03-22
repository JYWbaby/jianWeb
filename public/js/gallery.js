import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data
export const uploadPhotos = async (data) => {
  try {
    const url = '/api/v1/photos/';

    const res = await axios({
      method: 'Post',
      url,
      data,
    });

    if (res.data.status === 'success') {
        location.assign('/gallery')
      }

  } catch (err) {
    console.log(err);
  }
};