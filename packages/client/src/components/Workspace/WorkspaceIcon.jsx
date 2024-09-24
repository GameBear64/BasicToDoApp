import Icon from '@components/Icon';

import { tailwindColors, textSizes } from '@tools/consts';

export default function WorkspaceIcon({ color, icon, size }) {
  const defTextSize = size => {
    const number = size.split('-')[1];

    const keys = Object.keys(textSizes).map(Number);
    const key = keys.find(k => number <= k);

    return textSizes[key];
  };

  const textSize = defTextSize(size);

  return (
    <div className={`${tailwindColors[color]} ${size || 'size-24'} rounded flex justify-center items-center`}>
      <Icon icon={icon} styles={`${textSize || 'text-6xl'} text-white font-extrabold`} />
    </div>
  );
}
