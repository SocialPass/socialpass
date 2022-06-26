/**
 * @file 		Halfmoon JS
 * @desc 		Implements all of the necessary JS functionality for Halfmoon.
 * @version 	2.0
 * @author 		Tahmid Khan <tahmid.hm.dev@gmail.com>
 * @copyright 	Halfmoon UI, Tahmid Khan
 * @license 	MIT
 */

/* START POLYFILLS */

// Polyfill for Element.matches()
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// Polyfill for Element.closest()
if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

// Polyfill for Element.classList (http://purl.eligrey.com/github/classList.js/blob/master/classList.js)
"document"in self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||!function(t){"use strict";if("Element"in t){var e="classList",n="prototype",i=t.Element[n],s=Object,r=String[n].trim||function(){return this.replace(/^\s+|\s+$/g,"")},o=Array[n].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1},c=function(t,e){this.name=t,this.code=DOMException[t],this.message=e},a=function(t,e){if(""===e)throw new c("SYNTAX_ERR","The token must not be empty.");if(/\s/.test(e))throw new c("INVALID_CHARACTER_ERR","The token must not contain space characters.");return o.call(t,e)},l=function(t){for(var e=r.call(t.getAttribute("class")||""),n=e?e.split(/\s+/):[],i=0,s=n.length;s>i;i++)this.push(n[i]);this._updateClassName=function(){t.setAttribute("class",this.toString())}},u=l[n]=[],h=function(){return new l(this)};if(c[n]=Error[n],u.item=function(t){return this[t]||null},u.contains=function(t){return~a(this,t+"")},u.add=function(){var t,e=arguments,n=0,i=e.length,s=!1;do t=e[n]+"",~a(this,t)||(this.push(t),s=!0);while(++n<i);s&&this._updateClassName()},u.remove=function(){var t,e,n=arguments,i=0,s=n.length,r=!1;do for(t=n[i]+"",e=a(this,t);~e;)this.splice(e,1),r=!0,e=a(this,t);while(++i<s);r&&this._updateClassName()},u.toggle=function(t,e){var n=this.contains(t),i=n?e!==!0&&"remove":e!==!1&&"add";return i&&this[i](t),e===!0||e===!1?e:!n},u.replace=function(t,e){var n=a(t+"");~n&&(this.splice(n,1,e),this._updateClassName())},u.toString=function(){return this.join(" ")},s.defineProperty){var f={get:h,enumerable:!0,configurable:!0};try{s.defineProperty(i,e,f)}catch(p){void 0!==p.number&&-2146823252!==p.number||(f.enumerable=!1,s.defineProperty(i,e,f))}}else s[n].__defineGetter__&&i.__defineGetter__(e,h)}}(self),function(){"use strict";var t=document.createElement("_");if(t.classList.add("c1","c2"),!t.classList.contains("c2")){var e=function(t){var e=DOMTokenList.prototype[t];DOMTokenList.prototype[t]=function(t){var n,i=arguments.length;for(n=0;i>n;n++)t=arguments[n],e.call(this,t)}};e("add"),e("remove")}if(t.classList.toggle("c3",!1),t.classList.contains("c3")){var n=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(t,e){return 1 in arguments&&!this.contains(t)==!e?e:n.call(this,t)}}"replace"in document.createElement("_").classList||(DOMTokenList.prototype.replace=function(t,e){var n=this.toString().split(" "),i=n.indexOf(t+"");~i&&(n=n.slice(i),this.remove.apply(this,n),this.add(e),this.add.apply(this,n.slice(1)))}),t=null}());

// Polyfill for String.prototype.includes()
if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		if (search instanceof RegExp) {
			throw TypeError("First argument must not be a RegExp.");
		}
		if (start === undefined) {
			start = 0;
		}
		return this.indexOf(search, start) !== -1;
	};
}

// Polyfill for String.prototype.startsWith()
if (!String.prototype.startsWith) {
	Object.defineProperty(String.prototype, "startsWith", {
		value: function(search, rawPos) {
			var pos = rawPos > 0 ? rawPos|0 : 0;
			return this.substring(pos, pos + search.length) === search;
		}
	});
}

// Polyfill for Object.assign()

Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(e){"use strict";if(null==e)throw new TypeError("Cannot convert first argument to object");for(var r=Object(e),t=1;t<arguments.length;t++){var n=arguments[t];if(null!=n){n=Object(n);for(var c=Object.keys(Object(n)),o=0,a=c.length;o<a;o++){var b=c[o],i=Object.getOwnPropertyDescriptor(n,b);void 0!==i&&i.enumerable&&(r[b]=n[b])}}}return r}});

/* END POLYFILLS */


/**
 * Used for initializing properties in the main namespace.
 * @namespace
 */
var halfmoonInitProps = {
	/**
	 * Get the page wrapper.
	 *
	 * @returns {HTMLElement}
	 */
	pageWrapper: function() {
		return document.getElementsByClassName("page-wrapper")[0];
	},

	/**
	 * Get the content wrapper.
	 *
	 * @returns {HTMLElement}
	 */
	contentWrapper: function() {
		return document.querySelector(".page-wrapper > .content-wrapper");
	},

	/**
	 * Get the placeholder object for storing navbar related data.
	 *
	 * @returns {Object}
	 */
	navbars: function() {
		return {
			top: undefined,          // Navbar object (default, fixed top)
			heightTop: undefined,    // Height of default navbar
			bottom: undefined,       // Navbar object (fixed bottom)
			heightBottom: undefined, // Height of navbar fixed bottom
			queried: false           // See halfmoon.queryNavbars()
		};
	},

	/**
	 * Get the placeholder object for storing sidebar related data.
	 *
	 * @returns {Object}
	 */
	sidebar: function() {
		return {
			obj: undefined,                // Sidebar object
			type: "",                      // Sidebar type
			transitionDuration: undefined, // See halfmoon.querySidebar()
			queried: false                 // See halfmoon.querySidebar()
		};
	},

	/**
	 * Get the placeholder object for storing the active dialog data.
	 *
	 * @returns {Object}
	 */
	currentDialog: function() {
		return {
			obj: undefined,   // Dialog object
			toggle: undefined // Toggle used to open the dialog
		};
	},

	/**
	 * Get the sticky alerts container.
	 *
	 * @returns {HTMLElement}
	 */
	stickyAlerts: function() {
		return document.querySelector(".page-wrapper > .sticky-alerts");
	},

	/**
	 * Get the placeholder object for storing the active dropdown data.
	 *
	 * @returns {Object}
	 */
	currentDropdown: function() {
		return {
			menu: undefined,	// The menu object
			toggle: undefined, 	// Toggle used to open the dropdown
			parent: undefined	// The parent if the active one is nested
		};
	}
};


/**
 * Global Halfmoon namespace.
 * @namespace
 */
