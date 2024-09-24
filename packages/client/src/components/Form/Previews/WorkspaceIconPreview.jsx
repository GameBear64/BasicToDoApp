import ConnectForm from '@form/ConnectForm';
import Icon from '@components/Icon';

import { tailwindColors, colors, icons } from '@tools/consts';

export default function WorkshopIconPreview({ size }) {
  return (
    <ConnectForm>
      {({ getValues, setValue }) => {
        const icon = getValues('icon');
        const color = getValues('color');

        const setRandom = () => {
          setValue('icon', icons[Math.floor(Math.random() * icons.length)]);
          setValue('color', colors[Math.floor(Math.random() * colors.length)]);
        };

        return (
          <div className="relative select-none">
            <div
              className={`${tailwindColors[color] || 'bg-gray-500'} ${size || 'size-24'}
              rounded flex justify-center items-center`}
            >
              {icon && <Icon icon={icon} styles="text-white text-6xl font-extrabold" />}
            </div>
            <div
              className={`absolute top-0 
              ${size || 'size-24'}
              rounded flex justify-center items-center bg-neutral-500/60 opacity-0 hover:opacity-100 transition-opacity`}
            >
              <Icon
                icon="replay"
                clickable
                styles="text-white text-6xl font-extrabold active:translate-y-0.5 transition-transform"
                onClick={setRandom}
              />
            </div>
          </div>
        );
      }}
    </ConnectForm>
  );
}
