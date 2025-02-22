{/* Paginação */}
        <div className="flex justify-center mt-10 mb-4">
          <div className="flex items-center space-x-2">
            <button
              className={`"px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center" ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPage === 1}
              onClick={() => handlePageChange("prev")}
            >
              <FaArrowLeft className="w-20" /> 
            </button>
            <span className="text-sm text-gray-600 dark:text-white">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className={`"px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center" ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange("next")}
            >
               <FaArrowRight className="w-20" />
            </button>
          </div>
        </div>