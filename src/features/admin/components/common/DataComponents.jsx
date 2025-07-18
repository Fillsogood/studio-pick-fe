import React from 'react';
import { Card } from './index';

// 통계 카드 컴포넌트
export const StatCard = ({ title, value, change, icon: Icon, color = "teal", loading = false }) => (
  <Card className="relative overflow-hidden">
    {loading ? (
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    )}
  </Card>
);

// 테이블 컴포넌트 개선
export const Table = ({ 
  headers, 
  data, 
  actions, 
  onRowClick, 
  loading = false, 
  emptyMessage = "데이터가 없습니다.",
  emptyIcon: EmptyIcon = null 
}) => (
  <Card>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {headers.map((header, index) => (
              <th key={index} className="text-left py-3 px-4 font-medium text-gray-700">
                {header}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="text-right py-3 px-4 font-medium text-gray-700">액션</th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // 로딩 스켈레톤
            [...Array(5)].map((_, index) => (
              <tr key={index} className="border-b border-gray-100">
                {headers.map((_, cellIndex) => (
                  <td key={cellIndex} className="py-3 px-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="py-3 px-4">
                    <div className="animate-pulse flex justify-end space-x-2">
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row, index)}
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-3 px-4 text-gray-900">
                    {cell}
                  </td>
                ))}
                {actions && actions.length > index && actions[index] && (
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {Array.isArray(actions[index]) ? (
                        actions[index].map((action, actionIndex) => (
                          <div key={actionIndex} onClick={(e) => e.stopPropagation()}>
                            {action}
                          </div>
                        ))
                      ) : (
                        <div onClick={(e) => e.stopPropagation()}>
                          {actions[index]}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            // 빈 상태
            <tr>
              <td colSpan={headers.length + (actions && actions.length > 0 ? 1 : 0)} className="py-12">
                <div className="text-center">
                  {EmptyIcon && <EmptyIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />}
                  <p className="text-gray-500">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Card>
);

// 차트 컴포넌트 개선 (간단한 막대 차트)
export const SimpleBarChart = ({ data, title, loading = false, color = "teal" }) => (
  <Card>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {loading ? (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    ) : data.length > 0 ? (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 truncate" title={item.label}>
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(item.percentage || 0, 100)}%` }}
              />
            </div>
            <div className="w-12 text-sm font-medium text-gray-900 text-right">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        차트 데이터가 없습니다.
      </div>
    )}
  </Card>
);

// 파이 차트 컴포넌트 개선
export const SimplePieChart = ({ data, title, loading = false }) => {
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const colors = ['teal', 'blue', 'green', 'yellow', 'purple', 'red', 'orange', 'pink'];
  
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {loading ? (
        <div className="animate-pulse">
          <div className="flex items-center justify-center mb-4">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      ) : data.length > 0 && total > 0 ? (
        <>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="transparent"
                  className="text-gray-200"
                />
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const strokeDasharray = `${percentage * 3.51} 351`;
                  const color = colors[index % colors.length];
                  
                  return (
                    <circle
                      key={index}
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="transparent"
                      strokeDasharray={strokeDasharray}
                      className={`text-${color}-600`}
                      strokeDashoffset={index * -87.75}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {data.map((item, index) => {
              const color = colors[index % colors.length];
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${color}-600`} />
                    <span className="text-sm text-gray-600 truncate" title={item.label}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          차트 데이터가 없습니다.
        </div>
      )}
    </Card>
  );
};

// 새로운 컴포넌트: 메트릭 카드
export const MetricCard = ({ title, value, unit, change, trend, icon: Icon, color = "teal" }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center">
          <Icon className={`w-8 h-8 text-${color}-600 mr-3`} />
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {unit && <p className="ml-1 text-sm text-gray-500">{unit}</p>}
            </div>
          </div>
        </div>
        {change && (
          <div className="mt-2 flex items-center">
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs 이전 기간</span>
          </div>
        )}
      </div>
    </div>
  </Card>
);

// 새로운 컴포넌트: 진행률 카드
export const ProgressCard = ({ title, current, total, color = "teal", unit = "" }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>{current.toLocaleString()}{unit}</span>
        <span>{total.toLocaleString()}{unit}</span>
      </div>
    </Card>
  );
};

// 새로운 컴포넌트: 알림 카드
export const AlertCard = ({ type = "info", title, message, action, onAction, onClose }) => {
  const typeStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-700",
    success: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    error: "bg-red-50 border-red-200 text-red-700"
  };
  
  return (
    <div className={`border rounded-lg p-4 ${typeStyles[type]}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-sm font-medium mb-1">{title}</h3>
          <p className="text-sm opacity-90">{message}</p>
          {action && (
            <button
              onClick={onAction}
              className="mt-2 text-sm underline hover:no-underline"
            >
              {action}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-sm opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// 새로운 컴포넌트: 간단한 라인 차트
export const SimpleLineChart = ({ data, title, loading = false, color = "teal" }) => {
  const maxValue = Math.max(...data.map(item => item.value || 0));
  
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex justify-between">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded w-16"></div>
            ))}
          </div>
        </div>
      ) : data.length > 0 ? (
        <div className="space-y-4">
          <div className="h-32 relative">
            <svg className="w-full h-full">
              <polyline
                points={data.map((item, index) => 
                  `${(index / (data.length - 1)) * 100}%,${100 - (item.value / maxValue * 80)}%`
                ).join(' ')}
                fill="none"
                stroke={`rgb(var(--color-${color}-600))`}
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              {data.map((item, index) => (
                <circle
                  key={index}
                  cx={`${(index / (data.length - 1)) * 100}%`}
                  cy={`${100 - (item.value / maxValue * 80)}%`}
                  r="3"
                  fill={`rgb(var(--color-${color}-600))`}
                  className="drop-shadow-sm"
                />
              ))}
            </svg>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            {data.map((item, index) => (
              <span key={index} className="truncate" title={item.label}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          차트 데이터가 없습니다.
        </div>
      )}
    </Card>
  );
};

// 새로운 컴포넌트: 상태 표시기
export const StatusIndicator = ({ status, text, size = "sm" }) => {
  const statusColors = {
    active: "bg-green-400",
    inactive: "bg-gray-400",
    pending: "bg-yellow-400",
    error: "bg-red-400",
    processing: "bg-blue-400"
  };
  
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`${sizes[size]} rounded-full ${statusColors[status] || statusColors.inactive}`}></div>
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
};

// 새로운 컴포넌트: 빈 상태 표시
export const EmptyState = ({ icon: Icon, title, message, action, onAction }) => (
  <div className="text-center py-12">
    {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{message}</p>
    {action && (
      <button
        onClick={onAction}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
      >
        {action}
      </button>
    )}
  </div>
);
