import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import useFetch from '@tools/useFetch';

import Modal from '@components/Modal';
import CreateWorkspace from '@components/Workspace/CreateWorkspace';
import WorkspaceIcon from '@components/Workspace/WorkspaceIcon';

export default function Home() {
  const [workspaces, setWorkspaces] = useState([]);
  const [createModal, setCreateModal] = useState(false);

  const fetchAll = () => {
    useFetch({
      url: 'workspace/all',
    }).then(response => setWorkspaces(response));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="flex gap-4 items-center">
      {workspaces.map(wp => (
        <div className="bg-base-m p-4" key={wp.id}>
          <WorkspaceIcon {...wp} size="size-20" />
          <Link
            to={{
              pathname: `/wp/${wp.id}`,
            }}
          >
            {wp.name}
          </Link>
        </div>
      ))}
      <div className="bg-base-m p-4">
        <button className="plain-btn" onClick={() => setCreateModal(true)}>
          Add
        </button>
      </div>
      {createModal && (
        <Modal easyClose title="Create new workspace" closeFunction={() => setCreateModal(false)}>
          <CreateWorkspace />
        </Modal>
      )}
    </div>
  );
}
