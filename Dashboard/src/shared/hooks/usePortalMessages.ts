import { useState, useEffect } from 'react';
import type { PortalMessage } from '../../types/domain';

export const usePortalMessages = () => {
  const [portalMessages, setPortalMessages] = useState<PortalMessage[]>(() => {
    try {
      const local = localStorage.getItem('janatics_portal_messages');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('janatics_portal_messages', JSON.stringify(portalMessages));
  }, [portalMessages]);

  const getMessage = (code: string): string => {
    const msg = portalMessages.find(m => m.portalCode.toLowerCase() === code.toLowerCase());
    return msg ? msg.portalText : code;
  };

  const updatePortalMessage = (updated: PortalMessage) => {
    setPortalMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  return { portalMessages, getMessage, updatePortalMessage };
};
