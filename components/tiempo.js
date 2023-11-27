AFRAME.registerComponent('tiempo', {
    init: function () {
      console.log('this.el.id ' + this.el.id)
      // Función para mostrar el texto cada 5 segundos durante 1 segundo
      setInterval(() => {
        // Muestra el texto
        this.el.setAttribute('visible', 'true');

        // Oculta el texto después de 1 segundo
        setTimeout(() => {
          this.el.setAttribute('visible', 'false');
        }, 1000);
      }, 5000);
    },

  });