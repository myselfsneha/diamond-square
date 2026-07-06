function DataTable({
  columns = [],
  data = [],
  keyField = "id",
}) {
  if (!Array.isArray(columns)) columns = [];
  if (!Array.isArray(data)) data = [];

  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-left whitespace-nowrap"
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
                colSpan={columns.length}
                className="text-center py-8 text-gray-500 dark:text-gray-300"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row[keyField] ?? index}
                className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-5 py-3 text-gray-800 dark:text-gray-200"
                  >
                    {col.render
                      ? col.render(row)
                      : row[col.key] ?? "-"}
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