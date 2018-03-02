import test from 'tape';
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Option from '../option';

configure({ adapter: new Adapter() });

test('shallow render test of structured query option', (t) => {
	function onClick(option) {
		t.equal(option, 'test',
			'On click function did not send back the correct option');
	}

	const wrapper = shallow(<Option option="test" />);

	t.equal(wrapper.text(), 'test',
		'Children are incorrect on initial render');

	t.ok(wrapper.find('a').hasClass('typeahead-option'),
		'Initial class is incorrect on anchor element');

	wrapper.setProps({
		customClasses: {
			listItem: 'testItem',
			listAnchor: 'testAnchor'
		},
		hover: true,
		onClick
	});

	t.ok(wrapper.find('li').hasClass('hover filter-tokenizer-list__item testItem'),
		'Incorrect class on li element with custom class passed in');

	t.ok(wrapper.find('a').hasClass('typeahead-option filter-tokenizer-list__item testAnchor'),
		'Incorrect class on anchor element with custom class passed in');

	wrapper.find('li').simulate('click');

	t.end();
});
