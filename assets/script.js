const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = 1;

window.addEventListener("load",()=>{
    loadMusic(musicIndex);
    playingNow();
})
//load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `assets/img/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `assets/music/${allMusic[indexNumb - 1].src}.mp3`;
}//end
                        //functions 
//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}//end
//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}//end
//next music function
function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
//end
//previous music function
function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
//end

                        //events
playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

nextBtn.addEventListener("click",()=>{
    nextMusic();
});

prevBtn.addEventListener("click",()=>{
    prevMusic();
});

mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime = e.target.currentTime; //current time
    const duration = e.target.duration; // total time
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
    mainAudio.addEventListener("loadeddata",()=>{
        //update total song duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    })
        //update current song duration
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

    //progression based on click
progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth; //progress bar width 320px
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration; //total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    // playMusic();
});

                             //repeat shuffle
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat": repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title","song looped");
         break;
        case "repeat_one" : repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title","shuffle");
        break;
        case "shuffle" : repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title","Playlist looped");
        break;
    }
});

mainAudio.addEventListener("ended",()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat": nextMusic();break;
        case "repeat_one":
        mainAudio.currentTime = 0 ;
        loadMusic(musicIndex);
        playMusic();break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow()
            ;break;
    }
});


                             //queue list

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="assets/music/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);    
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`); //spans
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`); //audios

    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
    })
}

                        //play songs on queue list
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        if(allLiTags[j].getAttribute("li-index")==musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing"
        }
        allLiTags[j].setAttribute("onclick","clicked(this)");
    }
}

function clicked(element){
    let getIndex = element.getAttribute("li-index");
    musicIndex = getIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}