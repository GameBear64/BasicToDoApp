import { useStore } from '@nanostores/react';
import { $preferences, setTheme } from '@store/preferences';

import Icon from '@components/Icon';

export default function NavBar() {
  const preferences = useStore($preferences);

  const toggleMode = () => {
    if (preferences.theme == 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <div className="w-full flex justify-end">
      <button className="plain-btn flex justify-center items-center !text-txtPrimary size-10 m-2" onClick={toggleMode}>
        {preferences.theme == 'light' ? <Icon icon="dark_mode" /> : <Icon icon="light_mode" />}
      </button>
    </div>
  );
}
