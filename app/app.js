const Application = function () {
  this.initA4();
  this.tuner = new Tuner(this.a4);
  this.tuner.setVolumeThreshold(0.02); // 0.01–0.05 : filtrage léger
  this.notes = new Notes(".notes", this.tuner);
  this.meter = new Meter(".meter");
  this.frequencyBars = new FrequencyBars(".frequency-bars");

  this.update({
    name: "A",
    frequency: this.a4,
    octave: 4,
    value: 69,
    cents: 0,
  });
};

Application.prototype.initA4 = function () {
  this.$a4 = document.querySelector(".a4 span");
  this.a4 = parseInt(localStorage.getItem("a4")) || 440;
  if (this.$a4) {
    this.$a4.innerHTML = this.a4;
  }
};

Application.prototype.start = function () {
  const self = this;

  this.tuner.onNoteDetected = function (note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        self.update(note);
      } else {
        self.lastNote = note.name;
      }
    }
  };

  swal.fire("Welcome to online tuner!").then(function () {
    self.tuner.init();
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);
  });

  if (this.$a4) {
    this.$a4.addEventListener("click", function () {
      swal
        .fire({ input: "number", inputValue: self.a4 })
        .then(function ({ value: a4 }) {
          if (!parseInt(a4) || a4 === self.a4) {
            return;
          }
          self.a4 = a4;
          self.$a4.innerHTML = a4;
          self.tuner.middleA = a4;
          self.notes.createNotes();
          self.update({
            name: "A",
            frequency: self.a4,
            octave: 4,
            value: 69,
            cents: 0,
          });
          localStorage.setItem("a4", a4);
        });
    });
  }

  const autoToggle = document.querySelector(".auto input");
  if (autoToggle) {
    autoToggle.addEventListener("change", () => {
      this.notes.toggleAutoMode();
    });
  }

  this.updateFrequencyBars();
};

Application.prototype.updateFrequencyBars = function () {
  if (this.tuner.analyser) {
    this.tuner.analyser.getByteFrequencyData(this.frequencyData);
    this.frequencyBars.update(this.frequencyData);
  }
  requestAnimationFrame(this.updateFrequencyBars.bind(this));
};

Application.prototype.update = function (note) {
  this.notes.update(note);
  this.meter.update((note.cents / 50) * 45);
};

const app = new Application();
app.start();
