/*jshint laxbreak:true */
/**
 * @class
 */
(function (window) {
	'use strict';

	var htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#x27;',
		'`': '&#x60;'
	};

	var escapeHtmlChar = function (chr) {
		return htmlEscapes[chr];
	};

	var reUnescapedHtml = /[&<>"'`]/g;
	var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

	var escape = function (string) {
		return (string && reHasUnescapedHtml.test(string))
			? string.replace(reUnescapedHtml, escapeHtmlChar)
			: string;
	};


	/**
	 * @description  up defaults for all the Template methods such as a default template
	 * @name Template
	 * @constructor
	 */
	function Template() {
		this.defaultTemplate
		=	`<li data-id="{{id}}" class="{{completed}}">
				<div class="view">
					<input class="toggle" type="checkbox" {{checked}}>
					<label>{{title}}</label>
					<button class="destroy"></button>
				</div>
			</li>`;
	}


	/**
	 * @description Creates an <li> HTML string and returns it for placement in your app.
	 * NOTE: In real life you should be using a templating engine such as Mustache
	 * or Handlebars, however, this is a vanilla JS example.
	 *
	 * @method Template.show
	 * @param {object} data - The object containing keys you want to find in the template to replace.
	 * @example
	 * view.show({
	 *	id: 1,
	 *	title: "Hello World",
	 *	completed: 0,
	 * });
	 *
	 * @return {string} view - HTML String of an <li> element
	 */
	Template.prototype.show = function (data) {
		var i, l;
		var view = '';

		for (i = 0, l = data.length; i < l; i++) {
			var template = this.defaultTemplate;
			var completed = '';
			var checked = '';

			if (data[i].completed) {
				completed = 'completed';
				checked = 'checked';
			}

			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{title}}', escape(data[i].title));
			template = template.replace('{{completed}}', completed);
			template = template.replace('{{checked}}', checked);

			view = view + template;
		}

		return view;
	};

	/**
	 * @description Displays a counter of how many to dos are left to complete
	 * @method Template.itemCounter
	 * @param {number} activeTodos - The number of active todos.
	 * @return {string} String containing the count
	 */
	Template.prototype.itemCounter = function (activeTodos) {
		var plural = activeTodos === 1 ? '' : 's';

		return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
	};

	/**
	 * @description Updates the text within the "Clear completed" button
	 * @method Template.clearCompletedButton
	 * @param  {number} completedTodos The number of completed todos.
	 * @return {string} text for the "Clear completed" button
	 */
	Template.prototype.clearCompletedButton = function (completedTodos) {
		if (completedTodos > 0) {
			return 'Clear completed';
		} else {
			return '';
		}
	};

	// Export to window
	window.app = window.app || {};
	window.app.Template = Template;
})(window);
