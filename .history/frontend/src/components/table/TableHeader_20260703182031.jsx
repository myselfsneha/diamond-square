function TableHeader({
  title,
  buttonText,
  onClick,
}) {
  return (
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {title}
      </h2>

      {buttonText && (
        <button
          onClick={onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default TableHeader;