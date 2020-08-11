/*global app, $on */
/**
 * @class
 */
(function () {
	'use strict';

	/**
	 * @description Sets up a brand new Todo list.
	 * @constructor Todo
	 * @param {string} name The name of your new to do list
	 * @return {void}
	 */
	function Todo(name) {
		this.storage = new app.Store(name);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

	var todo = new Todo('todos-vanillajs');

	/**
	 * @description set view available
	 * @method Todo.setView
	 * @return {void}
	 */
	function setView() {
		todo.controller.setView(document.location.hash);
	}
	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);
})();
