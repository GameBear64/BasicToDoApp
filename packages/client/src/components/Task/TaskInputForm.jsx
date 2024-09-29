import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';

import Form from '@form/Form';
import { Select, Input, Textarea } from '@form/Fields';
import { REQUIRED, MIN_LENGTH, MAX_LENGTH } from '@form/validations';

import { $workspace, addTask, updateTask, FEMoveTask } from '@store/workspace';
import { pick } from '@tools/utils';

export default function TaskInputForm({ initialValues, closeFunction }) {
  const workspace = useStore($workspace);
  const [columnsOption, setColumnsOption] = useState([]);

  useEffect(() => {
    setColumnsOption(
      [].concat(...workspace.views.map(v => v.columns.map(c => ({ value: c.id, label: `${v.name} > ${c.name}` }))))
    );
  }, [workspace]);

  const sendData = data => {
    if (initialValues.id) {
      updateTask(initialValues.id, pick(data, ['title', 'description', 'column_id']));
      FEMoveTask(initialValues.id, { column_id: data.column_id, position: initialValues.position });
    } else {
      addTask(data);
    }
    closeFunction && closeFunction();
  };

  return (
    <>
      <Form defaultValues={initialValues} onSubmit={sendData}>
        <Select name="column_id" placeholder="Status" options={columnsOption} rules={REQUIRED} />

        <Input
          placeholder="Title"
          name="title"
          rules={{
            ...REQUIRED,
            ...MIN_LENGTH(3),
            ...MAX_LENGTH(255),
          }}
        />
        <Textarea
          placeholder="Description"
          name="description"
          rules={{
            ...MIN_LENGTH(3),
          }}
        />
        <div className="flex justify-end">
          <button type="submit">Submit</button>
        </div>
      </Form>
    </>
  );
}
