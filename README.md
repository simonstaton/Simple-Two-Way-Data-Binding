# Simple-Two-Way-Data-Binding
A simple JavaScript module to handle two way data binding via accessor mutators, uses a global class to encapsulate functionality.

<a href="http://jsfiddle.net/fm5tcwav/">Demo</a>

Define an interpolation point via {{}} expressions, input bindings can be defined via a data-relation attribute which can collate to a property in the modules store, if no property is defined it will be created using the inputs value as the expression.

# Example
	var myModule = new globalModel({
		template: '<div><h2>Hello {{name}}</h2><input type="text" id="name" value="Bob" data-relation="name" />',
		renderNode: document.getElementById('someWrapper'),
        	store: {
			somePresetValue: 'foobar'
		}
	});

	myModule.set('name', 'Bill');
	
If not supplied the renderNode will become the document body and the store will be an empty object.

#Run-time
1. globalModel invocation will initialise the globalModel class constructor method .initialise()
2. Template string will be populated into a div element
3. _compile() process begins, all elements in template are parsed
4. Once the parser encounters {{}} expressions in the nodes html it will check this._bindings for the expression
5. If no key is found it will store a new binding with related textNodes, current value in store and an empty relations array
6. If key is found it will simply concat this text node with any text nodes related to the expression
7. Element is then interpolated to update the expression with the stores actual value
8. If no {{}} expressions were found in node from step 4 it will check the element for data-relation attributes
9. If data relations are found it will create a relation for the expression in this._bindings and bind a keyup event to change the binding value
10. Public accessor mutator methods are available for updating the value programatically, all related inputs or text nodes will be reflected
