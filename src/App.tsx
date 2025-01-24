import CollaborativeTaskBoard from './components/collaborationboardtimer';
import CountHistory from './components/counthistory';
import TaskTimer from './components/tasktimer';

const App = () => {
  return (
    <div>
      <h1>Count History</h1>
      <CountHistory />
      <h2>Dynamic task Timer</h2>
      <TaskTimer />
      <h2>Collaboratve BoardManagement</h2>
      <CollaborativeTaskBoard />
    </div>
  );
};

export default App;