var halfmoon = {
	pageWrapper: halfmoonInitProps.pageWrapper(),
	contentWrapper: halfmoonInitProps.contentWrapper(),
	navbars: halfmoonInitProps.navbars(),
	sidebar: halfmoonInitProps.sidebar(),
	currentDialog: halfmoonInitProps.currentDialog(),
	stickyAlerts: halfmoonInitProps.stickyAlerts(),
	currentDropdown: halfmoonInitProps.currentDropdown(),

	/**
	 * Check if the browser being used is Internet Explorer 11 or not.
	 *
	 * @returns {boolean}
	 */
	isInternetExplorer: function() {
		if (document.documentMode) {
			return true;
		}
		else {
			return false;
		}
	},

	/**
	 * Create a random Id.
	 *
	 * @param {string} length - The number of characters in the Id.
	 * @returns {string}
	 */
	makeId: function(length) {
		var result = "";
		var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	},

	/**
	 * Get the Id from the data-hm-target attribute, making sure to remove any
	 * leading hashtags if they are present.
	 *
	 * @param {string} attr - The value of the attribute from the DOM.
	 * @returns {string}
	 */
	getIdFromTargetAttr: function(attr) {
		if (attr.startsWith("#")) {
			attr = attr.substring(1);
		}
		return attr;
	},

	/**
	 * Scroll horizontally to a target element keeping it centered.
	 *
	 * @param {HTMLElement} container - The parent container to scroll.
	 * @param {HTMLElement} target - The element to scroll to.
	 * @returns {void}
	 */
	scrollXCenter: function(container, target) {
	    var scrollX = (
	    	target.offsetLeft + (target.clientWidth / 2)
	    ) - (
	    	container.clientWidth / 2
	    );
	    container.scrollLeft = scrollX;
	},

	/**
	 * Get a tiny time value (in integer), which is sometimes needed to make
	 * some animations work.
	 *
	 * @returns {number}
	 */
	getTinyTimeout: function() {
		var mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (!mediaQuery || mediaQuery.matches) {
			return 0;
		} else {
			return 50;
		}
	},


	/* START COOKIES */

	/**
	 * Create a cookie.
	 *
	 * @param {string} name - Name of the cookie.
	 * @param {string} value - Value of the cookie.
	 * @param {number} days - Number of days before the cookie expires.
	 * @returns {void}
	 */
	createCookie: function(name, value, days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		}
		else {
			expires = "";
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	},

	/**
	 * Read a cookie given its name.
	 *
	 * @param {string} name - Name of the cookie.
	 * @returns {string}
	 */
	readCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(";");
		for(var i=0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === " ") {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length,c.length);
			}
		}
		return null;
	},

	/**
	 * Erase a cookie given its name.
	 *
	 * @param {string} name - Name of the cookie.
	 * @returns {void}
	 */
	eraseCookie: function(name) {
		halfmoon.createCookie(name, "", -1);
	},

	/* END COOKIES */


	/* START DARK MODE */

	/**
	 * Toggles dark mode.
	 *
	 * @returns {void}
	 */
	toggleDarkMode: function() {
		if (document.documentElement.classList.contains("dark-mode")) {
			document.documentElement.classList.remove("dark-mode");
			halfmoon.createCookie(
				"halfmoon_preferredColorScheme", "light-mode", 365
			);
		} else {
			document.documentElement.classList.add("dark-mode");
			halfmoon.createCookie(
				"halfmoon_preferredColorScheme", "dark-mode", 365
			);
		}
	},

	/**
	 * Get the preferred color scheme.
	 *
	 * @returns {string}
	 */
	getPreferredColorScheme: function() {
		// Saved cookie preference is given first priority
		if (halfmoon.readCookie("halfmoon_preferredColorScheme")) {
			return halfmoon.readCookie("halfmoon_preferredColorScheme");
		}

		// If cookie does not exist, priority is given to CSS color scheme
		if (window.matchMedia) {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				return "dark-mode";
			}
			else {
				return "light-mode";
			}
		}

		return "not-set";
	},

	/**
	 * Autoset the preferred color scheme.
	 *
	 * @returns {void}
	 */
	autosetPreferredColorScheme: function() {
		// Get the preferences to autoset from DOM
		var autosetPreferences = document.documentElement.getAttribute(
			"data-hm-autoset-preferences"
		) || "";

		// Turn dark mode on (if needed)
		if (autosetPreferences.includes("color-scheme")) {
			var preferredColorScheme = halfmoon.getPreferredColorScheme();
			if (preferredColorScheme === "dark-mode") {
				document.documentElement.classList.add("dark-mode");
			}
			else if (preferredColorScheme === "light-mode") {
				document.documentElement.classList.remove("dark-mode");
			}
		}
	},

	/* END DARK MODE */


	/* START READABLE MODE */

	/**
	 * Toggles readable mode.
	 *
	 * @returns {void}
	 */
	toggleReadableMode: function() {
		if (document.documentElement.classList.contains("readable-mode")) {
			document.documentElement.classList.remove("readable-mode");
			halfmoon.createCookie(
				"halfmoon_preferredFontSize", "compact-mode", 365
			);
		} else {
			document.documentElement.classList.add("readable-mode");
			halfmoon.createCookie(
				"halfmoon_preferredFontSize", "readable-mode", 365
			);
		}
	},

	/**
	 * Get the preferred font size.
	 *
	 * @returns {string}
	 */
	getPreferredFontSize: function() {
		if (halfmoon.readCookie("halfmoon_preferredFontSize")) {
			return halfmoon.readCookie("halfmoon_preferredFontSize");
		}

		return "not-set";
	},

	/**
	 * Autoset the preferred font size.
	 *
	 * @returns {void}
	 */
	autosetPreferredFontSize: function() {
		// Get the preferences to autoset from DOM
		var autosetPreferences = document.documentElement.getAttribute(
			"data-hm-autoset-preferences"
		) || "";

		// Turn readable mode on if needed
		if (autosetPreferences.includes("font-size")) {
			var preferredFontSize = halfmoon.getPreferredFontSize();
			if (preferredFontSize === "readable-mode") {
				document.documentElement.classList.add("readable-mode");
			}
			else if (preferredFontSize === "compact-mode") {
				document.documentElement.classList.remove("readable-mode");
			}
		}
	},

	/* END READABLE MODE */


	/* START NAVBARS */

	/**
	 * Query the DOM for the navbars and set the heights. This function should
	 * only be called if the page wrapper exists.
	 *
	 * @returns {void}
	 */
	queryNavbars: function() {
		// Default navbar (fixed top)
		var navbar = document.querySelector(
			".page-wrapper > .navbar:not(.navbar-fixed-bottom)"
		);
		if (navbar) {
			halfmoon.navbars.top = navbar;

			// Calculate the height (in px)
			var heightTop = getComputedStyle(navbar)["height"];
			heightTop = Number(
				heightTop.substring(0, heightTop.length - 2)
			);
			halfmoon.navbars.heightTop = heightTop;
		}

		// Navbar fixed bottom
		var navbarFixedBottom = document.querySelector(
			".page-wrapper > .navbar-fixed-bottom"
		);
		if (navbarFixedBottom) {
			halfmoon.navbars.bottom = navbarFixedBottom;

			// Calculate the height (in px)
			var heightBottom = getComputedStyle(navbarFixedBottom)["height"];
			heightBottom = Number(
				heightBottom.substring(0, heightBottom.length - 2)
			);
			halfmoon.navbars.heightBottom = heightBottom;
		}

		halfmoon.navbars.queried = true;
	},

	/**
	 * Check if the page supoorts the default navbar.
	 *
	 * @returns {boolean}
	 */
	supportsNavbar: function() {
		if (halfmoon.pageWrapper) {
			if (halfmoon.pageWrapper.classList.contains("with-navbar")) {
				if (!halfmoon.navbars.queried) {
					halfmoon.queryNavbars();
				}
				if (halfmoon.navbars.top) {
					return true;
				}
			}
		}
		return false;
	},

	/**
	 * Check if the page supoorts the navbar fixed bottom.
	 *
	 * @returns {boolean}
	 */
	supportsNavbarFixedBottom: function() {
		if (halfmoon.pageWrapper) {
			if (
				halfmoon.pageWrapper.classList.contains(
					"with-navbar-fixed-bottom"
				)
			) {
				if (!halfmoon.navbars.queried) {
					halfmoon.queryNavbars();
				}
				if (halfmoon.navbars.bottom) {
					return true;
				}
			}
		}
		return false;
	},

	/**
	 * Adjust a target's scroll margin (inside the content wrapper), so that
	 * it does not fall behind the default navbar (fixed top) after scrolling.
	 *
	 * @param {HTMLElement} target - The target to scroll to.
	 * @returns {void}
	 */
	adjustContentScrollMargin: function(target) {
		if (halfmoon.contentWrapper) {
			if (halfmoon.contentWrapper.contains(target)) {
				if (halfmoon.supportsNavbar()) {
					target.scrollIntoView(true);
					var threshold = target.getBoundingClientRect().top;
					if (threshold < halfmoon.navbars.heightTop) {
						window.scrollTo(
							0, window.scrollY - halfmoon.navbars.heightTop
						);
					}
				}
			}
		}
	},

	/* END NAVBARS */


	/* START SIDEBAR */

	/**
	 * Query the DOM for the sidebar and set type, transition duration,
	 * overlay. This function should only be called if the page wrapper exists.
	 *
	 * @returns {void}
	 */
	querySidebar: function() {
		var sidebar = document.getElementsByClassName("sidebar")[0];
		if (sidebar) {
			halfmoon.sidebar.obj = sidebar;
			if (halfmoon.pageWrapper.hasAttribute("data-hm-sidebar-type")) {
				halfmoon.sidebar.type = halfmoon.pageWrapper.getAttribute(
					"data-hm-sidebar-type"
				);
			}

			// Find the transition duration and convert it to milliseconds
			// (default is in seconds), because some operations work only if
			// they are done after the transition
			var transitionDuration = getComputedStyle(sidebar)[
				"transition-duration"
			];
			transitionDuration = transitionDuration.replace(/\s/g, "");
			transitionDuration = transitionDuration.split(",")[0];
			transitionDuration = Number(
				transitionDuration.substring(0, transitionDuration.length - 1)
			);
			halfmoon.sidebar.transitionDuration = transitionDuration * 1000;

			// If the sidebar overlay does not exist, one is created and added
			// to the DOM inside the page wrapper
			var sidebarOverlay = document.querySelector(
				".page-wrapper > .sidebar-overlay"
			);
			if (!sidebarOverlay) {
				sidebarOverlay = document.createElement("div");
				sidebarOverlay.classList.add("sidebar-overlay");
				halfmoon.pageWrapper.appendChild(sidebarOverlay);
			}
		}

		halfmoon.sidebar.queried = true;
	},

	/**
	 * Check if the page supoorts the sidebar.
	 *
	 * @returns {boolean}
	 */
	supportsSidebar: function() {
		if (halfmoon.pageWrapper) {
			if (halfmoon.pageWrapper.classList.contains("with-sidebar")) {
				if (!halfmoon.sidebar.queried) {
					halfmoon.querySidebar();
				}
				if (halfmoon.sidebar.obj) {
					return true;
				}
			}
		}
		return false;
	},

	/**
	 * Reset the sidebar.
	 *
	 * @returns {void}
	 */
	resetSidebar: function() {
		if (halfmoon.supportsSidebar()) {
			halfmoon.pageWrapper.removeAttribute("data-hm-sidebar-hidden");

			// Reset body scrolling (x-axis after transition completes)
			setTimeout(function() {
				document.body.classList.remove("sidebar-open-adjust-x");
			}, halfmoon.sidebar.transitionDuration);
			document.body.classList.remove("sidebar-open-adjust-y");
			document.body.classList.remove("sidebar-overlayed-all");
		}
	},

	/**
	 * Close the sidebar.
	 *
	 * @returns {void}
	 */
	closeSidebar: function() {
		if (halfmoon.supportsSidebar()) {
			if (window.innerWidth > 768) {
				halfmoon.pageWrapper.setAttribute(
					"data-hm-sidebar-hidden", "true"
				);

				// Reset body scrolling (x-axis after transition completes)
				setTimeout(function() {
					document.body.classList.remove("sidebar-open-adjust-x");
				}, halfmoon.sidebar.transitionDuration);
				document.body.classList.remove("sidebar-open-adjust-y");
				document.body.classList.remove("sidebar-overlayed-all");
			}
			else {
				halfmoon.resetSidebar();
			}
		}
	},

	/**
	 * Open the sidebar.
	 *
	 * @returns {void}
	 */
	openSidebar: function() {
		if (halfmoon.supportsSidebar()) {
			if (window.innerWidth > 768) {
				if (halfmoon.sidebar.type.includes("overlayed-all")) {
					halfmoon.pageWrapper.setAttribute(
						"data-hm-sidebar-hidden", "false"
					);

					// Adjust body scrolling
					document.body.classList.add("sidebar-open-adjust-x");
					document.body.classList.add("sidebar-open-adjust-y");
					document.body.classList.add("sidebar-overlayed-all");
				}
				else {
					halfmoon.resetSidebar();
				}
			}
			else {
				halfmoon.pageWrapper.setAttribute(
					"data-hm-sidebar-hidden", "false"
				);

				// Adjust body scrolling
				document.body.classList.add("sidebar-open-adjust-x");
				document.body.classList.add("sidebar-open-adjust-y");
				if (halfmoon.sidebar.type.includes("overlayed-all")) {
					document.body.classList.add("sidebar-overlayed-all");
				}
			}

			// Focus the sidebar to make it accessible for keyboard users
			// (after transition completes)
			setTimeout(function() {
				halfmoon.sidebar.obj.tabIndex = -1;
				halfmoon.sidebar.obj.focus();
			}, halfmoon.sidebar.transitionDuration);
		}
	},

	/**
	 * Toggle the visibility of the sidebar.
	 *
	 * @returns {void}
	 */
	toggleSidebar: function() {
		if (halfmoon.supportsSidebar()) {
			// If the page wrapper has the "data-hm-sidebar-hidden" attribute,
			// its value is flipped
			if (halfmoon.pageWrapper.hasAttribute("data-hm-sidebar-hidden")) {
				var sidebarHidden = halfmoon.pageWrapper.getAttribute(
					"data-hm-sidebar-hidden"
				);
				if (sidebarHidden === "true") {
					halfmoon.openSidebar();
				}
				else if (sidebarHidden === "false") {
					halfmoon.closeSidebar();
				}
			}
			// Otherwise, the sidebar is toggled depending on the screen width
			// and the type of the sidebar used
			else {
				if (window.innerWidth > 768) {
					if (halfmoon.sidebar.type.includes("overlayed-all")) {
						halfmoon.openSidebar();
					}
					else {
						halfmoon.closeSidebar();
					}
				}
				else {
					halfmoon.openSidebar();
				}
			}
		}
	},

	/* END SIDEBAR */


	/* START DIALOGS (MODALS AND OFFCANVAS) */

	/**
	 * Get the transition duration for the currently open dialog. This is
	 * needed to play the animation during dismissal. For modals, 0 is
	 * returned because not having a closing animation is (subjectively) ideal.
	 *
	 * @returns {number}
	 */
	getTransitionDurationForClose: function() {
		var transitionDuration = 0;

		// Find the transition duration from the CSS
		if (halfmoon.currentDialog.obj) {
			if (halfmoon.currentDialog.obj.classList.contains("offcanvas")) {
				// For offcanvas, the transition duration is on itself
				transitionDuration = getComputedStyle(
					halfmoon.currentDialog.obj
				)["transition-duration"];

				// Convert the duration to milliseconds (default is in seconds)
				transitionDuration = transitionDuration.replace(/\s/g, "");
				transitionDuration = transitionDuration.split(",")[0];
				transitionDuration = Number(
					transitionDuration.substring(
						0, transitionDuration.length - 1
					)
				);
				transitionDuration = transitionDuration * 1000;
			}
		}

		return transitionDuration;
	},

	/**
	 * Close the active dialog (also works as a reset for everything related
	 * to dialogs).
	 *
	 * @returns {void}
	 */
	closeDialog: function() {
		document.body.classList.remove("dialog-open");
		document.body.classList.remove("dialog-open-scroll-auto");
		document.body.classList.remove("no-dialog-overlay");

		// Make the page wrapper (and its contents) visible to screen readers
		if (halfmoon.pageWrapper) {
			halfmoon.pageWrapper.removeAttribute("aria-hidden");
		}

		if (halfmoon.currentDialog.obj) {
			// Start the dialog hide animation
			halfmoon.currentDialog.obj.classList.remove("show");

			// Make sure the animation plays out before closing the modal
			setTimeout(function() {
				// Hide the dialog (including from screen readers)
				halfmoon.currentDialog.obj.classList.remove("set-visible");
				halfmoon.currentDialog.obj.removeAttribute("aria-modal");
				halfmoon.currentDialog.obj.setAttribute("aria-hidden", "true");

				// Return the focus to the toggle that was used to open the
				// dialog (if it exists)
				if (halfmoon.currentDialog.toggle) {
					halfmoon.currentDialog.toggle.focus();
				}

				halfmoon.currentDialog = halfmoonInitProps.currentDialog();
			}, halfmoon.getTransitionDurationForClose());
		}
		else {
			halfmoon.currentDialog = halfmoonInitProps.currentDialog();
		}
	},

	/**
	 * Open a dialog (given the Id).
	 *
	 * @param {string} dialogId - Id of the dialog to open.
	 * @param {HTMLElement} toggle - The element used to open the dialog.
	 * @returns {void}
	 */
	openDialog: function(dialogId, toggle) {
		var dialog = document.getElementById(dialogId);

		if (dialog) {
			halfmoon.closeDialog();
			document.body.classList.add("dialog-open");
			if (dialog.getAttribute("data-hm-scroll") === "true") {
				document.body.classList.add("dialog-open-scroll-auto");
			}
			if (dialog.getAttribute("data-hm-backdrop") === "false") {
				document.body.classList.add("no-dialog-overlay");
			}

			// If the dialog overlay does not exist, one is created and added
			// to the DOM inside the body
			var dialogOverlay = document.querySelector(".dialog-overlay");
			if (!dialogOverlay) {
				dialogOverlay = document.createElement("div");
				dialogOverlay.classList.add("dialog-overlay");
				document.body.appendChild(dialogOverlay);
			}

			// Hide the page wrapper (and its contents) from screen readers
			if (halfmoon.pageWrapper) {
				halfmoon.pageWrapper.setAttribute("aria-hidden", "true");
			}

			// Show the dialog (including on screen readers)
			dialog.classList.add("set-visible");
			dialog.classList.add("show");
			dialog.setAttribute("role", "dialog");
			dialog.setAttribute("aria-modal", "true");
			dialog.removeAttribute("aria-hidden");

			// Shift focus and scroll to top
			dialog.tabIndex = -1;
			dialog.focus();
			dialog.scrollTop = 0;

			halfmoon.currentDialog.obj = dialog;
			if (toggle) {
				halfmoon.currentDialog.toggle = toggle;
			}
		}
	},

	/**
	 * Add a shake animation to the dialog. Used for dialogs with static
	 * backdrops and/or [esc] dismissal disabled.
	 *
	 * @returns {void}
	 */
	animateDialogShake: function() {
		if (halfmoon.currentDialog.obj) {
			var dialog = halfmoon.currentDialog.obj;

			// Animate the dialog using the .dialog-shake-animate class
			dialog.classList.add("dialog-shake-animate");

			var animationDuration = 0;

			// Find the animation duration from the CSS
			if (dialog.classList.contains("modal")) {
				// For modals, the animation duration is on the modal dialog
				animationDuration = getComputedStyle(
					dialog.querySelector(".modal-dialog")
				)["animation-duration"];
			}
			else if (dialog.classList.contains("offcanvas")) {
				// For offcanvas, the animation duration is on itself
				animationDuration = getComputedStyle(
					dialog
				)["animation-duration"];
			}

			// Convert the duration to milliseconds (default is in seconds)
			animationDuration = Number(
				animationDuration.substring(0, animationDuration.length - 1)
			);
			animationDuration = animationDuration * 1000;

			// Remove the animation class after its duration, so that the
			// animation can be repeated every time the user triggers it
			setTimeout(function() {
				dialog.classList.remove("dialog-shake-animate");
			}, animationDuration);
		}
	},

	/* END DIALOGS (MODALS AND OFFCANVAS) */


	/* START ALERTS */

	/**
	 * Close an alert.
	 *
	 * @returns {void}
	 */
	closeAlert: function(alert) {
		if (alert) {
			// Start fade out animation
			alert.classList.add("fade-out");

			// Find the transition duration for the fade out animation, and
			// convert it to milliseconds (default is in seconds)
			var transitionDuration = getComputedStyle(alert)[
				"transition-duration"
			];
			transitionDuration = transitionDuration.replace(/\s/g, "");
			transitionDuration = transitionDuration.split(",")[0];
			transitionDuration = Number(
				transitionDuration.substring(0, transitionDuration.length - 1)
			);
			transitionDuration = transitionDuration * 1000;

			// Dismiss the alert after animation
			setTimeout(function() {
				alert.classList.add("set-d-none");

				// Needed for toasting pre-made alerts more than once
				alert.classList.remove("set-d-block");
				alert.classList.remove("show");
				alert.classList.remove("fade-out");
			}, transitionDuration);
		}
	},

	/**
	 * Query the DOM to check if the sticky alerts container exists or not. If
	 * not, then one is created and added to the DOM inside the page wrapper.
	 * This function should only be called if the page wrapper exists.
	 *
	 * @returns {void}
	 */
	queryStickyAlerts: function() {
		if (!halfmoon.stickyAlerts) {
			var stickyAlerts = document.querySelector(
				".page-wrapper > .sticky-alerts"
			);

			// Create the container if not found
			if (!stickyAlerts) {
				stickyAlerts = document.createElement("div");
				stickyAlerts.classList.add("sticky-alerts");
				halfmoon.pageWrapper.appendChild(stickyAlerts);
			}

			halfmoon.stickyAlerts = stickyAlerts;
		}
	},

	/**
	 * Create a toast alert element.
	 *
	 * @param {Object} opts - The data for creating the toast.
	 * @returns {void}
	 */
	createToastAlert: function(opts) {
		// Set the variables from options
		var title = ("title" in opts) ? opts.title: "";
		var content = ("content" in opts) ? opts.content: "";
		var alertType = ("alertType" in opts) ? opts.alertType: "";
		var fillType = ("fillType" in opts) ? opts.fillType: "";
		var dismissible = ("dismissible" in opts) ? opts.dismissible: true;
		var timer = ("timer" in opts) ? opts.timer: 5000;

		// Create the toast element
		var toast = document.createElement("div");

		// Set the required attributes and classes
		toast.setAttribute("id", halfmoon.makeId(6));

		toast.classList.add("alert");
		if (alertType) toast.classList.add(alertType);
		if (fillType) toast.classList.add(fillType);

		toast.setAttribute("role", "alert");
		toast.setAttribute("aria-live", "assertive");
		toast.setAttribute("aria-atomic", "true");
		toast.setAttribute("data-hm-timer", timer);

		// Set the content inside the toast
		if (title) {
			content = "<h4 class='alert-heading'>" + title + "</h4>" + content;
		}
		if (dismissible !== "false") {
			content = "<button class='close' type='button' data-hm-dismiss='alert' aria-label='Close'>&times;</button>" + content;
		}
		toast.innerHTML = content;

		return toast;
	},

	/**
	 * Handle the actual toasting process (animation and dismissal)
	 *
	 * @param {HTMLElement} toast - The alert to be toasted.
	 * @returns {void}
	 */
	toastAlert: function(toast) {
		if (!toast.classList.contains("show")) {
			// Reset for alerts that may have been closed previously
			toast.classList.remove("set-d-none");

			// Change alert display and start animation
			// The tiny timeout is needed for the transition to work
			toast.classList.add("set-d-block");
			setTimeout(function() {
				toast.classList.add("show");
			}, halfmoon.getTinyTimeout());

			// Get the timer from the toast alert
			// Wait for the timer to hit 0 before closing
			var timer = toast.getAttribute("data-hm-timer") || 5000;
			if (timer !== "false") {
				setTimeout(function() {
					halfmoon.closeAlert(toast);
				}, Number(timer));
			}
		}
	},

	/**
	 * Initialize the toasting process from toggle.
	 *
	 * @param {HTMLElement} toggle - The trigger element for the toast.
	 * @returns {void}
	 */
	initToastAlertFromToggle: function(toggle) {
		if (halfmoon.pageWrapper) {
			halfmoon.queryStickyAlerts();
			var toast;

			// Get or create the toast alert element
			if (toggle.hasAttribute("data-hm-target")) {
				// If the toggle has an explicit target set, then the DOM is
				// queried for the pre-made toast alert
				toast = document.getElementById(
					halfmoon.getIdFromTargetAttr(
						toggle.getAttribute("data-hm-target")
					)
				);
			}
			else {
				// Otherwise, a toast alert element is created using data from
				// the attributes available
				var toastOpts = {
					title: toggle.getAttribute("data-hm-title") || "",
					content: toggle.getAttribute("data-hm-content") || "",
					alertType: toggle.getAttribute("data-hm-alert-type") || "",
					fillType: toggle.getAttribute("data-hm-fill-type") || "",
					dismissible: toggle.getAttribute(
						"data-hm-dismissible"
					) || true,
					timer: toggle.getAttribute("data-hm-timer") || 5000
				};
				toast = halfmoon.createToastAlert(toastOpts);

				// And the toast alert is inserted into the container
				halfmoon.stickyAlerts.insertBefore(
					toast, halfmoon.stickyAlerts.childNodes[0]
				);
			}

			// Handle the toasting process
			halfmoon.toastAlert(toast);
		}
	},

	/**
	 * Initialize the toasting process from data.
	 *
	 * @param {HTMLElement} toastOpts - The data for creating the toast alert.
	 * @returns {void}
	 */
	initToastAlert: function(toastOpts) {
		if (halfmoon.pageWrapper) {
			halfmoon.queryStickyAlerts();

			// Create the toast alert element using the data provided
			var toast = halfmoon.createToastAlert(toastOpts);

			// And it is inserted into the container
			halfmoon.stickyAlerts.insertBefore(
				toast, halfmoon.stickyAlerts.childNodes[0]
			);

			// Handle the toasting process
			halfmoon.toastAlert(toast);
		}
	},

	/**
	 * Toast alerts on page load.
	 *
	 * @returns {void}
	 */
	toastAlertsOnload: function() {
		var toasts = document.querySelectorAll("[data-hm-onload='toast']");
		for (var i = 0; i < toasts.length; i++) {
			halfmoon.toastAlert(toasts[i]);
		}
	},

	/* END ALERTS */


	/* START DROPDOWN */

	/**
	 * Close the active dropdown (also works as a reset for everything related
	 * to dropdowns).
	 *
	 * @returns {void}
	 */
	closeDropdown: function(focusToToggle) {
		if (halfmoon.currentDropdown.menu) {
			halfmoon.currentDropdown.menu.classList.remove("show");
			halfmoon.currentDropdown.menu.classList.remove("set-d-block");

			// Return the focus to the toggle that was used to open the
			// dropdown (if it exists and condition is true), and set attribute
			if (halfmoon.currentDropdown.toggle) {
				if (focusToToggle) halfmoon.currentDropdown.toggle.focus();
				halfmoon.currentDropdown.toggle.classList.remove("menu-open");
				halfmoon.currentDropdown.toggle.setAttribute(
					"aria-expanded", "false"
				);
			}

			// Make the parent dropdown the active one if current one is nested
			// Reset otherwise
			if (halfmoon.currentDropdown.parent) {
				var parent = halfmoon.currentDropdown.parent;
				halfmoon.currentDropdown = parent;
			}
			else {
				halfmoon.currentDropdown = halfmoonInitProps.currentDropdown();
			}
		}
		else {
			halfmoon.currentDropdown = halfmoonInitProps.currentDropdown();
		}
	},

	/**
	 * Open a dropdown.
	 *
	 * @param {HTMLElement} menu - The menu to open.
	 * @param {HTMLElement} toggle - The element used to open the dropdown.
	 * @returns {void}
	 */
	openDropdown: function(menu, toggle) {
		if (menu) {
			var parent;

			// If nested, get the parent dropdown
			// Close all other dropdowns otherwise
			if (halfmoon.currentDropdown.menu) {
				if (halfmoon.currentDropdown.menu.contains(menu)) {
					parent = Object.assign({}, halfmoon.currentDropdown);
				}
				else {
					while (halfmoon.currentDropdown.menu) {
						halfmoon.closeDropdown(false);
					}
				}
			}

			// Show the menu
			// The tiny timeout is needed for the transition to work
			menu.classList.add("set-d-block");
			setTimeout(function() {
				menu.classList.add("show");
			}, halfmoon.getTinyTimeout());

			halfmoon.currentDropdown.menu = menu;
			if (toggle) {
				toggle.classList.add("menu-open");
				toggle.setAttribute("aria-expanded", "true");
				halfmoon.currentDropdown.toggle = toggle;
			}
			if (parent) {
				halfmoon.currentDropdown.parent = parent;
			}
		}
	},

	/* END DROPDOWN */


	/* START TABS */

	/**
	 * Activate a tab.
	 *
	 * @param {string} tabePaneId - Id of the target tab pane.
	 * @param {HTMLElement} toggle - The toggle used to activate the tab.
	 * @returns {void}
	 */
	activateTab: function(tabPaneId, toggle) {
		var tabPane = document.getElementById(tabPaneId);

		if (tabPane) {
			// Reset the related toggles (including the selected one)
			var relatedToggles = toggle.closest(".tabs").querySelectorAll(
				"[data-hm-toggle='tab']"
			);
			for (var i = 0; i < relatedToggles.length; i++) {
				relatedToggles[i].classList.remove("active");
				relatedToggles[i].setAttribute("aria-selected", "false");
			}

			// Activate the selected toggle
			toggle.classList.add("active");
			toggle.setAttribute("aria-selected", "true");

			// Reset the related tab panes (including the selected one)
			var relatedTabPanes = tabPane.closest(
				".tab-content"
			).querySelectorAll(".tab-pane");
			for (i = 0; i < relatedTabPanes.length; i++) {
				relatedTabPanes[i].classList.remove("active");
				relatedTabPanes[i].classList.remove("fade-in");
				relatedTabPanes[i].classList.remove("set-d-block");
			}

			// Change selected tab pane display and start animation
			// The tiny timeout is needed for the transition to work
			tabPane.classList.add("set-d-block");
			setTimeout(function() {
				tabPane.classList.add("fade-in");
			}, halfmoon.getTinyTimeout());
		}
	},

	/**
	 * Scroll tabs horizontally to the active toggle.
	 *
	 * @returns {void}
	 */
	scrollTabsToActiveToggle: function() {
		var activeTabToggles = document.querySelectorAll(
			"[data-hm-toggle='tab'].active"
		);
		for (var i = 0; i < activeTabToggles.length; i++) {
			var toggle = activeTabToggles[i];

			// Skip tabs if disabled using attribute
			var parentTabs = toggle.closest(".tabs");
			if (parentTabs.getAttribute("data-hm-scroll") === "false") {
				continue;
			}

			halfmoon.scrollXCenter(parentTabs, toggle);
		}
	},

	/* END TABS */


	/* START FORM CONTROLS */

	/**
	 * Set the :indeterminate state to the marked inputs.
	 *
	 * @returns {void}
	 */
	initIndeterminateInputs: function() {
		var indeterminateInputs = document.querySelectorAll(
			"[data-hm-indeterminate]"
		);
		for (var i = 0; i < indeterminateInputs.length; i++) {
			indeterminateInputs[i].indeterminate = true;
		}
	},

	/**
	 * Initialize the file inputs.
	 *
	 * @returns {void}
	 */
	initFileInputs: function() {
		var fileInputs = document.querySelectorAll(".form-file-input");

		for (var i = 0; i < fileInputs.length; i++) {
			var fileInput = fileInputs[i];
			var filename;

			// Add the filename if one does not exist
			if (!fileInput.parentNode.querySelector(".form-file-filename")) {
				filename = document.createElement("label");
				filename.classList.add("form-file-filename");
				filename.setAttribute("for", fileInput.getAttribute("id"));
				filename.innerHTML = "No file chosen";
				fileInput.parentNode.appendChild(filename);
			}

			// Add the event listener to change the filename
			fileInput.addEventListener("change", function(event) {
				filename = event.target.parentNode.querySelector(
					".form-file-filename"
				);

				// Set the content depending on the number of file(s)
				if (event.target.files.length === 1) {
					filename.innerHTML = event.target.files[0].name;
				}
				else if (event.target.files.length > 1) {
					filename.innerHTML = event.target.files.length + " files";
				}
				else {
					filename.innerHTML = "No file chosen";
				}
			});
		}
	},

	/**
	 * Call the step up function for an input given its Id.
	 *
	 * @param {string} inputId - The Id of the target input.
	 * @returns {void}
	 */
	inputStepUp: function(inputId) {
		var input = document.getElementById(inputId);
		if (input) {
			if (!halfmoon.isInternetExplorer()) {
				input.stepUp();
			}
			else {
				// IE only supports step functions for range inputs
				// Therefore, this cloning hack is used
				var cloneInput = input.cloneNode(false);
				cloneInput.setAttribute("type", "range");
				try {
					cloneInput.stepUp();
				}
				catch (e) {}
				input.value = cloneInput.value;
			}
		}
	},

	/**
	 * Call the step down function for an input given its Id.
	 *
	 * @param {string} inputId - The Id of the target input.
	 * @returns {void}
	 */
	inputStepDown: function(inputId) {
		var input = document.getElementById(inputId);
		if (input) {
			if (!halfmoon.isInternetExplorer()) {
				input.stepDown();
			}
			else {
				// IE only supports step functions for range inputs
				// Therefore, this cloning hack is used
				var cloneInput = input.cloneNode(false);
				cloneInput.setAttribute("type", "range");
				try {
					cloneInput.stepDown();
				}
				catch (e) {}
				input.value = cloneInput.value;
			}
		}
	},

	/**
	 * Toggle the display of a password input given its Id.
	 *
	 * @param {string} passwordId - The Id of the target password input.
	 * @param {HTMLElement} toggle - The element used to toggle the display.
	 * @returns {void}
	 */
	togglePassword: function(passwordId, toggle) {
		var passwordInput = document.getElementById(passwordId);
		if (passwordInput) {
			if (passwordInput.getAttribute("type") == "password") {
				passwordInput.type = "text";
				toggle.classList.add("target-input-type-text");
			} else {
				passwordInput.type = "password";
				toggle.classList.remove("target-input-type-text");
			}
		}
	},

	/**
	 * Bind the value of an input to the given target(s).
	 *
	 * @param {HTMLElement} input - The input to bind.
	 * @returns {void}
	 */
	bindInputValue: function(input) {
		if (input.getAttribute("data-hm-target")) {
			var targetIds = input.getAttribute("data-hm-target");
			targetIds = targetIds.replace(/\s+/g, "").split(",");
			var target;

			for (var i = 0; i < targetIds.length; i++) {
				target = document.getElementById(
					halfmoon.getIdFromTargetAttr(targetIds[i])
				);
				if (target) {
					if (target instanceof HTMLInputElement) {
						target.value = input.value;
					} else {
						target.innerText = input.value;
					}
				}
			}
		}
	},

	/**
	 * Attach the bind input value function (meant to be called when an event
	 * listener is attached).
	 *
	 * @param {Event} event - The event.
	 * @returns {void}
	 */
	callBindInputValueForAttachment: function(event) {
		halfmoon.bindInputValue(event.target);
	},

	/**
	 * Set the initial values and add the event listeners for binding the
	 * value.
	 *
	 * @returns {void}
	 */
	bindInputs: function() {
		var inputs = document.querySelectorAll("[data-hm-bind]");

		for (var i = 0; i < inputs.length; i++) {
			// Set initial value
			halfmoon.bindInputValue(inputs[i]);

			// Attach the event listener
			if (!halfmoon.isInternetExplorer()) {
				inputs[i].addEventListener(
					"input", halfmoon.callBindInputValueForAttachment
				);
			}
			else {
				// IE only supports the input event for text or password inputs
				if (
					inputs[i].getAttribute("type") === "text" ||
					inputs[i].getAttribute("type") === "password"
				) {
					inputs[i].addEventListener(
						"input", halfmoon.callBindInputValueForAttachment
					);
				}
				else {
					inputs[i].addEventListener(
						"change", halfmoon.callBindInputValueForAttachment
					);
				}
			}
		}
	},

	/* END FORM CONTROLS */


	/* START EVENT LISTENER FUNCTIONS */

	/**
	 * Handle the keydown event.
	 *
	 * @param {Object} event - The main interaction.
	 * @returns {void}
	 */
	onKeyDown: function(event) {
		// Handle [esc] keydown event (priority: dropdown > dialog > sidebar)
		if (event.keyCode === 27) {
			// Close dropdown menu (if one is open)
			if (halfmoon.currentDropdown.menu) {
				halfmoon.closeDropdown(true);
				event.preventDefault();
			}

			// Close open dialog
			else if (halfmoon.currentDialog.obj) {
				var dialog = halfmoon.currentDialog.obj;
				if (dialog.getAttribute("data-hm-keyboard") === "false") {
					halfmoon.animateDialogShake();
				} else {
					halfmoon.closeDialog();
				}
				event.preventDefault();
			}

			// Hide open sidebar (only if overlayed sidebar is used)
			else if (halfmoon.supportsSidebar()) {
				if (
					halfmoon.sidebar.type.includes("overlayed-all") ||
					halfmoon.sidebar.type.includes("overlayed-md-down")
				) {
					var sidebarHidden = halfmoon.pageWrapper.getAttribute(
						"data-hm-sidebar-hidden"
					);
					if (sidebarHidden === "false") {
						halfmoon.toggleSidebar();
						event.preventDefault();
					}
				}
			}
		}
	},

	/**
	 * Handle the keyup event.
	 *
	 * @param {Object} event - The main interaction.
	 * @returns {void}
	 */
	onKeyUp: function(event) {
		// When the sidebar open, if the focus is shifted to an element that
		// is outside of the sidebar using [tab], the sidebar is hidden. This
		// is done mainly for accessibility reasons
		if (event.keyCode === 9) {
			if (halfmoon.supportsSidebar()) {
				var sidebarHidden = halfmoon.pageWrapper.getAttribute(
					"data-hm-sidebar-hidden"
				);

				// Only applies when the screen width <= 768px
				if (window.innerWidth <= 768) {
					if (sidebarHidden === "false") {
						if (!halfmoon.sidebar.obj.contains(event.target)) {
							halfmoon.closeSidebar();
						}
					}
				}

				// Or if the sidebar type is "overlayed-all"
				else {
					if (
						halfmoon.sidebar.type.includes("overlayed-all") &&
						sidebarHidden === "false"
					) {
						if (!halfmoon.sidebar.obj.contains(event.target)) {
							halfmoon.closeSidebar();
						}
					}
				}
			}
		}
	},

	/**
	 * Handle the focusin event.
	 *
	 * @param {Object} event - The main interaction.
	 * @returns {void}
	 */
	onFocusIn: function(event) {
		// Shift focus back to open dialog if shifted outside (focus trap)
		if (halfmoon.currentDialog.obj) {
			if (!halfmoon.currentDialog.obj.contains(event.target)) {
				halfmoon.currentDialog.obj.focus();
			}
		}

		// Make sure that focused elements inside the content wrapper are not
		// hidden behind the fixed navbars (both default and fixed bottom)
		else if (halfmoon.contentWrapper) {
			if (halfmoon.contentWrapper.contains(event.target)) {
				var targetBound = event.target.getBoundingClientRect();
				var threshold;

				// Adjust if target falls behind default navbar
				if (halfmoon.supportsNavbar()) {
					threshold = targetBound.top;
					if (threshold < halfmoon.navbars.heightTop) {
						event.target.scrollIntoView(true);
						window.scrollTo(
							0, window.scrollY - halfmoon.navbars.heightTop
						);
					}
				}

				// Adjust if target falls behind navbar fixed bottom
				if (halfmoon.supportsNavbarFixedBottom()) {
					threshold = window.innerHeight - targetBound.bottom;
					if (threshold < halfmoon.navbars.heightBottom) {
						event.target.scrollIntoView(false);
						window.scrollTo(
							0, window.scrollY + halfmoon.navbars.heightBottom
						);
					}
				}
			}
		}
	},

	/**
	 * Handle the hashchange event.
	 *
	 * @param {Object} event - The main interaction.
	 * @returns {void}
	 */
	onHashChange: function(event) {
		var hashTarget = document.getElementById(location.hash.substring(1));
		if (hashTarget) {
			event.preventDefault();
			halfmoon.adjustContentScrollMargin(hashTarget);
		}
	},

	/**
	 * Handle the click event.
	 *
	 * @param {Object} event - The main interaction.
	 * @returns {void}
	 */
	onClick: function(event) {
		var target = event.target;
		var dropdownMenuClosed;

		// Close active dropdown when clicked outside of the menu
		if (halfmoon.currentDropdown.menu) {
			if (!halfmoon.currentDropdown.menu.contains(target)) {
				dropdownMenuClosed = halfmoon.currentDropdown.menu;
				halfmoon.closeDropdown(false);
			}
		}

		// Handle clicks on links (adjust scroll margin when needed)
		// The scroll-margin-top property does this using CSS, so no JS needed
		if (!("scroll-margin-top" in document.documentElement.style)) {
			if (target.matches("a[href]")) {
				// If the "href" attribute does not match hash, then this is
				// handled by the hashchange event listener instead
				if (target.getAttribute("href") === location.hash) {
					var hashTarget = document.getElementById(
						target.getAttribute("href").substring(1)
					);
					if (hashTarget) {
						event.preventDefault();
						halfmoon.adjustContentScrollMargin(hashTarget);
					}
				}
			}
		}

		// Handle clicks on dark mode toggles
		if (
			target.matches("[data-hm-toggle='dark-mode']") ||
			target.matches("[data-hm-toggle='dark-mode'] *")
		) {
			halfmoon.toggleDarkMode();
			event.preventDefault();
		}

		// Handle clicks on readable mode toggles
		if (
			target.matches("[data-hm-toggle='readable-mode']") ||
			target.matches("[data-hm-toggle='readable-mode'] *")
		) {
			halfmoon.toggleReadableMode();
			event.preventDefault();
		}

		// Handle clicks on sidebar toggles
		if (
			target.matches("[data-hm-toggle='sidebar']") ||
			target.matches("[data-hm-toggle='sidebar'] *")
		) {
			halfmoon.toggleSidebar();
			event.preventDefault();
		}

		// Handle clicks on sidebar overlay
		if (target.matches(".sidebar-overlay")) {
			halfmoon.toggleSidebar();
			event.preventDefault();
		}

		// Handle clicks on dialog toggles
		if (
			target.matches("[data-hm-toggle='modal']") ||
			target.matches("[data-hm-toggle='modal'] *") ||
			target.matches("[data-hm-toggle='offcanvas']") ||
			target.matches("[data-hm-toggle='offcanvas'] *")
		) {
			if (target.matches("[data-hm-toggle='modal'] *")) {
				target = target.closest("[data-hm-toggle='modal']");
			}
			if (target.matches("[data-hm-toggle='offcanvas'] *")) {
				target = target.closest("[data-hm-toggle='offcanvas']");
			}
			halfmoon.openDialog(
				halfmoon.getIdFromTargetAttr(
					target.getAttribute("data-hm-target")
				), target
			);
			event.preventDefault();
		}

		// Handle clicks on dialog dismiss buttons
		if (
			target.matches("[data-hm-dismiss='modal']") ||
			target.matches("[data-hm-dismiss='modal'] *") ||
			target.matches("[data-hm-dismiss='offcanvas']") ||
			target.matches("[data-hm-dismiss='offcanvas'] *")
		) {
			halfmoon.closeDialog();
			event.preventDefault();
		}

		// Handle clicks on dialog overlays
		// For modals, the click is registered on the dialog
		// For offcanvas, the click is registered on the overlay
		if (
			target.matches(".modal-dialog") ||
			target.matches(".dialog-overlay")
		) {
			var dialog = halfmoon.currentDialog.obj;
			if (dialog.getAttribute("data-hm-backdrop") === "static") {
				halfmoon.animateDialogShake();
			} else {
				halfmoon.closeDialog();
			}
			event.preventDefault();
		}

		// Handle clicks on alert dismiss buttons
		if (
			target.matches("[data-hm-dismiss='alert']") ||
			target.matches("[data-hm-dismiss='alert'] *")
		) {
			var alert = target.closest(".alert");
			halfmoon.closeAlert(alert);
			event.preventDefault();
		}

		// Handle clicks on toast toggles
		if (
			target.matches("[data-hm-toggle='toast']") ||
			target.matches("[data-hm-toggle='toast'] *")
		) {
			if (target.matches("[data-hm-toggle='toast'] *")) {
				target = target.closest("[data-hm-toggle='toast']");
			}
			halfmoon.initToastAlertFromToggle(target);
			event.preventDefault();
		}

		// Handle clicks on dropdown toggles
		if (
			target.matches("[data-hm-toggle='dropdown']") ||
			target.matches("[data-hm-toggle='dropdown'] *")
		) {
			if (target.matches("[data-hm-toggle='dropdown'] *")) {
				target = target.closest("[data-hm-toggle='dropdown']");
			}

			if (!target.classList.contains("menu-open")) {
				// A click that closed a menu should not open it again
				var menu = target.parentElement.querySelector(
					".dropdown-menu"
				);
				if (menu !== dropdownMenuClosed) {
					halfmoon.openDropdown(menu, target);
					event.preventDefault();
				}
			}
		}

		// Handle clicks on tab toggles
		if (
			target.matches("[data-hm-toggle='tab']") ||
			target.matches("[data-hm-toggle='tab'] *")
		) {
			if (target.matches("[data-hm-toggle='tab'] *")) {
				target = target.closest("[data-hm-toggle='tab']");
			}
			if (!(target.classList.contains("active"))) {
				halfmoon.activateTab(
					halfmoon.getIdFromTargetAttr(
						target.getAttribute("data-hm-target")
					), target
				);
			}
			event.preventDefault();
		}

		// Handle clicks on step up toggles
		if (
			target.matches("[data-hm-toggle='step-up']") ||
			target.matches("[data-hm-toggle='step-up'] *")
		) {
			if (target.matches("[data-hm-toggle='step-up'] *")) {
				target = target.closest("[data-hm-toggle='step-up']");
			}
			halfmoon.inputStepUp(
				halfmoon.getIdFromTargetAttr(
					target.getAttribute("data-hm-target")
				)
			);
			event.preventDefault();
		}

		// Handle clicks on step down toggles
		if (
			target.matches("[data-hm-toggle='step-down']") ||
			target.matches("[data-hm-toggle='step-down'] *")
		) {
			if (target.matches("[data-hm-toggle='step-down'] *")) {
				target = target.closest("[data-hm-toggle='step-down']");
			}
			halfmoon.inputStepDown(
				halfmoon.getIdFromTargetAttr(
					target.getAttribute("data-hm-target")
				)
			);
			event.preventDefault();
		}

		// Handle clicks on password toggles
		if (
			target.matches("[data-hm-toggle='password']") ||
			target.matches("[data-hm-toggle='password'] *")
		) {
			if (target.matches("[data-hm-toggle='password'] *")) {
				target = target.closest("[data-hm-toggle='password']");
			}
			halfmoon.togglePassword(
				halfmoon.getIdFromTargetAttr(
					target.getAttribute("data-hm-target")
				), target
			);
			event.preventDefault();
		}
	},

	/**
	 * Handle the DOMContentLoaded event.
	 *
	 * @returns {void}
	 */
	onDOMContentLoaded: function() {
		// Re-init the required elements if not on browser (for virtual DOMs)
		if (
			typeof process !== "undefined" &&
			process.versions != null &&
			process.versions.node != null
		) {
			halfmoon.pageWrapper = halfmoonInitProps.pageWrapper();
			halfmoon.contentWrapper = halfmoonInitProps.contentWrapper();
			halfmoon.navbars = halfmoonInitProps.navbars();
			halfmoon.sidebar = halfmoonInitProps.sidebar();
			halfmoon.currentDialog = halfmoonInitProps.currentDialog();
			halfmoon.stickyAlerts = halfmoonInitProps.stickyAlerts();
			halfmoon.currentDropdown = halfmoonInitProps.currentDropdown();
		}

		halfmoon.autosetPreferredColorScheme();

		halfmoon.autosetPreferredFontSize();

		document.addEventListener("keydown", function(event) {
			halfmoon.onKeyDown(event);
		});

		document.addEventListener("keyup", function(event) {
			halfmoon.onKeyUp(event);
		});

		document.addEventListener("focusin", function(event) {
			halfmoon.onFocusIn(event);
		});

		// Add the hashchange event listener (adjust scroll margin when needed)
		// The scroll-margin-top property does this using CSS, so no JS needed
		if (!("scroll-margin-top" in document.documentElement.style)) {
			window.addEventListener("hashchange", function(event) {
				halfmoon.onHashChange(event);
			});
		}

		document.addEventListener("click", function(event) {
			halfmoon.onClick(event);
		});

		halfmoon.toastAlertsOnload();

		halfmoon.scrollTabsToActiveToggle();

		halfmoon.initIndeterminateInputs();

		halfmoon.initFileInputs();

		halfmoon.bindInputs();

		// Adjust scroll margin for the hash target
		// The scroll-margin-top property does this using CSS, so no JS needed
		if (!("scroll-margin-top" in document.documentElement.style)) {
			setTimeout(function() {
				var hashTarget = document.getElementById(
					location.hash.substring(1)
				);
				if (hashTarget) {
					// Only adjust if the difference is small (less than 50px)
					// In most cases, the difference should be 0, but
					// sometimes it is a very small number
					if (Math.abs(hashTarget.offsetTop - window.scrollY) < 50) {
						halfmoon.adjustContentScrollMargin(hashTarget);
					}
				}
			}, 250);
		}
	}

	/* END EVENT LISTENER FUNCTIONS */
};


if (typeof window !== "undefined" && typeof window.document !== "undefined") {
	// Call the function when the DOM is loaded on browser
	document.addEventListener("DOMContentLoaded", halfmoon.onDOMContentLoaded);
}
else {
	// Export as module otherwise
	module.exports = halfmoon;
}
