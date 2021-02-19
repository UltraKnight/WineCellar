class Sound {
  constructor(src, loop, volume) {
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("controls", "none");
      this.sound.style.display = "none";
      this.sound.loop = loop;
      this.sound.volume = volume;

      document.body.prepend(this.sound);

      this.play = function () {
          this.sound.play();
      };

      this.stop = function () {
          this.sound.pause();
      };
  }
}

let openSound = new Sound('/sounds/open.aac', false, 1);
let achieveSound = new Sound('/sounds/achievement.aac', false, 1);