import CartShopping from './components/cartShopping';
import CollaborativeTaskBoard from './components/collaborationboardtimer';
import CountHistory from './components/counthistory';
import DrawingTool from './components/drawingTool';
import InfiniteGallery from './components/Infinite-scrollimages';
import TaskTimer from './components/tasktimer';

const App = () => {
  return (
    <div>
      <h1>Count History</h1>
      <CountHistory />
      <h2>Dynamic task Timer</h2>
      <TaskTimer />
      <h2>CollaboratveTaskSorting BoardManagement</h2>
      <CollaborativeTaskBoard />
      <h2>CartShopping</h2>
      <CartShopping />
      <h2>DrawingToolCanvas</h2>
      <DrawingTool width={300} height={300} />
      <h2>INfinite Gallery </h2>
      <InfiniteGallery />
    </div>
  );
};

export default App;
