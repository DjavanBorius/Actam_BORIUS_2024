const button3 = document.getElementById('t2_to_1');
const button4 = document.getElementById('t2_to_3');
var audioduration = 0;
var stoplooping = false;
var loop;

button3.onclick = function goto_page1() {
    page2.classList.remove('on');
    page2.classList.add('off');
    page1.classList.remove('off');
    page1.classList.add('on');
}


button4.onclick = function goto_page3() {
    if (page3.classList.contains('off')){
        page3.classList.remove('off');
        page3.classList.add('on');
        page2.classList.remove('on');
        page2.classList.add('off');
    }
}

var k=0;
var nb_feature_here = 0;        

var multitrack = Multitrack.create(
    [
        {
            id: 0,
        },
        {
            id: 1,
        },
        {
            id: 2,
        },
        {
            id: 3,
        },
        {
            id: 4,
        },
        {
            id: 5,
        },
        {
            id: 6,
        },
        {
            id: 7,
        },
        {
            id: 8,
        },
        {
            id: 9,
        },
        {
            id: 10,
        }, 
    ],
    {
        container: document.querySelector('#container'), // required!
        minPxPerSec: 5, // zoom level
        rightButtonDrag: false, // set to true to drag with right mouse button
        cursorWidth: 5,
        cursorColor: '#D72F21',
        trackBackground: '#2D2D2D',
        trackBorderColor: '#7C7C7C',
        dragBounds: true,
        envelopeOptions: {
          lineColor: 'rgba(255, 0, 0, 0.7)',
          lineWidth: 4,
          //dragPointSize: window.innerWidth < 600 ? 20 : 10,
          dragPointFill: 'rgba(255, 255, 255, 0.8)',
          dragPointStroke: 'rgba(255, 255, 255, 0.3)',
        },
    },
    )

    let looper = true
// Toggle looping with a checkbox
document.querySelector('input[type="checkbox"]').onclick = (e) => {
  looper = e.target.checked
}

const button = document.querySelector('#play');
button.disabled = true;
multitrack.once('canplay', () => {
button.disabled = false
button.onclick = () => {
    if (looper) {
        if(multitrack.isPlaying()) {
            stoplooping = true;
        
        }
        console.log(stoplooping);
        looping();
    } 
    multitrack.isPlaying() ? multitrack.pause() : multitrack.play();
    button.textContent = multitrack.isPlaying() ? 'Pause' : 'Play';
};
})

function looping() {
    multitrack.setTime(0);
    if(stoplooping||(!looper)) {
        console.log('Click again on play');
        clearTimeout(loop);
        return stoplooping = false
    };
    console.log('not working')
    loop = setTimeout(()=>looping(), multitrack.maxDuration*1000-50);
}

function addSonginMultitrack() {   
    resetmultitrack();     
    const selectedFile = fileInput.files[0];
    const SongURL = URL.createObjectURL(selectedFile);
    console.log(SongURL);
    multitrack.addTrack({
        id:k,
        url: SongURL,
        startPosition: 0,
        envelope: false,
        volume: 1,
        draggable: true,
    })
    let audio = new Audio(SongURL);
    audio.addEventListener('loadedmetadata', function() {
        audioduration = audio.duration;
    });
    stoplooping = false;
    k = k+1;
}

function addTrackinMultitrack() {
    track = document.getElementById("feature"+nb_feature_here);
    track_url = track.getAttribute("data-href");
    
    nb_feature_here = nb_feature_here + 1;

    multitrack.addTrack({
        id:k,
        url: track_url,
        startPosition: 0,
        draggable: true,
        envelope: false,
        volume: 0.7,
    });
   
    k = k+1;  
}

function deletetrack() {
    if(multitrack.isPlaying()){
        alert("Pause the track first");
    }else {
    multitrack.addTrack({
        id:k-1,
    })
    k=k-1;
    }
}

function resetmultitrack() {
    multitrack.destroy();
        
    multitrack = Multitrack.create(
        [
            {
                id: 0,
            },
            {
                id: 1,
            },
            {
                id: 2,
            },
            {
                id: 3,
            },
            {
                id: 4,
            },
            {
                id: 5,
            },
            {
                id: 6,
            },
            {
                id: 7,
            },
            {
                id: 8,
            },
            {
                id: 9,
            },
            {
                id: 10,
            }, 
        ],
        {
            container: document.querySelector('#container'), // required!
            minPxPerSec: 3, // zoom level
            rightButtonDrag: false, // set to true to drag with right mouse button
            cursorWidth: 5,
            cursorColor: '#D72F21',
            trackBackground: '#2D2D2D',
            trackBorderColor: '#7C7C7C',
            dragBounds: true,
            envelopeOptions: {
            lineColor: 'rgba(255, 0, 0, 0.7)',
            lineWidth: 4,
            //dragPointSize: window.innerWidth < 600 ? 20 : 10,
            dragPointFill: 'rgba(255, 255, 255, 0.8)',
            dragPointStroke: 'rgba(255, 255, 255, 0.3)',
            },
        },
        )
    
    k=0;
    stoplooping = true;
}

const firebaseConfig = {
    apiKey: "AIzaSyAll9rgWdK94fjfT8IiC5kb2uI3UM5jZGA",
    authDomain: "actamproject-24c89.firebaseapp.com",
    projectId: "actamproject-24c89",
    storageBucket: "actamproject-24c89.appspot.com",
    messagingSenderId: "583595028219",
    appId: "1:583595028219:web:ab7a3a9dce9baa870bca5e"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore()
var usedcomp = '.'
var storageRef = firebase.storage().ref();

// Select the track from Database 
db.collection("data")
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            $('#menuDeroulant1').append($('<option>', {
                value: doc.id,
                text: doc.id,
            }));
    })
})

var trueURL;
function addTrackfromDatabase() {
    // Replace with your Google Cloud Storage details
    var childsong = document.getElementById("menuDeroulant1").value;

    APIurl = firebase.storage().ref().child("composition").child(childsong).getDownloadURL().then((value)=> {
        console.log(value);
        trueURL = value;
        return trueURL;
    });

    
    setTimeout(()=>getURLdatabase(trueURL),1000)
    
}
  
function getURLdatabase(APIurl) {
    fetch(APIurl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Create a link and trigger the download
        url = URL.createObjectURL(blob);
        multitrack.addTrack({
            id:k,
            url: url,
            startPosition: 0,
            draggable: true,
            envelope: false,
            volume: 0.8,
        });
        k = k+1;
      })
      .catch(error => {
        console.error('Error downloading file:', error);
      });
    return trueURL
}


