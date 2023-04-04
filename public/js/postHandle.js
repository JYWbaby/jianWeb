import axios from 'axios';
import { showAlert } from './alert';

export const newPost = async (data) => {
  console.log(data);
  try {
    if(data.has('slug')){
      const url ='/api/v1/posts/';
      // handle img here

      const res = await axios({
        method: 'Patch',
        url,
        data,
      });
      if (res.data.status === 'success') {
        location.assign('/')
      }
    }
    else{
      const url ='/api/v1/posts/';
      // handle img here

      const res = await axios({
        method: 'Post',
        url,
        data,
      });
      if (res.data.status === 'success') {
        location.assign('/')
      }
    }

    
  } catch (err) {
      console.log(err);
      //location.reload();
  }
};
  