import React from 'react'
import Button from './Button'

// Simple home page with a single action button
const Home: React.FC = () => {
  const handleClick = () => {
    // For demonstration, show a quick feedback. Could navigate elsewhere if desired.
    alert('Button clicked!')
    // Example: navigate('/products')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
    >
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Home</h1>
        <p className="text-gray-600 mb-6">Welcome to the Onja Products home page.</p>
        <Button onClick={handleClick} text="Click Me" className="bg-black text-white px-6 py-3 rounded-lg" />
      </div>
    </div>
  )
}

export default Home
