# React Structured Query

## Overview

React Structured Query is a library that can be used to filter data in a table.

It is a continuation of https://github.com/SummitRoute/react-structured-filter.

It also uses https://github.com/wangzuo/input-moment for the date picker for 
date data types.

## Scripts

* Install
```
npm install react-structured-query --save
```
* Build bundle
```
npm run build
```
* Run example
```
npm start
```
* Run tests
```
npm run test
```

### Features

Structured query renders UI elements called tokens. The tokens are used to 
represent data that has been filtered out. Each token keeps track of 
four different values:

* **id**: Each token has an id associated with it. The id should be what you 
need to query; i.e. a database table field, a client side table column name, etc
* **category**: displayed to the user and indicates the field being queried.
* **operation**: operation to apply to the data with value and is based on the 
data type of the category
* **value**: value to filter against the category with the operation selected

Structured query can generate enumerable lists for values, generate different 
operations based on the data type of the category, and has typeahead with 
fuzzy matching for all lists. Space, tab, and enter will autocomplete as well.

### Styling

CSS styles can be found in [structured-filter.css](./example/css/structured-filter.less)
Datepicker styles can be found in [input-moment.css](./example/css/input-moment.css)

## Props

#### props.options

A list of objects describing the options that are available in lists 
for categories, operations, and values(*optional*).

An example options prop:

```javascript
[
	{
		id: '123',
		category: 'Display123',
		type: 'enumoptions',
		options: ['foo', 'bar']
	},
	{
		id: 'baz',
		category: 'Another category',
		type: 'integer'
	}
]
```

* id ( *string* ) -- Identifier for the token. Attached to the token when user 
selects a category.

* category ( *string* ) -- Display name to show to the user.

* type ( *string* ) -- data type for what kind of operations are allowed on the 
category.

  * Allowable types:
    * string
    * email
    * enumoptions
    * boolean
    * integer
    * float
    * datetime

* options ( *[string]* )

A list of options that will generate if the value is supposed to be an 
enumerable list. Used with the enumoptions data type.

*Note:* Boolean data type has a default list of `['True', 'False']`. This 
can be overrode by passing in your own options object.

* optionObjs ( *[object]* )

A list of options that will generate if the value is supposed to be an 
enumerable list. This one will take objects that must have an id and name field
in them. Structured query will generate a list based on the name field. 
Used with enumoptions data type.

*Note:* If an options object passes both an options and optionObjs prop,
only the options prop will be used and optionObjs prop will be ignored.

#### props.stringOperations

Operations on string and email data types. Defaults:

* ==
* !=
* contains
* !contains
* like
* !like
* startsWith
* !startsWith
* endsWith
* !endsWith

#### props.numOperations

Operations on integer and float data types. Defaults:

* ==
* !=
* <
* <=
* \>
* \>=

#### props.dateOperations

Operations on date data types. Defaults are same as integer operations.

#### props.enumOperations

Operations on enumerable and boolean data types. Defaults:

* ==
* !=


#### props.customClasses

Custom CSS classes to apply to structured query. The following fields in an 
object will be used as classes to change the appearance of structured query:

* **container:** Changes the filter container
* **input:** Changes the input box
* **results:** Changes the list container of options
* **listItem:** Changes each list option in the list container
* **listAnchor:** Changes each list link in the list container

```javascript
customClasses={{
	input: '123',
	results: 'foo',
	listItem: 'bar',
	listAnchor: 'baz'
}}
```

#### props.initTokens

Initial tokens is a list of objects that can be passed in to generate 
predefined tokens in structured query. Sending in new initial tokens will also 
cause the current search to be replaced with the new initial tokens.

Objects passed in need to have the following fields: 
	* **id ( *string* ):** token identifier
	* **category ( *string* ):** the field being searched
	* **operator ( *string* ):** operation being applied to the field
	* **value ( *string* ):** value to look for

#### props.onTokenAdd

A callback function that is called when the user finishes generating a new 
token. This function will receive a list of objects with each object 
being a token.

#### props.onTokenRemove

A callback function that is called when the user removes a token. This 
function will receive a list of objects with each object being a token.

#### props.exportSearch

Callback function that allows you to export/save a search. The callback will 
receive the list of current search tokens.

#### props.queryDisabled

Toggle if querying is disabled on the table. Sometimes, you may want to allow 
the current query to be viewable but not modifiable. Set this to true to show 
query tokens, but it does not allow the user to change the query in the filter.

#### props.enableQueryOnClick

Toggle to allow the user to enable querying if it is disabled. Set if the 
querying is to be initially disabled, but then want to allow the user to enable 
it on click.
