// import { useState } from 'react';

// import Modal from '@components/Modal';
import useFetch from '@tools/useFetch';
import { formatDate } from '@tools/utils';

// import TaskInputForm from '@components/Task/TaskInputForm';
// import TaskCard from '@components/Task/TaskCard';
import Icon from '@components/Icon';
import { Droppable, Draggable } from '@hello-pangea/dnd';

export default function Column(column) {
  // const [createTaskModal, setCreateTaskModal] = useState(false);

  const sendData = () => {
    useFetch({
      url: 'task',
      method: 'POST',
      body: {
        title: 'Dummy test task',
        description: ':) !',
        column_id: column.id,
      },
    }).then(() => {
      // successSnackBar('Task created');
      // setTasks(prev => [...prev, response]);
      // closeFunction && closeFunction();
    });
  };

  return (
    <>
      <div className="flex flex-col min-w-80 py-4">
        {column.name}

        <Droppable droppableId={column.id}>
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {column?.tasks?.map((task, i) => (
                <Draggable draggableId={task.id} index={i} key={task.id}>
                  {provided => (
                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                      <div className="bg-base-m rounded mb-2 p-2 hover:bg-base-s pointer-events-none">
                        <div className="flex gap-2">
                          <Icon
                            clickable
                            styles={`${task.completed ? 'text-green-500' : 'text-txtSecondary'} pointer-events-auto`}
                            icon={task.completed ? 'check_box' : 'check_box_outline_blank'}
                          />
                          <p className="cursor-pointer pointer-events-auto line-clamp-2">{task.title}</p>
                        </div>
                        {task.description && (
                          <p className="my-2 text-sm text-txtSecondary line-clamp-6">{task.description}</p>
                        )}

                        <p className="text-xs text-txtSecondary text-end">{formatDate(task.created_at)}</p>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="flex-1 rounded-lg">
          <button onClick={sendData}>Add</button>
        </div>
      </div>
      {/* {createTaskModal && (
        <Modal easyClose title="Create new task" closeFunction={() => setCreateTaskModal(false)}>
          <TaskInputForm closeFunction={() => setCreateTaskModal(false)} />
        </Modal>
      )} */}
    </>
  );
}
