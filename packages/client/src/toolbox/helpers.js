export function getCheckboxStyles(taskId, columns) {
  const isInFirstColumn = columns
    .reduce((minColumn, column) => (column.position < minColumn.position ? column : minColumn), columns[0])
    .tasks.some(t => t.id === taskId);

  const isInLastColumn = columns
    .reduce((maxColumn, column) => (column.position > maxColumn.position ? column : maxColumn), columns[0])
    .tasks.some(t => t.id === taskId);

  if (isInFirstColumn) return ['text-txtSecondary', 'check_box_outline_blank'];
  if (isInLastColumn) return ['text-green-500', 'check_box'];

  return ['text-blue-500', 'dialogs'];
}
