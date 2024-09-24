import { createPortal } from 'react-dom';

import Icon from './Icon';

export default function Modal({ children, closeFunction, easyClose, title }) {
  const portalTarget = document.body.querySelector('#root').children[0];

  return createPortal(
    <div
      className="background-div z-50 absolute right-0 top-0 flex h-screen w-screen flex-col items-center justify-center bg-slate-500/40"
      onClick={e => {
        if (easyClose && Object.values(e.target.classList).includes('background-div')) closeFunction();
      }}
    >
      <div className="w-2/3 min-w-[20em] max-w-[80vw] rounded-lg bg-base-x px-4 py-3 text-txtPrimary md:w-1/2 md:max-w-[60vw] xl:w-1/3">
        <div className="flex justify-between border-b-2 border-primary pb-1">
          <p className="text-xl font-bold"> {title} </p>
          {closeFunction && (
            <button className="bare flex items-center" onClick={closeFunction}>
              <Icon icon="close" />
            </button>
          )}
        </div>
        <div className="max-h-[80vh] overflow-auto py-2">{children}</div>
      </div>
    </div>,
    portalTarget
  );
}
