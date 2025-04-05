document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".cardcontainer");

    fetch("/songs.json")
        .then(response => response.json())
        .then(songs => {
            songs.forEach(song => {
                const filePath = "/" + song.file;

                fetch(filePath)
                    .then(response => response.blob())
                    .then(blob => {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            const arrayBuffer = e.target.result;

                            window.jsmediatags.read(new Blob([arrayBuffer]), {
                                onSuccess: function (tag) {
                                    const { title, artist } = tag.tags;
                                    let songTitle = title || song.file;
                                    let songArtist = artist || "Unknown Artist";

                                    let imageUrl = "/default.jpg"; // fallback
                                    if (tag.tags.picture) {
                                        const picture = tag.tags.picture;
                                        const base64String = btoa(
                                            String.fromCharCode(...picture.data)
                                        );
                                        imageUrl = `data:${picture.format};base64,${base64String}`;
                                    }

                                    const card = document.createElement("div");
                                    card.classList.add("card");

                                    const img = document.createElement("img");
                                    img.src = imageUrl;
                                    img.alt = songTitle;

                                    const h3 = document.createElement("h3");
                                    h3.textContent = songTitle;

                                    const p = document.createElement("p");
                                    p.textContent = songArtist;

                                    card.appendChild(img);
                                    card.appendChild(h3);
                                    card.appendChild(p);

                                    card.addEventListener("click", () => {
                                        const audio = new Audio(filePath);
                                        audio.play();
                                    });

                                    container.appendChild(card);
                                },
                                onError: function (error) {
                                    console.error("Error reading tags: ", error);
                                }
                            });
                        };
                        reader.readAsArrayBuffer(blob);
                    });
            });
        })
        .catch(error => {
            console.error("Failed to load songs.json or mp3 files:", error);
        });
});
