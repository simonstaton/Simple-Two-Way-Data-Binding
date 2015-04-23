(function(){
		
		'use strict';

		var globalModel = function(data){
				this.templateString = data.template || '';
				this.renderNode = data.node || document.body;
				this.store = data.store || {};
				this._bindings = {};
				this.initialise();
		};

		globalModel.prototype = {

				initialise: function(){
						this.template = document.createElement('div');
						this.template.innerHTML = this.templateString;
						this._compile();
				},

				_compile: function(){
						var elements = this.template.getElementsByTagName('*');
						for (var i=0;i<elements.length;i++){
								this._parse(elements[i]);
						}
						this._render();
				},

				_parse: function(node){
						var indices = this._interpolationPoints(node.innerHTML);
						if(!indices.interpolate){
								this._parseRelations(node);
						} else {
								this._parseInterpolationBindings(node, indices);
						}
				},

				_parseInterpolationBindings: function(node, indices){
						var textNodes = [];
						for (var i = 0; i < node.childNodes.length; i++) {
								if (node.childNodes[i].nodeName === "#text") {
										textNodes.push({
												node: node.childNodes[i],
												value: node.childNodes[i].nodeValue
										});
								}
						}
						var value = node.innerHTML; 
						for(var index in indices.start){
								var keyPair = value.substring(indices.start[index]+2, indices.end[index]);
								if(this._bindings[keyPair]){
										this._bindings[keyPair].textNodes = this._bindings[keyPair].textNodes.concat(textNodes);
								} else {
										this._bindings[keyPair] = {
												textNodes: textNodes,
												relations: [],
												value: this.get(keyPair) || ''
										};
								}
								this._interpolate(this._bindings[keyPair], keyPair);
						}	 
				},

				_interpolationPoints: function(string){
						var reg = /{{[^}]*}}/gi,
								indices = {start: [], end: [], interpolate: false},
								match;
						while (match = reg.exec(string)) {
								indices.start.push(match.index);
								indices.end.push(match.index + match[0].length - 2);
								indices.interpolate = true;
						} 
						return indices;
				},

				_parseRelations: function(node){
						if(node.tagName == 'INPUT' && node.getAttribute("data-relation")){
								this._twoWayBind(node);
						}
				},

				_interpolate: function(bind, key){
						bind.value = this.store[key];
						var self = this,
								interpolate = function(string){
										var indices = self._interpolationPoints(string);
										if(indices.interpolate){
												string = string.substring(0, indices.start[0]) + (self.store[string.substring(indices.start[0]+2, indices.end[0])] || '') + string.substring(indices.end[0]+2);
												return interpolate(string);
										} else {
												return string
										}
								}
						for(var i=0;i<bind.textNodes.length;i++){
								bind.textNodes[i].node.nodeValue = interpolate(bind.textNodes[i].value);
						}
						for(var j=0;j<bind.relations.length;j++){
								bind.relations[j].value = bind.value;
						}
				},

				_twoWayBind: function(node){
						var relation = node.getAttribute("data-relation"),
								self = this;

						if(this.get(relation)){
								node.value = this.get(relation);
						} else {
								this.set(relation, node.value);
						}

						if(this._bindings[relation]){
								this._bindings[relation].relations.push(node);
						} else {
								this._bindings[relation] = {
										textNodes: [],
										relations: [node],
										value: this.get(relation) || ''
								};
						}
						
						node.addEventListener("keyup", function(e){
								self.set(relation, e.target.value);
						});
				},

				set: function(key, value){
						this.store[key] = value;
						if(this._bindings[key]){
								this._interpolate(this._bindings[key], key)
						}
						return this.store[key];
				},

				get: function(key, value){
						return this.store[key];
				},

				_render: function(){
						this.renderNode.appendChild(this.template);
						this.renderNode.replaceChild(this.template.childNodes[0], this.template);
				}

		}

		////////////////////////////////////////////////

		/**
		 * Non module related functionality, simply invoking and setting values
		 */
		var myModule = new globalModel({
				template: '<div><h2>Hello {{name}}</h2><p><label for="email">Related input with no value set: </label><input type="text" id="email" data-relation="email" /></p><p>your email is {{email}}</p><p><label for="email2">Related input with value set: </label><input type="text" id="email2" value="email@foobar.com" data-relation="email2" /></p><p>your email is {{email2}}</p><p>Preset value: {{somePresetValue}}</p><p>A value not yet set but will be in 3 seconds {{asyncValue}}</div>',
				store: {
						somePresetValue: 'foobar'
				}
		});

		myModule.set('name', 'bob');

		setTimeout(function(){
				myModule.set('asyncValue', 'some async value');
		}, 3000);

})();
