import { useForm } from 'react-hook-form';

import { addTask, updateTask } from '@store/workspace';

import { REQUIRED, MIN_LENGTH, MAX_LENGTH } from '@components/Form/validations';

export default function TaskInputForm({ initialValues, closeFunction }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const sendData = data => {
    if (initialValues.id) {
      updateTask(initialValues.id, { title: data.title, description: data.description });
    } else {
      addTask({
        ...data,
        column_id: initialValues.column_id,
      });
    }
    closeFunction && closeFunction();
  };

  return (
    <>
      <form onSubmit={handleSubmit(data => sendData(data))}>
        <input
          placeholder="Title"
          {...register('title', {
            ...REQUIRED,
            ...MIN_LENGTH(3),
            ...MAX_LENGTH(255),
          })}
          className={errors['title'] && 'input-error'}
        />
        {errors['title'] && <p className="font-semibold text-red-600">{errors['title'].message}</p>}
        <textarea
          placeholder="Description"
          {...register('description', {
            ...MIN_LENGTH(3),
          })}
          className={errors['description'] && 'input-error'}
        />
        {errors['description'] && <p className="font-semibold text-red-600">{errors['description'].message}</p>}
        <div className="flex justify-end">
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}
