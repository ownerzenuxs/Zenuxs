document.addEventListener("DOMContentLoaded", () => {
    const player = document.getElementById("player");
    const songName = document.getElementById("songName");
    const audio = document.getElementById("audio");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const progressBar = document.getElementById("progressBar");
    const rightContainer = document.querySelector(".right");
    let isPlaying = false;

    function playSong(songSrc, name) {
        songName.textContent = name;
        audio.src = songSrc;
        player.style.display = "flex";
        audio.play();
        playPauseBtn.src = "pause.svg";
        isPlaying = true;
    }

    function addToPlaylist(songSrc, name) {
        if (!rightContainer.querySelector(`.song-item[data-src="${songSrc}"]`)) {
            const songItem = document.createElement("div");
            songItem.classList.add("song-item");
            songItem.setAttribute("data-src", songSrc);
            songItem.setAttribute("data-name", name);
            songItem.textContent = name;

            songItem.addEventListener("click", () => {
                playSong(songSrc, name);
            });

            rightContainer.appendChild(songItem);
            savePlaylist();
        }
    }

    function savePlaylist() {
        const songs = [];
        document.querySelectorAll(".right .song-item").forEach(item => {
            songs.push({ src: item.getAttribute("data-src"), name: item.textContent });
        });
        localStorage.setItem("playlist", JSON.stringify(songs));
    }

    function loadPlaylist() {
        const savedSongs = JSON.parse(localStorage.getItem("playlist") || "[]");
        savedSongs.forEach(song => {
            addToPlaylist(song.src, song.name);
        });
    }

    document.querySelectorAll(".left .card").forEach(card => {
        card.addEventListener("click", function () {
            const songSrc = this.getAttribute("data-src");
            const name = this.getAttribute("data-name");

            playSong(songSrc, name);
            addToPlaylist(songSrc, name);
        });
    });

    playPauseBtn.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.src = "play.svg";
        } else {
            audio.play();
            playPauseBtn.src = "pause.svg";
        }
        isPlaying = !isPlaying;
    });

    audio.addEventListener("ended", () => {
        playPauseBtn.src = "play.svg";
        isPlaying = false;
    });

    // Timeline update
    audio.addEventListener("timeupdate", () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress || 0; // Avoid NaN when song is loading
    });

    // Seek functionality
    progressBar.addEventListener("input", () => {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    // Load saved playlist on page load
    loadPlaylist();
});
