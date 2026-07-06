function TableSearch({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full
        md:w-80
        px-4
        py-2
        rounded-lg
        border
        border-gray-300
        dark:border-gray-600
        bg-white
        dark:bg-gray-800
        text-gray-900
        dark:text-white
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
      "
    />
  );
}

export default TableSearch;