let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");

  // 1. Fetch and display all toys
  function fetchToys() {
    return fetch("http://localhost:3000/toys")
      .then(res => res.json())
      .then(toys => {
        toys.forEach(toy => addToyCard(toy));
      });
  }

  // 2. Helper function to create a toy card
  function addToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);

    // Add event listener to the like button
    card.querySelector(".like-btn").addEventListener("click", () => {
      updateLikes(toy);
    });
  }

  // 3. Update likes function
  function updateLikes(toy) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(res => res.json())
      .then(updatedToy => {
        // Find the card and update the likes display
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
          if (card.querySelector("h2").textContent === updatedToy.name) {
            card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
          }
        });
      });
  }

  // 4. Form submission handler
  toyFormContainer.addEventListener("submit", function (event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const image = form.image.value;

    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(res => res.json())
      .then(toy => {
        addToyCard(toy);
        form.reset();
      });
  });

  // Toggle form visibility (your existing code)
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Initial fetch of toys when page loads
  fetchToys();
});