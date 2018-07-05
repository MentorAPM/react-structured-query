import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Token component displays a users query
class Token extends Component {

	_makeCloseButton() {
		if (!this.props.onRemove) return;

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

	_disableToken = () => {
		if (!this.props.onRemove) return;

		this.props.onClick(this.props.children);
	}

	render() {
		const { children } = this.props;

		const value = typeof children.value === 'object' ?
			children.value.name : children.value;

		return (
			<div
				className="typeahead-token"
				onClick={this._disableToken}
				style={{ background: children.disabled === true ? 'transparent': '' }}
			>
				{children.category} {children.operator} {value}
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
