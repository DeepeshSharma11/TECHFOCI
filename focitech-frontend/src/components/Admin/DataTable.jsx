// src/components/Admin/DataTable.jsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { 
  ChevronUp, ChevronDown, Search, Filter, 
  ChevronLeft, ChevronRight, MoreVertical,
  Download, Edit, Trash2, Eye, RefreshCw
} from 'lucide-react';

const DataTable = ({
  columns,
  data,
  loading = false,
  searchable = true,
  sortable = true,
  selectable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  onExport,
  actions = true,
  emptyMessage = 'No data available',
  searchPlaceholder = 'Search...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Search
    if (searchTerm && searchable) {
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
    
    // Sort
    if (sortColumn && sortable) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [data, searchTerm, sortColumn, sortDirection, columns, searchable, sortable]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  // Handlers
  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleAction = (action, row, index) => {
    switch(action) {
      case 'edit':
        onEdit?.(row, index);
        break;
      case 'delete':
        onDelete?.(row, index);
        break;
      case 'view':
        onView?.(row, index);
        break;
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-white/5 rounded-3xl p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-3xl overflow-hidden">
      {/* Table Header with Controls */}
      <div className="p-6 border-b border-white/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {searchable && (
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                title="Refresh"
              >
                <RefreshCw size={18} />
              </button>
            )}
            
            {onExport && (
              <button
                onClick={onExport}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                title="Export"
              >
                <Download size={18} />
              </button>
            )}
            
            <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        {/* Selected Actions */}
        {selectable && selectedRows.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-500">
                {selectedRows.size} item{selectedRows.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 rounded-lg">
                  Bulk Action
                </button>
                <button 
                  onClick={() => setSelectedRows(new Set())}
                  className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-white/5">
            <tr>
              {selectable && (
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:ring-blue-500"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider ${
                    sortable ? 'cursor-pointer hover:text-slate-300' : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortable && sortColumn === column.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUp size={14} /> : 
                        <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              
              {actions && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-white/5">
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-6 py-16 text-center"
                >
                  <div className="text-slate-500">
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  className={`hover:bg-white/5 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleSelectRow(rowIndex)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:ring-blue-500"
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      {column.render ? (
                        column.render(row[column.key], row, rowIndex)
                      ) : (
                        <div className="text-sm text-slate-300 truncate max-w-[200px]">
                          {row[column.key] || '-'}
                        </div>
                      )}
                    </td>
                  ))}
                  
                  {actions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('view', row, rowIndex);
                            }}
                            className="p-1.5 text-blue-500/50 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('edit', row, rowIndex);
                            }}
                            className="p-1.5 text-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('delete', row, rowIndex);
                            }}
                            className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        
                        <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {((currentPage - 1) * pageSize) + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredData.length)} of{' '}
              {filteredData.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <span className="px-2 text-slate-400">...</span>
              )}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  searchable: PropTypes.bool,
  sortable: PropTypes.bool,
  selectable: PropTypes.bool,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  onRowClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onRefresh: PropTypes.func,
  onExport: PropTypes.func,
  actions: PropTypes.bool,
  emptyMessage: PropTypes.string,
  searchPlaceholder: PropTypes.string
};

export default DataTable;