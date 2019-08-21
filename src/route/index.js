import {Route as BaseRoute, Redirect as BaseRedirect} from 'react-router-dom';

import Hash from './Hash';
import RouteConfig from './RouteConfig';

Route.Hash = Hash;
Route.Path = BaseRoute;
Route.Redirect = BaseRedirect;
export default function Route (config) {
	return new RouteConfig(config);
}

