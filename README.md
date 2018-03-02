# NOTICE

This product contains a modified version of the react-structured-filter 
library which is copyright (c) 2015, Summit Route LLC.

* License: BSD
	* https://github.com/SummitRoute/react-structured-filter/blob/master/LICENSE
* Homepage
	* https://github.com/SummitRoute/react-structured-filter

# Structured Query

## Overview

Structured Query is a library that can be used to filter data. Is used in
conjunction with [kyle tables](../kyle-tables).

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

CSS styles can be found in [structured-filter.css](../../../dependencies/styles/structured-filter.css)
Datepicker styles can be found in [input-moment.css](../../../dependencies/styles/input-moment.css)

## Props

* **[options ( *[object]* )](#options)** 
* **[customClasses ( *object* )](#customclasses)**
* **[initTokens ( *[object]* )](#inittokens)**
* **[onTokenAdd ( *function* )](#ontokenadd)** 
* **[onTokenRemove ( *function* )](#ontokenremove)** 
* **[disabled ( *boolean* )](#disabled)**
* **[enableQueryOnClick ( *boolean* )](#enablequeryonclick)**


### options

A list of opjects describing the options that are available in lists 
for categories, operations, and values(*optional*).

An example options prop:

```javascript
[ { id: '123', category: 'Display123', type: 'enumoptions', options: ['foo', 'bar'] },
{ id: 'baz', category: 'Another category', type: 'integer' } ]
```

#### Id ( *string* )

Identifier for the token. Attached to the token when user selects a category.

#### Category ( *string* )

Display name to show to the user.

#### Type ( *string* )

Type says what kind of operations are allowed on the category.

The following operations are allowed based on what data type is equal to:

##### Data Types
* string, email
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
* integer, float, datetime
	* ==
	* !=
	* <
	* <=
	* \>
	* \>=
* enumoptions, boolean
	* ==
	* !=

#### Options ( *[string]* )

A list of options that will generate if the value is supposed to be an 
enumerable list. Used with enumoptions data type.

*Note:* Boolean data type does not generate a default list and you should pass 
in an on options object describing the true/false for it.

#### OptionObjs ( *[object]* )

A list of options that will generate if the value is supposed to be an 
enumerable list. This one will take objects that must an id and name field
in them. Structured query will generate a list based on the name field. 
Used with enumoptions data type.

*Note:* If an options object passes both an options and optionObjs prop,
only the options prop will be used and optionObjs prop will be ignored.

### customClasses

Custom CSS classes to apply to structured query. The following fields in an 
object will be used as classes to change the appearance of structured query:

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

### initTokens

Initial tokens is a list of objects that can be passed in to generate 
predefined tokens in structured query.

Objects passed in need to have the following fields: 
	* **id ( *string* ):** token identifier
	* **category ( *string* ):** the field being searched
	* **operator ( *string* ):** operation being applied to the field
	* **value ( *string* ):** value to look for

### onTokenAdd

A callback function that is called when the user finishes generating a new 
token. This function will receive a list of objects with each object 
being a token.

### onTokenRemove

A callback function that is called when the user removes a token. This 
function will receive a list of objects with each object being a token.

### queryDisabled

Toggle if querying is disabled on the table. Sometimes, you may want to allow 
the current query to be viewable but not modifiable. Set this to true to show 
query tokens, but it does not allow the user to change the query in the filter.

### enableQueryOnClick

Toggle to allow the user to enable querying if it is disabled. Set if the 
querying is to be initially disabled, but then want to allow the user to enable 
it on click.
