import { DragDropContext } from '@hello-pangea/dnd';

import Column from '@components/Workspace/Column';

export default function WorkArea({ columns }) {
  const onDragEnd = e => {
    console.log(e);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 flex-1 px-4">
        {columns?.map(column => (
          <>
            <Column key={column.id} {...column} />
            <div className="border-r border-base-x"></div>
          </>
        ))}
      </div>
    </DragDropContext>
  );
}
