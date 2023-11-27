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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./components/distance.js":
/*!********************************!*\
  !*** ./components/distance.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

function calculateDistance(pos1, pos2) {
  return pos1.distanceTo(pos2);
}

AFRAME.registerComponent('distance', {

  schema: {
    camera: { type: 'selector', default: '' },
    distanceLimit: { type: 'number', default: 10 }
  },

  init: function () {
    console.log('El componente distance se está ejecutando');
    console.log('ESTOY EN INIT');
    //me hago una copia del valor porque si no se actualiza automaticamente porque ambas variables apuntan al mismo objeto en la memoria
    this.prevCamPos = new THREE.Vector3().copy(this.data.camera.object3D.position);
    console.log('LLEGO AQUI 1');
    this.frameCount = 0;
    this.framesToSkip = 60; // Ejecutar cada 60 fotogramas (1 segundo a 60 FPS)
    this.tick();
  },
  // Pasa la función calculateDistance al componente como un método
  calculateDistance: calculateDistance,

  tick: function () {

    // Incrementa el contador de fotogramas
    this.frameCount++;

    if (this.frameCount >= this.framesToSkip) {
      console.log('La función tick se ejecutó');
      var elemPos = this.el.getAttribute('position');
      console.log('Posición del objeto elemPos:', elemPos.x, elemPos.y, elemPos.z);

      var camPosNow = this.data.camera.object3D.position;

      var distanceLimit = this.data.distanceLimit;
      console.log('distanceLimit ' + distanceLimit);
      console.log('Posición del objeto camPosNow:', camPosNow.x, camPosNow.y, camPosNow.z);
      // console.log('Posición del objeto prevCamPos FINAL:', this.prevCamPos.x, this.prevCamPos.y, this.prevCamPos.z);
      if (camPosNow.x !== this.prevCamPos.x || camPosNow.y !== this.prevCamPos.y || camPosNow.z !== this.prevCamPos.z) {
        console.log('ME HE MOVIDO');
        var distance = this.calculateDistance(camPosNow, elemPos);
        console.log('distance ' + distance);
        if (distance < distanceLimit) {
          console.log('DISPARO PLAY');
          this.el.sceneEl.emit('cercaObjeto', { elem: this.el, id: this.el.id, distance: distance });
        }

        if (distance >= distanceLimit) {
          console.log("ME ALEJÉ DEL ELEMENTO");
          this.el.sceneEl.emit('lejosObjeto', { elem: this.el, id: this.el.id });
        }
        // Actualiza la posición anterior
        this.prevCamPos.copy(camPosNow);
      }

      // Reinicia el contador de fotogramas
      this.frameCount = 0;
    }

    // Vuelve a programar la ejecución de la función tick para el próximo fotograma
    // this.el.sceneEl.renderer.xr.getSession().requestAnimationFrame(this.tick.bind(this));
    //   this.el.sceneEl.renderer.xr.getSession()?.requestAnimationFrame(this.tick.bind(this));
    const session = this.el.sceneEl.renderer.xr.getSession();
    if (session) {
      session.requestAnimationFrame(this.tick.bind(this));
    }
  }

});

document.addEventListener('cercaObjeto', function (event) {
  // Accede al elemento y sus atributos desde el evento
  var elemento = event.detail.elem;
  console.log('elemento ' + elemento);
  console.log('sound component:', elemento.components.sound);
  var idElemento = event.detail.id;
  var distance = event.detail.distance;

  // Imprime todos los atributos del elemento
  var atributosElemento = elemento.attributes;
  console.log('Atributos del elemento con ID', idElemento);
  for (var i = 0; i < atributosElemento.length; i++) {
    var nombreAtributo = atributosElemento[i].name;
    var valorAtributo = atributosElemento[i].value;
    console.log('Atributo:', nombreAtributo, 'Valor:', valorAtributo);
    if (nombreAtributo === 'interruptor_texto') {
      elemento.sceneEl.emit('activarTextoSonido');
    } else if (nombreAtributo === 'opacidad_interruptor') {
      console.log('ACTIVO OPACIDAD');
      if (distance >= 12) {
        elemento.setAttribute('material', 'opacity: 0.8');
      } else if (distance <= 12 && distance > 7) {
        elemento.setAttribute('material', 'opacity: 0.6');
      } else if (distance <= 7 && distance > 5) {
        elemento.setAttribute('material', 'opacity: 0.3');
      } else {
        elemento.setAttribute('material', 'opacity: 0');
      }
    } else if (nombreAtributo === 'luz_interruptor') {
      console.log('ACTIVO LUZ');
      let el = document.getElementById('luzCalavera');
      el.setAttribute('light', 'intensity: 3');
    } else if (nombreAtributo === 'interruptor_video') {
      console.log('ACTIVO VIDEO');
      var elemVideo = document.getElementById('videoElefante');
      elemVideo.setAttribute('visible', 'true');
      let video = elemVideo.components.material.material.map.image;
      video.play();
    }
  }
});

document.addEventListener('lejosObjeto', function (event) {
  // Accede al elemento y sus atributos desde el evento
  var elemento = event.detail.elem;
  var idElemento = event.detail.id;

  // Imprime todos los atributos del elemento
  var atributosElemento = elemento.attributes;
  console.log('Atributos del elemento con ID', idElemento);
  for (var i = 0; i < atributosElemento.length; i++) {
    var nombreAtributo = atributosElemento[i].name;
    var valorAtributo = atributosElemento[i].value;
    console.log('Atributo:', nombreAtributo, 'Valor:', valorAtributo);
    if (nombreAtributo === 'interruptor_texto') {
      elemento.sceneEl.emit('desactivarTextoSonido');
      var ele = document.getElementById('textoActivarSonido');
      let audio = document.querySelector(ele.components.sound.attrValue.src);
      audio.pause();
      console.log('HE DESACTIVADO AUDIO');
    } else if (nombreAtributo === 'opacidad_interruptor') {
      elemento.setAttribute('material', 'opacity: 1');
    } else if (nombreAtributo === 'luz_interruptor') {
      let el = document.getElementById('luzCalavera');
      el.setAttribute('light', 'intensity: 0');
    } else if (nombreAtributo === 'interruptor_video') {
      var elemVideo = document.getElementById('videoElefante');
      console.log('PARO VIDEO');
      let video = elemVideo.components.material.material.map.image;
      video.pause();
      elemVideo.setAttribute('visible', 'false');
    }
  }
});

document.addEventListener('desactivarTextoSonido', function (event) {
  const boton = document.getElementById('textoActivarSonido');
  boton.setAttribute('visible', 'false');
});

AFRAME.registerComponent('clickable', {
  init: function () {
    var el = this.el;
    document.addEventListener('activarTextoSonido', function (event) {

      const botonActivar = document.getElementById('textoActivarSonido');
      botonActivar.setAttribute('visible', 'true');
      const textoActivar = document.getElementById('textoActivar');

      // Accede al componente de sonido
      var audio = document.querySelector(el.components.sound.attrValue.src);
      console.log('RAC AUDIO 55: ' + audio);
      var isPlay = false;
      el.addEventListener('click', function (event) {
        console.log('CLICCCCCCCCCC');
        console.log('isPlay ' + isPlay);

        if (isPlay) {
          audio.pause();
          console.log('Audio pausado');
          isPlay = false;
          botonActivar.setAttribute('color', 'green');
          textoActivar.setAttribute('value', 'Activar sonido');
        } else {
          audio.play();
          console.log('Audio activado');
          isPlay = true;
          botonActivar.setAttribute('color', 'red');
          textoActivar.setAttribute('value', 'Parar sonido');
        }
      });
    });
  }
});

/***/ }),

