import { atom } from 'recoil';

export const STORE_KEY_USER = 'user';

export function getValue(key: string) {
  return localStorage.getItem(key);
}

export function setValue(key: string, value: string) {
  if (!value) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
}

function createAtom(key: string, defaultValue: any) {
  return atom({
    key,
    default: getValue(key) || defaultValue,
    effects_UNSTABLE: [
      ({ onSet }) => {
        onSet((newValue: any) => {
          setValue(key, newValue);
        });
      },
    ],
  });
}

export const userAtom = createAtom(STORE_KEY_USER, JSON.stringify({}));

export function getUser() {
  const userString = getValue(STORE_KEY_USER);
  if (userString) {
    return JSON.parse(userString);
  }
  return null;
}
