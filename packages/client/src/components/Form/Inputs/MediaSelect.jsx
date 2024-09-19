import Icon from '@components/Icon';

import ConnectForm from '@form/ConnectForm';

export default function MediaSelect({ name, rules = {}, styles, label, ...rest }) {
  return (
    <ConnectForm>
      {({ register, watch, setValue, formState: { dirtyFields } }) => {
        register(name, rules);
        const file = watch(name, '');

        return (
          <div className={`flex flex-col items-center justify-center ${styles}`}>
            <label className="self-start text-xl font-semibold">{label}</label>
            {file ? (
              <div className="relative w-fit self-center">
                <img
                  className="max-h-52"
                  src={dirtyFields[name] ? URL.createObjectURL(file) : `http://localhost:3030/recourse/${file}`}
                  alt=""
                />
                <div className="absolute right-[2px] top-[2px] rounded-md">
                  {/* <Icon icon="edit" styles="rounded-lg border-2 border-neutral-400 bg-white text-neutral-700" /> */}
                  <Icon
                    icon="delete"
                    onClick={() => setValue(name, '', { shouldDirty: true, shouldTouch: true })}
                    styles="rounded-lg border-2 border-neutral-400 bg-white text-neutral-700"
                  />
                </div>
              </div>
            ) : (
              <input
                className="file:text-black-700 mb-2 block w-full
                border-none text-sm font-semibold
                text-txtSecondary file:mr-4
                file:cursor-pointer file:rounded-full file:border-0
                file:bg-base-xs file:px-4
                file:py-2 file:text-sm file:font-semibold hover:file:bg-base-xxs"
                {...rest}
                type="file"
                onChange={(e) => {
                  setValue(name, e.target.files[0], { shouldDirty: true, shouldTouch: true });
                }}
              />
            )}
          </div>
        );
      }}
    </ConnectForm>
  );
}
