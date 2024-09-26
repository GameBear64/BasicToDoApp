import { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

import Modal from '@components/Modal';
import TaskCard from '@components/Task/TaskCard';
import TaskInputForm from '@components/Task/TaskInputForm';

export default function Column(column) {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <div className="flex flex-col min-w-80 py-4">
        {column.name}

        <Droppable droppableId={column.id}>
          {provided => (
            <div className="w-full flex flex-col gap-2 my-2" {...provided.droppableProps} ref={provided.innerRef}>
              {column?.tasks?.map((task, i) => (
                <Draggable draggableId={task.id} index={i} key={task.id}>
                  {(provided, snapshot) => (
                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                      <TaskCard task={task} isDragging={snapshot.isDragging} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="flex-1 rounded-lg">
          <button onClick={() => setEditMode(true)}>Add</button>
        </div>
      </div>
      {editMode && (
        <Modal easyClose title="Edit details" closeFunction={() => setEditMode(false)}>
          <TaskInputForm initialValues={{ column_id: column.id }} closeFunction={() => setEditMode(false)} />
        </Modal>
      )}
    </>
  );
}
