import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState(null);       // Stores fetched users
  const [loading, setLoading] = useState(false); // Indicates loading state
  const [error, setError] = useState(null);     // Stores error messages

  useEffect(() => {
    // Define fetchData inside useEffect to avoid missing dependencies
    const fetchData = async (retryCount = 0) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setData(response.data);
      } catch (err) {
        if (retryCount < 3) {
          // Retry after 1 second
          setTimeout(() => fetchData(retryCount + 1), 1000);
        } else {
          setError('Failed to fetch data after 3 attempts.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Invoke the fetchData function
  }, []); // Empty dependency array ensures this runs once on mount

  // Conditional Rendering based on state
  if (loading) return <p className="text-yellow-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold">Home</h1>
      {data && (
        <ul>
          {data.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
