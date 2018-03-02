import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TypeaheadOption from './option';

// Typeahead selector is the menu that holds the header
// of the current category and also holds all
// currently viewable options in category
class TypeaheadSelector extends Component {

	static propTypes = {
		options: PropTypes.array,
		header: PropTypes.string,
		customClasses: PropTypes.object,
		onOptionSelected: PropTypes.func
	}

	static defaultProps = {
		customClasses: {},
		header: '',
		options: []
	}

	render() {
		const {
			customClasses,
			header,
			onOptionSelected,
			options,
			selectedOptionIndex
		} = this.props;

		let classList = classNames({
			'typeahead-selector': true,
			'filter-tokenizer-list__container': true,
			[customClasses.results]: customClasses.results
		});

		let results = options.map((option, i) => {
			return (
				<TypeaheadOption
					onClick={onOptionSelected}
					option={option}
					customClasses={customClasses}
					hover={selectedOptionIndex === i}
					key={i}
				/>
			);
		}, this);

		return (
			<ul className={classList}>
				<li className="header">{header}</li>
				{results}
			</ul>
		);
	}
}



export default TypeaheadSelector;
