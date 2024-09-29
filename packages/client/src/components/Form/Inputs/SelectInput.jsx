import ConnectForm from '../ConnectForm';

// options = [{ value: 'us', label: 'United States' }]
export default function SelectField({ name, label, options = [], rules = {}, styles, ...rest }) {
  return (
    <ConnectForm>
      {({ register, formState: { errors } }) => {
        const { ref, ...registerRest } = register(name, rules);
        return (
          <div className={styles}>
            <div className="flex flex-col">
              <label className="text-left font-semibold text-txtSecondary">{label}</label>
              <select ref={ref} className={errors[name] && 'input-error'} {...registerRest} {...rest}>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {errors[name] && <p className="font-semibold text-red-600">{errors[name].message}</p>}
          </div>
        );
      }}
    </ConnectForm>
  );
}
