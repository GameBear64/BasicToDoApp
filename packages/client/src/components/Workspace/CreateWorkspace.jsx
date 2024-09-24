import { useNavigate } from 'react-router-dom';

import useFetch from '@tools/useFetch';
import { successSnackBar } from '@tools/snackbars';
import { genRand } from '@tools/utils';

import { Input, ColorPicker, IconPicker } from '@form/Fields';
import Form from '@form/Form';
import { REQUIRED, MIN_LENGTH, MAX_LENGTH } from '@form/validations';
import WorkshopIconPreview from '@form/Previews/WorkspaceIconPreview';
import WorkspaceLayout from '@form/Previews/WorkspaceLayout';

import { icons, colors } from '@tools/consts';

export default function CreateWorkspace() {
  const navigate = useNavigate();

  const sendData = data => {
    data.views = data.views.map(v => ({ name: v.name, default: v.default, columns: v.columns.map(c => c.name) }));

    useFetch({
      url: 'workspace',
      method: 'POST',
      body: data,
    }).then(response => {
      successSnackBar(`The ${data.name} workspace has been created!`);
      navigate(`/wp/${response.id}`);
    });
  };

  return (
    <>
      <Form
        onSubmit={sendData}
        defaultValues={{
          icon: icons[Math.floor(Math.random() * icons.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          views: [
            {
              id: genRand(10),
              name: 'Backlog',
              columns: [
                { id: genRand(10), name: 'Bugs' },
                { id: genRand(10), name: 'Ideas' },
              ],
              default: false,
            },
            {
              id: genRand(10),
              name: 'Current',
              columns: [
                { id: genRand(10), name: 'To Do' },
                { id: genRand(10), name: 'In Progress' },
                { id: genRand(10), name: 'Done' },
              ],
              default: true,
            },
          ],
        }}
      >
        <Input
          placeholder="Very cool project name"
          name="name"
          label="Name"
          rules={{
            ...REQUIRED,
            ...MIN_LENGTH(3),
            ...MAX_LENGTH(255),
          }}
          styles="mb-4"
        />

        <span className="font-semibold text-txtSecondary">Icon</span>
        <div className="flex justify-around items-center my-4">
          <WorkshopIconPreview size="size-28" />
          <div className="flex flex-col gap-4">
            <ColorPicker name="color" />
            <IconPicker name="icon" />
          </div>
        </div>

        <span className="font-semibold text-txtSecondary">Layout</span>
        <WorkspaceLayout />

        <div className="flex justify-end my-2">
          <button type="submit">Submit</button>
        </div>
      </Form>
    </>
  );
}
