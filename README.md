# Simple-Two-Way-Data-Binding
A simple JavaScript module to handle two way data binding via accessor mutators, uses a global class for invocation.

Define an interpolation point via {{}} declarations, input bindings can be defined via a data-relation attribute which can collate to a property in the modules store, if no property is defined it will be created using the inputs value as the expression.

@Properties

		templateString = data.template || ''; //Template string to compile
		
		renderNode = data.node || document.body; //DOM insertion node
		
		store = data.store || {}; //Preset store values
		
@example
		var myModule = new globalModel({
				template: '<div><h2>Hello {{name}}</h2><input type="text" id="name" value="Bob" data-relation="name" />',
				renderNode: document.getElementById('someWrapper'),
        store: {
						somePresetValue: 'foobar'
				}
		});

		myModule.set('name', 'Bill');

@Run-time
To Do
