import ConnectForm from '../ConnectForm';

export default function TextareaField({ name, label, rules = {}, styles, ...rest }) {
  return (
    <ConnectForm>
      {({ register, formState: { errors } }) => {
        const { ref, ...registerRest } = register(name, rules);
        return (
          <div className={styles}>
            <div className="flex flex-col">
              <label className="text-left font-semibold text-txtSecondary">{label}</label>
              <textarea
                ref={ref}
                className={errors[name] ? 'input-error' : 'input h-auto'}
                {...registerRest}
                {...rest}>
              </textarea>
              {errors[name] && <p className="font-semibold text-red-600">{errors[name].message}</p>}
            </div>
          </div>
        );
      }}
    </ConnectForm>
  );
}
