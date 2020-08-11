/*jshint eqeqeq:false */
/**
 * @class
 */
(function (window) {
	'use strict';

	/**
	 * @description Creates a new client side storage object and will create an empty
	 * collection if no collection already exists.
	 *
	 * @name Store
	 * @param {string} name - The name of our DB we want to use
	 * @param {function} callback - Our fake DB uses callbacks because in real life you probably would be making AJAX calls
	 * @constructor
	 * @return {void}
	 */
	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name;

		if (!localStorage[name]) {
			var data = {
				todos: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		callback.call(this, JSON.parse(localStorage[name]));
	}

	/**
	 * @description Finds items based on a query given as a JS object
	 * @method Store.find
	 * @param {object} query - The query to match against (i.e. {foo: 'bar'})
	 * @param {function} callback - The callback to fire when the query has completed running
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 *
	 * @return {boolean} return if items found
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		var todos = JSON.parse(localStorage[this._dbName]).todos;

		callback.call(this, todos.filter(function (todo) {
			for (var q in query) {
				if (query[q] !== todo[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	/**
	 * @description Will retrieve all data from the collection
	 * @method Store.findAll
	 * @param {function} callback - The callback to fire upon retrieving data
	 * @return {void}
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
	};

	/**
	 * @description save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 *
	 * @method Store.save
	 * @param {object} updateData - The data to save back into the DB
	 * @param {function} callback - The callback to fire after saving
	 * @param {number} id - An optional param to enter an ID of an item to update
	 * @return {void}
	 */
	Store.prototype.save = function (updateData, callback, id) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;
		callback = callback || function () {};
		// If an ID was actually given, find the item and update each property
		if (id) {
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);
		} else {
			// Assign a Generate ID
			updateData.id = Date.now();

			todos.push(updateData);
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, [updateData]);
		}
	};

	/**
	 * @description Will remove an item from the Store based on its ID
	 *
	 * @method Store.remove
	 * @param {number} id - the ID of the item you want to remove
	 * @param {function} callback - the callback to fire after saving
	 * @return {void}
	 */
	Store.prototype.remove = function (id, callback) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;
		var todoId;
		
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				todoId = todos[i].id;
			}
		}

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == todoId) {
				todos.splice(i, 1);
			}
		}

		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, todos);
	};

	/**
	 * @description drop all storage and start fresh
	 * @method Store.drop
	 * @param {function} callback - The callback to fire after dropping the data
	 * @return {void}
	 */
	Store.prototype.drop = function (callback) {
		var data = {todos: []};
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, data.todos);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);
