import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';

import Column from '@components/Workspace/Column';

import { $workspace, moveTask } from '@store/workspace';

export default function WorkArea({ columns }) {
  // Credit for half: GPT
  const onDragEnd = result => {
    const { source, destination } = result;

    if (!destination) return;

    const currentColumns = $workspace.get().columns;
    const updatedColumns = structuredClone(currentColumns);
    let movedTask;
    let destinationTasks;

    if (source.droppableId === destination.droppableId) {
      // Same column: reorder tasks
      const column = updatedColumns.find(col => col.id === source.droppableId);
      destinationTasks = column.tasks;
      [movedTask] = destinationTasks.splice(source.index, 1);
    } else {
      // Moving tasks between columns
      const sourceColumn = updatedColumns.find(col => col.id === source.droppableId);
      const destinationColumn = updatedColumns.find(col => col.id === destination.droppableId);

      const sourceTasks = sourceColumn.tasks;
      [movedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks = destinationColumn.tasks;

      // Update column_id for the moved task
      movedTask.column_id = destination.droppableId;
    }
    // Set movedTask's new position based on its new neighbors
    destinationTasks.splice(destination.index, 0, movedTask);
    const prevTask = destinationTasks[destination.index - 1];
    const nextTask = destinationTasks[destination.index + 1];
    movedTask.position = prevTask ? prevTask.position + 1 : nextTask ? nextTask.position - 1 : 1;

    // Optimistic update
    $workspace.setKey('columns', updatedColumns);
    moveTask(movedTask.id, { destination: destination.droppableId, position: movedTask.position });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 flex-1 px-4">
        {columns?.map(column => (
          <React.Fragment key={column.id}>
            <Column {...column} />
            <div className="border-r border-base-x"></div>
          </React.Fragment>
        ))}
      </div>
    </DragDropContext>
  );
}
