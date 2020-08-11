/*global NodeList */
/**
 * @class window
 */
(function (window) {
	'use strict';

	/**
	 * @description Get element(s) by CSS selector
	 * @method window.qs
	 * @param {string} selector - CSS selector
	 * @param {string} scope - entry point
	 * @return {string} first element found
	 */
	window.qs = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};

	/**
	 * @description Collect the items by CSS Selector
	 * @method window.qsa
	 * @param {string} selector - CSS selector
	 * @param {string} scope - entry point
	 * @return {element} NodeListOf<*> all elements found
	 */
	window.qsa = function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};

	/**
	 * @description addEventListener wrapper
	 * @method window.$on
	 * @param {object} target - the target
	 * @param {string} type - string representing the type of event to listen to
	 * @param {function} callback
	 * @param {boolean} useCapture dispatch the event ?
	 * @return {void}
	 */
	window.$on = function (target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};

	/**
	 * @description Attach a handler to event for all elements that match the selector,
	 * now or in the future, based on a root element
	 * @method window.$delegate
	 * @param {object} target the target
	 * @param {string} selector - CSS selector
	 * @param {string} type a string representing the type of event to listen to
	 * @param {function} handler function for dispatch event
	 * @return {void}
	 */
	window.$delegate = function (target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target;
			var potentialElements = window.qsa(selector, target);
			var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

			if (hasMatch) {
				handler.call(targetElement, event);
			}
		}

		// https://developer.mozilla.org/en-US/docs/Web/Events/blur
		var useCapture = type === 'blur' || type === 'focus';

		window.$on(target, type, dispatchEvent, useCapture);
	};

	/**
	 * @description Find the element's parent with the given tag name: $parent(qs('a'), 'div');
	 * @method window.$delegate
	 * @param {object} DOM element
	 * @param {string} tagName - Name of the label of the element on which it is called
	 * @return {element} return a reference to the parent window or undefined.
	 */
	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	/**
	 *  @description Allow for looping on nodes by chaining:
	 */
	NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
