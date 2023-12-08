const displayAscii = "#&%!*+-"
const displayNotes = "ABCDEFG"

var scales = {
    "C": ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    "G": ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'],
    "D": ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'],
    "A": ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'],
    "E": ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#', 'E'],
    "B": ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'],
    "F#": ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#', 'F#'],
    "C#": ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#', 'C#']
}

var keys = ["C", "G", "D", "A", "E", "B", "F#", "C#"]
let octaves = "1234567"

let isDarkMode = false;
let ascii = displayAscii
let key = keys[Math.floor(Math.random()*keys.length)]
let notesArr = scales[key]
Tone.Transport.bpm.value = 90
let octave = "4"

let chords = [['C4', 'E4', 'G4']
            ,['C4', 'E4', 'G4']
            ,['C4', 'E4', 'G4']
            ,['C4', 'E4', 'G4']
            ,['C4', 'E4', 'G4']]

function randomKey() {
    key = keys[Math.floor(Math.random()*keys.length)]
    notesArr = scales[key]
    nn.get('#randomKey').content(key)
}
  
function randomBPM() { 
    const tempo = { min: 90, max: 140 }
    let bpm = nn.randomInt(tempo.min, tempo.max)
    Tone.Transport.bpm.value = bpm
    nn.get('#BPM').content(bpm)
}

function randomOctave() {
    let octaveIdx = Math.floor(Math.random()*octaves.length)
    octave = octaves[octaveIdx]
    let visualSymbol = displayAscii[octaveIdx]
    nn.get("#asciiKey").content(visualSymbol)
}

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
let c = 0

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

            let ySelect = floor(map(mouseY, 0, windowHeight, 0, 50))

            if (j == ySelect && i == s
                || (ySelect <= 0 && j == 0 && i == s)
                || (ySelect >= 30 && j == 30 && i == s)
                || (i == c && (j == 5 || j == 15 || j == 25))) {
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
                notes[i] = note + octave;
                } else {
                notes[i] = "C" + octave;
                }            
            } 

            if ((i==0 || (i+1)%16 == 0) && i < 80) {
                let bar = 0
                if ((i+1)%16 == 0) {
                    bar = 5 - (i+1)/16
                }
                if (!note) {
                    note = "C"
                }
                    if (j == 5) {
                        // console.log(chords[bar][0])
                        chords[bar][0] = note + octave
                    } else if (j == 15) {
                        chords[bar][1] = note + octave
                    } else if (j == 25) {
                        chords[bar][2] = note + octave
                    }
            }
        }
    }
}

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
    chordBars: 16
}

function play (time) {
    if (sampler.loaded === false) {
        nn.get('#play').content('play')
        return 
    } else {
        nn.get('#play').content('pause')
    }

    s = state.step % state.totalSteps
    b = state.step % state.chordBars

    if (b == 0) {
        let chordNum = 0
        if (s != 0) {
            chordNum = 5 - s/16
        }
        let chord = chords[chordNum]
        c = s
        sampler.triggerAttackRelease(chord, '1n', time)
    }

    if (notes.length > 0) {
        var note = notes[s]
        sampler.triggerAttackRelease(note, '8n', time)
        state.step++
    }
}

async function start() {
    if (Tone.context.state !== "running") {
        Tone.context.resume();
    }
    if (Tone.Transport.state === 'started') {
        Tone.Transport.stop()
        nn.get('#play').content('play')
    } else {
        Tone.Transport.start()
        nn.get('#play').content('pause')
    }
}

function showPopup() {
    var popup = document.getElementById('popup');
    if (popup.style.display === 'none') {
        popup.style.display = 'block';
        popup.style.animation = "fadeIn 1s"
    } else {
        popup.style.display = 'none';
        popup.style.animation = "fadeOut 1s"
    }
}

Tone.Transport.scheduleRepeat(time => play(time), '8n')
nn.get('#play').on('click', start)
nn.get('#randomKey').on('click', randomKey)
nn.get('#BPM').on('click', randomBPM)
nn.get('#modeChanger').on('click', changeMode)
nn.get("#asciiKey").on('click', randomOctave)
nn.get("#info").on('click', showPopup)