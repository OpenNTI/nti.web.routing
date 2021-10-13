
import * as LinkTo from '../link-to';

import Path from './Path';

export default function ObjectRedirect(props) {
	return <LinkTo.Object {...props} as={Path} />;
}
