import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fuzzy from 'fuzzy';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import moment from 'moment';

import TypeaheadSelector from './selector';
import DatePicker from '../datepicker/datepicker';
import KeyEvent from '../keyevent/keyevent';

// Typeahead an auto-completion text input
//
// Renders a text input that shows options nearby that you can
// use the keyboard or mouse to select.
export class Typeahead extends Component {

	static propTypes = {
		customClasses: PropTypes.object,
		disabled: PropTypes.bool,
		maxVisible: PropTypes.number,
		options: PropTypes.array,
		header: PropTypes.string,
		datatype: PropTypes.string,
		defaultValue: PropTypes.string,
		onOptionSelected: PropTypes.func,
		onKeyDown: PropTypes.func,
		selectedOptionIndex: PropTypes.number,
		selectedOption: PropTypes.string
	}

	static defaultProps = {
		options: [],
		header: 'Category',
		datatype: 'text',
		customClasses: {},
		value: '',
		selectedOption: null,
		selectedOptionIndex: null
	}

	constructor(props) {
		super(props);

		// options: set of all currently available options
		// header: title of the options
		// focused: form is focused by user
		// visible: currently visible set of options
		// selectedOption: option that user has currently selected
		// selectedOptionIndex: index of the option the user
		// 	currently has selected
		this.state = {
			options: this.props.options,
			header: this.props.header,
			focused: false,
			value: this.props.value,
			visible: this.getOptionsForValue(
					this.props.value,
					this.props.options
				),
			selectedOption: this.props.selectedOption,
			selectedOptionIndex: this.props.selectedOptionIndex
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.focused) {
			this.inputRef.focus();
		}

		this.setState({
			focused: nextProps.focused,
			options: nextProps.options,
			header: nextProps.header,
			visible: nextProps.options
		});
	}

	// Updates the available options as the user inputs keystrokes
	getOptionsForValue(value, options) {
		let fuzzyOptions = {};

		let result = fuzzy.filter(value, options).map(res => {
			return res.string;
		});

		return result;
	}

	// This will show the user the header of the category and the
	// options depending on the category of the search he is in and 
	// what he has entered
	_renderIncrementalSearchResults() {
		if (!this.state.focused) {
			return '';
		}

		// handle special case for date time querying
		if (this.props.datatype === 'datetime') {
			return (
				<DatePicker
					onOptionSelected={this._onOptionSelected}
					updateDateValue={this.updateDateValue}
				/>
		       );
		}

		// there are no typeahead/autocomplete suggestions, 
		// so render nothing
		if (!this.state.visible.length) {
			return '';
		}

		return (
			<TypeaheadSelector
				customClasses={this.props.customClasses}
				options={this.state.visible}
				header={this.state.header}
				onOptionSelected={this._onOptionSelected}
				selectedOptionIndex={this.state.selectedOptionIndex}
			/>
		);
	}

	// Update the value when using a calendar popup
	updateDateValue = (newValue) => {
		this.setState({
			value: newValue
		});
	}

	// When a user selects an option in the current list, we need 
	// to refocus the user to the input, update the value in the input,
	// and get the next list of options
	_onOptionSelected = (option) => {
		// need to refocus on input box after selection
		this.inputRef.focus();

		// convert datetimes when user hits enter on value
		if (this.props.datatype === 'datetime') {
			option = moment(option).toISOString();
		}

		this.setState({
			value: '',
			visible: this.getOptionsForValue(
						 option,
						 this.state.options
					),
			selectedOption: null,
			selectedOptionIndex: null
		});

		this.props.addTokenForValue(option);
	}

	// As the user enters keystrokes fuzzy match against current options
	_onTextEntryUpdated = (event) => {
		let value = event.target.value;
		
		this.setState({
			value,
			visible: this.getOptionsForValue(
					 value,
					 this.state.options
				),
			selectedOption: null
		});
	}


	// Event mappings for keystrokes
	eventMap(event) {
		let events = {};

		events[KeyEvent.DOM_VK_UP] = this.navUp;
		events[KeyEvent.DOM_VK_DOWN] = this.navDown;
		events[KeyEvent.DOM_VK_RETURN] = events[KeyEvent.DOM_VK_ENTER] = this._onEnter;
		events[KeyEvent.DOM_VK_ESCAPE] = this._onEscape;
		events[KeyEvent.DOM_VK_TAB] = this._onTab;
		events[KeyEvent.DOM_VK_SPACE] = this._onSpace;

		return events;
	}


