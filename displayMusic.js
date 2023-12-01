const displayAscii = "#&%!*+-"
const displayNotes = "ABCDEFG"

let isDarkMode = false;
let ascii = displayAscii
let notesArr = displayNotes
  
function setup() {
    var canvas = createCanvas(800,498);
    canvas.parent("canvas")
    video = createCapture(VIDEO);
    video.size(80,50);
    video.hide();
}

let notes = new Array(80)

var sharedData = [1]

let s = 0 
let b = 0

function draw() {
    if (isDarkMode) {
        background(0); // Dark background
        color = 'white';
        document.body.style.color = "#ffffff"

        let buttons = document.querySelectorAll("button") 
        buttons.forEach((button) => {
            button.style.color = "#ffffff"
        })
    } else {
        background(255); // Light background
        color = 'black';
        document.body.style.color = "#030303"

        let buttons = document.querySelectorAll("button") 
        buttons.forEach((button) => {
            button.style.color = "#030303"
        })
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
            
            let coordX = i * w + w * 0.5
            let coordY = j * h + h * 0.5

            let ySelect = floor(map(mouseY, 0, windowHeight, 0, 62))

            if (j == ySelect && i == s
                || (ySelect <= 0 && j == 0 && i == s)
                || (ySelect >= 30 && j == 30 && i == s)) {
                color = 'blue'
            } else if (j == ySelect 
                || ySelect <= 0 && j == 0
                || ySelect >= 30 && j == 30) {
                color = 'red' 
            } else if (isDarkMode) {
                color = 'white'
            } else {
                color = 'black'
            }   
     
            fill(color)
            textSize(12)
            let symbol = ascii[charIndex]
            let note = notesArr[charIndex]

            text(symbol, coordX, coordY);
            

            if (j == ySelect) {
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
        ascii = displayAscii.split('').reverse().join('')
        notesArr = displayNotes.split('').reverse().join('')
    } else {
        document.getElementsByTagName("body")[0].style.backgroundColor = "#ffffff"
        ascii = displayAscii
        notesArr = displayNotes
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
    totalSteps: 80,
    chordBars: 10
}

function play (time) {
    if (sampler.loaded === false) {
        nn.get('#play').content('...loading...')
        return 
    } else {
        nn.get('#play').content('pause')
    }

    s = state.step % state.totalSteps
    // b = state.step % state.chordBars

    // if (b == 0) {
    //     const chord = ['C4', 'E4', 'G4']
    //     sampler.triggerAttackRelease(chord, '1n', time)
    // }

    if (notes.length > 0) {
        var note = notes[s]
        sampler.triggerAttackRelease(note, '8n', time)
        state.step++
    }
}

async function start() {
    if (Tone.Transport.state === 'started') {
        Tone.Transport.stop()
        nn.get('#play').content('play')
    } else {
        Tone.Transport.start()
        nn.get('#play').content('pause')
    }
}

Tone.Transport.scheduleRepeat(time => play(time), '8n')
nn.get('#play').on('click', start)