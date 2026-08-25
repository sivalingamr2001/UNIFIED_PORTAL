import { useDatabaseContext } from '../lib/database.context';

export const useDatabase = () => {
  return useDatabaseContext();
};
