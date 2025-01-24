// import { useReducer } from "react";
// import React from 'react';
// interface State {
//     tasks: Task[];
// }

// const InitialState: State = {
//     tasks: []
// }

// interface Task {
//     id: string;
//     name: string;
//     status: "todo" | "inprogress" | "done"
//     priority: "low" | "medium" | "high";
// }

// type Action = {
//     type: "addTask";
//     task: Task;
// } | {
//     type: "updateTask";
//     task: Task;
// } | {
//     type: "removeTask";
//     taskId: string;
// } | {
//     type: "moveTask";
//     taskId: string;
//     status: Task["status"];
// } | {
//     type: "setPriority";
//     taskId: string;
//     priority: Task["priority"];
// }
// const initialState: State = {
//     tasks: []
// }
// const CollaborationboardTaskManager: React.FC = () => {
// const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState)

//     const handleAddTask = () => {
//         dispatch({
//             type: "addTask",
//             task: { id: "1", name: "Task 1", status: "todo", priority: "low" }
//         })

//     const handleUpdateTask = (id:number) => { }
//     const handleRemoveTask = (id:number) => { }
//     const handleMoveTask = () => { }
//     const handleSetPriority = () => { }
//   return (
//     <div>CollaborationboardTaskManager</div>
//   )
// }

// function reducer(state: State, action: Action): State {
//     const {tasks} = state
//     switch (action.type) {
//         case "addTask":
//             return {
//                 ...state,
//                 tasks: [...state.tasks, action.task]
//             }
//         case "updateTask":
//             return {
//                 ...state,
//                 tasks: state.tasks.map(task => task.id === action.task.id ? action.task : task)
//             }
//         case "removeTask":
//             return {
//                 ...state,
//                 tasks: state.tasks.filter(task => task.id !== action.taskId)
//             }
//         case "moveTask":
//             return {
//                 ...state,
//                 tasks: state.tasks.map(task => task.id === action.taskId ? { ...task, status: action.status } : task)
//             }
//         case "setPriority":
//             return {
//                 ...state,
//                 tasks: state.tasks.map(task => task.id === action.taskId ? { ...task, priority: action.priority } : task)
//             }
//         default:
//             return state;
//     }
//  }
// export default CollaborationboardTaskManager
import React, { useState, useReducer } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

// Typescript interfaces for strong typing
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

// Action types for reducer
type Action =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | {
      type: 'MOVE_TASK';
      payload: { taskId: string; newStatus: Task['status'] };
    }
  | { type: 'DELETE_TASK'; payload: string };

// Reducer function for complex state management
function taskReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'ADD_TASK':
      return [
        ...state,
        {
          ...action.payload,
          id: Date.now().toString(),
          createdAt: Date.now(),
        },
      ];
    case 'MOVE_TASK':
      return state.map((task) =>
        task.id === action.payload.taskId
          ? { ...task, status: action.payload.newStatus }
          : task,
      );
    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);
    default:
      return state;
  }
}

const CollaborativeTaskBoard: React.FC = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    status: 'todo' as Task['status'],
  });

  const addTask = () => {
    if (newTask.title.trim()) {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          status: newTask.status,
        },
      });

      // Reset form
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId !== source.droppableId ||
      destination.index !== source.index
    ) {
      dispatch({
        type: 'MOVE_TASK',
        payload: {
          taskId: draggableId,
          newStatus: destination.droppableId as Task['status'],
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Collaborative Task Board</h1>

      {/* Task Input Form */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
          className="border p-2"
        />
        <select
          value={newTask.priority}
          onChange={(e) =>
            setNewTask((prev) => ({
              ...prev,
              priority: e.target.value as Task['priority'],
            }))
          }
          className="border p-2"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
          className="border p-2 col-span-2"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 col-span-2"
        >
          Add Task
        </button>
      </div>

      {/* Drag and Drop Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {(['todo', 'inProgress', 'done'] as const).map((status) => (
            <Droppable
              key={status}
              droppableId={status}
              isDropDisabled={false}
              isCombineEnabled={false}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-4 rounded"
                >
                  <h2 className="font-bold mb-2 capitalize">
                    {status.replace(/([A-Z])/g, ' $1').trim()}
                  </h2>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-2 mb-2 rounded ${
                              task.priority === 'high'
                                ? 'bg-red-200'
                                : task.priority === 'medium'
                                  ? 'bg-yellow-200'
                                  : 'bg-green-200'
                            }`}
                          >
                            <div className="font-bold">{task.title}</div>
                            <div className="text-sm">{task.description}</div>
                            <button
                              onClick={() =>
                                dispatch({
                                  type: 'DELETE_TASK',
                                  payload: task.id,
                                })
                              }
                              className="text-red-500 text-xs mt-1"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CollaborativeTaskBoard;
