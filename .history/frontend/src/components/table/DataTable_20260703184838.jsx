function DataTable({ columns = [], data = [] }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-left text-sm font-semibold whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="py-8 text-center text-gray-500 dark:text-gray-300"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-5 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap"
                  >
                    {typeof row[col.key] === "function"
                      ? row[col.key]()
                      : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;