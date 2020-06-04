import axios from 'axios';
export default {
    FETCH_POSTS_DETAILS: () => axios.get('/posts?per_page=100')
}