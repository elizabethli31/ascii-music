const ascii = "#&%!*+-"
let isDarkMode = false;

const notes_arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  
function setup() {
  createCanvas(720,450);
  video = createCapture(VIDEO);
  video.size(72,45);
  video.hide();
}

let notes = new Array(72)

var sharedData = [1]

let s = 0 

function draw() {
  if (isDarkMode) {
    background(0); // Dark background
    color = 'white';
  } else {
    background(255); // Light background
    color = 'black';
  }
  
  let w = width / video.width;
  let h = width / video.height;
  video.loadPixels();

  let j;
  let i;
  for (j = 0; j < video.height; j++) {
    for (i = 0; i < video.width; i++) {
      const pixelIndex = (video.width -i + 1 + (j * video.width)) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];
      const avg = (r + g + b) / 3;
      
      fill(avg);

      const len = ascii.length;
      const charIndex = floor(map(avg, 0, 255, 0, len));
      
      textAlign(CENTER,CENTER);
    
      if (j == 15 && i == s) {
        color = 'blue'
      } else if (j == 15) {
        color = 'red' 
      } else {
        color = 'black'
      }

      fill(color);
      let symbol = ascii[charIndex]
      let note = notes_arr[charIndex]
      text(symbol, i * w + w * 0.5, j * h + h * 0.5);

      if (j == 15) {
        if (note) {
          notes[i] = note + "4";
        } else {
          notes[i] = "C4";
        }            
      }
    }
  }
}
  
nn.get('#modeChanger').on('click', changeMode)

function changeMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.getElementsByTagName("body")[0].style.backgroundColor = "#000000"
    } else {
        document.getElementsByTagName("body")[0].style.backgroundColor = "#ffffff"
    }
}

let new_notes = notes.map((note) => note + "4")

/* music section */
const sampler = new Tone.Sampler({
  urls: {
    'A0': 'A0.mp3',
    'C1': 'C1.mp3',
    'D#1': 'Ds1.mp3',
    'F#1': 'Fs1.mp3',
    'A1': 'A1.mp3',
    'C2': 'C2.mp3',
    'D#2': 'Ds2.mp3',
    'F#2': 'Fs2.mp3',
    'A2': 'A2.mp3',
    'C3': 'C3.mp3',
    'D#3': 'Ds3.mp3',
    'F#3': 'Fs3.mp3',
    'A3': 'A3.mp3',
    'C4': 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F#4': 'Fs4.mp3',
    'A4': 'A4.mp3',
    'C5': 'C5.mp3',
    'D#5': 'Ds5.mp3',
    'F#5': 'Fs5.mp3',
    'A5': 'A5.mp3',
    'C6': 'C6.mp3',
    'D#6': 'Ds6.mp3',
    'F#6': 'Fs6.mp3',
    'A6': 'A6.mp3',
    'C7': 'C7.mp3',
    'D#7': 'Ds7.mp3',
    'F#7': 'Fs7.mp3',
    'A7': 'A7.mp3',
    'C8': 'C8.mp3',
  },
  release: 1,
  baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination()

const state = {
step: 0,
totalSteps: 72
}

function play (time) {
    if (sampler.loaded === false) {
        nn.get('#play').content('...loading...')
        return 
    } else {
        nn.get('#play').content('stop')
    }

    // get current step && bar index
    s = state.step % state.totalSteps
    if (notes.length > 0) {
        var note = notes[s]
        sampler.triggerAttackRelease(note, '8n', time)
        state.step++
    }
}

async function start() {
    if (Tone.Transport.state === 'started') {
        Tone.Transport.stop()
        nn.get('#play').content('start')
    } else {
        Tone.Transport.start()
        nn.get('#play').content('stop')
    }
}

Tone.Transport.scheduleRepeat(time => play(time), '8n')
nn.get('#play').on('click', start)