import { APP_VERSION } from './constants';
import { storageFactory } from './storageWrapper';

const key = (name: string) => `${APP_VERSION}:${name}`;

export default storageFactory(key, process.browser ? window.localStorage : null);
