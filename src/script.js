const audio = new Audio()
const { ipcRenderer } = require('electron');
const playList = []

const iconDir = '../assets/icons/'
const musicDir = '../musics/'

window.onload = () => {
    // DEBUG_CODE
    setMusic('WildWarDance.mp3')
    // Event追加
    document.getElementById('volume').onclick = setMute
    document.getElementById('start_btn').onclick = startOrStop
    showMusic()
}

const startOrStop = () => {
    const btn = document.getElementById('start_btn');
    const icon = {
        play: 'play.png',
        pause: 'pause.png'
    }
    let id
    if ( !audio.src ) {
        alert("楽曲を選択してください")
        return
    }
    if ( audio.paused ) {
        id = setInterval(setProgress, 1000)
        btn.src = iconDir + icon.pause
        audio.play()
    }
    else {
        clearInterval(id)
        btn.src = iconDir + icon.play
        audio.pause();
    }
}

const setMusic = path => {
    audio.src = musicDir + path
    setMusicInfo(path)
}

const setMusicInfo = (title) => {
    const musicTitle = document.getElementById('music_title')
    musicTitle.innerText = title
}

const setVolume = ( volume ) => { audio.volume = volume / 100 }

const setMute = () => {
    volume = document.getElementById('volume')
    volume.src = iconDir + ['mute.png', 'volume.png'][Number(audio.muted)]
    audio.muted = audio.muted ? false : true
}

const setProgress = () => {
    const progress = document.getElementById('play_progress')
    progress.style.width = (audio.currentTime / audio.duration * 100) + '%'
    return progress.value
}


const showMusic = () => {
    const musicFiles = ipcRenderer.sendSync('show-music')
    const musicTBody= document.getElementById('music_tbody')
    musicFiles.forEach( (music) => {
        const row = musicTBody.insertRow(-1)
        const name = row.insertCell(-1)
        const artist = row.insertCell(-1)
        const time = row.insertCell(-1)
        name.innerHTML = '<a href="#">' + music + '</a>'
        artist.innerHTML = 'None'
        time.innerHTML = 'None'
        name.onclick = () => { setMusic(music) }
    })
}
