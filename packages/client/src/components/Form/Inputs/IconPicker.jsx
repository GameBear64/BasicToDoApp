import { useState } from 'react';
import Stick from 'react-stick';

import ConnectForm from '@form/ConnectForm';
import Icon from '@components/Icon';

import { icons } from '@tools/consts';

export default function IconPicker({ name, rules = {}, styles, label }) {
  return (
    <ConnectForm>
      {({ register, watch, setValue }) => {
        register(name, rules);
        const chosenIcon = watch(name, '');

        const [showMenu, setShowMenu] = useState(false);

        return (
          <div className={`relative flex flex-col items-center justify-center select-none ${styles || ''}`}>
            <label className="self-start text-xl font-semibold">{label}</label>

            <Stick
              node={
                showMenu && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 card w-80 flex flex-wrap justify-center gap-2 border border-primary shadow-xl">
                    {icons.map(icon => (
                      <div
                        key={icon}
                        onClick={() => {
                          setValue(name, icon);
                          setShowMenu(false);
                        }}
                        className={`${
                          chosenIcon === icon && 'bg-primary'
                        } hover:bg-primary-shade size-8 cursor-pointer rounded flex justify-center items-center`}
                      >
                        <Icon icon={icon} styles="font-extrabold" />
                      </div>
                    ))}
                  </div>
                )
              }
              onClickOutside={() => setShowMenu(false)}
              position="bottom center"
              align="top center"
              transportTo={document.body.querySelector('#root').children[0]}
              autoFlipVertically
              autoFlipHorizontally
            >
              <button type="button" onClick={() => setShowMenu(!showMenu)}>
                Chose Icon
              </button>
            </Stick>
          </div>
        );
      }}
    </ConnectForm>
  );
}
