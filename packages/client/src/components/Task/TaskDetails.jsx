import { useState } from 'react';
import { useStore } from '@nanostores/react';

import { formatDate } from '@tools/utils';
import { getCheckboxStyles } from '@tools/helpers';

import { $workspace, removeTask, advanceTask } from '@store/workspace';

import Icon from '@components/Icon';
import Modal from '@components/Modal';
import TaskInputForm from '@components/Task/TaskInputForm';

export default function TaskDetails({ task }) {
  const workspace = useStore($workspace);
  const [editMode, setEditMode] = useState(false);

  const checkboxStyles = getCheckboxStyles(task.id, workspace.columns);

  return (
    <div>
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <Icon clickable styles={checkboxStyles[0]} icon={checkboxStyles[1]} onClick={() => advanceTask(task.id)} />
          <p className="text-xl font-semibold">{task.title}</p>
        </div>
        <div className="flex gap-2">
          <Icon clickable styles="text-blue-500" icon="edit" onClick={() => setEditMode(true)} />
          <Icon clickable styles="text-red-500" icon="delete" onClick={() => removeTask(task.id)} />
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
