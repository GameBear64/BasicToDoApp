import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '@components/Layout/NavBar';

import { doNotRedirectFrom } from '@tools/consts';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="bg-base text-txtPrimary h-screen w-screen overflow-auto flex flex-col">
      {!doNotRedirectFrom.includes(location.pathname) && <NavBar />}

      <Outlet />
    </div>
  );
}
