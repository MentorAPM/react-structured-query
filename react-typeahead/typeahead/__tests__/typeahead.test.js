import test from 'tape';
import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InputMoment from 'input-moment';
import moment from 'moment';

import { Typeahead } from '../typeahead';
import Selector from '../selector';
import Option from '../option';
import KeyEvent from 'keyevent';
import DatePicker from '../../datepicker/datepicker';

configure({ adapter: new Adapter() });

test('full mount render test of structured query typeahead', (t) => {
	function tabAutoComplete(option) {
		t.equal(option, 'Bar',
			'Wrong option was sent back on tab autocomplete');
	}

	const options = ['Foo', 'Bar', 'Baz', 'abc'];
	const wrapper = mount(
			<Typeahead
				addTokenForValue={tabAutoComplete}
			/>);


	t.ok(wrapper.find('div').hasClass('typeahead'),
		'Div has incorrect class on initial render');

	t.ok(wrapper.find('input').hasClass('filter-tokenizer-text-input'),
		'Input has incorrect class on initial render');

	t.equal(wrapper.state('header'), 'Category',
		'Header in state is incorrect on initial render');

	t.deepEqual(wrapper.state('options'), [],
		'Options in state is incorrect on initial render');

	t.deepEqual(wrapper.state('visible'), [],
		'Visible in state is incorrect on initial render');

	t.equal(wrapper.instance()._renderIncrementalSearchResults(), '',
		'Search results is rendering a selector with no options');

	wrapper.setProps({
		customClasses: {
			input: 'inputClass'
		},
		header: 'New Header',
		data: 'number',
		options
	});

	t.ok(wrapper.find('input').hasClass('inputClass'),
		'Input has incorrect class when customClasses.input is set');

	t.equal(wrapper.state('header'), 'New Header',
		'Header in state did not update on new props');

	t.deepEqual(wrapper.state('options'), options,
		'Options in state did not update on new props');

	t.deepEqual(wrapper.state('visible'), options,
		'Visible options in state did not update on new options props');

	t.equal(wrapper.instance()._renderIncrementalSearchResults(), '',
		'Input box is focused when it shouldnt be');

	// test user focusing on typeahead
	wrapper.find('div').simulate('focus');

	t.equal(wrapper.state('focused'), true,
		'Typeahead focused state is not true after simulate focus');

	t.equal(wrapper.find(Selector).length, 1,
		'Number of selectors is wrong when the div has been focused');

	t.equal(wrapper.find(Option).length, 4,
		'Number of typeahead options is not 4 with 4 options passed in');


	// user enters a single keystroke
	wrapper.find('input').simulate('change', { target: { value: 'b' } });

	t.equal(wrapper.state('value'), 'b',
		'Value in state is not set correctly after a keystroke');

	t.equal(wrapper.find(Option).length, 3,
		'Number of typeahead options is not 3 after a keystroke removed one');

	t.deepEqual(wrapper.state('visible'), ['Bar', 'Baz', 'abc'],
		'Visible options did not update when a key stroke was passed in');

	
	// user hits down arrow; value should be Bar
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_DOWN });

	t.equal(wrapper.state('selectedOptionIndex'), 0,
		'Selected option index is wrong when down arrow key is hit');

	t.equal(wrapper.state('selectedOption'), 'Bar',
		'Selected option is wrong when down arrow key is hit');

	// value should be Baz
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_DOWN });

	t.equal(wrapper.state('selectedOptionIndex'), 1,
		'Selected option index is wrong when down arrow key is hit twice in a row');

	t.equal(wrapper.state('selectedOption'), 'Baz',
		'Selected option is wrong when down arrow key is hit twice in a row');

	
	// user hits escape; value should be null
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_ESCAPE });

	t.equal(wrapper.state('selectedOptionIndex'), null,
		'Selected option index is not null after escape was hit on a selected option');

	t.equal(wrapper.state('selectedOption'), null,
		'Selected option is not null after escape was hit on a selected option');


	// user hits up arrow; value should be abc
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_UP });

	t.equal(wrapper.state('selectedOptionIndex'), 2,
		'Selected option index is wrong when hitting up arrow and going to the bottom of the options list');

	t.equal(wrapper.state('selectedOption'), 'abc',
		'Selected option is wrong when hitting up arrow and going to the bottom of the options list');

	// wrap to top of list; value should be Bar
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_DOWN });

	t.equal(wrapper.state('selectedOptionIndex'), 0,
		'Selected option index is wrong when down arrow wraps to top of list');

	t.equal(wrapper.state('selectedOption'), 'Bar',
		'Selected option is wrong when down arrow wraps to top of list');

	// user hits tab to auto complete
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_TAB });

	t.equal(wrapper.state('value'), '',
		'Value in state was incorrect after tab autocomplete');

	t.deepEqual(wrapper.state('visible'), ['Bar'],
		'Visible options was incorrect after tab autocomplete');

	t.equal(wrapper.state('selectedOption'), null,
		'Selected option was incorrect after tab autocomplete');

	t.equal(wrapper.state('selectedOptionIndex'), null,
		'Selected option was incorrect after tab autocomplete');

	wrapper.setProps({
		options,
		addTokenForValue: (option) => {
			t.equal(option, 'Foo',
				'Option sent back on tab auto complete is wrong w/ no selected option');
		}
	});

	// tab auto completion with no selected option
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_TAB });

	t.equal(wrapper.state('value'), '',
		'Value in state on tab auto completion with no selected option is incorrect');

	t.deepEqual(wrapper.state('visible'), ['Foo'],
		'Visible options in state on tab auto completion with no selected option is incorrect');

	t.equal(wrapper.state('selectedOption'), null,
		'Selected option in state on tab auto completion with no selected option is incorrect');

	t.equal(wrapper.state('selectedOptionIndex'), null,
		'Selected option index in state on tab auto completion with no selected option is incorrect');


	wrapper.setProps({
		options,
		addTokenForValue: (option) => {
			t.equal(option, 'Foo',
				'Option sent back on enter auto complete w/ no selected option is wrong');
		}
	});

	// enter auto completion with no selected option
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_ENTER });

	t.equal(wrapper.state('value'), '',
		'Value in state on enter auto completion with no selected option is incorrect');

	t.deepEqual(wrapper.state('visible'), ['Foo'],
		'Visible options in state on enter auto completion with no selected option is incorrect');

	t.equal(wrapper.state('selectedOption'), null,
		'Selected option in state on enter auto completion with no selected option is incorrect');

	t.equal(wrapper.state('selectedOptionIndex'), null,
		'Selected option index in state on enter auto completion with no selected option is incorrect');

	wrapper.setProps({
		options
	});

	// enter auto completion with selected option
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_DOWN });
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_ENTER });

	t.equal(wrapper.state('value'), '',
		'Value in state on enter auto completion with selected option is incorrect');

	t.deepEqual(wrapper.state('visible'), ['Foo'],
		'Visible options in state on enter auto completion with selected option is incorrect');

	t.equal(wrapper.state('selectedOption'), null,
		'Selected option in state on enter auto completion with selected option is incorrect');

	t.equal(wrapper.state('selectedOptionIndex'), null,
		'Selected option index in state on enter auto completion with selected option is incorrect');



	wrapper.setProps({
		options,
		addTokenForValue: (option) => {
			t.equal(option, 'Foo',
				'Option sent back on space auto complete w/ no selected option is wrong');
		}
	});

	// space auto completion with no selected option
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_SPACE });

	t.equal(wrapper.state('value'), '',
		'Value in state on space auto completion with no selected option is incorrect');

	t.deepEqual(wrapper.state('visible'), ['Foo'],
		'Visible options in state on space auto completion with no selected option is incorrect');

	t.equal(wrapper.state('selectedOption'), null,
		'Selected option in state on space auto completion with no selected option is incorrect');

	t.equal(wrapper.state('selectedOptionIndex'), null,
		'Selected option index in state on space auto completion with no selected option is incorrect');

	wrapper.setProps({
		options
	});

	// space auto completion with selected option
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_DOWN });
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_SPACE });

	t.equal(wrapper.state('value'), '',
		'Value in state on space auto completion with selected option is incorrect');

	t.deepEqual(wrapper.state('visible'), ['Foo'],
		'Visible options in state on space auto completion with selected option is incorrect');

	t.equal(wrapper.state('selectedOption'), null,
		'Selected option in state on space auto completion with selected option is incorrect');

	t.equal(wrapper.state('selectedOptionIndex'), null,
		'Selected option index in state on space auto completion with selected option is incorrect');

	wrapper.setProps({
		options
	});

	wrapper.find('input').simulate('change', { target: { value: 'f' } });

	// space auto completion with no selected option and only 1 visible option
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_SPACE });

	t.equal(wrapper.state('value'), '',
		'Value in state on space auto completion with no selected option is incorrect');

	t.deepEqual(wrapper.state('visible'), ['Foo'],
		'Visible options in state on space auto completion with no selected option is incorrect');

	t.equal(wrapper.state('selectedOption'), null,
		'Selected option in state on space auto completion with no selected option is incorrect');

	t.equal(wrapper.state('selectedOptionIndex'), null,
		'Selected option index in state on space auto completion with no selected option is incorrect');

	wrapper.setProps({
		options: ['Foo 1', 'Foo 2']
	});

	// space auto completion with no selected option and multiple visible options with spaces
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_SPACE });

	t.deepEqual(wrapper.state('visible'), ['Foo 1', 'Foo 2'],
		'Space auto completion with multiple options with spaces in them is incorrect');

	wrapper.setProps({
		options: [],
		onKeyDown: (evt, value) => {
			t.equal(value, 'z',
				'Key down value sent to callback was incorrect with no visible options');
		},
		addTokenForValue: (option) => {
			t.equal(option, 'z',
				'Option sent back to add token for value w/ no visible options was incorrect');
		}
	});

	t.equal(wrapper.instance()._onEnter(), undefined,
		'Simulating enter keystroke did not return undefined with no selected option and no visible option list');

	// testing arrow navigation with no options
	t.equal(wrapper.instance()._nav(1), undefined,
		'Arrow navigation is not undefined with no options');

	// testing keystrokes with no visible options
	wrapper.find('input').simulate('change', { target: { value: 'z' } });
	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_UP });
	
	t.equal(wrapper.find(Selector).length, 0,
		'There is a typeahead selector when options are empty');

	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_ENTER });

	t.equal(wrapper.state('value'), '',
		'Value in state didnt reset to empty after enter was hit with a valid value in state and no  visible options');

	t.deepEqual(wrapper.state('visible'), [],
		'Visible options in state didnt reset on enter with valid value in state and no visible options');

	t.equal(wrapper.state('selectedOption'), null,
		'Selected option in state didnt reset on enter with valid value in state and no visible options');

	t.equal(wrapper.state('selectedOptionIndex'), null,
		'Selected option index in state didnt reset on enter with valid value in state and no visible options');

	// test handling special characters that are ignored with visible options
	wrapper.setProps({
		options
	});

	const DOM_VK_RIGHT = 39;
	wrapper.find('input').simulate('change', { target: { value: 'z' } });
	wrapper.find('input').simulate('keyDown', { keyCode: DOM_VK_RIGHT });
	
	// testing date time handling
	wrapper.setProps({
		options: [],
		datatype: 'datetime',
		onKeyDown: (evt, val) => {
			t.skip();
		},
		addTokenForValue: (dateOption) => {
			t.ok(moment(dateOption).isSameOrBefore(Date.now()),
				'Date sent back on completion is not same or before as initial date');
		}
	});

	t.equal(wrapper.find(DatePicker).length, 1,
		'Date picker was not rendered after data type of datetime passed in');

	wrapper.instance().updateDateValue(moment());

	t.ok(moment(wrapper.state('value')).isSameOrBefore(Date.now()),
		'Date value did not update to same or before current datetime after a datetime was passed in');

	wrapper.find('input').simulate('keyDown', { keyCode: KeyEvent.DOM_VK_ENTER });


	// mimic clicking outside the component to lose focus
	wrapper.instance().handleClickOutside();

	t.equal(wrapper.state('focused'), false,
		'Focused was not false after clicking outside of the typeahead component');

	t.end();
});

