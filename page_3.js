const button5 = document.getElementById('t3_to_1');
const button6 = document.getElementById('t3_to_2');

button5.onclick = function goto_page1() {
    page3.classList.remove('on');
    page3.classList.add('off');
    page1.classList.remove('off');
    page1.classList.add('on');
}


button6.onclick = function goto_page2() {
    if (page2.classList.contains('off')){
        page2.classList.remove('off');
        page2.classList.add('on');
        page3.classList.remove('on');
        page3.classList.add('off');
    }
}

var c = new AudioContext();
function resume_audio() {
    c.resume();
}
const compressor = c.createDynamicsCompressor();
compressor.connect(c.destination);
const recorder = new Tone.Recorder();
const synth = new Tone.Synth().toDestination().connect(recorder);
const drums = new Tone.Sampler({
	urls: {
		A1: "Snare.mp3",
        A2: "Crash.wav",
        A3: "Ride.wav",
        A4: "Kick.wav"
	},
    baseUrl: "sounds/",
}).toDestination().connect(recorder);
const piano = new Tone.Sampler({
	urls: {
		C1: "Piano_C1.wav",
        C2: "Piano_C2.wav",
        C3: "Piano_C3.wav",
        C4: "Piano_C4.wav",
        C5: "Piano_C5.wav",
	},
    baseUrl: "sounds/",
}).toDestination().connect(recorder);
const brass = new Tone.Sampler({
	urls: {
		C2: "Brass_C2.wav",
        C3: "Brass_C3.wav",
        C4: "Brass_C4.wav",
        C5: "Brass_C5.wav",
	},
    baseUrl: "sounds/",
}).toDestination().connect(recorder);
const strings = new Tone.Sampler({
	urls: {
		C2: "Strings_C2.wav",
        C3: "Strings_C3.wav",
        C4: "Strings_C4.wav",
        C5: "Strings_C5.wav",
	},
    baseUrl: "sounds/",
}).toDestination().connect(recorder);

const listInstrument = [synth, piano, brass, strings, drums];

function selectnote() {
    var nb = parseFloat(document.getElementById("instrument").value[0]);
    var name_note = ['C','D','E','F','G','A','B'];
    $("#menuDeroulant2").empty();
    console.log(nb)
    if (nb==0||nb==1){
        for(var i=1;i<6;i++){
            for(var j=0;j<7;j++){
                var additional_option = document.createElement("option");
                additional_option.appendChild(document.createTextNode(name_note[j]+i));
                additional_option.value = name_note[j]+i;
                document.getElementById('menuDeroulant2').appendChild(additional_option);
            }
        }
    }
    else if (nb==2||nb==3){
        for(var i=2;i<6;i++){
            for(var j=0;j<7;j++){
                var additional_option = document.createElement("option");
                additional_option.appendChild(document.createTextNode(name_note[j]+i));
                additional_option.value = name_note[j]+i;
                document.getElementById('menuDeroulant2').appendChild(additional_option);
            }
        }
    }
    else if (nb==4){
        var nb2 = parseFloat(document.getElementById("instrument").value[2]);
        var additional_option = document.createElement("option");
        additional_option.appendChild(document.createTextNode(' '));
        additional_option.value = 'A'+ nb2; 
        document.getElementById('menuDeroulant2').appendChild(additional_option);    
    }       
}

function cleartnote() {
    var parainstru = document.getElementById("paraNote");
    if(parainstru.classList.contains("ifnoteOn")){
        parainstru.classList.remove('ifnoteOn');
        parainstru.classList.add('ifnoteOff');
    }
    var menuinstru = document.getElementById("menuDeroulant2");
    if(menuinstru.classList.contains("pianoNotesOn")){
        menuinstru.classList.remove('pianoNotesOn');
        menuinstru.classList.add('pianoNotesOff');
    }     
       
}

function playinstrument(note,time) {
    var nb = parseFloat(document.getElementById("instrument").value[0]);
    if(nb>=4) {
        if(note==1) {
            note=1;
        } else {             
            //note = document.getElementById("instrument").value.slice(-2)
            console.log(note);
            console.log(nb)
            listInstrument[nb].triggerAttackRelease(note, time);    
        } 
    }else {
        listInstrument[nb].triggerAttackRelease(note, time);
    }

}

var Sequence_note = [];
var Sequence_measure = [];
var time = 0;
var nb_image = 0;
var playing = 1;
var nb_feature = 0;
let re = 1;
let startTime;


function createSequence(measure) { 
    if(playing==2){
        alert("clear partition first")
    } else {
    time = Math.round(measure);
    playing = 2;
    nb_image = 0;
    } 
}

function addNote(name) {
    let bpm = parseFloat(document.getElementById("bpm").value);//document.getElementById('bpm');
    let beat = Math.round(60*1000/bpm-1); //time of 1 beat
  
    if (name=='quarter_note'){t = beat;}
    else if (name=='half_note') {t = 2*beat;}
    else if (name=='whole_note') {t = 4*beat;}
    else if (name=='eighth_note') {t = 0.5*beat;}
    else if (name=='sixteenth_note') {t = 0.25*beat;}
    note = document.getElementById('menuDeroulant2').value;
  
    if(note=="no_instrument")
    {
        alert("choose an instrument (click on ok)")
    }
    else if (time+1-t<0||playing==1) {
        alert("too many notes");
      } 
    else {
        Sequence_note.push(note);
        Sequence_measure.push(t);
        time = time - t;
        toggleImage(name)
      }
}

