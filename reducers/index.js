import { combineReducers } from 'redux';

import auth from './auth';
import logistics from './logistics';
import siteConfig from './siteConfig';

export default combineReducers({
  auth,
  logistics,
  siteConfig,
});