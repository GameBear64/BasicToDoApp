import { deepMap } from 'nanostores';
import useFetch from '@tools/useFetch';

import { successSnackBar, infoSnackBar } from '@tools/snackbars';

export const $workspace = deepMap({});

export function fetchWP({ id, view }) {
  useFetch({
    url: `workspace/${id}${view ? '/' + view : ''}`,
  }).then($workspace.set);
}

export function updateTask(taskID, body) {
  useFetch({
    url: `task/${taskID}`,
    method: 'PATCH',
    body,
  }).then(response => {
    const columns = $workspace.get().columns;
    const target = columns.findIndex(c => c.id == response.column_id);
    const targetTask = columns[target].tasks.findIndex(t => t.id == response.id);

    $workspace.setKey(`columns[${target}].tasks[${targetTask}]`, response);

    successSnackBar('Task updated');
  });
}

export function advanceTask(taskID) {
  const updatedColumns = structuredClone($workspace.get().columns);

  const currentColumn = updatedColumns.find(c => c.tasks.some(t => t.id == taskID));
  const nextColumn = updatedColumns.find(c => c.position > currentColumn.position);

  if (!nextColumn) return infoSnackBar('Already at the last column');

  const position = nextColumn.tasks?.[0] ? nextColumn.tasks?.[0].position - 1 : 1;

  moveTask(taskID, { column_id: nextColumn.id, position });
  FEMoveTask(taskID, { column_id: nextColumn.id, position });
}

export function FEMoveTask(taskID, { column_id, position }) {
  const updatedColumns = structuredClone($workspace.get().columns);
  const currentColumn = updatedColumns.find(c => c.tasks.some(t => t.id == taskID));
  const nextColumn = updatedColumns.find(c => c.id == column_id);

  let task = currentColumn.tasks.findIndex(t => t.id == taskID);
  task = { ...task, column_id, position };

  const [movedTask] = currentColumn.tasks.splice(task, 1);
  if (nextColumn) {
    nextColumn.tasks.splice(position, 0, movedTask);
  }

  $workspace.setKey(`columns`, updatedColumns);
}

export function moveTask(taskID, { column_id, position }) {
  return useFetch({
    url: `task/${taskID}/move`,
    method: 'PATCH',
    body: {
      column_id,
      position,
    },
  });
}

export function addTask(body) {
  return useFetch({
    url: 'task',
    method: 'POST',
    body,
  }).then(response => {
    const columns = $workspace.get().columns;
    const target = columns.findIndex(c => c.id == response.column_id);

    $workspace.setKey(`columns[${target}].tasks`, [...columns[target].tasks, response]);

    successSnackBar('Task created');
  });
}

export function removeTask(taskID) {
  useFetch({
    url: `task/${taskID}`,
    method: 'DELETE',
  }).then(() => {
    $workspace.setKey(
      'columns',
      $workspace.get().columns.map(c => ({ ...c, tasks: c.tasks.filter(t => t.id != taskID) }))
    );
  });
}

// maybe throttle
export function setColumns(columns) {
  // fetch here
  // then
  $workspace.setKey('columns', columns);
}
