const form = document.querySelector("#search-form");
const subjectSelect = form.elements.subject;
const statusMessage = document.querySelector("#status");
const tbody = document.querySelector("#results tbody");

async function loadSubjects() {
    const response = await fetch("subjects.php");

    // fetch() does not reject on 404 or 500, so check it ourselves
    if (!response.ok) {
        throw new Error(`subjects.php returned ${response.status}`);
    }

    const subjects = await response.json();

    for (const subject of subjects) {
        const option = document.createElement("option");
        option.value = subject.id;
        option.textContent = subject.name;
        subjectSelect.appendChild(option);
    }
}

loadSubjects().catch((error) => console.error(error));



async function loadBooks() {
    const params = new URLSearchParams(new FormData(form));
    const response = await fetch(`books.php?${params}`);

    if (!response.ok) {
        throw new Error(`books.php returned ${response.status}`);
    }

    const books = await response.json();

    tbody.replaceChildren();

    for (const book of books) {
        const row = document.createElement("tr");

        const values = [
            book.title,
            book.author,
            book.year,
            book.subject,
            `${book.available} of ${book.copies}`,
        ];

        for (const value of values) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        }

        // No copies on the shelf: show the last cell in red
        if (book.available === 0) {
            row.lastElementChild.classList.add("out");
        }

        tbody.appendChild(row);
    }

    if (books.length === 0) {
        statusMessage.textContent = "No books match your search.";
    } else if (books.length === 1) {
        statusMessage.textContent = "1 book found.";
    } else {
        statusMessage.textContent = `${books.length} books found.`;
    }
}
s
const searchButton = form.querySelector("button");

async function search() {
    searchButton.disabled = true;
    statusMessage.textContent = "Searching…";

    try {
        await loadBooks();
        searchButton.disabled = false;
    } catch (error) {
        console.error(error);
        tbody.replaceChildren();
        statusMessage.textContent = "Couldn't load the books. Please try again.";
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
});

form.elements.subject.addEventListener("change", search);
form.elements.available.addEventListener("change", search);

search();
