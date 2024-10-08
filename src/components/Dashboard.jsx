import React, {useState, useEffect} from 'react'
import {getUsers, createPost, getComments} from '../services/api'
import APIChainVisualizer from './APIChainVisualizer'

const Dashboard = () => {
  // State Variables
  const [users, setUsers] = useState([]) // Stores fetched users
  const [posts, setPosts] = useState([]) // Stores created posts
  const [comments, setComments] = useState([]) // Stores comments related to posts
  const [loading, setLoading] = useState(false) // Indicates loading state
  const [error, setError] = useState(null) // Stores error messages
  const [postData, setPostData] = useState({
    // Stores form input data for creating a post
    title: '',
    body: '',
    userId: '',
  })

  // Fetch Users on Component Mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Function to Fetch Users
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getUsers()
      setUsers(response.data)
    } catch (err) {
      setError('Failed to fetch users.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Function to Handle API Call Chain
  const handleAPICallChain = async () => {
    setLoading(true)
    setError(null)
    const steps = [
      'Fetch Users List (GET)',
      'Create Post with selected User ID (POST)',
      'Fetch Comments for the created Post (GET)',
    ]
    try {
      // Step 1: Get Users
      const usersResponse = await getUsers()
      setUsers(usersResponse.data)

      // Step 2: Create Post with userId from users
      const userId = usersResponse.data[0]?.id
      if (!userId) throw new Error('No users available to create a post.')

      const newPost = {
        title: postData.title || 'New Post',
        body: postData.body || 'This is a new post.',
        userId,
      }
      const postResponse = await createPost(newPost)
      setPosts([...posts, postResponse.data])

      // Step 3: Get Comments for the new post
      const commentsResponse = await getComments(postResponse.data.id)
      setComments(commentsResponse.data)

      // Optionally, update steps to reflect success
      steps.push('API Chain Completed Successfully')
    } catch (err) {
      setError(err.message || 'An error occurred.')
      steps.push(`Error: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
      // You can manage `steps` as a state if dynamic updates are needed
    }
  }

  // Function to Handle Creating a Post Independently
  const createPostHandler = async () => {
    if (!postData.userId) {
      setError('User ID is required to create a post.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await createPost(postData)
      setPosts([...posts, response.data])
      // Optionally, fetch comments for the new post
      const commentsResponse = await getComments(response.data.id)
      setComments(commentsResponse.data)
    } catch (err) {
      setError('Failed to create post.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>

      {/* Button to Run API Call Chain */}
      <button
        onClick={handleAPICallChain}
        className='bg-blue-600 text-white px-4 py-2 rounded'
      >
        Run API Chain
      </button>

      {/* Loading Indicator */}
      {loading && <p className='text-yellow-500'>Loading...</p>}

      {/* Error Message */}
      {error && <p className='text-red-500'>{error}</p>}

      {/* API Chaining Visualization */}
      <APIChainVisualizer
        steps={[
          'Fetch Users List (GET)',
          'Create Post with selected User ID (POST)',
          'Fetch Comments for the created Post (GET)',
        ]}
      />

      {/* Display Users */}
      {users.length > 0 && (
        <div className='mt-4'>
          <h2 className='text-xl font-semibold'>Users</h2>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create New Post Form */}
      <div className='mt-6'>
        <h2 className='text-xl font-semibold'>Create New Post</h2>
        <input
          type='text'
          placeholder='Title'
          value={postData.title}
          onChange={e => setPostData({...postData, title: e.target.value})}
          className='border p-2 w-full mt-2'
        />
        <textarea
          placeholder='Body'
          value={postData.body}
          onChange={e => setPostData({...postData, body: e.target.value})}
          className='border p-2 w-full mt-2'
        ></textarea>
        <select
          value={postData.userId}
          onChange={e => setPostData({...postData, userId: e.target.value})}
          className='border p-2 w-full mt-2'
        >
          <option value=''>Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button
          onClick={createPostHandler}
          className='bg-green-500 text-white px-4 py-2 rounded mt-2'
        >
          Create Post
        </button>
      </div>

      {/* Display Posts */}
      {posts.length > 0 && (
        <div className='mt-6'>
          <h2 className='text-xl font-semibold'>Posts</h2>
          <ul>
            {posts.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Comments */}
      {comments.length > 0 && (
        <div className='mt-6'>
          <h2 className='text-xl font-semibold'>Comments</h2>
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>{comment.body}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Dashboard
