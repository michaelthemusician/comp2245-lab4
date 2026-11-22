const form = document.querySelector("#search-form");
const subjectSelect = form.elements.subject;

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
