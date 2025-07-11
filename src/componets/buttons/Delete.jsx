import React from 'react'

const Delete = () => {
  function showModal() {
    const modal = document.getElementById("modal");
    modal.classList.toggle("hidden");
  }
  return (
    <div>
      <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-900 opacity-75" />
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>
        <div
          className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <h1 className="flex justify-center text-blue-700 font-bold">
            Are you sure you want to delete this item?
          </h1>
          <div className="bg-gray-200 px-4 py-3 text-right">
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
              onClick={showModal}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button
              type=""
              onClick={showModal}
              className="py-2 px-4 bg-blue-500 text-white rounded font-medium hover:bg-blue-700 mr-2 transition duration-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Delete