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
  useFetch({
    url: `task/${taskID}/advance`,
    method: 'PATCH',
  }).then(response => {
    if (typeof response == 'string') {
      infoSnackBar(response);
    } else {
      $workspace.setKey('columns', response);
    }
  });
}

export function moveTask(taskID, { destination, position }) {
  return useFetch({
    url: `task/${taskID}/move`,
    method: 'PATCH',
    body: {
      column_id: destination,
      position: position,
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
