import React from 'react';

const Table = ({ 
  columns, 
  data, 
  loading, 
  error,
  emptyMessage = "No data available.",
  loadingSpinner,
  onRowClick,
  rowActions,
  currentPage,
  itemsPerPage,
  onPageChange,
  totalItems
}) => {
  if (loading) {
    return loadingSpinner || (
      <div className="spinner-border text-primary spinner" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger ms-2">{error}</p>;
  }

  if (!data || data.length === 0) {
    return <p className="mt-3 ms-3">{emptyMessage}</p>;
  }

  return (
    <div> {/* Added margin to prevent horizontal scroll */}
      <div className="table-responsive">
        <table className="table table-default table-hover table-striped-columns table-borderless mt-2">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="text-center" // Center align headers
                  style={{ minWidth: column.minWidth }} // Optional minimum width for columns
                >
                  {column.header}
                </th>
              ))}
              {rowActions && <th className="text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr 
                key={item.id || rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                style={onRowClick ? { cursor: 'pointer' } : {}}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className="text-center align-middle" // Center align and vertically center content
                  >
                    {column.render 
                      ? column.render(item, rowIndex + 1 + (currentPage - 1) * itemsPerPage)
                      : item[column.accessor]
                    }
                  </td>
                ))}
                {rowActions && (
                  <td className="text-center align-middle">
                    {rowActions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalItems > itemsPerPage && (
        <nav className="d-flex justify-content-center mt-3">
          <ul className="pagination">
            {Array.from(
              { length: Math.ceil(totalItems / itemsPerPage) },
              (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  <a
                    onClick={() => onPageChange(i + 1)}
                    className="page-link"
                    style={{ cursor: 'pointer' }}
                  >
                    {i + 1}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Table;