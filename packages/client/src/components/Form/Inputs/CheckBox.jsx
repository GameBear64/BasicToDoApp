import ConnectForm from '../ConnectForm';

export default function InputField({ name, label, rules = {}, styles, ...rest }) {
  return (
    <ConnectForm>
      {({ register, formState: { errors } }) => {
        const { ref, ...registerRest } = register(name, rules);
        return (
          <div className={styles}>
            <div className="flex items-center gap-2">
              <input
                id={label?.toLowerCase().replace(/ /g, '-')}
                ref={ref}
                type="checkbox"
                className={errors[name] ? 'input-error' : 'input size-5 accent-primary'}
                {...registerRest}
                {...rest}
              />
              <label htmlFor={label?.toLowerCase().replace(/ /g, '-')} className="text-sm font-semibold text-txtSecondary">
                {label}
              </label>
            </div>
            {errors[name] && <p className="font-semibold text-red-600">{errors[name].message}</p>}
          </div>
        );
      }}
    </ConnectForm>
  );
}
