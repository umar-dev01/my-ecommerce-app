import { useReducer, useState } from "react";
const initialState = {
  tasks: [],
  filter: "all",
};
const ACTIONS = {
  ADD_TASK: "ADD_TASK",
  DELETE_TASK: "DELETE_TASK",
  TOGGLE_TASK: "TOGGLE_TASK",
  SET_FILTER: "SET_FILTER",
  CLEAR_COMPLETED: "CLEAR_COMPLETED",
};
function taskReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TASK: {
      const newTask = {
        id: Date.now(),
        text: action.payload.text,
        completed: false,
        createAt: new Date().toISOString(),
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }
    case ACTIONS.DELETE_TASK: {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      };
    }
    case ACTIONS.TOGGLE_TASK: {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task,
        ),
      };
    }
    case ACTIONS.SET_FILTER: {
      return {
        ...state,
        filter: action.payload.filter,
      };
    }
    case ACTIONS.CLEAR_COMPLETED: {
      return {
        ...state,
        tasks: state.tasks.filter((task) => !task.completed),
      };
    }
    default:
      return state;
  }
}
function TaskManager() {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [inputText, setInputText] = useState("");
  function handleAddTask() {
    if (!inputText.trim()) return;
    dispatch({ type: ACTIONS.ADD_TASK, payload: { text: inputText } });
    setInputText("");
  }
  const filteredTasks = state.tasks.filter((task) => {
    if (state.filter === "active") return !task.completed;
    if (state.filter === "completed") return task.completed;
    return true;
  });
  const activeCount = state.tasks.filter((task) => !task.completed).length;
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-purple-800 text-center mb-8">
          Task Manager ✅
        </h1>

        {/* Input Area */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-800"
          />
          <button
            onClick={handleAddTask}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition font-bold"
          >
            Add
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() =>
                dispatch({
                  type: ACTIONS.SET_FILTER,
                  payload: { filter: f },
                })
              }
              className={`px-4 py-1 rounded-lg capitalize font-medium transition ${
                state.filter === f
                  ? "bg-purple-800 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No tasks here! 🎉</p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50"
              >
                {/* Checkbox + Text */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      dispatch({
                        type: ACTIONS.TOGGLE_TASK,
                        payload: { id: task.id },
                      })
                    }
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span
                    className={`text-gray-800 ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() =>
                    dispatch({
                      type: ACTIONS.DELETE_TASK,
                      payload: { id: task.id },
                    })
                  }
                  className="text-red-400 hover:text-red-600 transition font-bold"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{activeCount} tasks remaining</span>
          <button
            onClick={() => dispatch({ type: ACTIONS.CLEAR_COMPLETED })}
            className="hover:text-red-500 transition"
          >
            Clear Completed
          </button>
        </div>
      </div>
    </div>
  );
}
export default TaskManager;
