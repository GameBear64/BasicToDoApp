import { useState, useEffect, createContext } from 'react';

import Modal from '@components/Modal';
import useFetch from '@tools/useFetch';

import TaskInputForm from '@components/Task/TaskInputForm';
import TaskCard from '@components/Task/TaskCard';

export const TasksContext = createContext();

export default function TaskView() {
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchAll = () => {
    useFetch({
      url: 'task/all',
    }).then(response => setTasks(response));
  };

  const checkTask = task => {
    useFetch({
      url: `task/${task.id}`,
      method: 'PATCH',
      body: { completed: !task.completed },
    }).then(response => {
      setTasks(prev => prev.map(task => (task.id === response.id ? response : task)));
    });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <TasksContext.Provider value={{ fetchAll, setTasks, checkTask }}>
      <div className="flex flex-col items-center">
        <h1 className="text-6xl font-semibold">Basic To Do App</h1>
        <button className="my-4" onClick={() => setCreateTaskModal(true)}>
          New Task
        </button>
      </div>

      {createTaskModal && (
        <Modal easyClose title="Create new task" closeFunction={() => setCreateTaskModal(false)}>
          <TaskInputForm closeFunction={() => setCreateTaskModal(false)} />
        </Modal>
      )}

      <div className="flex justify-center w-full my-10">
        <div className="flex flex-col sm:flex-row max-w-3xl w-full">
          <div className="basis-1/2">
            <h2 className="text-center text-2xl font-semibold">To do:</h2>
            {tasks
              .filter(task => !task.completed)
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
          <div className="hidden sm:block border border-base-s mx-2 mt-8"></div>
          <div className="basis-1/2">
            <h2 className="text-center text-2xl font-semibold">Done:</h2>
            {tasks
              .filter(task => task.completed)
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </div>
      </div>
    </TasksContext.Provider>
  );
}
