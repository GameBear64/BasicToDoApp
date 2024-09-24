import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useFieldArray } from 'react-hook-form';

import ConnectForm from '@form/ConnectForm';
import { Input, CheckBox } from '@form/Fields';

import { genRand } from '@tools/utils';

import Icon from '@components/Icon';

// I will have no idea what any of this does in a month
// Half the effort was by GPT
export default function WorkspaceLayout() {
  return (
    <ConnectForm>
      {({ getValues, setValue, control }) => {
        const views = getValues('views');

        const onDragEnd = result => {
          const { source, destination, type } = result;

          // Dropped outside the list
          if (!destination) return;

          if (type === 'VIEW') {
            const reorderedViews = [...views];
            const [movedView] = reorderedViews.splice(source.index, 1);
            reorderedViews.splice(destination.index, 0, movedView);
            setValue('views', reorderedViews);
          }

          if (type === 'COLUMN') {
            const viewIndex = source.droppableId.split('-')[1];
            const columns = [...views[viewIndex].columns];
            const [movedColumn] = columns.splice(source.index, 1);
            columns.splice(destination.index, 0, movedColumn);
            const updatedViews = [...views];
            updatedViews[viewIndex].columns = columns;
            setValue('views', updatedViews);
          }
        };

        return (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="views" type="VIEW" direction="horizontal">
              {provided => (
                <div
                  className="flex gap-2 bg-base-m rounded p-2 overflow-auto max-h-80"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {views.map((view, viewIndex) => (
                    <Draggable key={view.id} draggableId={view.id} index={viewIndex}>
                      {provided => (
                        <div className="flex flex-col min-w-44" ref={provided.innerRef} {...provided.draggableProps}>
                          <button
                            type="button"
                            className="text-btn !text-sm flex justify-center items-center gap-1 text-red-600"
                            onClick={() => {
                              const newViews = views.filter((_, index) => index !== viewIndex);
                              setValue('views', newViews);
                            }}
                          >
                            <Icon icon="delete" styles="text-lg" /> Remove View
                          </button>
                          <div className="flex justify-between items-center">
                            <Icon {...provided.dragHandleProps} icon="drag_indicator" clickable />
                            <Input name={`views.${viewIndex}.name`} placeholder="View Name" />
                            <CheckBox styles="ml-2" name={`views.${viewIndex}.default`} />
                          </div>

                          <div className="bg-base-s rounded p-2">
                            {/* Columns Section */}
                            <Droppable droppableId={`columns-${viewIndex}`} type="COLUMN">
                              {provided => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                  <Columns viewIndex={viewIndex} control={control} />
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button
                    type="button"
                    onClick={() => {
                      const newViews = [...views, { id: Date.now(), name: 'New View', columns: [] }];
                      setValue('views', newViews);
                    }}
                    className="text-btn !text-sm flex justify-center items-center gap-1 !bg-base-s !px-3"
                  >
                    <Icon icon="add" styles="text-lg -ml-1" /> Add
                  </button>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        );
      }}
    </ConnectForm>
  );
}

function Columns({ viewIndex, control }) {
  const {
    fields: columnFields,
    append: appendColumn,
    remove: removeColumn,
  } = useFieldArray({
    control,
    name: `views.${viewIndex}.columns`,
  });

  return (
    <div>
      {columnFields.map((column, columnIndex) => (
        <Draggable key={column.id} draggableId={column.id} index={columnIndex}>
          {provided => (
            <div className="flex justify-between items-center " ref={provided.innerRef} {...provided.draggableProps}>
              <Icon {...provided.dragHandleProps} icon="drag_indicator" clickable />
              <Input name={`views.${viewIndex}.columns.${columnIndex}.name`} placeholder="Column Name" />
              <button
                type="button"
                className="text-btn flex justify-center items-center gap-1 !text-red-600"
                onClick={() => removeColumn(columnIndex)}
              >
                <Icon icon="delete" styles="text-lg" />
              </button>
            </div>
          )}
        </Draggable>
      ))}
      <button
        type="button"
        className="text-btn !text-sm flex justify-center items-center gap-1 w-full"
        onClick={() => appendColumn({ id: genRand(10), name: 'New Column' })}
      >
        <Icon icon="add" styles="text-lg" /> Add
      </button>
    </div>
  );
}
