import { ClientNotExistError } from '@cosmos-kit/core';

import { Xion } from './types';

interface XionWindow {
  xion?: Xion;
}

export const getXionFromExtension: () => Promise<
  Xion | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const xion = (window as XionWindow).xion;

  if (xion) {
    return xion;
  }

  if (document.readyState === 'complete') {
    if (xion) {
      return xion;
    } else {
      throw ClientNotExistError;
    }
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (xion) {
          resolve(xion);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
