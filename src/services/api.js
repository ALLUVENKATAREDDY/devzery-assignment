import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Fetch Users
export const getUsers = () => axios.get(`${BASE_URL}/users`);

// Create Post
export const createPost = (postData) => axios.post(`${BASE_URL}/posts`, postData);

// Get Comments by Post ID
export const getComments = (postId) => axios.get(`${BASE_URL}/comments`, {
  params: { postId },
});
