document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".cardcontainer");

  fetch("/songs.json")
    .then(res => res.json())
    .then(songs => {
      songs.forEach(song => {
        const filePath = `/${song.file}`;
        fetch(filePath)
          .then(res => res.blob())
          .then(blob => {
            jsmediatags.read(blob, {
              onSuccess: tag => {
                const { title, artist, picture } = tag.tags;
                const songTitle = title || song.file.replace(".mp3", "");
                const songArtist = artist || "Unknown Artist";

                let imageUrl = "/default.jpg"; // fallback
                if (picture) {
                  const base64String = btoa(String.fromCharCode(...picture.data));
                  imageUrl = `data:${picture.format};base64,${base64String}`;
                }

                const card = document.createElement("div");
                card.className = "card";

                card.innerHTML = `
                  <img src="${imageUrl}" alt="${songTitle}" />
                  <h3>${songTitle}</h3>
                  <p>${songArtist}</p>
                  <audio controls src="${filePath}"></audio>
                `;

                container.appendChild(card);
              },
              onError: err => {
                console.error("Tag read error:", err);
              }
            });
          })
          .catch(err => console.error("MP3 fetch error:", err));
      });
    })
    .catch(err => console.error("songs.json error:", err));
});
