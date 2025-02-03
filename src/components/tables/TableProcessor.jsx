import React from "react";

const TableProcessor = ({ columns, data, onActionClick }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="border-collapse min-w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase">
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-4 py-2">
                  {col.key === "actions" ? (
                    col.renderAction ? (
                      col.renderAction(row, onActionClick)
                    ) : (
                      <span>-</span>
                    )
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableProcessor;