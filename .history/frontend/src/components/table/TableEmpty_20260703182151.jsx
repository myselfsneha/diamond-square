function TableEmpty({
  message = "No records found",
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-10 text-center">
      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
        {message}
      </h3>
    </div>
  );
}

export default TableEmpty;