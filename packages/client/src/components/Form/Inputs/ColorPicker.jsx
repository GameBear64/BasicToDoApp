import ConnectForm from '@form/ConnectForm';
import Icon from '@components/Icon';

import { tailwindColors, colors } from '@tools/consts';

export default function ColorPicker({ name, rules = {}, styles, label }) {
  return (
    <ConnectForm>
      {({ register, watch, setValue }) => {
        register(name, rules);
        const chosenColor = watch(name, '');

        return (
          <div className={`flex flex-col  items-center justify-center select-none ${styles || ''}`}>
            <label className="text-xl font-semibold">{label}</label>
            <div className="flex gap-1 flex-wrap w-28 justify-center">
              {colors.map(color => (
                <div
                  key={color}
                  onClick={() => setValue(name, color)}
                  className={`${tailwindColors[color]} size-6 cursor-pointer rounded flex justify-center items-center`}
                >
                  {chosenColor === color && <Icon icon="check" styles="font-extrabold" />}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </ConnectForm>
  );
}
