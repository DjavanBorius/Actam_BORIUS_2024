
class AudioParser {
    constructor() {
        this.debug_enable = true;
        this.playing = false;
        this.tick = 0;
        this.loaded = false;

        // Audio API
        // this._setupAudioAPI();

        // file readers
        this.fileReader = new FileReader();
        this.fileReader.onload = e => this._fileLoaded(e);
    }

    debug(...msg) {
        if (this.debug_enable) {
            console.log(...msg);
        }
    }

    /**
     * Read from file
     *
     * @param file File object to pares
     */
    readFile(file) {
        this.file = file;

        this.debug("reading file", file.name);
        SongName = file.name;
        
        this.loaded = false;
        this.fileReader.readAsArrayBuffer(file);
    }

    decodeAudioData(data) {
        this.debug("Decoding Audio");
        this._setupAudioAPI();
        this._createSourceNodes();
        this._setupAudioNodes();
        this._setupOfflineContext();

        this.offlineContext.decodeAudioData(data, buffer => {
            if (!buffer) {
                console.warn("Failed to decode audio, buffer null");
                return;
            }

            this.sourceNode.buffer = buffer;
            this.offlineSourceNode.buffer = buffer;
            this.offlineSourceNode.start(0);
            this.offlineContext.startRendering();
        });
    }

    /**
     * Get the BPM of the current data set
     * @param data Array of byte data 0 left and 1 right channel
     */
    getBPM(data) {
        let partSize = 22050,
            parts = data[0].length / partSize,
            peaks = [];

        for (let i = 0; i < parts; i++) {
            let max = 0;
            for (let j = i * partSize; j < (i + 1) * partSize; j++) {
                let volume = Math.max(
                    Math.abs(data[0][j]),
                    Math.abs(data[1][j])
                );
                if (!max || volume > max.volume) {
                    max = {
                        position: j,
                        volume: volume
                    };
                }
            }
            peaks.push(max);
        }

        peaks.sort((a, b) => {
            return b.volume - a.volume;
        });
        peaks = peaks.splice(0, peaks.length * 0.5);
        peaks.sort((a, b) => {
            return a.position - b.position;
        });

        let groups = [];
        peaks.forEach((peak, index) => {
            for (let i = 1; index + i < peaks.length && i < 10; i++) {
                let group = {
                    bpm:
                        60 *
                        44100 /
                        (peaks[index + i].position - peak.position),
                    count: 1
                };

                while (group.bpm < 90) {
                    group.bpm *= 2;
                }

                while (group.bpm > 180) {
                    group.bpm /= 2;
                }

                group.bpm = Math.round(group.bpm);

                if (
                    !groups.some(interval => {
                        return interval.bpm === group.bpm
                            ? interval.count++
                            : 0;
                    })
                ) {
                    groups.push(group);
                }
            }
        });

        let bpm = groups.sort((intA, intB) => {
            return intB.count - intA.count;
        })[0].bpm;

        this.debug("bpm:", bpm);
        document.getElementById("bpm").setAttribute("value",bpm);
        
        return bpm;
    }

    play() {
        if (this.sourceNode && this.sourceNode.buffer) {
            if (this.playing) {
                this.playing = false;
                this._disconnectSourceNode();
            } else {
                this.playing = true;
                this._connectSourceNode();
                // this.sourceNode.start(0);
            }
        } else {
            this.playing = false;
            this._disconnectSourceNode();
            alert("Audio is not ready");
        }
    }

    /**
     * 1. Audio api contexts and analyser
     */
    _setupAudioAPI() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.offlineContext = new (window.OfflineAudioContext ||
            window.webkitOfflineAudioContext)(2, 30 * 44100, 44100);
        this.offlineContext.oncomplete = e => this._audioDecoded(e);
        this.analyser = this.context.createAnalyser();
    }

    /**
     * 2. Buffers to handle audio stream and pre-parse stream
     */
    _createSourceNodes() {
        this.sourceNode = this.context.createBufferSource();
        this.offlineSourceNode = this.offlineContext.createBufferSource();
    }

    /**
     * 3. Connect source nodes together
     */
    _setupAudioNodes() {
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 2048;

        this.sourceNode.connect(this.analyser);
        this._connectSourceNode();
        this.sourceNode.onended = e => this.onended(e);
    }

    _connectSourceNode() {
        this.sourceNode.connect(this.context.destination);
    }

    _disconnectSourceNode() {
        this.sourceNode.disconnect(this.context.destination);
    }

    /**
     * handle FileReader onload event
     */
    _fileLoaded(e) {
        this.debug("File Loaded");

        this.fileData = this.fileReader.result;
        if (this.fileData) {
            this.loaded = true;
        } else {
            this.loaded = false;
            this.fileData = null;
            console.warn("Unable to load file data");
            return;
        }

        this.decodeAudioData(this.fileData);
    }

    onend() {
        this._disconnectSourceNode();
        this.debug("SourceNode onended");
    }

    /**
     * Offline context used to pre-parse file data
     */
    _setupOfflineContext() {
        // Beats generally occur around the 100 to 150 hz range.
        let lowpass = this.offlineContext.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.settar;
        lowpass.frequency.setValueAtTime(150, 0);
        lowpass.Q.setValueAtTime(1, 0);

        this.offlineSourceNode.connect(lowpass);

        let highpass = this.offlineContext.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.setValueAtTime(100, 0);
        highpass.Q.setValueAtTime(1, 0);
        lowpass.connect(highpass);
        highpass.connect(this.offlineContext.destination);
    }

    /**
     * audio decode complete, we can init
     **/
    _audioDecoded(e) {
        this.debug("Audio decode complete");

        let buffer = e.renderedBuffer;

        this.bpm = this.getBPM([
            buffer.getChannelData(0),
            buffer.getChannelData(1)
        ]);
        // this._init();
    }
}

/** Start the engines! */
var parser = new AudioParser();
var SongName;

/** Allow user to load local file */
document.getElementById("fileInput").addEventListener("change", function(e) {
    var target = e.currentTarget;
    var file = target.files[0]; 
    parser.readFile(file);
});


/*codepen MP3 BPM Detection by Curtis Lawrence*/