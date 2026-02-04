import React from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
        >
            <div className="max-w-md w-full text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Home</h1>
                <p className="text-gray-600 mb-6">Welcome to the Onja Products home page.</p>
                <Button onClick={() => navigate("/products")} text="See our products" className="bg-black text-white px-6 py-3 rounded-lg" />
            </div>
        </div>
    )
}

export default Home
