import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { pick } from '@tools/utils';

export default function Form({
  defaultValues,
  children,
  onSubmit,
  onChange,
  submitOnEnter = false,
  onlyDirty = false,
  validationMode = 'onChange',
  ...rest
}) {
  const methods = useForm({ defaultValues, mode: validationMode });
  const {
    handleSubmit,
    reset,
    watch,
    formState: { dirtyFields },
  } = methods;

  const allFields = watch();

  useEffect(() => {
    if (onChange) onChange(allFields);
  }, [allFields]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const checkKeyDown = e => {
    if (e.key === 'Enter' && !submitOnEnter) e.preventDefault();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(e => {
          onSubmit(onlyDirty ? pick(e, Object.keys(dirtyFields)) : e);
          if (submitOnEnter) reset();
        })}
        onKeyDown={e => checkKeyDown(e)}
        {...rest}
      >
        {children}
      </form>
    </FormProvider>
  );
}
