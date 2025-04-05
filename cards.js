document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.querySelector(".cardcontainer");

    // List of mp3 files manually for now (GitHub/Netlify doesn't allow directory listing)
    const songs = [
        "yalgaar.mp3",
        "song2.mp3"
        // Add more filenames here
    ];

    songs.forEach(fileName => {
        const name = fileName.replace(".mp3", "");
        const image = `logos/${name}.jpg`; // or .png if you use that format
        const filePath = `${name}.mp3`;

        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-src", filePath);
        card.setAttribute("data-name", name);

        const img = document.createElement("img");
        img.src = image;
        img.alt = name;

        const title = document.createElement("h3");
        title.textContent = name;

        card.appendChild(img);
        card.appendChild(title);

        card.addEventListener("click", () => {
            const audio = document.getElementById("audio");
            const songName = document.getElementById("songName");
            const playPauseBtn = document.getElementById("playPauseBtn");
            const player = document.getElementById("player");

            songName.textContent = name;
            audio.src = filePath;
            audio.play();
            playPauseBtn.src = "pause.svg";
            player.style.display = "flex";
        });

        cardContainer.appendChild(card);
    });
});
