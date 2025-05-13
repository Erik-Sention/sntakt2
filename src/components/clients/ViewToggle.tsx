'use client';

import { ViewMode } from '@/types';

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => onViewChange('grid')}
        className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
          activeView === 'grid'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v-5h1v5h5v1h-5v5h-1v-5H4z" clipRule="evenodd" />
        </svg>
        Lista
      </button>
      <button
        type="button"
        onClick={() => onViewChange('calendar')}
        className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
          activeView === 'calendar'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        Kalender
      </button>
    </div>
  );
} 