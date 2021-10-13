
import * as LinkTo from '../link-to';

import Path from './Path';

export default function NameRedirect(props) {
	return <LinkTo.Name {...props} as={Path} />;
}
