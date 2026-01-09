/**
 * Jotai Provider
 * Provider setup with DevTools for development
 */

import { Provider } from 'jotai';
import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';

interface JotaiProviderProps {
  children: React.ReactNode;
}

export function JotaiProvider({ children }: JotaiProviderProps) {
  return (
    <Provider>
      {import.meta.env.DEV && <DevTools />}
      {children}
    </Provider>
  );
}
