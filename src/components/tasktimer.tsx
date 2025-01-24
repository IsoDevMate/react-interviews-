// import React from 'react';

// interface Task {
//   name: string;
//   timespent: number;
//   status: 'started' | 'paused' | 'ongoinng' | 'completed';
//   currentIndex:number
// }

// interface TaskState {
//   isstarted: boolean
//   ispaused: boolean
//   isOngoing: boolean
//   isCompleted:boolean
//  }

// const Tasktimer: React.FC = () => {
//   const [task,setTask]-React.useState<Task[]>([])
//   const [newTaskName, setNewTaskName] = React.useState('')
//   const [state, setState] -React.useState<TaskState>({
//     isstarted: false,
//     ispaused: false,
//   isOngoing:false ,
//   isCompleted:false,
//   })
// const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
//   event.preventDefault()

// }
//         const handleAddTask-(e:React.MouseEvent<HTMLButtonElement>)=> {
//   const newTask = [
//        Task.name
//      ]
//       }

//     const handleremoveTask = () -> {

// }

//   return <div>Tasktimer</div>;
// };

// export default Tasktimer;

import React, { useState, useEffect } from 'react';

// Define the Task interface
interface Task {
  id: string;
  name: string;
  timeSpent: number;
  isRunning: boolean;
}

const TaskTimer: React.FC = () => {
  // State for tasks and new task input
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');

  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add a new task
  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: generateId(),
        name: newTaskName,
        timeSpent: 0,
        isRunning: false,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTaskName('');
    }
  };

  // Toggle task timer
  const toggleTaskTimer = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isRunning: !task.isRunning } : task,
      ),
    );
  };

  // Remove a task
  const removeTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Timer effect to increment time
  useEffect(() => {
    const timerId = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.isRunning ? { ...task, timeSpent: task.timeSpent + 1 } : task,
        ),
      );
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // Format time to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Timer</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Enter task name"
          className="flex-grow p-2 border mr-2"
        />
        <button onClick={addTask} className="bg-blue-500 text-white p-2">
          Add Task
        </button>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex justify-between items-center p-3 border-b"
        >
          <div>
            <span>{task.name}</span>
            <div className="text-gray-500">{formatTime(task.timeSpent)}</div>
          </div>
          <div>
            <button
              onClick={() => toggleTaskTimer(task.id)}
              className={`mr-2 p-2 ${
                task.isRunning ? 'bg-yellow-500' : 'bg-green-500'
              } text-white`}
            >
              {task.isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => removeTask(task.id)}
              className="bg-red-500 text-white p-2"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskTimer;
