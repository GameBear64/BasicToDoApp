import { useContext, useState } from 'react';

import { formatDate } from '@tools/utils';

import Icon from '@components/Icon';
import Modal from '@components/Modal';
import TaskDetails from '@components/Task/TaskDetails';

import { TasksContext } from '@views/TaskView';

export default function TaskCard({ task }) {
  const [optionsModal, setOptionsModal] = useState(false);

  const { checkTask } = useContext(TasksContext);

  return (
    <>
      <div className="bg-base-m rounded m-2 p-2 hover:bg-base-s pointer-events-none">
        <div className="flex gap-2">
          <Icon
            clickable
            styles={`${task.completed ? 'text-green-500' : 'text-txtSecondary'} pointer-events-auto`}
            icon={task.completed ? 'check_box' : 'check_box_outline_blank'}
            onClick={() => checkTask(task)}
          />
          <p className="cursor-pointer pointer-events-auto line-clamp-2" onClick={() => setOptionsModal(true)}>
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
