import React from 'react';

const APIChainVisualizer = ({ steps }) => {
  return (
    <div className="my-4 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">API Chaining Flow</h2>
      <ol className="list-decimal list-inside">
        {steps.map((step, index) => (
          <li key={index} className="mt-2">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default APIChainVisualizer;
