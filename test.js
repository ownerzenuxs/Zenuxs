document.addEventListener("DOMContentLoaded", () => {
    const songs = [
        { name: "Yalgaar", file: "/songs/yalgaar.mp3", image: "/logos/yalgaar.jpg" },
    ];

    const player = document.getElementById("player");
    const songName = document.getElementById("songName");
    const audio = document.getElementById("audio");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const progressBar = document.getElementById("progressBar");
    const rightContainer = document.querySelector(".right");
    const cardContainer = document.querySelector(".cardcontainer");
    const menuBtn = document.getElementById("menu-btn");
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
            songItem.textContent = name;

            songItem.addEventListener("click", () => {
                playSong(songSrc, name);
                rightContainer.classList.remove("active"); // Close menu after song selection
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

    // Generate cards from song list
    songs.forEach(song => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-src", song.file);
        card.setAttribute("data-name", song.name);

        const img = document.createElement("img");
        img.src = song.image;
        img.alt = song.name;

        const title = document.createElement("h3");
        title.textContent = song.name;

        card.appendChild(img);
        card.appendChild(title);

        card.addEventListener("click", () => {
            playSong(song.file, song.name);
            addToPlaylist(song.file, song.name);
        });

        cardContainer.appendChild(card);
    });

    // Play/Pause button
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

    audio.addEventListener("timeupdate", () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress || 0;
    });

    progressBar.addEventListener("input", () => {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    // Click outside to stop audio and hide player
    document.addEventListener("click", (e) => {
        const isCard = e.target.closest(".card");
        const isItem = e.target.closest(".song-item");
        const isPlayer = e.target.closest("#player");

        if (!isCard && !isItem && !isPlayer) {
            audio.pause();
            player.style.display = "none";
            playPauseBtn.src = "play.svg";
            isPlaying = false;
        }
    });

    loadPlaylist();

    // ✅ Fix: Menu Toggle (Now Works!)
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent event bubbling
        rightContainer.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
        if (!rightContainer.contains(event.target) && event.target !== menuBtn) {
            rightContainer.classList.remove("active");
        }
    });

    // ✅ Close menu when clicking on a song
    document.querySelectorAll(".song-item").forEach(song => {
        song.addEventListener("click", () => {
            rightContainer.classList.remove("active");
        });
    });
});