function addsilence(name) {
    let bpm = parseFloat(document.getElementById("bpm").value);//document.getElementById('bpm');
    let beat = Math.round(60*1000/bpm-1); //time of 1 pulse
    if (name=='quarter_rest'){t = beat;}
    else if (name=='eighth_rest') {t = beat/2;}
    
    if (time-t<0||playing==1) {
        alert("too many notes");
    } else {
        Sequence_note.push(1);
        Sequence_measure.push(t);
        time = time - t;
        toggleImage(name)
    }
}

function ListenSequence(index) {
    loop = Sequence_measure.length
    playinstrument(Sequence_note[index], Sequence_measure[index]/1000-0.1, Sequence_measure[index]/1000-0.05);
    follow_rythme(index,loop)
    setTimeout(()=>ListenSequence((index+1)), Sequence_measure[index]);    
}

function RecordSequence(index) {
    if (playing==2) {
        if (re==1) {
            recorder.start();
            startTime = Date.now();
            console.log(startTime)
            re = 2;
        }
        loop = Sequence_measure.length
        playinstrument(Sequence_note[index%loop], Sequence_measure[index%loop]/1000-0.1, Sequence_measure[index%loop]/1000-0.05);
        follow_rythme(index%loop,loop)
        setTimeout(()=>RecordSequence((index+1)%loop), Sequence_measure[index%loop]);
    }
}

var savecomp;
async function stop_recording() {
    const recording = await recorder.stop();
    let blobrecorder = new Blob([recording], {type: "audio.mp3"});
    let duration = Date.now() - startTime
    console.log(Date.now)
    console.log(duration)
    blobfixed = ysFixWebmDuration(blobrecorder, duration, {logger:false});
    console.log(blobfixed)
    let blobaudio = blobfixed.then((value) => {
        console.log(value);
        savecomp = value;
        return value;
    });
    setTimeout(()=>save_recording(),400);
    cleartnote();
}

function save_recording() {
    let newdiv = document.createElement("div");
    let url = URL.createObjectURL(savecomp);

    newdiv.setAttribute("id", "feature"+nb_feature);
    newdiv.setAttribute("data-href", url);
    let rhythmContainer = document.getElementById("addrhythm");
    rhythmContainer.appendChild(newdiv);
    re = 1;
    nb_feature = nb_feature + 1;
    clear_partition();

    console.log(url);
}

function toggleImage(img_note) {
    let imageContainer = document.getElementById("imageContainer");
    let existingImage = document.getElementById("dynamicImage"+nb_image);

    let newImage = document.createElement("img");
    newImage.setAttribute("src", "images/"+img_note+".png");
    newImage.setAttribute("id", "dynamicImage"+nb_image);
    newImage.style.position = "absolute";
    newImage.style.left = 80*(nb_image+1) + "px"; // Position horizontale aléatoire
    newImage.style.top = 240 + "px";  // Position verticale aléatoire
    newImage.style.height = 90 + "px";
    newImage.style.width = 40 + "px";
    nb_image = nb_image + 1;
    imageContainer.appendChild(newImage);
    imageContainer.classList.add("note2")
    
}

function clear_partition() {
    for (let i = 0; i < nb_image; i++) {
        let imageContainer = document.getElementById("imageContainer");
        let existingImage = document.getElementById("dynamicImage"+i)
        imageContainer.removeChild(existingImage)
    }
    Sequence_note = [];
    Sequence_measure = [];
    nb_image = 0;
    playing=1;
}

function follow_rythme(img_note,loop) {
    let imageContainer = document.getElementById("imageContainer");
    if (img_note==0) {
        let borderImage = document.getElementById("dynamicImage"+(loop-1));
        borderImage.style.border = "red";
    } else {
        let borderImage = document.getElementById("dynamicImage"+(img_note-1));
        borderImage.style.border = "red";
    
    }
    let newBorderImage = document.getElementById("dynamicImage"+img_note);
    newBorderImage.style.border = "red 4px solid";
}

function add_composition() {        
    let namecomp = document.getElementById("composition").value;

    let storageRef = firebase.storage().ref();
    const compositionRef = storageRef.child(`composition/${namecomp}`);  
    compositionRef.put(savecomp);
    
    $('#menuDeroulant1').append($('<option>', {
        value: namecomp,
        text: namecomp,
    }));  

    db.collection("data").doc(namecomp).set({namecomp})
    db.collection("data").doc(namecomp).get().then(
    function (doc) {
        console.log("The saved blob is: ", doc.data().namecomp)
        usedcomp =  doc.data().namecomp
        document.getElementById("successDatabase").innerHTML = "Track successfully added to Database !";
    })    
}   

