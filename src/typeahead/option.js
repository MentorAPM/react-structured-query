import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Typeahead option displays a single option in 
// a list of all options
class TypeaheadOption extends Component {

	static propTypes = {
		customClasses: PropTypes.object,
		onClick: PropTypes.func,
		option: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
	}

	static defaultProps = {
		customClasses: {},
		hover: false
	}

	// Prevent default when clicking an option
	_onClick = () => {
		this.props.onClick(this.props.option);
	}

	_getClasses() {
		const { customClasses } = this.props;

		let classes = classNames({
			"typeahead-option": true,
			'filter-tokenizer-list__item': true,
			[customClasses.listAnchor]: !!customClasses.listAnchor
		});

		return classes;
	}

	// Render the current option
	render() {
		const { customClasses, option } = this.props;

		let classList = classNames({
			hover: this.props.hover,
			'filter-tokenizer-list__item': true,
			[customClasses.listItem]: !!customClasses.listItem
		});

		return (
			<li className={classList} onClick={this._onClick}>
				<a href="#" className={this._getClasses()}>
					{typeof option === 'object' ?
						option.name : option }
				</a>
			</li>
		);
	}
}

export default TypeaheadOption;
