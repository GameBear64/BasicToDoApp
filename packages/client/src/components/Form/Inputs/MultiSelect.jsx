import ConnectForm from '../ConnectForm';

export default function SelectInput({ name, label, rules = {}, options, ...rest }) {
  return (
    <ConnectForm>
      {({ register, formState: { errors } }) => {
        const { ref, ...registerRest } = register(name, rules);
        return (
          <div className="w-full">
            <div className="flex flex-col">
              <label className="mr-2 font-semibold text-txtSecondary">{label}</label>
              <select
                className="w-full cursor-pointer rounded-sm bg-base-x focus:outline-none"
                ref={ref}
                {...registerRest}
                {...rest}>
                {options.map((option) => (
                  <option key={option._id} className={`flex cursor-pointer items-center bg-base-m p-2 hover:bg-base-m`}>
                    <div className="ml-2 flex w-full flex-col justify-between">
                      <p className="text-sm font-bold leading-snug text-txtPrimary">{option?.name || option?.handle}</p>
                      <p className="text-xs leading-snug text-txtSecondary">@{option?.handle}</p>
                    </div>
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
