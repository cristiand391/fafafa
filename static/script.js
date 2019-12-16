const url = "/api/notes";

const form = document.querySelector("form");

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = e.target.children[0].value;
  const note = e.target.children[1].value;

  addNote({ title, note });

  e.target.children[0].value = "";
  e.target.children[1].value = "";
});

async function showNotes() {
  let res = await fetch(url);
  let notes = await res.json();

  const notesContainer = document.querySelector(".notes-container");

  if (notesContainer.childElementCount != 0) {
    [...notesContainer.childNodes].forEach(note => note.remove());
  }

  notes.forEach(nota => {
    let card = document.createElement("note-card");
    card.setAttribute("id", nota._id);

    let title = document.createElement("span");
    title.setAttribute("slot", "title");
    title.textContent = nota.title;

    let note = document.createElement("span");
    note.setAttribute("slot", "note");
    note.textContent = nota.note;

    let editBtn = card.shadowRoot.children[1].children[2];
    editBtn.addEventListener("click", editNote);

    let deleteBtn = card.shadowRoot.children[1].children[3];
    deleteBtn.addEventListener("click", deleteNote);

    card.append(title);
    card.append(note);

    notesContainer.append(card);
  });
}

async function addNote(note) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });

  showNotes();
}

async function deleteNote(e) {
  const card = e.target.parentElement.parentNode.host;
  const id = card.getAttribute("id");

  try {
    let res = await fetch(url, {
      method: "DELETE",
      headers: { id }
    });

    let { deleted } = await res.json();

    if (deleted) {
      card.remove();
    } else {
      alert(
        "It wasn't possible to delete this note, please try again later :)"
      );
    }
  } catch (e) {
    console.error(e);
    alert("It wasn't possible to delete this note, please try again later :)");
  }
}

async function editNote(e) {
  const card = e.target.parentElement.parentNode.host;
  const id = card.getAttribute("id");

  const titleInput = document.createElement("input");
  const noteInput = document.createElement("input");

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Confirm";

  confirmBtn.addEventListener("click", e => {
    const title = titleInput.value;
    const note = noteInput.value;

    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", id },
      body: JSON.stringify({ title, note })
    });

    showNotes();
  });

  card.shadowRoot.children[1].append(titleInput);
  card.shadowRoot.children[1].append(noteInput);
  card.shadowRoot.children[1].append(confirmBtn);
}

showNotes();
