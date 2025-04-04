document.addEventListener("DOMContentLoaded", () => {
    const songs = [
        { name: "Yalgaar", file: "/songs/yalgaar.mp3" },
        { name: "Song 2", file: "/songs/song2.mp3" } // Image will be auto-generated
    ];

    const player = document.getElementById("player");
    const songName = document.getElementById("songName");
    const audio = document.getElementById("audio");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const progressBar = document.getElementById("progressBar");
    const rightContainer = document.querySelector(".right");
    const cardContainer = document.querySelector(".cardcontainer");
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
            });

            rightContainer.appendChild(songItem);
            savePlaylist();
        }
    }

    function savePlaylist() {
        const savedSongs = [];
        document.querySelectorAll(".right .song-item").forEach(item => {
            savedSongs.push({ src: item.getAttribute("data-src"), name: item.textContent });
        });
        localStorage.setItem("playlist", JSON.stringify(savedSongs));
    }

    function loadPlaylist() {
        const savedSongs = JSON.parse(localStorage.getItem("playlist") || "[]");
        savedSongs.forEach(song => {
            addToPlaylist(song.src, song.name);
        });
    }

    // Generate song cards
    songs.forEach(song => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-src", song.file);
        card.setAttribute("data-name", song.name);

        // Automatically assign an image if not provided
        const imageSrc = song.image || song.file.replace("/songs/", "/logos/").replace(".mp3", ".jpg");

        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = song.name;
        img.classList.add("song-image"); // Optional class for styling

        // Handle missing images
        img.onerror = () => {
            img.src = "/logos/default.jpg"; // Fallback image
        };

        const title = document.createElement("h3");
        title.textContent = song.name;

        // Append elements to the card
        card.appendChild(img);
        card.appendChild(title);

        // Click event to play song and add to playlist
        card.addEventListener("click", () => {
            playSong(song.file, song.name);
            addToPlaylist(song.file, song.name);
        });

        // Append card to the container
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
});

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const library = document.querySelector(".right");

    menuBtn.addEventListener("click", () => {
        library.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
        if (!library.contains(event.target) && event.target !== menuBtn) {
            library.classList.remove("active");
        }
    });

    document.querySelectorAll(".song-item").forEach(song => {
        song.addEventListener("click", () => {
            library.classList.remove("active");
        });
    });
});
