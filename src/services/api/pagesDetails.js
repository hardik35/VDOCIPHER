import axios from 'axios';
export default {
    FETCH_PAGES_DETAILS: () => axios.get('/pages?per_page=100')
}