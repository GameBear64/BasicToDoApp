import { useContext, useState } from 'react';

import { formatDate } from '@tools/utils';
import useFetch from '@tools/useFetch';
import { infoSnackBar } from '@tools/snackbars';

import Icon from '@components/Icon';
import Modal from '@components/Modal';
import TaskInputForm from '@components/Task/TaskInputForm';

import { TasksContext } from '@views/TaskView';

export default function TaskDetails({ task }) {
  const { setTasks, checkTask } = useContext(TasksContext);
  const [editMode, setEditMode] = useState(false);

  const deleteTask = () => {
    useFetch({
      url: `task/${task.id}`,
      method: 'DELETE',
    }).then(() => {
      infoSnackBar('Task removed');
      setTasks(prev => prev.filter(t => t.id != task.id));
    });
  };

  return (
    <div>
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <Icon
            clickable
            styles={task.completed ? 'text-green-500' : 'text-txtSecondary'}
            icon={task.completed ? 'check_box' : 'check_box_outline_blank'}
            onClick={() => checkTask(task)}
          />
          <p className="text-xl font-semibold">{task.title}</p>
        </div>
        <div className="flex gap-2">
          <Icon clickable styles="text-blue-500" icon="edit" onClick={() => setEditMode(true)} />
          <Icon clickable styles="text-red-500" icon="delete" onClick={deleteTask} />
        </div>
      </div>
      {task.description && <p className="bg-base-m p-2 rounded my-2 text-sm">{task.description}</p>}
      <p className="mt-6 text-xs text-txtSecondary text-end">
        Created: {formatDate(task.created_at)}
        {task.created_at != task.updated_at && <span> | Updated: {formatDate(task.updated_at)}</span>}
      </p>

      {editMode && (
        <Modal easyClose title="Edit details" closeFunction={() => setEditMode(false)}>
          <TaskInputForm initialValues={task} closeFunction={() => setEditMode(false)} />
        </Modal>
      )}
    </div>
  );
}
