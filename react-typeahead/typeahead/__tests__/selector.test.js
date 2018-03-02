import test from 'tape';
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Selector from '../selector';
import Option from '../option';

configure({ adapter: new Adapter() });

test('shallow render test of structured query selector', (t) => {
	const wrapper = shallow(
		<Selector
			header="test"
		/>);

	t.ok(wrapper.find('ul').hasClass('typeahead-selector filter-tokenizer-list__container'),
		'Incorrect class on ul on initial render');

	t.equal(wrapper.find('li.header').text(), 'test',
		'Incorrect text in selector on initial render');

	wrapper.setProps({
		customClasses: {
			results: 'resultsClass'
		},
		options: ['opt1', 'opt2', 'opt2']
	});

	t.ok(wrapper.find('ul').hasClass('typeahead-selector filter-tokenizer-list__container resultsClass'),
		'Incorrect class on ul on custom classes');

	t.equal(wrapper.find(Option).length, 3,
		'Incorrect number of options');

	wrapper.setProps({
		selectedOptionIndex: 1
	});

	t.equal(wrapper.find(Option).at(1).prop('hover'), true,
		'Selected option is not hovered when it should be');

	t.end();
});

