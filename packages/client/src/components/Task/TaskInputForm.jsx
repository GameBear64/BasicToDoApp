import { useContext } from 'react';
import { useForm } from 'react-hook-form';

import useFetch from '@tools/useFetch';
import { successSnackBar } from '@tools/snackbars';
import { REQUIRED, MIN_LENGTH, MAX_LENGTH } from '@tools/validations';

import { TasksContext } from '@views/TaskView';

export default function TaskInputForm({ initialValues, closeFunction }) {
  const { setTasks } = useContext(TasksContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const sendData = data => {
    if (initialValues) {
      useFetch({
        url: `task/${initialValues.id}`,
        method: 'PATCH',
        body: { title: data.title, description: data.description },
      }).then(response => {
        successSnackBar('Task updated');
        setTasks(prev => prev.map(task => (task.id === response.id ? response : task)));
        closeFunction && closeFunction();
      });
    } else {
      useFetch({
        url: 'task',
        method: 'POST',
        body: data,
      }).then(response => {
        successSnackBar('Task created');
        setTasks(prev => [...prev, response]);
        closeFunction && closeFunction();
      });
    }
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
