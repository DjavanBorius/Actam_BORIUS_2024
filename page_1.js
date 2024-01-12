const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileInput');
const button1 = document.getElementById('1_to_2');
const button2 = document.getElementById('1_to_3');
const para = document.getElementById("text2")
var audioduration = 0;

dropArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileSelect);

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = '#f2f2f2';
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.backgroundColor = 'white';
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = 'white';
    fileInput.files = e.dataTransfer.files;
    handleFileSelect();
});
        

function handleFileSelect() {
    const selectedFile = fileInput.files[0];
    const objectURL = URL.createObjectURL(selectedFile);
    var divname = document.getElementById("SongName");
    var bpmvalue;  ;
    ws.load(objectURL);
    let audio = new Audio(objectURL);
    audio.addEventListener('loadedmetadata', function() {
        audioduration = audio.duration;
    });
    setTimeout(()=>bpmvalue = parseFloat(document.getElementById("bpm").value),2000);
    setTimeout(()=>divname.innerHTML = SongName+' and the BPM is : '+ bpmvalue,2050);
    
    if (playbutton.classList.contains('hide_button')) {
        playbutton.classList.remove('hide_button');
    }   
    if (para.classList.contains('off')) {
        para.classList.remove('off');
        para.classList.add('on');
    }
    
}
        
var playbutton = document.getElementById("playButton")

var ws= WaveSurfer.create({
        container: "#waveform",
        waveColor: "violet",
        progessColor: "purple",
        barWidth: 4,
        height: 90,
        barRadius: 4,
        responsive: true,
});

playbutton.onclick = function() {
    ws.playPause();
    if(playbutton.src.includes("images/play.png")){
        playbutton.src = "images/pause.png";
    }else{
        playbutton.src = "images/play.png";
    }
}

const page1 = document.getElementById('page_1');
const page2 = document.getElementById('page_2');
const page3 = document.getElementById('page_3');

button1.onclick = function goto_page2() {
    page2.classList.remove('off');
    page2.classList.add('on');
    page1.classList.remove('on');
    page1.classList.add('off');
}


button2.onclick = function goto_page3() {
    if (page3.classList.contains('off')){
        page3.classList.remove('off');
        page3.classList.add('on');
        page1.classList.remove('on');
        page1.classList.add('off');
    }
}