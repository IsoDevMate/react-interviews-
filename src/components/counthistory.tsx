import React from 'react';
interface HistoryState {
  count: number;
  currentIndex: number;
  history: number[];
}

const CountHistory = () => {
  const [state, setState] = React.useState<HistoryState>({
    count: 0,
    currentIndex: 0,
    history: [0],
  });
  const handleIncrease = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newCount = state.count + 1;
    const newHistory = [
      ...state.history.slice(0, state.currentIndex + 1),
      newCount,
    ];

    setState({
      count: newCount,
      history: newHistory,
      currentIndex: newHistory.length - 1,
    });
  };

  const handleDecrease = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newCount = state.count - 1;
    const newHistory = [
      ...state.history.slice(0, state.currentIndex + 1),
      newCount,
    ];

    setState({
      count: newCount,
      history: newHistory,
      currentIndex: newHistory.length - 1,
    });
  };

  const handleundo = () => {
    if (state.currentIndex > 0) {
      const newIndex = state.currentIndex - 1;
      setState({
        count: state.history[newIndex],
        history: state.history,
        currentIndex: newIndex,
      });
    }
  };

  const handleredo = () => {
    if (state.currentIndex < state.history.length - 1) {
      const newIndex = state.currentIndex + 1;
      setState({
        count: state.history[newIndex],
        history: state.history,
        currentIndex: newIndex,
      });
    }
  };
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-black min-h-screen">
      <h1 className="text-2xl font-bold">Counter</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={handleIncrease}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Increase
        </button>

        <span className="text-xl text-white">{state.count}</span>

        <button
          onClick={handleDecrease}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Decrease
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleundo}
          disabled={state.currentIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Undo
        </button>

        <button
          onClick={handleredo}
          disabled={state.currentIndex === state.history.length - 1}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Redo
        </button>
      </div>
    </div>
  );
};

export default CountHistory;
