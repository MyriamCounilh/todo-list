/**
 * @class
 */
(function (window) {
	'use strict';

	/**
	 * @description Takes a model and view and acts as the controller between them
	 * @param {object} model - The model instance
	 * @param {object} view -  The view instance
	 * @constructor
	 * @name Controller
	 */
	function Controller(model, view) {
		var self = this;
		self.model = model;
		self.view = view;

		self.view.bind('newTodo', function (title) {
			self.addItem(title);
		});

		self.view.bind('itemEdit', function (item) {
			self.editItem(item.id);
		});

		self.view.bind('itemEditDone', function (item) {
			self.editItemSave(item.id, item.title);
		});

		self.view.bind('itemEditCancel', function (item) {
			self.editItemCancel(item.id);
		});

		self.view.bind('itemRemove', function (item) {
			self.removeItem(item.id);
		});

		self.view.bind('itemToggle', function (item) {
			self.toggleComplete(item.id, item.completed);
		});

		self.view.bind('removeCompleted', function () {
			self.removeCompletedItems();
		});

		self.view.bind('toggleAll', function (status) {
			self.toggleAll(status.completed);
		});
	}

	/**
	 * @description Loads and initialises the view
	 * @method Controller.setView
	 * @param locationHash {string} '' | 'active' | 'completed'
	 * @return {void}
	 */
	Controller.prototype.setView = function (locationHash) {
		var route = locationHash.split('/')[1];
		var page = route || '';
		this._updateFilterState(page);
	};

	/**
	 * @description An event to fire on load. Will get all items and display them in the todo-list
	 * @method Controller.showAll
	 * @return {void}
	 */
	Controller.prototype.showAll = function () {
		var self = this;
		self.model.read(function (data) {
			self.view.render('showEntries', data);
		});
	};

	/**
	 * @description Renders all active tasks
	 * @method Controller.showActive
	 * @return {void}
	 */
	Controller.prototype.showActive = function () {
		var self = this;
		self.model.read({ completed: false }, function (data) {
			self.view.render('showEntries', data);
		});
	};

	/**
	 * @description Renders all completed tasks
	 * @method Controller.showCompleted
	 * @return {void}
	 */
	Controller.prototype.showCompleted = function () {
		var self = this;
		self.model.read({ completed: true }, function (data) {
			self.view.render('showEntries', data);
		});
	};

	/**
	 * @description An event to fire whenever you want to add an item. Simply pass in the event
	 * object and it'll handle the DOM insertion and saving of the new item.
	 * @method Controller.addItem
	 * @param {string} title - title of the item
	 * @return {void}
	 */
	Controller.prototype.addItem = function (title) {
		var self = this;

		if (title.trim() === '') {
			return;
		}

		self.model.create(title, function () {
			self.view.render('clearNewTodo');
			self._filter(true);
		});
	};

	/**
	 * @description Triggers the item editing mode.
	 * @method Controller.editItem
	 * @param {number} id - id of the item
	 * @return {void}
	 */
	Controller.prototype.editItem = function (id) {
		var self = this;
		self.model.read(id, function (data) {
			self.view.render('editItem', {id: id, title: data[0].title});
		});
	};

	/**
	 * @description Finishes the item editing mode successfully.
	 * @method Controller.editItemSave
	 * @param {number} id - id of the item
	 * @param {string} title - title of the item
	 * @return {void}
	 */
	Controller.prototype.editItemSave = function (id, title) {
		var self = this;

		while (title[0] === " ") {
			title = title.slice(1);
		}

		while (title[title.length-1] === " ") {
			title = title.slice(0, -1);
		}

		if (title.length !== 0) {
			self.model.update(id, {title: title}, function () {
				self.view.render('editItemDone', {id: id, title: title});
			});
		} else {
			self.removeItem(id);
		}
	};

	/**
	 * @description Cancels the item editing mode.
	 * @method Controller.editItemCancel
	 * @param {number} id - id of the item
	 * @return {void}
	 */
	Controller.prototype.editItemCancel = function (id) {
		var self = this;
		self.model.read(id, function (data) {
			self.view.render('editItemDone', {id: id, title: data[0].title});
		});
	};

	/**
	 * @description By giving it an ID it'll find the DOM element matching that ID,
	 * remove it from the DOM and also remove it from storage.
	 * @method Controller.removeItem
	 * @param id {number} id The ID of the item to remove from the DOM and storage
	 * @return {void}
	 */
	Controller.prototype.removeItem = function (id) {
		var self = this;

		self.model.remove(id, function () {
			self.view.render('removeItem', id);
			console.log("Element with ID: " + id + " has been removed.");
		});

		self._filter();
	};

	/**
	 * @description Will remove all completed items from the DOM and storage.
	 * @method Controller.removeCompletedItems
	 * @return {void}
	 */
	Controller.prototype.removeCompletedItems = function () {
		var self = this;
		self.model.read({ completed: true }, function (data) {
			data.forEach(function (item) {
				self.removeItem(item.id);
			});
		});

		self._filter();
	};

	/**
	 * @description Give it an ID of a model and a checkbox and it will update the item
	 * in storage based on the checkbox's state.
	 * @method Controller.toggleComplete
	 * @param {number} id - the ID of the element to complete or uncomplete
	 * @param {object} completed - checkbox The checkbox to check the state of complete or not
	 * @param {boolean|undefined} silent - silent Prevent re-filtering the todo items
	 * @return {void}
	 */
	Controller.prototype.toggleComplete = function (id, completed, silent) {
		var self = this;
		self.model.update(id, { completed: completed }, function () {
			self.view.render('elementComplete', {
				id: id,
				completed: completed
			});
		});

		if (!silent) {
			self._filter();
		}
	};

	/**
	 * @description Will toggle ALL checkboxes' on/off state and completeness of models.
	 * Just pass in the event object.
	 * @method Controller.toggleAll
	 * @param {object} completed - checkbox The checkbox to check the state of complete or not
	 * @return {void}
	 */
	Controller.prototype.toggleAll = function (completed) {
		var self = this;
		self.model.read({ completed: !completed }, function (data) {
			data.forEach(function (item) {
				self.toggleComplete(item.id, completed, true);
			});
		});

		self._filter();
	};

	/**
	 * @description Updates the pieces of the page which change depending on the remaining number of todos.
	 * @method Controller._updateCount
	 * @return {void}
	 */
	Controller.prototype._updateCount = function () {
		var self = this;
		self.model.getCount(function (todos) {
			self.view.render('updateElementCount', todos.active);
			self.view.render('clearCompletedButton', {
				completed: todos.completed,
				visible: todos.completed > 0
			});

			self.view.render('toggleAll', {checked: todos.completed === todos.total});
			self.view.render('contentBlockVisibility', {visible: todos.total > 0});
		});
	};

	/**
	 * @description Re-filters the todo items, based on the active route.
	 * @method Controller._filter
	 * @param {boolean|undefined} force - forces a re-painting of todo items.
	 * @return {void}
	 */
	Controller.prototype._filter = function (force) {
		var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);

		// Update the elements on the page, which change with each completed todo
		this._updateCount();

		/**
		 * If the last active route isn't "All", or we're switching routes, we
		 * re-create the todo item elements, calling:
		 * this.show[All|Active|Completed]();
		 */
		if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
			this['show' + activeRoute]();
		}

		this._lastActiveRoute = activeRoute;
	};

	/**
	 * @description Simply updates the filter nav's selected states
	 * @method Controller._updateFilterState
	 * @param {string} currentPage - name of the active route, allowing us to re-filter todo
	 * @return {void}
	 */
	Controller.prototype._updateFilterState = function (currentPage) {
		// Store a reference to the active route, allowing us to re-filter todo
		// items as they are marked complete or incomplete.
		this._activeRoute = currentPage;

		if (currentPage === '') {
			this._activeRoute = 'All';
		}

		this._filter();

		this.view.render('setFilter', currentPage);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);
