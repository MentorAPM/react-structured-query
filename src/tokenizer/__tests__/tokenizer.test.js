import test from 'tape';
import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Tokenizer from '../tokenizer';
import Typeahead from '../../typeahead/typeahead';
import Token from '../token';
import KeyEvent from '../../keyevent/keyevent';

configure({ adapter: new Adapter() });

test('full mount render test of structured query tokenizer', (t) => {
	// operations for strings
	const STRING_OPERATIONS = ['==', '!=', 'contains', '!contains', 'like', '!like',
				'startsWith', '!startsWith', 'endsWith', '!endsWith'];
	// operations for integers and dates
	const NUM_DATE_OPERATIONS = ['==', '!=', '<', '<=', '>', '>='];
	// operations for enumerable options
	const ENUM_OPERATIONS = ['==', '!='];

	const wrapper = mount(<Tokenizer />);

	
	// testing initial render
	t.deepEqual(wrapper.state('searchTokens'), [],
		'Default search tokens are incorrect');

	t.deepEqual(wrapper.state('nextToken'), 
		{ id: '', category: '', operator: '', value: '' },
		'Default next token is incorrect');

	t.equal(wrapper.find(Typeahead).length, 1,
		'Typeahead not rendered on default render');

	t.equal(wrapper.text(), '',
		'Initial text is incorrect in render');


	// testing iniatizing tokenizer with tokens
	let initTokens = [{
		id: '1',
		category: '1',
		operator: '1',
		value: '1'
	}];

	wrapper.setProps({ initTokens });

	t.deepEqual(wrapper.state('searchTokens'), initTokens,
		'Tokenizer did not initialize search tokens when more tokens passed in');

	wrapper.setProps({ initTokens: [] });

	t.deepEqual(wrapper.state('searchTokens'), [],
		'Tokenizer did not initialize search tokens when less tokens passed in');

	wrapper.setProps({ initTokens });
	let newInitTokens = [{
		id: '2',
		category: '2',
		operator: '1',
		value: '1'
	}];

	wrapper.setProps({ initTokens: newInitTokens });

	t.deepEqual(wrapper.state('searchTokens'), newInitTokens,
		'Tokenizer did not initialize to new tokens of same length');

	// pass in same tokens again to test if they change when init tokens are the same
	wrapper.setProps({ initTokens: newInitTokens });

	t.deepEqual(wrapper.state('searchTokens'), newInitTokens,
		'Tokenizer changed search tokens when same initial tokens were passed in');

	
	// simulating keydown events
	t.equal(wrapper.instance()._onKeyDown({ keyCode: KeyEvent.ESCAPE }, ''), undefined,
		'Non backspace keystroke did not return undefined');

	t.equal(wrapper.instance()._onKeyDown({ keyCode: KeyEvent.DOM_VK_BACK_SPACE }, 'val'), undefined,
		'Keydown event did not return undefined if a value is present');


	// test rendering search tokens
	wrapper.setProps({
		initTokens
	});

	t.equal(wrapper.find(Token).length, 1,
		'Incorrect number of tokens rendered on search tokens passed in');

	t.equal(wrapper.find(Token).at(0).key(), '111',
		'Token constructed an incorrect key');

	t.equal(wrapper.find('div.token-collection').text(), '1 1 1×',
		'Render token gave incorrect text');


	// testing getting options for typeaheads
	let options = [
		{ id: 'o1', category: 'opt1', type: 'string' },
		{ id: 'o2', category: 'opt2', type: 'email' },
		{ id: 'o3', category: 'opt3', type: 'enumoptions' },
		{ id: 'o4', category: 'opt4', type: 'integer' },
		{ id: 'o5', category: 'opt5', type: 'float' },
		{ id: 'o6', category: 'opt6', type: 'datetime' }
	];
	wrapper.setProps({
		initTokens,
		options
	});

	// category
	t.equal(wrapper.instance()._getHeader(), 'Category',
		'Category header for the options list is incorrect');

	t.deepEqual(wrapper.instance()._getOptionsForTypeahead(),
		['opt1', 'opt2', 'opt3', 'opt4', 'opt5', 'opt6'],
		'Category options did not return the correct list of categories');

	t.equal(wrapper.instance()._addTokenForValue(options[0].category), undefined,
		'Adding category token to new token did not return undefined');

	t.deepEqual(wrapper.state('nextToken'),
		{ id: 'o1', category: 'opt1', operator: '', value: '' },
		'Next token category in state is not correct after adding token for category');

	t.equal(wrapper.find('div.filter-category').text(), 'opt1',
		'Category has different text from the next token category');
	
	
	// operator
	t.equal(wrapper.instance()._getHeader(), 'Operator',
		'Operator header for the options list is incorrect');

	t.equal(wrapper.instance()._getCategoryType(), 'string',
		'Operator data type is incorrect for option selected');

	t.deepEqual(wrapper.instance()._getOptionsForTypeahead(), STRING_OPERATIONS,
		'Operator operations is incorrect');

	t.equal(wrapper.instance()._addTokenForValue(STRING_OPERATIONS[0]), undefined,
		'Adding operator token to new token did not return undefined');

	t.deepEqual(wrapper.state('nextToken'),
		{ id: 'o1', category: 'opt1', operator: STRING_OPERATIONS[0], value: '' },
		'Next token operator in state is not correct after adding token for operator');

	t.equal(wrapper.find('div.filter-operator').text(), STRING_OPERATIONS[0],
		'Operator has different text from the next token operator');

	// value
	function onTokenAdd(newSearchTokens) {
		t.deepEqual(newSearchTokens,
			[initTokens[0], {
				id: options[0].id,
				category: options[0].category,
				operator: STRING_OPERATIONS[0],
				value: 'value'
			}],
			'Search tokens sent back to onTokenAdd callback are incorrect');
	}

	wrapper.setProps({
		onTokenAdd
	});

	t.equal(wrapper.instance()._getHeader(), 'Value',
		'Value header for the options list is incorrect');

	t.equal(wrapper.instance()._getCategoryOptions(), undefined,
		'Value options wasnt undefined when there are no options associated with the category');

	t.deepEqual(wrapper.instance()._getOptionsForTypeahead(), [],
		'Value options did not return the correct list of values');

	t.equal(wrapper.instance()._addTokenForValue('value'), undefined,
		'Adding value to token did not return undefined');

	t.deepEqual(wrapper.state('nextToken'),
		{ id: '', category: '', operator: '', value: '' },
		'Adding a value to token did not reset nextToken in state');

	t.deepEqual(wrapper.state('searchTokens'),
		[initTokens[0], {
			id: options[0].id,
			category: options[0].category,
			operator: STRING_OPERATIONS[0],
			value: 'value'
		}],
		'Adding a value to token did not create the proper searchTokens in state');

	wrapper.update();
	t.equal(wrapper.find(Token).length, 2,
		'There arent two token components with searchTokens having two tokens');


	// testing if we pass in a duplicate token
	wrapper.instance()._addTokenForValue(options[0].category);
	wrapper.instance()._addTokenForValue(STRING_OPERATIONS[0]);

	t.equal(wrapper.instance()._addTokenForValue('value'), undefined,
		'Adding a duplicate token did not return undefined');

	t.ok(wrapper.instance()._checkDuplicateToken('value'),
		'Checking for a duplicate token did not return true when a token was duplicated');

	
	// test removing tokens
	wrapper.setProps({
		initTokens: initTokens.slice(),
		onTokenRemove: (searchTokens) => {
			t.skip(searchTokens, [],
				'Search tokens sent to onTokenRemove callback are incorrect');
		}
	});

	t.deepEqual(wrapper.state('nextToken'), 
		{ id: options[0].id, category: options[0].category, operator: STRING_OPERATIONS[0], value: '' },
		'Checking duplicate token removed the next token');

	wrapper.instance()._onKeyDown({ keyCode: KeyEvent.DOM_VK_BACK_SPACE });

	t.deepEqual(wrapper.state('nextToken'), 
		{ id: options[0].id, category: options[0].category, operator: '', value: '' },
		'Removing operator from next token did not occur');

	wrapper.instance()._onKeyDown({ keyCode: KeyEvent.DOM_VK_BACK_SPACE });

	t.deepEqual(wrapper.state('nextToken'), 
		{ id: '', category: '', operator: '', value: '' },
		'Removing category and id from next token did not occur');


	t.deepEqual(wrapper.state('searchTokens'), initTokens, 'Before deleting last token');
	wrapper.instance()._onKeyDown({ keyCode: KeyEvent.DOM_VK_BACK_SPACE });
	t.deepEqual(wrapper.state('searchTokens'), [], 'After deleting last token');
	
	t.skip(wrapper.state('searchTokens'), initTokens,
		'Remove token did not remove the last token in the search token list');

	t.end();
});
