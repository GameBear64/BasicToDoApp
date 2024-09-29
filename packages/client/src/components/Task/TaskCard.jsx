import { useState } from 'react';
import { useStore } from '@nanostores/react';

import { formatDate } from '@tools/utils';
import { getCheckboxStyles } from '@tools/helpers';
import { $workspace, advanceTask } from '@store/workspace';

import Icon from '@components/Icon';
import Modal from '@components/Modal';
import TaskDetails from '@components/Task/TaskDetails';

export default function TaskCard({ task, isDragging }) {
  const workspace = useStore($workspace);
  const [optionsModal, setOptionsModal] = useState(false);

  const checkboxStyles = getCheckboxStyles(task.id, workspace.columns);

  return (
    <>
      <div className="bg-base-m rounded p-2 hover:bg-base-s pointer-events-none">
        <div className="flex gap-2">
          <Icon
            clickable
            styles={`${checkboxStyles[0]} pointer-events-auto`}
            icon={checkboxStyles[1]}
            onClick={() => !isDragging && advanceTask(task.id)}
          />
          <p
            className="cursor-pointer pointer-events-auto line-clamp-2"
            onClick={() => !isDragging && setOptionsModal(true)}
          >
            {task.title}
          </p>
        </div>
        {task.description && <p className="my-2 text-sm text-txtSecondary line-clamp-6">{task.description}</p>}

        <p className="text-xs text-txtSecondary text-end">{formatDate(task.created_at)}</p>
      </div>
      {optionsModal && (
        <Modal easyClose title="Task details" closeFunction={() => setOptionsModal(false)}>
          <TaskDetails task={task} />
        </Modal>
      )}
    </>
  );
}
