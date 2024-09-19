import { persistentMap } from '@nanostores/persistent';

// import useFetch from '@tools/useFetch';

const defaultState = {
  theme: 'dark',
  accent: 'green',
};
export const $preferences = persistentMap('theme-', defaultState);

export function setPreferences(preferencesDetails) {
  $preferences.set(preferencesDetails);
}

export function getPreferences() {
  return $preferences.get().theme;
}

export function setTheme(theme) {
  // useFetch({
  //   url: 'user/settings',
  //   method: 'PATCH',
  //   body: {
  //     theme: theme,
  //   },
  // }).then(() => {
  $preferences.setKey('theme', theme);
  // });
}

export function setAccent(accent) {
  // useFetch({
  //   url: 'user/settings',
  //   method: 'PATCH',
  //   body: {
  //     accent,
  //   },
  // }).then(() => {
  $preferences.setKey('accent', accent);
  // });
}

export function clearPreferences() {
  $preferences.setKey('accent', '');
  $preferences.setKey('theme', '');
}
