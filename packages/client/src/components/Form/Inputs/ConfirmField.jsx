import ConnectForm from '../ConnectForm';

export default function ConfirmField({ name, sameAs, rules = {}, styles, label, ...rest }) {
  return (
    <ConnectForm>
      {({ register, watch, formState: { errors } }) => {
        return (
          <div className={styles}>
            <div className={`flex flex-col ${label ? 'mt-2' : ''}`}>
              <label className="text-left font-semibold text-txtSecondary">{label}</label>
              <input
                {...register(name, {
                  ...rules,
                  validate: value => {
                    if (watch(sameAs) != value) return 'Your passwords do no match';
                  },
                })}
                className={errors[name] ? 'input-error' : 'input'}
                {...rest}
              />
            </div>
            {errors[name] && <p className="text-red-400">{errors[name]?.message}</p>}
          </div>
        );
      }}
    </ConnectForm>
  );
}
