# Actam_BORIUS_2024
Project for the Advanced coding and Methodologies class

Djavan BORIUS 10966816

Advanced Coding Tools and Methodologies Project :
Creative Composer looping

Explanation of the purpose of the project :
This is an MP3/Wav player, where the user can add features to the musical piece selected.
It's a combination of a MP3/Wav multiplayer, a sequencer and a storage.
To make a sequence the user is totally free to choose the length of the notes,
the instruments (in the limit of those accessible on the website) and the pitch.
After a sequence is made the user has the possibility to save his sequence into a storage
and let his personal sequence accessible to other users 

Why is the projetc useful :
The project group 3 things that where never grouped on a website.
Indeed we can see audio players in javascript and sequencer separated but never joined.
So in music creation it's a new website design.

How it was implemented : 
The project use html, CSS and javascript code.
The functions and tools used in the html and CSS codes are basic and the majority was
overlooked during the ACTAM lessons.
On the other hand the scripts in javascript uses functions and functionnalities that 
where studied during lessons. 
For instance we need to know the bpm of the song. As stft in javascript are complexe and
not very efficient I use the code of Curtis Lawrence on codepen : MP3 BPM Detection.
To show and play on the multiplayer we use the Wavesurfer.js (https://wavesurfer.xyz/) library.
For the sequencer we use Tone.js (https://tonejs.github.io/) to create the instruments via recorded notes of these
particular instruments. (all the trakcs of instruments come from https://freewavesamples.com/)
To record the sequence we also use Tone.js, but there has been a big issue with this recorder.
To fix it we need to use the function ysFixWebmDuration (available on github :
https://github.com/yusitnikov/fix-webm-duration).

Challenges :
They were a lot of challenges during this project. 
The main one was finding an efficient recorder. Indeed it exist a lot of recorder in javascript
but mainly using the microphone of the device or something else. A recorder of samples is 
hard to find (until Tone.js was presented). But even after using the Tone.js recorder there 
still was a problem. Indeed the recorder saves the track into a blob file. That causes 
the file to have a duration of infinity. This is a big issue for our multiplayer to work 
properly. So I needed to find a way to fix this problem, and the function ysFixWebmDuration
was it. 
The loop of the multitrack causes some problem but using the library wavesurfer.js I manage 
to find solutions.
Also the storage processes was difficult to learn and use since we only had 1 lesson on 
firestore database but not on firestore storage. And if we want to use sequence of other
user we need to use a storage and not a database. So I had to learn new concepts and
pass these difficulties. 

Video :
video available here https://github.com/DjavanBorius/Actam_BORIUS_2024/blob/main/Actam_Video.mp4 

Website host :
https://djavanborius.github.io/Actam_BORIUS_2024/

PS :
When I started to code I use french notations for the variables. I tried to changed back the names to english.
Some of them might not be changed, I hope you can still understand the code. 
