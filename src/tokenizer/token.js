import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Token component displays a users query
class Token extends Component {

	_makeCloseButton() {
		if (!this.props.onRemove) {
			return;
		}

		const onClickClose = (event) => {
			this.props.onRemove(this.props.children);
			event.preventDefault();
		};


		return (
			<a 
				href="#"
				onClick={onClickClose}
				className="typeahead-token-close"
			>
				&#x00d7;
			</a>
		);
	}

	render() {
		const { children } = this.props;

		return (
			<div className="typeahead-token">
				{children.category} {children.operator} {children.value}
				{this._makeCloseButton()}
			</div>
		);
	}
}

Token.propTypes = {
	children: PropTypes.object,
	onRemove: PropTypes.func
};

Token.defaultProps = {
	children: {}
};

export default Token;
