export default function GameControls({ 
  onUndo, 
  onReset, 
  onToggleFirstPlayer,
  canUndo, 
  canToggleFirst 
}) {
  return (
    <div className="controls-container mt-6 flex flex-wrap gap-4 md:gap-5 justify-center px-4">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-400 to-blue-500 
                   text-white rounded-2xl font-bold text-base md:text-lg
                   hover:from-blue-500 hover:to-blue-600 
                   active:scale-95 transition-all duration-300
                   disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                   shadow-xl hover:shadow-2xl hover:scale-105
                   border-2 border-blue-600 disabled:border-gray-400
                   flex items-center gap-2"
      >
        <span>↶ 悔棋</span>
      </button>
      
      <button
        onClick={onReset}
        className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-400 to-amber-500 
                   text-white rounded-2xl font-bold text-base md:text-lg
                   hover:from-amber-500 hover:to-amber-600 
                   active:scale-95 transition-all duration-300
                   shadow-xl hover:shadow-2xl hover:scale-105
                   border-2 border-amber-600"
      >
        🔄 重玩
      </button>

      {canToggleFirst && (
        <button
          onClick={onToggleFirstPlayer}
          disabled={!canToggleFirst}
          className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-400 to-purple-500 
                     text-white rounded-2xl font-bold text-base md:text-lg
                     hover:from-purple-500 hover:to-purple-600 
                     active:scale-95 transition-all duration-300
                     disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                     shadow-xl hover:shadow-2xl hover:scale-105
                     border-2 border-purple-600 disabled:border-gray-400"
        >
          ⚫⚪ 切换先手
        </button>
      )}
    </div>
  )
}
