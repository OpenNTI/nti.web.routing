import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';

import {Router, LinkTo, Route, View} from '../../src';

const TEST_MIME_TYPE = 'test-mime-type';

function Root () {
	return (
		<View.WithTitle title="Cmp Root">
			<div>
				<LinkTo.Path to="/sub">
					Sub
					<LinkTo.Path to="/sub/a">Sub/A</LinkTo.Path>
					<LinkTo.Path to="/sub/b">Sub/B</LinkTo.Path>
				</LinkTo.Path>
				<h1>Root</h1>
			</div>
		</View.WithTitle>
	);
}

class CmpA extends React.Component {
	static contextTypes = {
		router: PropTypes.shape({
			routeTo: PropTypes.shape({
				object: PropTypes.func,
				name: PropTypes.func
			})
		})
	}

	gotoRoot = () => {
		const {router} = this.context;

		router.routeTo.name('root');
	}


	gotoSubRoot = () => {
		const {router} = this.context;

		router.routeTo.name('sub-root');
	}


	gotoObject = () => {
		const {router} = this.context;

		router.routeTo.object({MimeType: TEST_MIME_TYPE});
	}


	render () {
		return (
			<View.WithTitle title="Cmp A">
				<div>
					<LinkTo.Name name="root">Root</LinkTo.Name>
					<LinkTo.Name name="sub-root">Sub Root</LinkTo.Name>
					<LinkTo.Object object={{MimeType: TEST_MIME_TYPE}}>Object</LinkTo.Object>
					<button onClick={this.gotoRoot}>Goto Root</button>
					<button onClick={this.gotoSubRoot}>Goto Sub Root</button>
					<button onClick={this.gotoObject}>Goto Object</button>

					<h2>Nested A</h2>
				</div>
			</View.WithTitle>
		);
	}
}


function CmpB () {
	return (
		<View.WithTitle title="Cmp B">
			<div>
				<LinkTo.Name name="root">Root</LinkTo.Name>
				<LinkTo.Name name="sub-root">Sub Root</LinkTo.Name>

				<h2>Nested B</h2>
			</div>
		</View.WithTitle>
	);
}

function SubCmp () {
	return (
		<View.WithTitle title="Cmp Sub">
			<div>
				<LinkTo.Path to="a">A</LinkTo.Path>
				<LinkTo.Path to="b">B</LinkTo.Path>

				<h2>Sub Root</h2>
			</div>
		</View.WithTitle>
	);
}

Frame.propTypes = {
	children: PropTypes.any
};
function Frame ({children}) {
	return (
		<div className="sub-frame">
			<div>frame</div>
			{children}
		</div>
	);
}

const Sub = Router.for([
	Route({path: '/a', component: CmpA}),
	Route({path: '/b', component: CmpB, getRouteFor: (obj) => {
		if (obj.MimeType === TEST_MIME_TYPE) {
			return () => {
				alert('Object Clicked');
			};
		}
	}}),
	Route({path: '/', component: SubCmp, name: 'sub-root'})
], {frame: Frame});

const Test = Router.for([
	Route({path: '/sub', component: Sub}),
	Route({path: '/', component: Root, name: 'root'})
], {title: 'root'});

ReactDom.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
