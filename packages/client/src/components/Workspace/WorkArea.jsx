import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';

import Column from '@components/Workspace/Column';

import { $workspace, moveTask } from '@store/workspace';

export default function WorkArea({ columns }) {
  // Credit for half: GPT
  const onDragEnd = result => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedColumns = structuredClone($workspace.get().columns);
    let movedTask;
    let destinationTasks;

    if (source.droppableId === destination.droppableId) {
      // Same column: reorder tasks
      destinationTasks = updatedColumns.find(col => col.id === source.droppableId).tasks;
      [movedTask] = destinationTasks.splice(source.index, 1);
    } else {
      // Moving tasks between columns
      const sourceColumn = updatedColumns.find(col => col.id === source.droppableId).tasks;
      destinationTasks = updatedColumns.find(col => col.id === destination.droppableId).tasks;

      [movedTask] = sourceColumn.splice(source.index, 1);
      movedTask.column_id = destination.droppableId;
    }
    // Set movedTask's new position based on its new neighbors
    destinationTasks.splice(destination.index, 0, movedTask);
    const prevTask = destinationTasks[destination.index - 1];
    const nextTask = destinationTasks[destination.index + 1];
    movedTask.position = prevTask ? prevTask.position + 1 : nextTask ? nextTask.position - 1 : 1;

    // Optimistic update
    $workspace.setKey('columns', updatedColumns);
    moveTask(movedTask.id, { column_id: destination.droppableId, position: movedTask.position });
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
