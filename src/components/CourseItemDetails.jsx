import React, { useState } from 'react';
import axios from 'axios';

const CourseItemDetails = () => {
  const [postId, setPostId] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async (retryCount = 0) => {
    if (!postId) {
      setError('Post ID is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      setComments(response.data);
    } catch (err) {
      if (retryCount < 3) {
        // Retry after 1 second
        setTimeout(() => fetchComments(retryCount + 1), 1000);
      } else {
        setError('Failed to fetch comments after 3 attempts.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Course Item Details</h1>
      <input
        type="number"
        placeholder="Enter Post ID"
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
        className="border p-2 w-full mt-2"
      />
      <button onClick={() => fetchComments()} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">
        Get Comments
      </button>
      
      {loading && <p className="text-yellow-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {comments.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Comments</h2>
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>{comment.body}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseItemDetails;
