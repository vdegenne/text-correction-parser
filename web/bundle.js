/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__text_correction_parser__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__text_correction_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__text_correction_parser__);

window.TextCorrectionParser = __WEBPACK_IMPORTED_MODULE_0__text_correction_parser___default.a;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let operators = [
  {
    name: 'wrong_replace',
    opening : '[',
    closing: '>',
    encloser: '<span class="wrong_replace">%</span> '
  },

  {
    name: 'right_replace',
    opening: '>',
    closing: ']',
    encloser: '<span class="right_replace">%</span>'
  },

  {
    name: 'removed',
    opening: '>',
    closing: '<',
    encloser: '<span class="removed">%</span>'
  },

  {
    name: 'adding',
    opening: '@',
    closing: '@',
    encloser: '<span class="added">%</span>'
  }
];

let awaiting, candidates, enclosedText;

function reset_vars () {
  awaiting = false;
  candidates = [];
  enclosedText = '';
}

function parse_data (data) {
  let output = '';
  reset_vars();

  for (let i = 0; i < data.length; ++i) {
    let theLetter = data[i];

    if (!awaiting) {
      /* searching for an opening */
      let openings = operators.filter(function (o) {
        return o.opening === theLetter;
      });

      if (openings.length) {
        candidates = openings;
        awaiting = true;
        continue;
      }

      output += theLetter;
      continue;
    }

    /* else we search for closers */
    let closers = candidates.filter(function (c) {
      return c.closing === theLetter;
    });

    if (closers.length)
    {
      let closer = closers[0];

      output += closer.encloser.replace('%', enclosedText);
      reset_vars();

      let openings = operators.filter(function (o) {
        return (!(closer === o) && o.opening === theLetter);
      });

      if (openings.length) {
        candidates = openings;
        awaiting = true;
      }
      continue;
    }

    enclosedText += theLetter;
  }

  reset_vars();
  return output;
}




module.exports.parse_data = parse_data;

/***/ })
/******/ ]);