import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { fetchCreds, routes } from '@/lib/routes';

function ModalNewStudySession({ children }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      {/* Open Modal Only */}
      <div onClick={() => setModalOpen(true)}>Create New Study Session</div>
    </div>
  );
}

export default ModalNewStudySession;
