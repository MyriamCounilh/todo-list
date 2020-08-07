/*global app, $on */
(function () {
	'use strict';

	/**
	 * @description Sets up a brand new Todo list.
	 * @param name {string} name The name of your new to do list
	 * @constructor
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
	 * @description
	 */
	function setView() {
		todo.controller.setView(document.location.hash);
	}
	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);
})();
