function TablePagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) {
  return (
    <div className="flex justify-end items-center gap-4 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={onPrevious}
        className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span className="font-semibold text-gray-800 dark:text-white">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={onNext}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default TablePagination;