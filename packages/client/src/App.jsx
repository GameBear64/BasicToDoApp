import { useContext } from 'react';

import { theme } from '@tools/ThemeProvider';

import Icon from '@components/Icon';

import TaskView from '@views/TaskView';

function App() {
  const { mode, toggleMode } = useContext(theme);

  return (
    <div className="bg-base text-txtPrimary h-screen w-screen overflow-auto">
      <div className="w-full flex justify-end">
        <button
          className="plain-btn flex justify-center items-center !text-txtPrimary size-10 m-2"
          onClick={toggleMode}
        >
          {mode == 'light' ? <Icon icon="dark_mode" /> : <Icon icon="light_mode" />}
        </button>
      </div>

      <TaskView />
    </div>
  );
}

export default App;
