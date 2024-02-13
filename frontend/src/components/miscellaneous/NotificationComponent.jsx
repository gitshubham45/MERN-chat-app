import React, { useRef } from 'react';
import NotificationBadge from 'react-notification-badge';

const NotificationComponent = ({count,effect}) => {
  const badgeRef = useRef(null);

  return (
    <NotificationBadge ref={badgeRef} count={count} effect={effect} />
  );
};

export default NotificationComponent;
