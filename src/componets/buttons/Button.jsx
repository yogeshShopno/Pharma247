import React from 'react'

const Button = () => {
    return (
        <div>
            <button
                type="submit"
                className="w-full text-white mb-5 primary-bg hover:primary-bg focus:ring-4 rounded-lg focus:outline-none focus:ring-blue-100 font-medium dark:shadow-lg dark:shadow-blue-800/80 text-lg px-5 py-3 text-center mt-5"
            >
                Request OTP
            </button>
        </div>
    )
}

export default Button