/***/ "./components/tiempo.js":
/*!******************************!*\
  !*** ./components/tiempo.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

AFRAME.registerComponent('tiempo', {
  init: function () {
    console.log('this.el.id ' + this.el.id);
    // Función para mostrar el texto cada 5 segundos durante 1 segundo
    setInterval(() => {
      // Muestra el texto
      this.el.setAttribute('visible', 'true');

      // Oculta el texto después de 1 segundo
      setTimeout(() => {
        this.el.setAttribute('visible', 'false');
      }, 1000);
    }, 5000);
  }

});

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./components/distance */ "./components/distance.js")
__webpack_require__(/*! ./components/tiempo */ "./components/tiempo.js")



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9kaXN0YW5jZS5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL3RpZW1wby5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6WyJjYWxjdWxhdGVEaXN0YW5jZSIsInBvczEiLCJwb3MyIiwiZGlzdGFuY2VUbyIsIkFGUkFNRSIsInJlZ2lzdGVyQ29tcG9uZW50Iiwic2NoZW1hIiwiY2FtZXJhIiwidHlwZSIsImRlZmF1bHQiLCJkaXN0YW5jZUxpbWl0IiwiaW5pdCIsImNvbnNvbGUiLCJsb2ciLCJwcmV2Q2FtUG9zIiwiVEhSRUUiLCJWZWN0b3IzIiwiY29weSIsImRhdGEiLCJvYmplY3QzRCIsInBvc2l0aW9uIiwiZnJhbWVDb3VudCIsImZyYW1lc1RvU2tpcCIsInRpY2siLCJlbGVtUG9zIiwiZWwiLCJnZXRBdHRyaWJ1dGUiLCJ4IiwieSIsInoiLCJjYW1Qb3NOb3ciLCJkaXN0YW5jZSIsInNjZW5lRWwiLCJlbWl0IiwiZWxlbSIsImlkIiwic2Vzc2lvbiIsInJlbmRlcmVyIiwieHIiLCJnZXRTZXNzaW9uIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiYmluZCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiZWxlbWVudG8iLCJkZXRhaWwiLCJjb21wb25lbnRzIiwic291bmQiLCJpZEVsZW1lbnRvIiwiYXRyaWJ1dG9zRWxlbWVudG8iLCJhdHRyaWJ1dGVzIiwiaSIsImxlbmd0aCIsIm5vbWJyZUF0cmlidXRvIiwibmFtZSIsInZhbG9yQXRyaWJ1dG8iLCJ2YWx1ZSIsInNldEF0dHJpYnV0ZSIsImdldEVsZW1lbnRCeUlkIiwiZWxlbVZpZGVvIiwidmlkZW8iLCJtYXRlcmlhbCIsIm1hcCIsImltYWdlIiwicGxheSIsImVsZSIsImF1ZGlvIiwicXVlcnlTZWxlY3RvciIsImF0dHJWYWx1ZSIsInNyYyIsInBhdXNlIiwiYm90b24iLCJib3RvbkFjdGl2YXIiLCJ0ZXh0b0FjdGl2YXIiLCJpc1BsYXkiLCJzZXRJbnRlcnZhbCIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQSxTQUFTQSxpQkFBVCxDQUEyQkMsSUFBM0IsRUFBaUNDLElBQWpDLEVBQXVDO0FBQ25DLFNBQU9ELEtBQUtFLFVBQUwsQ0FBZ0JELElBQWhCLENBQVA7QUFDRDs7QUFHREUsT0FBT0MsaUJBQVAsQ0FBeUIsVUFBekIsRUFBcUM7O0FBRW5DQyxVQUFRO0FBQ05DLFlBQVEsRUFBRUMsTUFBTSxVQUFSLEVBQW9CQyxTQUFTLEVBQTdCLEVBREY7QUFFTkMsbUJBQWUsRUFBRUYsTUFBTSxRQUFSLEVBQWtCQyxTQUFTLEVBQTNCO0FBRlQsR0FGMkI7O0FBT25DRSxRQUFNLFlBQVk7QUFDbEJDLFlBQVFDLEdBQVIsQ0FBWSwyQ0FBWjtBQUNFRCxZQUFRQyxHQUFSLENB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QUFSLENBQVksZ0JBQVo7QUFDQThELG1CQUFTLElBQVQ7QUFDQUYsdUJBQWFmLFlBQWIsQ0FBMEIsT0FBMUIsRUFBbUMsS0FBbkM7QUFDQWdCLHVCQUFhaEIsWUFBYixDQUEwQixPQUExQixFQUFtQyxjQUFuQztBQUNEO0FBQ0YsT0FqQkQ7QUFrQkgsS0E5QkM7QUFnQ0Q7QUFuQ21DLENBQXRDLEU7Ozs7Ozs7Ozs7O0FDbktGdEQsT0FBT0MsaUJBQVAsQ0FBeUIsUUFBekIsRUFBbUM7QUFDL0JNLFFBQU0sWUFBWTtBQUNoQkMsWUFBUUMsR0FBUixDQUFZLGdCQUFnQixLQUFLWSxFQUFMLENBQVFVLEVBQXBDO0FBQ0E7QUFDQXlDLGdCQUFZLE1BQU07QUFDaEI7QUFDQSxXQUFLbkQsRUFBTCxDQUFRaUMsWUFBUixDQUFxQixTQUFyQixFQUFnQyxNQUFoQzs7QUFFQTtBQUNBbUIsaUJBQVcsTUFBTTtBQUNmLGFBQUtwRCxFQUFMLENBQVFpQyxZQUFSLENBQXFCLFNBQXJCLEVBQWdDLE9BQWhDO0FBQ0QsT0FGRCxFQUVHLElBRkg7QUFHRCxLQVJELEVBUUcsSUFSSDtBQVNEOztBQWI4QixDQUFuQyxFOzs7Ozs7Ozs7OztBQ0FBLG1CQUFPLENBQUMsdURBQXVCO0FBQy9CLG1CQUFPLENBQUMsbURBQXFCIiwiZmlsZSI6ImFmcmFtZS1tdXNlb2FpcmVsaWJyZS1jb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9pbmRleC5qc1wiKTtcbiIsImZ1bmN0aW9uIGNhbGN1bGF0ZURpc3RhbmNlKHBvczEsIHBvczIpIHtcclxuICAgIHJldHVybiBwb3MxLmRpc3RhbmNlVG8ocG9zMik7XHJcbiAgfVxyXG5cclxuXHJcbiAgQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdkaXN0YW5jZScsIHtcclxuICAgIFxyXG4gICAgc2NoZW1hOiB7XHJcbiAgICAgIGNhbWVyYTogeyB0eXBlOiAnc2VsZWN0b3InLCBkZWZhdWx0OiAnJyB9LFxyXG4gICAgICBkaXN0YW5jZUxpbWl0OiB7IHR5cGU6ICdudW1iZXInLCBkZWZhdWx0OiAxMCB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdFbCBjb21wb25lbnRlIGRpc3RhbmNlIHNlIGVzdMOhIGVqZWN1dGFuZG8nKTtcclxuICAgICAgY29uc29sZS5sb2coJ0VTVE9ZIEVOIElOSVQnKTtcclxuICAgICAgLy9tZSBoYWdvIHVuYSBjb3BpYSBkZWwgdmFsb3IgcG9ycXVlIHNpIG5vIHNlIGFjdHVhbGl6YSBhdXRvbWF0aWNhbWVudGUgcG9ycXVlIGFtYmFzIHZhcmlhYmxlcyBhcHVudGFuIGFsIG1pc21vIG9iamV0byBlbiBsYSBtZW1vcmlhXHJcbiAgICAgIHRoaXMucHJldkNhbVBvcyA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuY29weSh0aGlzLmRhdGEuY2FtZXJhLm9iamVjdDNELnBvc2l0aW9uKTtcclxuICAgICAgY29uc29sZS5sb2coJ0xMRUdPIEFRVUkgMScpXHJcbiAgICAgIHRoaXMuZnJhbWVDb3VudCA9IDA7XHJcbiAgICAgIHRoaXMuZnJhbWVzVG9Ta2lwID0gNjA7ICAvLyBFamVjdXRhciBjYWRhIDYwIGZvdG9ncmFtYXMgKDEgc2VndW5kbyBhIDYwIEZQUylcclxuICAgICAgdGhpcy50aWNrKCk7XHJcbiAgICB9LFxyXG4gICAgLy8gUGFzYSBsYSBmdW5jacOzbiBjYWxjdWxhdGVEaXN0YW5jZSBhbCBjb21wb25lbnRlIGNvbW8gdW4gbcOpdG9kb1xyXG4gICAgY2FsY3VsYXRlRGlzdGFuY2U6IGNhbGN1bGF0ZURpc3RhbmNlLFxyXG5cclxuICAgIHRpY2s6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgLy8gSW5jcmVtZW50YSBlbCBjb250YWRvciBkZSBmb3RvZ3JhbWFzXHJcbiAgICAgIHRoaXMuZnJhbWVDb3VudCsrO1xyXG5cclxuICAgICAgaWYgKHRoaXMuZnJhbWVDb3VudCA+PSB0aGlzLmZyYW1lc1RvU2tpcCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYSBmdW5jacOzbiB0aWNrIHNlIGVqZWN1dMOzJyk7XHJcbiAgICAgICAgdmFyIGVsZW1Qb3MgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgncG9zaXRpb24nKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnUG9zaWNpw7NuIGRlbCBvYmpldG8gZWxlbVBvczonLCBlbGVtUG9zLngsIGVsZW1Qb3MueSwgZWxlbVBvcy56KTtcclxuXHJcbiAgICAgICAgdmFyIGNhbVBvc05vdyA9IHRoaXMuZGF0YS5jYW1lcmEub2JqZWN0M0QucG9zaXRpb247XHJcblxyXG4gICAgICAgIHZhciBkaXN0YW5jZUxpbWl0ID0gdGhpcy5kYXRhLmRpc3RhbmNlTGltaXQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2Rpc3RhbmNlTGltaXQgJytkaXN0YW5jZUxpbWl0KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQb3NpY2nDs24gZGVsIG9iamV0byBjYW1Qb3NOb3c6JywgY2FtUG9zTm93LngsIGNhbVBvc05vdy55LCBjYW1Qb3NOb3cueik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1Bvc2ljacOzbiBkZWwgb2JqZXRvIHByZXZDYW1Qb3MgRklOQUw6JywgdGhpcy5wcmV2Q2FtUG9zLngsIHRoaXMucHJldkNhbVBvcy55LCB0aGlzLnByZXZDYW1Qb3Mueik7XHJcbiAgICAgICAgaWYgKGNhbVBvc05vdy54ICE9PSB0aGlzLnByZXZDYW1Qb3MueCB8fCBjYW1Qb3NOb3cueSAhPT0gdGhpcy5wcmV2Q2FtUG9zLnkgfHwgY2FtUG9zTm93LnogIT09IHRoaXMucHJldkNhbVBvcy56KSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTUUgSEUgTU9WSURPJylcclxuICAgICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMuY2FsY3VsYXRlRGlzdGFuY2UoY2FtUG9zTm93LGVsZW1Qb3MpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2Rpc3RhbmNlICcgKyBkaXN0YW5jZSlcclxuICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCBkaXN0YW5jZUxpbWl0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRElTUEFSTyBQTEFZJylcclxuICAgICAgICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5lbWl0KCdjZXJjYU9iamV0bycsIHtlbGVtOiB0aGlzLmVsLCBpZDogdGhpcy5lbC5pZCwgZGlzdGFuY2U6IGRpc3RhbmNlfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPj0gZGlzdGFuY2VMaW1pdCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJNRSBBTEVKw4kgREVMIEVMRU1FTlRPXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLmVtaXQoJ2xlam9zT2JqZXRvJywge2VsZW06IHRoaXMuZWwsIGlkOiB0aGlzLmVsLmlkfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gQWN0dWFsaXphIGxhIHBvc2ljacOzbiBhbnRlcmlvclxyXG4gICAgICAgICAgdGhpcy5wcmV2Q2FtUG9zLmNvcHkoY2FtUG9zTm93KVxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICAvLyBSZWluaWNpYSBlbCBjb250YWRvciBkZSBmb3RvZ3JhbWFzXHJcbiAgICAgICAgdGhpcy5mcmFtZUNvdW50ID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVnVlbHZlIGEgcHJvZ3JhbWFyIGxhIGVqZWN1Y2nDs24gZGUgbGEgZnVuY2nDs24gdGljayBwYXJhIGVsIHByw7N4aW1vIGZvdG9ncmFtYVxyXG4gICAgICAvLyB0aGlzLmVsLnNjZW5lRWwucmVuZGVyZXIueHIuZ2V0U2Vzc2lvbigpLnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XHJcbiAgICAvLyAgIHRoaXMuZWwuc2NlbmVFbC5yZW5kZXJlci54ci5nZXRTZXNzaW9uKCk/LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XHJcbiAgICBjb25zdCBzZXNzaW9uID0gdGhpcy5lbC5zY2VuZUVsLnJlbmRlcmVyLnhyLmdldFNlc3Npb24oKTtcclxuICAgIGlmIChzZXNzaW9uKSB7XHJcbiAgICAgIHNlc3Npb24ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2VyY2FPYmpldG8nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgLy8gQWNjZWRlIGFsIGVsZW1lbnRvIHkgc3VzIGF0cmlidXRvcyBkZXNkZSBlbCBldmVudG9cclxuICAgIHZhciBlbGVtZW50byA9IGV2ZW50LmRldGFpbC5lbGVtO1xyXG4gICAgY29uc29sZS5sb2coJ2VsZW1lbnRvICcgKyBlbGVtZW50bylcclxuICAgIGNvbnNvbGUubG9nKCdzb3VuZCBjb21wb25lbnQ6JywgZWxlbWVudG8uY29tcG9uZW50cy5zb3VuZCk7XHJcbiAgICB2YXIgaWRFbGVtZW50byA9IGV2ZW50LmRldGFpbC5pZDtcclxuICAgIHZhciBkaXN0YW5jZSA9IGV2ZW50LmRldGFpbC5kaXN0YW5jZTtcclxuXHJcbiAgICAvLyBJbXByaW1lIHRvZG9zIGxvcyBhdHJpYnV0b3MgZGVsIGVsZW1lbnRvXHJcbiAgICB2YXIgYXRyaWJ1dG9zRWxlbWVudG8gPSBlbGVtZW50by5hdHRyaWJ1dGVzO1xyXG4gICAgY29uc29sZS5sb2coJ0F0cmlidXRvcyBkZWwgZWxlbWVudG8gY29uIElEJywgaWRFbGVtZW50byk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0cmlidXRvc0VsZW1lbnRvLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub21icmVBdHJpYnV0byA9IGF0cmlidXRvc0VsZW1lbnRvW2ldLm5hbWU7XHJcbiAgICAgIHZhciB2YWxvckF0cmlidXRvID0gYXRyaWJ1dG9zRWxlbWVudG9baV0udmFsdWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdBdHJpYnV0bzonLCBub21icmVBdHJpYnV0bywgJ1ZhbG9yOicsIHZhbG9yQXRyaWJ1dG8pO1xyXG4gICAgICBpZihub21icmVBdHJpYnV0byA9PT0gJ2ludGVycnVwdG9yX3RleHRvJyl7XHJcbiAgICAgICAgZWxlbWVudG8uc2NlbmVFbC5lbWl0KCdhY3RpdmFyVGV4dG9Tb25pZG8nKTtcclxuXHJcbiAgICAgIH1lbHNlIGlmKG5vbWJyZUF0cmlidXRvID09PSAnb3BhY2lkYWRfaW50ZXJydXB0b3InKXtcclxuICAgICAgICBjb25zb2xlLmxvZygnQUNUSVZPIE9QQUNJREFEJylcclxuICAgICAgICBpZihkaXN0YW5jZSA+PSAxMil7XHJcbiAgICAgICAgICAgIGVsZW1lbnRvLnNldEF0dHJpYnV0ZSgnbWF0ZXJpYWwnLCAnb3BhY2l0eTogMC44Jyk7IFxyXG4gICAgICAgICAgfWVsc2UgaWYoZGlzdGFuY2UgPD0gMTIgJiYgZGlzdGFuY2UgPiA3ICl7XHJcbiAgICAgICAgICAgIGVsZW1lbnRvLnNldEF0dHJpYnV0ZSgnbWF0ZXJpYWwnLCAnb3BhY2l0eTogMC42Jyk7IFxyXG4gICAgICAgICAgfWVsc2UgaWYoZGlzdGFuY2UgPD0gNyAmJiBkaXN0YW5jZSA+IDUpe1xyXG4gICAgICAgICAgICBlbGVtZW50by5zZXRBdHRyaWJ1dGUoJ21hdGVyaWFsJywgJ29wYWNpdHk6IDAuMycpOyBcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBlbGVtZW50by5zZXRBdHRyaWJ1dGUoJ21hdGVyaWFsJywgJ29wYWNpdHk6IDAnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfWVsc2UgaWYobm9tYnJlQXRyaWJ1dG8gPT09ICdsdXpfaW50ZXJydXB0b3InKXtcclxuICAgICAgICBjb25zb2xlLmxvZygnQUNUSVZPIExVWicpO1xyXG4gICAgICAgIGxldCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsdXpDYWxhdmVyYScpO1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnbGlnaHQnLCAnaW50ZW5zaXR5OiAzJyk7XHJcbiAgICAgIH1lbHNlIGlmKG5vbWJyZUF0cmlidXRvID09PSAnaW50ZXJydXB0b3JfdmlkZW8nKXtcclxuICAgICAgICBjb25zb2xlLmxvZygnQUNUSVZPIFZJREVPJyk7XHJcbiAgICAgICAgdmFyIGVsZW1WaWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlb0VsZWZhbnRlJyk7XHJcbiAgICAgICAgZWxlbVZpZGVvLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICd0cnVlJyk7XHJcbiAgICAgICAgbGV0IHZpZGVvID0gZWxlbVZpZGVvLmNvbXBvbmVudHMubWF0ZXJpYWwubWF0ZXJpYWwubWFwLmltYWdlO1xyXG4gICAgICAgIHZpZGVvLnBsYXkoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsZWpvc09iamV0bycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAvLyBBY2NlZGUgYWwgZWxlbWVudG8geSBzdXMgYXRyaWJ1dG9zIGRlc2RlIGVsIGV2ZW50b1xyXG4gICAgdmFyIGVsZW1lbnRvID0gZXZlbnQuZGV0YWlsLmVsZW07XHJcbiAgICB2YXIgaWRFbGVtZW50byA9IGV2ZW50LmRldGFpbC5pZDtcclxuXHJcbiAgICAvLyBJbXByaW1lIHRvZG9zIGxvcyBhdHJpYnV0b3MgZGVsIGVsZW1lbnRvXHJcbiAgICB2YXIgYXRyaWJ1dG9zRWxlbWVudG8gPSBlbGVtZW50by5hdHRyaWJ1dGVzO1xyXG4gICAgY29uc29sZS5sb2coJ0F0cmlidXRvcyBkZWwgZWxlbWVudG8gY29uIElEJywgaWRFbGVtZW50byk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0cmlidXRvc0VsZW1lbnRvLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub21icmVBdHJpYnV0byA9IGF0cmlidXRvc0VsZW1lbnRvW2ldLm5hbWU7XHJcbiAgICAgIHZhciB2YWxvckF0cmlidXRvID0gYXRyaWJ1dG9zRWxlbWVudG9baV0udmFsdWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdBdHJpYnV0bzonLCBub21icmVBdHJpYnV0bywgJ1ZhbG9yOicsIHZhbG9yQXRyaWJ1dG8pO1xyXG4gICAgICBpZihub21icmVBdHJpYnV0byA9PT0gJ2ludGVycnVwdG9yX3RleHRvJyl7XHJcbiAgICAgICAgZWxlbWVudG8uc2NlbmVFbC5lbWl0KCdkZXNhY3RpdmFyVGV4dG9Tb25pZG8nKTtcclxuICAgICAgICB2YXIgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHRvQWN0aXZhclNvbmlkbycpXHJcbiAgICAgICAgbGV0IGF1ZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGUuY29tcG9uZW50cy5zb3VuZC5hdHRyVmFsdWUuc3JjKTtcclxuICAgICAgICBhdWRpby5wYXVzZSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdIRSBERVNBQ1RJVkFETyBBVURJTycpO1xyXG4gICAgICAgIFxyXG4gICAgICB9ZWxzZSBpZihub21icmVBdHJpYnV0byA9PT0gJ29wYWNpZGFkX2ludGVycnVwdG9yJyl7XHJcbiAgICAgICAgZWxlbWVudG8uc2V0QXR0cmlidXRlKCdtYXRlcmlhbCcsICdvcGFjaXR5OiAxJyk7XHJcbiAgICAgIH1lbHNlIGlmKG5vbWJyZUF0cmlidXRvID09PSAnbHV6X2ludGVycnVwdG9yJyl7XHJcbiAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2x1ekNhbGF2ZXJhJyk7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdsaWdodCcsICdpbnRlbnNpdHk6IDAnKTtcclxuICAgICAgfWVsc2UgaWYobm9tYnJlQXRyaWJ1dG8gPT09ICdpbnRlcnJ1cHRvcl92aWRlbycpe1xyXG4gICAgICAgIHZhciBlbGVtVmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW9FbGVmYW50ZScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQQVJPIFZJREVPJyk7XHJcbiAgICAgICAgbGV0IHZpZGVvID0gZWxlbVZpZGVvLmNvbXBvbmVudHMubWF0ZXJpYWwubWF0ZXJpYWwubWFwLmltYWdlO1xyXG4gICAgICAgIHZpZGVvLnBhdXNlKCk7XHJcbiAgICAgICAgZWxlbVZpZGVvLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICdmYWxzZScpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXNhY3RpdmFyVGV4dG9Tb25pZG8nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgY29uc3QgYm90b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dG9BY3RpdmFyU29uaWRvJyk7XHJcbiAgICBib3Rvbi5zZXRBdHRyaWJ1dGUoJ3Zpc2libGUnLCAnZmFsc2UnKTtcclxuXHJcblxyXG4gIH0pO1xyXG5cclxuICBBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2NsaWNrYWJsZScsIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGVsID0gdGhpcy5lbDtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYWN0aXZhclRleHRvU29uaWRvJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgY29uc3QgYm90b25BY3RpdmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHRvQWN0aXZhclNvbmlkbycpO1xyXG4gICAgICAgIGJvdG9uQWN0aXZhci5zZXRBdHRyaWJ1dGUoJ3Zpc2libGUnLCAndHJ1ZScpO1xyXG4gICAgICAgIGNvbnN0IHRleHRvQWN0aXZhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0b0FjdGl2YXInKTtcclxuXHJcblxyXG5cclxuICAgICAgICAvLyBBY2NlZGUgYWwgY29tcG9uZW50ZSBkZSBzb25pZG9cclxuICAgICAgICB2YXIgYXVkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsLmNvbXBvbmVudHMuc291bmQuYXR0clZhbHVlLnNyYyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1JBQyBBVURJTyA1NTogJyArIGF1ZGlvKTtcclxuICAgICAgICB2YXIgaXNQbGF5ID0gZmFsc2U7XHJcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0NMSUNDQ0NDQ0NDQ0MnKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2lzUGxheSAnICsgaXNQbGF5KVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiAoaXNQbGF5KSB7XHJcbiAgICAgICAgICAgIGF1ZGlvLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBdWRpbyBwYXVzYWRvJyk7XHJcbiAgICAgICAgICAgIGlzUGxheSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBib3RvbkFjdGl2YXIuc2V0QXR0cmlidXRlKCdjb2xvcicsICdncmVlbicpO1xyXG4gICAgICAgICAgICB0ZXh0b0FjdGl2YXIuc2V0QXR0cmlidXRlKCd2YWx1ZScsICdBY3RpdmFyIHNvbmlkbycpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXVkaW8ucGxheSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQXVkaW8gYWN0aXZhZG8nKTtcclxuICAgICAgICAgICAgaXNQbGF5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgYm90b25BY3RpdmFyLnNldEF0dHJpYnV0ZSgnY29sb3InLCAncmVkJyk7XHJcbiAgICAgICAgICAgIHRleHRvQWN0aXZhci5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ1BhcmFyIHNvbmlkbycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgfVxyXG59KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ3RpZW1wbycsIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ3RoaXMuZWwuaWQgJyArIHRoaXMuZWwuaWQpXHJcbiAgICAgIC8vIEZ1bmNpw7NuIHBhcmEgbW9zdHJhciBlbCB0ZXh0byBjYWRhIDUgc2VndW5kb3MgZHVyYW50ZSAxIHNlZ3VuZG9cclxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIC8vIE11ZXN0cmEgZWwgdGV4dG9cclxuICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICd0cnVlJyk7XHJcblxyXG4gICAgICAgIC8vIE9jdWx0YSBlbCB0ZXh0byBkZXNwdcOpcyBkZSAxIHNlZ3VuZG9cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCd2aXNpYmxlJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgIH0sIDUwMDApO1xyXG4gICAgfSxcclxuXHJcbiAgfSk7IiwicmVxdWlyZSgnLi9jb21wb25lbnRzL2Rpc3RhbmNlJylcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL3RpZW1wbycpXHJcblxyXG4iXSwic291cmNlUm9vdCI6IiJ9