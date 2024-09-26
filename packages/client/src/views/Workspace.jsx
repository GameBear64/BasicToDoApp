import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Link, useParams } from 'react-router-dom';

import { $workspace, fetchWP } from '@store/workspace';

import WorkArea from '@components/Workspace/WorkArea';

export default function Home() {
  const { id, view } = useParams();
  const workspace = useStore($workspace);

  useEffect(() => {
    fetchWP({ id, view });
  }, [id, view]);

  useEffect(() => {
    console.log(workspace);
  }, [workspace]);

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
