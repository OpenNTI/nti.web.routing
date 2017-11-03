import React from 'react';
import PropTypes from 'prop-types';
import {Link, NavLink} from 'react-router-dom';

PathLink.propTypes = {
	activeClassName: PropTypes.string,
	activeStyle: PropTypes.object
};
export default function PathLink ({activeClassName, activeStyle, ...otherProps}) {
	return activeClassName || activeStyle ?
		(<NavLink activeClassName={activeClassName} activeStyle={activeStyle} {...otherProps} />) :
		(<Link {...otherProps} />);
}
