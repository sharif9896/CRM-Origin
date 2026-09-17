import { useContext } from 'react';
import { AccessContext } from '../context/accessContextObject';

export const useAccess = () => {
  const value = useContext(AccessContext);
  if (!value) throw new Error('useAccess must be used inside AccessProvider');
  return value;
};
