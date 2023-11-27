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
      console.log('LLEGO AQUI 1')
      this.frameCount = 0;
      this.framesToSkip = 60;  // Ejecutar cada 60 fotogramas (1 segundo a 60 FPS)
      this.tick();
    },
    // Pasa la función calculateDistance al componente como un método
    calculateDistance: calculateDistance,

    tick: function() {

      // Incrementa el contador de fotogramas
      this.frameCount++;

      if (this.frameCount >= this.framesToSkip) {
        console.log('La función tick se ejecutó');
        var elemPos = this.el.getAttribute('position');
        console.log('Posición del objeto elemPos:', elemPos.x, elemPos.y, elemPos.z);

        var camPosNow = this.data.camera.object3D.position;

        var distanceLimit = this.data.distanceLimit;
        console.log('distanceLimit '+distanceLimit)
        console.log('Posición del objeto camPosNow:', camPosNow.x, camPosNow.y, camPosNow.z);
        // console.log('Posición del objeto prevCamPos FINAL:', this.prevCamPos.x, this.prevCamPos.y, this.prevCamPos.z);
        if (camPosNow.x !== this.prevCamPos.x || camPosNow.y !== this.prevCamPos.y || camPosNow.z !== this.prevCamPos.z) {
          console.log('ME HE MOVIDO')
          var distance = this.calculateDistance(camPosNow,elemPos);
          console.log('distance ' + distance)
              if (distance < distanceLimit) {
                console.log('DISPARO PLAY')
                this.el.sceneEl.emit('cercaObjeto', {elem: this.el, id: this.el.id, distance: distance});
              }

              if (distance >= distanceLimit) {
                console.log("ME ALEJÉ DEL ELEMENTO");
                this.el.sceneEl.emit('lejosObjeto', {elem: this.el, id: this.el.id});
              }
          // Actualiza la posición anterior
          this.prevCamPos.copy(camPosNow)
        }



        // Reinicia el contador de fotogramas
        this.frameCount = 0;
      }

      // Vuelve a programar la ejecución de la función tick para el próximo fotograma
      this.el.sceneEl.renderer.xr.getSession().requestAnimationFrame(this.tick.bind(this));
    //   this.el.sceneEl.renderer.xr.getSession()?.requestAnimationFrame(this.tick.bind(this));


    }

  });

  document.addEventListener('cercaObjeto', function(event) {
    // Accede al elemento y sus atributos desde el evento
    var elemento = event.detail.elem;
    console.log('elemento ' + elemento)
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
      if(nombreAtributo === 'interruptor_texto'){
        elemento.sceneEl.emit('activarTextoSonido');

      }else if(nombreAtributo === 'opacidad_interruptor'){
        console.log('ACTIVO OPACIDAD')
        if(distance >= 12){
            elemento.setAttribute('material', 'opacity: 0.8'); 
          }else if(distance <= 12 && distance > 7 ){
            elemento.setAttribute('material', 'opacity: 0.6'); 
          }else if(distance <= 7 && distance > 5){
            elemento.setAttribute('material', 'opacity: 0.3'); 
          }else{
            elemento.setAttribute('material', 'opacity: 0');
          }
      }else if(nombreAtributo === 'luz_interruptor'){
        console.log('ACTIVO LUZ');
        let el = document.getElementById('luzCalavera');
        el.setAttribute('light', 'intensity: 3');
      }else if(nombreAtributo === 'interruptor_video'){
        console.log('ACTIVO VIDEO');
        var elemVideo = document.getElementById('videoElefante');
        elemVideo.setAttribute('visible', 'true');
        let video = elemVideo.components.material.material.map.image;
        video.play();
      }
    }
  });

  document.addEventListener('lejosObjeto', function(event) {
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
      if(nombreAtributo === 'interruptor_texto'){
        elemento.sceneEl.emit('desactivarTextoSonido');
        var ele = document.getElementById('textoActivarSonido')
        let audio = document.querySelector(ele.components.sound.attrValue.src);
        audio.pause();
        console.log('HE DESACTIVADO AUDIO');
        
      }else if(nombreAtributo === 'opacidad_interruptor'){
        elemento.setAttribute('material', 'opacity: 1');
      }else if(nombreAtributo === 'luz_interruptor'){
        let el = document.getElementById('luzCalavera');
        el.setAttribute('light', 'intensity: 0');
      }else if(nombreAtributo === 'interruptor_video'){
        var elemVideo = document.getElementById('videoElefante');
        console.log('PARO VIDEO');
        let video = elemVideo.components.material.material.map.image;
        video.pause();
        elemVideo.setAttribute('visible', 'false');

        
      }
    }
  });

  document.addEventListener('desactivarTextoSonido', function(event) {
    const boton = document.getElementById('textoActivarSonido');
    boton.setAttribute('visible', 'false');


  });

  AFRAME.registerComponent('clickable', {
    init: function () {
      var el = this.el;
      document.addEventListener('activarTextoSonido', function(event) {

        const botonActivar = document.getElementById('textoActivarSonido');
        botonActivar.setAttribute('visible', 'true');
        const textoActivar = document.getElementById('textoActivar');



        // Accede al componente de sonido
        var audio = document.querySelector(el.components.sound.attrValue.src);
        console.log('RAC AUDIO 55: ' + audio);
        var isPlay = false;
        el.addEventListener('click', function(event) {
          console.log('CLICCCCCCCCCC')
          console.log('isPlay ' + isPlay)
          
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