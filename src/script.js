const audio = new Audio()
const { ipcRenderer } = require('electron')
const { app, BrowserWindow, dialog } = require('electron').remote

let queue = new Array()

queue.enqueue = (path) => {
    queue.push(path)
    setMusic()
    showQueue()
}

queue.dequeue = () => {
    audio.pause()
    queue.shift()
    setMusic()
    showQueue()
}

const iconDir = '../assets/icons/'
const musicDir = '../musics/'

window.onload = () => {
    // Event追加
    document.getElementById('volume').onclick = setMute
    document.getElementById('start_btn').onclick = startOrStop
    document.getElementById('import_music').onclick = showOpenDialog
    document.getElementById('next_btn').onclick = queue.dequeue
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

const setMusic = () => {
    audio.src = queue[0]
    setMusicInfo(queue[0])
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


const showQueue = () => {
    const queue_list = document.getElementById('queue_list')
    queue_list.innerHTML = ''
    queue.forEach( music => {
        queue_list.innerHTML += '<li><a href="#">'+ music +'</a></li>'
    })
}

const showOpenDialog = flag => {
    const options = {
        title: 'Open Music Files',
        defaultPath: app.getPath('userDesktop'),
        filters: [
            { name: 'Musics', extensions: ['mp3', 'wav', 'm4a']},
        ],
        properties: ['openFile', 'multiSelections', 'createDirectory']
    };
    if(flag){
        let win = BrowserWindow.getFocusedWindow();
        dialog.showOpenDialog(win, options, (filenames) => {
            if (filenames !== undefined) {
                console.log(filenames)
                filenames.forEach((filename) => {
                    console.log(filename)
                    queue.enqueue(filename)
                    setMusic()
                })
            }
        });
    } else {
        dialog.showOpenDialog(options, (filenames) => {
            console.log(filenames)
        });
    }
}
