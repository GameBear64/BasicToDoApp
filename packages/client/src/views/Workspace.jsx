import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import useFetch from '@tools/useFetch';

import WorkArea from '@components/Workspace/WorkArea';

export default function Home() {
  const { id, view } = useParams();

  const [workspace, setWorkspace] = useState([]);

  const fetchWP = () => {
    useFetch({
      url: `workspace/${id}${view ? '/' + view : ''}`,
    }).then(response => setWorkspace(response));
  };

  useEffect(() => {
    fetchWP();
  }, [id, view]);

  return (
    <>
      <div className="flex gap-2">
        <h1>{workspace.name}</h1>
        {workspace?.views?.map(v => (
          <Link
            className={`${view == v.id || (view == undefined && v.default) ? 'underline' : ''}`}
            key={v.id}
            to={{
              pathname: `/wp/${id}/${v.id}`,
            }}
          >
            {v.name}
          </Link>
        ))}
      </div>

      <WorkArea columns={workspace.columns} />
    </>
  );
}
