import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Token component displays a users query
class Token extends Component {

	static propTypes = {
		children: PropTypes.object,
		onClick: PropTypes.func,
		onRemove: PropTypes.func
	}

	static defaultProps = {
		children: {}
	}

	_makeCloseButton() {
		if (!this.props.onRemove) return;

		const onClickClose = (event) => {
			event.stopPropagation();
			this.props.onRemove(this.props.children);
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

	_disableToken = (event) => {
		event.stopPropagation();

		this.props.onClick(this.props.children);
	}

	render() {
		const { children } = this.props;

		return (
			<div
				className="typeahead-token"
				onClick={this._disableToken}
				style={{ background: children.disabled === true ? 'transparent': '' }}
			>
				{children.category} {children.operator} {children.value}
				{this._makeCloseButton()}
			</div>
		);
	}
}

export default Token;
