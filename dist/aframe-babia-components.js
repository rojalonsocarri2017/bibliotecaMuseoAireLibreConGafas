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
    this.el.sceneEl.renderer.xr.getSession().requestAnimationFrame(this.tick.bind(this));
    //   this.el.sceneEl.renderer.xr.getSession()?.requestAnimationFrame(this.tick.bind(this));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9kaXN0YW5jZS5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL3RpZW1wby5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6WyJjYWxjdWxhdGVEaXN0YW5jZSIsInBvczEiLCJwb3MyIiwiZGlzdGFuY2VUbyIsIkFGUkFNRSIsInJlZ2lzdGVyQ29tcG9uZW50Iiwic2NoZW1hIiwiY2FtZXJhIiwidHlwZSIsImRlZmF1bHQiLCJkaXN0YW5jZUxpbWl0IiwiaW5pdCIsImNvbnNvbGUiLCJsb2ciLCJwcmV2Q2FtUG9zIiwiVEhSRUUiLCJWZWN0b3IzIiwiY29weSIsImRhdGEiLCJvYmplY3QzRCIsInBvc2l0aW9uIiwiZnJhbWVDb3VudCIsImZyYW1lc1RvU2tpcCIsInRpY2siLCJlbGVtUG9zIiwiZWwiLCJnZXRBdHRyaWJ1dGUiLCJ4IiwieSIsInoiLCJjYW1Qb3NOb3ciLCJkaXN0YW5jZSIsInNjZW5lRWwiLCJlbWl0IiwiZWxlbSIsImlkIiwicmVuZGVyZXIiLCJ4ciIsImdldFNlc3Npb24iLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJiaW5kIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJlbGVtZW50byIsImRldGFpbCIsImNvbXBvbmVudHMiLCJzb3VuZCIsImlkRWxlbWVudG8iLCJhdHJpYnV0b3NFbGVtZW50byIsImF0dHJpYnV0ZXMiLCJpIiwibGVuZ3RoIiwibm9tYnJlQXRyaWJ1dG8iLCJuYW1lIiwidmFsb3JBdHJpYnV0byIsInZhbHVlIiwic2V0QXR0cmlidXRlIiwiZ2V0RWxlbWVudEJ5SWQiLCJlbGVtVmlkZW8iLCJ2aWRlbyIsIm1hdGVyaWFsIiwibWFwIiwiaW1hZ2UiLCJwbGF5IiwiZWxlIiwiYXVkaW8iLCJxdWVyeVNlbGVjdG9yIiwiYXR0clZhbHVlIiwic3JjIiwicGF1c2UiLCJib3RvbiIsImJvdG9uQWN0aXZhciIsInRleHRvQWN0aXZhciIsImlzUGxheSIsInNldEludGVydmFsIiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBLFNBQVNBLGlCQUFULENBQTJCQyxJQUEzQixFQUFpQ0MsSUFBakMsRUFBdUM7QUFDbkMsU0FBT0QsS0FBS0UsVUFBTCxDQUFnQkQsSUFBaEIsQ0FBUDtBQUNEOztBQUdERSxPQUFPQyxpQkFBUCxDQUF5QixVQUF6QixFQUFxQzs7QUFFbkNDLFVBQVE7QUFDTkMsWUFBUSxFQUFFQyxNQUFNLFVBQVIsRUFBb0JDLFNBQVMsRUFBN0IsRUFERjtBQUVOQyxtQkFBZSxFQUFFRixNQUFNLFFBQVIsRUFBa0JDLFNBQVMsRUFBM0I7QUFGVCxHQUYyQjs7QUFPbkNFLFFBQU0sWUFBWTtBQUNsQkMsWUFBUUMsR0FBUixDQUFZLDJDQUFaO0FBQ0VELFlBQVFDLEdBQVIsQ0FBWSxlQUFaO0FB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QixFQUFtQyxLQUFuQztBQUNBZ0IsdUJBQWFoQixZQUFiLENBQTBCLE9BQTFCLEVBQW1DLGNBQW5DO0FBQ0Q7QUFDRixPQWpCRDtBQWtCSCxLQTlCQztBQWdDRDtBQW5DbUMsQ0FBdEMsRTs7Ozs7Ozs7Ozs7QUMvSkZyRCxPQUFPQyxpQkFBUCxDQUF5QixRQUF6QixFQUFtQztBQUMvQk0sUUFBTSxZQUFZO0FBQ2hCQyxZQUFRQyxHQUFSLENBQVksZ0JBQWdCLEtBQUtZLEVBQUwsQ0FBUVUsRUFBcEM7QUFDQTtBQUNBd0MsZ0JBQVksTUFBTTtBQUNoQjtBQUNBLFdBQUtsRCxFQUFMLENBQVFnQyxZQUFSLENBQXFCLFNBQXJCLEVBQWdDLE1BQWhDOztBQUVBO0FBQ0FtQixpQkFBVyxNQUFNO0FBQ2YsYUFBS25ELEVBQUwsQ0FBUWdDLFlBQVIsQ0FBcUIsU0FBckIsRUFBZ0MsT0FBaEM7QUFDRCxPQUZELEVBRUcsSUFGSDtBQUdELEtBUkQsRUFRRyxJQVJIO0FBU0Q7O0FBYjhCLENBQW5DLEU7Ozs7Ozs7Ozs7O0FDQUEsbUJBQU8sQ0FBQyx1REFBdUI7QUFDL0IsbUJBQU8sQ0FBQyxtREFBcUIiLCJmaWxlIjoiYWZyYW1lLWJhYmlhLWNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2luZGV4LmpzXCIpO1xuIiwiZnVuY3Rpb24gY2FsY3VsYXRlRGlzdGFuY2UocG9zMSwgcG9zMikge1xyXG4gICAgcmV0dXJuIHBvczEuZGlzdGFuY2VUbyhwb3MyKTtcclxuICB9XHJcblxyXG5cclxuICBBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2Rpc3RhbmNlJywge1xyXG4gICAgXHJcbiAgICBzY2hlbWE6IHtcclxuICAgICAgY2FtZXJhOiB7IHR5cGU6ICdzZWxlY3RvcicsIGRlZmF1bHQ6ICcnIH0sXHJcbiAgICAgIGRpc3RhbmNlTGltaXQ6IHsgdHlwZTogJ251bWJlcicsIGRlZmF1bHQ6IDEwIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2coJ0VsIGNvbXBvbmVudGUgZGlzdGFuY2Ugc2UgZXN0w6EgZWplY3V0YW5kbycpO1xyXG4gICAgICBjb25zb2xlLmxvZygnRVNUT1kgRU4gSU5JVCcpO1xyXG4gICAgICAvL21lIGhhZ28gdW5hIGNvcGlhIGRlbCB2YWxvciBwb3JxdWUgc2kgbm8gc2UgYWN0dWFsaXphIGF1dG9tYXRpY2FtZW50ZSBwb3JxdWUgYW1iYXMgdmFyaWFibGVzIGFwdW50YW4gYWwgbWlzbW8gb2JqZXRvIGVuIGxhIG1lbW9yaWFcclxuICAgICAgdGhpcy5wcmV2Q2FtUG9zID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5jb3B5KHRoaXMuZGF0YS5jYW1lcmEub2JqZWN0M0QucG9zaXRpb24pO1xyXG4gICAgICBjb25zb2xlLmxvZygnTExFR08gQVFVSSAxJylcclxuICAgICAgdGhpcy5mcmFtZUNvdW50ID0gMDtcclxuICAgICAgdGhpcy5mcmFtZXNUb1NraXAgPSA2MDsgIC8vIEVqZWN1dGFyIGNhZGEgNjAgZm90b2dyYW1hcyAoMSBzZWd1bmRvIGEgNjAgRlBTKVxyXG4gICAgICB0aGlzLnRpY2soKTtcclxuICAgIH0sXHJcbiAgICAvLyBQYXNhIGxhIGZ1bmNpw7NuIGNhbGN1bGF0ZURpc3RhbmNlIGFsIGNvbXBvbmVudGUgY29tbyB1biBtw6l0b2RvXHJcbiAgICBjYWxjdWxhdGVEaXN0YW5jZTogY2FsY3VsYXRlRGlzdGFuY2UsXHJcblxyXG4gICAgdGljazogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAvLyBJbmNyZW1lbnRhIGVsIGNvbnRhZG9yIGRlIGZvdG9ncmFtYXNcclxuICAgICAgdGhpcy5mcmFtZUNvdW50Kys7XHJcblxyXG4gICAgICBpZiAodGhpcy5mcmFtZUNvdW50ID49IHRoaXMuZnJhbWVzVG9Ta2lwKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xhIGZ1bmNpw7NuIHRpY2sgc2UgZWplY3V0w7MnKTtcclxuICAgICAgICB2YXIgZWxlbVBvcyA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdwb3NpdGlvbicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQb3NpY2nDs24gZGVsIG9iamV0byBlbGVtUG9zOicsIGVsZW1Qb3MueCwgZWxlbVBvcy55LCBlbGVtUG9zLnopO1xyXG5cclxuICAgICAgICB2YXIgY2FtUG9zTm93ID0gdGhpcy5kYXRhLmNhbWVyYS5vYmplY3QzRC5wb3NpdGlvbjtcclxuXHJcbiAgICAgICAgdmFyIGRpc3RhbmNlTGltaXQgPSB0aGlzLmRhdGEuZGlzdGFuY2VMaW1pdDtcclxuICAgICAgICBjb25zb2xlLmxvZygnZGlzdGFuY2VMaW1pdCAnK2Rpc3RhbmNlTGltaXQpXHJcbiAgICAgICAgY29uc29sZS5sb2coJ1Bvc2ljacOzbiBkZWwgb2JqZXRvIGNhbVBvc05vdzonLCBjYW1Qb3NOb3cueCwgY2FtUG9zTm93LnksIGNhbVBvc05vdy56KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnUG9zaWNpw7NuIGRlbCBvYmpldG8gcHJldkNhbVBvcyBGSU5BTDonLCB0aGlzLnByZXZDYW1Qb3MueCwgdGhpcy5wcmV2Q2FtUG9zLnksIHRoaXMucHJldkNhbVBvcy56KTtcclxuICAgICAgICBpZiAoY2FtUG9zTm93LnggIT09IHRoaXMucHJldkNhbVBvcy54IHx8IGNhbVBvc05vdy55ICE9PSB0aGlzLnByZXZDYW1Qb3MueSB8fCBjYW1Qb3NOb3cueiAhPT0gdGhpcy5wcmV2Q2FtUG9zLnopIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdNRSBIRSBNT1ZJRE8nKVxyXG4gICAgICAgICAgdmFyIGRpc3RhbmNlID0gdGhpcy5jYWxjdWxhdGVEaXN0YW5jZShjYW1Qb3NOb3csZWxlbVBvcyk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZGlzdGFuY2UgJyArIGRpc3RhbmNlKVxyXG4gICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IGRpc3RhbmNlTGltaXQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdESVNQQVJPIFBMQVknKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLmVtaXQoJ2NlcmNhT2JqZXRvJywge2VsZW06IHRoaXMuZWwsIGlkOiB0aGlzLmVsLmlkLCBkaXN0YW5jZTogZGlzdGFuY2V9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+PSBkaXN0YW5jZUxpbWl0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1FIEFMRUrDiSBERUwgRUxFTUVOVE9cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuZW1pdCgnbGVqb3NPYmpldG8nLCB7ZWxlbTogdGhpcy5lbCwgaWQ6IHRoaXMuZWwuaWR9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBBY3R1YWxpemEgbGEgcG9zaWNpw7NuIGFudGVyaW9yXHJcbiAgICAgICAgICB0aGlzLnByZXZDYW1Qb3MuY29weShjYW1Qb3NOb3cpXHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIC8vIFJlaW5pY2lhIGVsIGNvbnRhZG9yIGRlIGZvdG9ncmFtYXNcclxuICAgICAgICB0aGlzLmZyYW1lQ291bnQgPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBWdWVsdmUgYSBwcm9ncmFtYXIgbGEgZWplY3VjacOzbiBkZSBsYSBmdW5jacOzbiB0aWNrIHBhcmEgZWwgcHLDs3hpbW8gZm90b2dyYW1hXHJcbiAgICAgIHRoaXMuZWwuc2NlbmVFbC5yZW5kZXJlci54ci5nZXRTZXNzaW9uKCkucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuICAgIC8vICAgdGhpcy5lbC5zY2VuZUVsLnJlbmRlcmVyLnhyLmdldFNlc3Npb24oKT8ucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2VyY2FPYmpldG8nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgLy8gQWNjZWRlIGFsIGVsZW1lbnRvIHkgc3VzIGF0cmlidXRvcyBkZXNkZSBlbCBldmVudG9cclxuICAgIHZhciBlbGVtZW50byA9IGV2ZW50LmRldGFpbC5lbGVtO1xyXG4gICAgY29uc29sZS5sb2coJ2VsZW1lbnRvICcgKyBlbGVtZW50bylcclxuICAgIGNvbnNvbGUubG9nKCdzb3VuZCBjb21wb25lbnQ6JywgZWxlbWVudG8uY29tcG9uZW50cy5zb3VuZCk7XHJcbiAgICB2YXIgaWRFbGVtZW50byA9IGV2ZW50LmRldGFpbC5pZDtcclxuICAgIHZhciBkaXN0YW5jZSA9IGV2ZW50LmRldGFpbC5kaXN0YW5jZTtcclxuXHJcbiAgICAvLyBJbXByaW1lIHRvZG9zIGxvcyBhdHJpYnV0b3MgZGVsIGVsZW1lbnRvXHJcbiAgICB2YXIgYXRyaWJ1dG9zRWxlbWVudG8gPSBlbGVtZW50by5hdHRyaWJ1dGVzO1xyXG4gICAgY29uc29sZS5sb2coJ0F0cmlidXRvcyBkZWwgZWxlbWVudG8gY29uIElEJywgaWRFbGVtZW50byk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0cmlidXRvc0VsZW1lbnRvLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub21icmVBdHJpYnV0byA9IGF0cmlidXRvc0VsZW1lbnRvW2ldLm5hbWU7XHJcbiAgICAgIHZhciB2YWxvckF0cmlidXRvID0gYXRyaWJ1dG9zRWxlbWVudG9baV0udmFsdWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdBdHJpYnV0bzonLCBub21icmVBdHJpYnV0bywgJ1ZhbG9yOicsIHZhbG9yQXRyaWJ1dG8pO1xyXG4gICAgICBpZihub21icmVBdHJpYnV0byA9PT0gJ2ludGVycnVwdG9yX3RleHRvJyl7XHJcbiAgICAgICAgZWxlbWVudG8uc2NlbmVFbC5lbWl0KCdhY3RpdmFyVGV4dG9Tb25pZG8nKTtcclxuXHJcbiAgICAgIH1lbHNlIGlmKG5vbWJyZUF0cmlidXRvID09PSAnb3BhY2lkYWRfaW50ZXJydXB0b3InKXtcclxuICAgICAgICBjb25zb2xlLmxvZygnQUNUSVZPIE9QQUNJREFEJylcclxuICAgICAgICBpZihkaXN0YW5jZSA+PSAxMil7XHJcbiAgICAgICAgICAgIGVsZW1lbnRvLnNldEF0dHJpYnV0ZSgnbWF0ZXJpYWwnLCAnb3BhY2l0eTogMC44Jyk7IFxyXG4gICAgICAgICAgfWVsc2UgaWYoZGlzdGFuY2UgPD0gMTIgJiYgZGlzdGFuY2UgPiA3ICl7XHJcbiAgICAgICAgICAgIGVsZW1lbnRvLnNldEF0dHJpYnV0ZSgnbWF0ZXJpYWwnLCAnb3BhY2l0eTogMC42Jyk7IFxyXG4gICAgICAgICAgfWVsc2UgaWYoZGlzdGFuY2UgPD0gNyAmJiBkaXN0YW5jZSA+IDUpe1xyXG4gICAgICAgICAgICBlbGVtZW50by5zZXRBdHRyaWJ1dGUoJ21hdGVyaWFsJywgJ29wYWNpdHk6IDAuMycpOyBcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBlbGVtZW50by5zZXRBdHRyaWJ1dGUoJ21hdGVyaWFsJywgJ29wYWNpdHk6IDAnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfWVsc2UgaWYobm9tYnJlQXRyaWJ1dG8gPT09ICdsdXpfaW50ZXJydXB0b3InKXtcclxuICAgICAgICBjb25zb2xlLmxvZygnQUNUSVZPIExVWicpO1xyXG4gICAgICAgIGxldCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsdXpDYWxhdmVyYScpO1xyXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnbGlnaHQnLCAnaW50ZW5zaXR5OiAzJyk7XHJcbiAgICAgIH1lbHNlIGlmKG5vbWJyZUF0cmlidXRvID09PSAnaW50ZXJydXB0b3JfdmlkZW8nKXtcclxuICAgICAgICBjb25zb2xlLmxvZygnQUNUSVZPIFZJREVPJyk7XHJcbiAgICAgICAgdmFyIGVsZW1WaWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlb0VsZWZhbnRlJyk7XHJcbiAgICAgICAgZWxlbVZpZGVvLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICd0cnVlJyk7XHJcbiAgICAgICAgbGV0IHZpZGVvID0gZWxlbVZpZGVvLmNvbXBvbmVudHMubWF0ZXJpYWwubWF0ZXJpYWwubWFwLmltYWdlO1xyXG4gICAgICAgIHZpZGVvLnBsYXkoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsZWpvc09iamV0bycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAvLyBBY2NlZGUgYWwgZWxlbWVudG8geSBzdXMgYXRyaWJ1dG9zIGRlc2RlIGVsIGV2ZW50b1xyXG4gICAgdmFyIGVsZW1lbnRvID0gZXZlbnQuZGV0YWlsLmVsZW07XHJcbiAgICB2YXIgaWRFbGVtZW50byA9IGV2ZW50LmRldGFpbC5pZDtcclxuXHJcbiAgICAvLyBJbXByaW1lIHRvZG9zIGxvcyBhdHJpYnV0b3MgZGVsIGVsZW1lbnRvXHJcbiAgICB2YXIgYXRyaWJ1dG9zRWxlbWVudG8gPSBlbGVtZW50by5hdHRyaWJ1dGVzO1xyXG4gICAgY29uc29sZS5sb2coJ0F0cmlidXRvcyBkZWwgZWxlbWVudG8gY29uIElEJywgaWRFbGVtZW50byk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0cmlidXRvc0VsZW1lbnRvLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub21icmVBdHJpYnV0byA9IGF0cmlidXRvc0VsZW1lbnRvW2ldLm5hbWU7XHJcbiAgICAgIHZhciB2YWxvckF0cmlidXRvID0gYXRyaWJ1dG9zRWxlbWVudG9baV0udmFsdWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdBdHJpYnV0bzonLCBub21icmVBdHJpYnV0bywgJ1ZhbG9yOicsIHZhbG9yQXRyaWJ1dG8pO1xyXG4gICAgICBpZihub21icmVBdHJpYnV0byA9PT0gJ2ludGVycnVwdG9yX3RleHRvJyl7XHJcbiAgICAgICAgZWxlbWVudG8uc2NlbmVFbC5lbWl0KCdkZXNhY3RpdmFyVGV4dG9Tb25pZG8nKTtcclxuICAgICAgICB2YXIgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHRvQWN0aXZhclNvbmlkbycpXHJcbiAgICAgICAgbGV0IGF1ZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGUuY29tcG9uZW50cy5zb3VuZC5hdHRyVmFsdWUuc3JjKTtcclxuICAgICAgICBhdWRpby5wYXVzZSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdIRSBERVNBQ1RJVkFETyBBVURJTycpO1xyXG4gICAgICAgIFxyXG4gICAgICB9ZWxzZSBpZihub21icmVBdHJpYnV0byA9PT0gJ29wYWNpZGFkX2ludGVycnVwdG9yJyl7XHJcbiAgICAgICAgZWxlbWVudG8uc2V0QXR0cmlidXRlKCdtYXRlcmlhbCcsICdvcGFjaXR5OiAxJyk7XHJcbiAgICAgIH1lbHNlIGlmKG5vbWJyZUF0cmlidXRvID09PSAnbHV6X2ludGVycnVwdG9yJyl7XHJcbiAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2x1ekNhbGF2ZXJhJyk7XHJcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdsaWdodCcsICdpbnRlbnNpdHk6IDAnKTtcclxuICAgICAgfWVsc2UgaWYobm9tYnJlQXRyaWJ1dG8gPT09ICdpbnRlcnJ1cHRvcl92aWRlbycpe1xyXG4gICAgICAgIHZhciBlbGVtVmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW9FbGVmYW50ZScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQQVJPIFZJREVPJyk7XHJcbiAgICAgICAgbGV0IHZpZGVvID0gZWxlbVZpZGVvLmNvbXBvbmVudHMubWF0ZXJpYWwubWF0ZXJpYWwubWFwLmltYWdlO1xyXG4gICAgICAgIHZpZGVvLnBhdXNlKCk7XHJcbiAgICAgICAgZWxlbVZpZGVvLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICdmYWxzZScpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXNhY3RpdmFyVGV4dG9Tb25pZG8nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgY29uc3QgYm90b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dG9BY3RpdmFyU29uaWRvJyk7XHJcbiAgICBib3Rvbi5zZXRBdHRyaWJ1dGUoJ3Zpc2libGUnLCAnZmFsc2UnKTtcclxuXHJcblxyXG4gIH0pO1xyXG5cclxuICBBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2NsaWNrYWJsZScsIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGVsID0gdGhpcy5lbDtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYWN0aXZhclRleHRvU29uaWRvJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgY29uc3QgYm90b25BY3RpdmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHRvQWN0aXZhclNvbmlkbycpO1xyXG4gICAgICAgIGJvdG9uQWN0aXZhci5zZXRBdHRyaWJ1dGUoJ3Zpc2libGUnLCAndHJ1ZScpO1xyXG4gICAgICAgIGNvbnN0IHRleHRvQWN0aXZhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0b0FjdGl2YXInKTtcclxuXHJcblxyXG5cclxuICAgICAgICAvLyBBY2NlZGUgYWwgY29tcG9uZW50ZSBkZSBzb25pZG9cclxuICAgICAgICB2YXIgYXVkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsLmNvbXBvbmVudHMuc291bmQuYXR0clZhbHVlLnNyYyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1JBQyBBVURJTyA1NTogJyArIGF1ZGlvKTtcclxuICAgICAgICB2YXIgaXNQbGF5ID0gZmFsc2U7XHJcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0NMSUNDQ0NDQ0NDQ0MnKVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2lzUGxheSAnICsgaXNQbGF5KVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiAoaXNQbGF5KSB7XHJcbiAgICAgICAgICAgIGF1ZGlvLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBdWRpbyBwYXVzYWRvJyk7XHJcbiAgICAgICAgICAgIGlzUGxheSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBib3RvbkFjdGl2YXIuc2V0QXR0cmlidXRlKCdjb2xvcicsICdncmVlbicpO1xyXG4gICAgICAgICAgICB0ZXh0b0FjdGl2YXIuc2V0QXR0cmlidXRlKCd2YWx1ZScsICdBY3RpdmFyIHNvbmlkbycpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXVkaW8ucGxheSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQXVkaW8gYWN0aXZhZG8nKTtcclxuICAgICAgICAgICAgaXNQbGF5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgYm90b25BY3RpdmFyLnNldEF0dHJpYnV0ZSgnY29sb3InLCAncmVkJyk7XHJcbiAgICAgICAgICAgIHRleHRvQWN0aXZhci5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ1BhcmFyIHNvbmlkbycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgfVxyXG59KTsiLCJBRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ3RpZW1wbycsIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ3RoaXMuZWwuaWQgJyArIHRoaXMuZWwuaWQpXHJcbiAgICAgIC8vIEZ1bmNpw7NuIHBhcmEgbW9zdHJhciBlbCB0ZXh0byBjYWRhIDUgc2VndW5kb3MgZHVyYW50ZSAxIHNlZ3VuZG9cclxuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIC8vIE11ZXN0cmEgZWwgdGV4dG9cclxuICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICd0cnVlJyk7XHJcblxyXG4gICAgICAgIC8vIE9jdWx0YSBlbCB0ZXh0byBkZXNwdcOpcyBkZSAxIHNlZ3VuZG9cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCd2aXNpYmxlJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgIH0sIDUwMDApO1xyXG4gICAgfSxcclxuXHJcbiAgfSk7IiwicmVxdWlyZSgnLi9jb21wb25lbnRzL2Rpc3RhbmNlJylcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL3RpZW1wbycpXHJcblxyXG4iXSwic291cmNlUm9vdCI6IiJ9