	// Handle a tab event for autofill
	_onTab(event) {
		event.preventDefault();

		// pass the first visible option in the list for tab 
		// completion
		let option = this.state.selectedOption ? 
			this.state.selectedOption :
			this.state.visible[0];
	
		this._onOptionSelected(option);
	}


	// Handle an escape event for deselecting an option using arrow keys
	_onEscape() {
		this.setState({
			selectedOptionIndex: null,
			selectedOption: null
 		});
 	}


	// Handle an enter event that wasn't caught in this.onKeyDown()
	// pass either a selected option from arrow keys or pass the first
	// visible option in the list
	_onEnter(event) {
		if (this.state.selectedOption) {
			this._onOptionSelected(this.state.selectedOption);
		} else if (this.state.visible.length > 0) {
			this._onOptionSelected(this.state.visible[0]);
		}
	}

	// Handle a space event that wasn't caught in this.onKeyDown()
	// pass either a selected option from arrow keys or pass the first
	// visible option in the list if there are no spaces in the options
	// remaining on the list or the option if it is the only one remaining
	_onSpace(event) {
		if (this.state.selectedOption) {
			this._onOptionSelected(this.state.selectedOption);
			event.preventDefault();
		} else if (this.state.visible.length === 1 || 
				this.state.visible.length > 0 && 
				this.state.visible.every(option => {
					return option.indexOf(' ') === -1;
				})
		) {
			this._onOptionSelected(this.state.visible[0]);
			event.preventDefault();
		}
	}

	// Handle key events as user enters input
	// @event: key pressed by user
	_onKeyDown = (event) => {
		// If enter pressed
		if (event.keyCode === KeyEvent.DOM_VK_RETURN ||
			event.keyCode === KeyEvent.DOM_VK_ENTER) {

			if (this.state.visible.length === 0) {
				this._onOptionSelected(this.state.value);
			}
		}

		// if there are no visible elements, don't perform selected
		// navigation. Just pass up to the upstream onkeyDown handler
		if (!this.state.visible.length) {
			return this.props.onKeyDown(event, this.state.value);
		}

		let handler = this.eventMap()[event.keyCode];

		// handle any special keystrokes
		if (handler) {
			handler.call(this, event);
		} else {
			return this.props.onKeyDown(event, this.state.value);
		}

		if (event.keyCode !== KeyEvent.DOM_VK_SPACE) {
			// don't propagate keystrokes back to DOM/browser
			event.preventDefault();
		}
	}


	// Move the selected option up or down depending on keystroke
	// @delta: direction in which to move
	_nav(delta) {
		// no visible options to move to
		if (!this.state.visible.length) {
			return;
		}

		let newIndex;

		// if no selection has been set
		if (this.state.selectedOptionIndex === null) {
			if (delta === 1) {
				newIndex = 0;
			} else {
				newIndex = delta;
			}
		} else {
			newIndex = this.state.selectedOptionIndex + delta;
		}

		// wrap around to end or start if user goes past start 
		// or end of list
		if (newIndex < 0) {
			newIndex += this.state.visible.length;
		} else if (newIndex >= this.state.visible.length) {
			newIndex -= this.state.visible.length;
		}

		let newSelection = this.state.visible[newIndex];
		this.setState({
			selectedOptionIndex: newIndex,
			selectedOption: newSelection
		});
	}

	// Go down the options
	navDown() {
		this._nav(1);
	}

	// Go up the options
	navUp() {
		this._nav(-1);
	}

	// drop focus when user clicks outside of component
	// used with react-onclickoutside
	handleClickOutside = (event) => {
		this.setState({
			focused: false
		});
	}


	render() {
		const { customClasses } = this.props;

		let inputClassList = classNames({
			'filter-tokenizer-text-input': true,
			[customClasses.input]: !!customClasses.input
		});

		return (
			<div className="typeahead">
				<input
					className={inputClassList}
					disabled={this.props.disabled}
					onChange={this._onTextEntryUpdated}
					onKeyDown={this._onKeyDown}
					ref={ref => this.inputRef = ref}
					type="text"
					value={this.state.value}
				/>
				{this._renderIncrementalSearchResults()}
			</div>
	       );
	}
}


export default onClickOutside(Typeahead);
