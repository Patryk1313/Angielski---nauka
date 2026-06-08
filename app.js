const studyData = {
    grammar: {
        label: "Grammar / Vocabulary / Skills",
        units: {
            1: "Grammar%20Vocabulary%20Skills/unit%201.txt",
            2: "Grammar%20Vocabulary%20Skills/unit%202.txt",
            3: "Grammar%20Vocabulary%20Skills/unit%203.txt",
            4: "Grammar%20Vocabulary%20Skills/unit%204.txt",
            5: "Grammar%20Vocabulary%20Skills/unit%205.txt",
            6: "Grammar%20Vocabulary%20Skills/unit%206.txt",
        },
    },
    listening: {
        label: "Listening comprehension",
        units: {
            1: "Listening%20comprehension/unit%201.txt",
            2: "Listening%20comprehension/unit%202.txt",
            3: "Listening%20comprehension/unit%203.txt",
            4: "Listening%20comprehension/unit%204.txt",
            5: "Listening%20comprehension/unit%205.txt",
            6: "Listening%20comprehension/unit%206.txt",
        },
    },
    reading: {
        label: "Reading comprehension",
        units: {
            1: "Reading%20comprehension/unit%201.txt",
            2: "Reading%20comprehension/unit%202.txt",
            3: "Reading%20comprehension/unit%203.txt",
            4: "Reading%20comprehension/unit%204.txt",
            5: "Reading%20comprehension/unit%205.txt",
            6: "Reading%20comprehension/unit%206.txt",
        },
    },
};

const categoryOrder = ["grammar", "listening", "reading"];
const unitOrder = [1, 2, 3, 4, 5, 6];

const state = {
    category: "grammar",
    unit: 1,
};

const categoryButtons = document.getElementById("category-buttons");
const unitButtons = document.getElementById("unit-buttons");
const contentCategory = document.getElementById("content-category");
const contentTitle = document.getElementById("content-title");
const contentFrame = document.getElementById("content-frame");
const topMenu = document.querySelector(".top-menu");

function syncMenuHeight() {
    if (!topMenu) {
        return;
    }

    document.documentElement.style.setProperty(
        "--menu-height",
        `${topMenu.offsetHeight}px`,
    );
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function formatNoteContent(rawText) {
    return rawText
        .split("\n")
        .map((line) => {
            const trimmedLine = line.trim();
            const escapedLine = escapeHtml(line);

            if (trimmedLine === "") {
                return '<div class="note-space"></div>';
            }

            if (/^\d+\.\s/.test(trimmedLine)) {
                return `<h3 class="note-section-title">${escapeHtml(trimmedLine)}</h3>`;
            }

            if (trimmedLine.endsWith(":")) {
                return `<div class="note-subtitle">${escapeHtml(trimmedLine)}</div>`;
            }

            if (!escapedLine.includes(" = ")) {
                return `<div class="note-line">${escapedLine}</div>`;
            }

            const parts = escapedLine.split(" = ");

            if (parts.length < 2) {
                return `<div class="note-line">${escapedLine}</div>`;
            }

            const englishPart = parts.slice(0, -1).join(" = ");
            const translationPart = parts.at(-1);

            return `<div class="note-line"><strong>${englishPart}</strong> - ${translationPart}</div>`;
        })
        .join("");
}

function renderCategoryButtons() {
    categoryButtons.innerHTML = "";

    for (const key of categoryOrder) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "select-button";
        button.textContent = studyData[key].label;

        if (state.category === key) {
            button.classList.add("is-active");
        }

        button.addEventListener("click", () => {
            state.category = key;
            render();
        });

        categoryButtons.appendChild(button);
    }
}

function renderUnitButtons() {
    unitButtons.innerHTML = "";

    for (const unit of unitOrder) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "select-button";
        button.textContent = `Unit ${unit}`;

        if (state.unit === unit) {
            button.classList.add("is-active");
        }

        button.addEventListener("click", () => {
            state.unit = unit;
            render();
        });

        unitButtons.appendChild(button);
    }
}

async function renderContent() {
    const currentCategory = studyData[state.category];
    const relativePath = currentCategory.units[state.unit];

    contentCategory.textContent = currentCategory.label;
    contentTitle.textContent = `Unit ${state.unit}`;

    try {
        const response = await fetch(relativePath);

        if (!response.ok) {
            throw new Error(`Nie udalo sie wczytac pliku: ${relativePath}`);
        }

        contentFrame.innerHTML = formatNoteContent(await response.text());
    } catch (error) {
        contentFrame.textContent = error.message;
    }
}

function render() {
    renderCategoryButtons();
    renderUnitButtons();
    syncMenuHeight();
    void renderContent();
}

window.addEventListener("resize", syncMenuHeight);
new ResizeObserver(syncMenuHeight).observe(topMenu);

render();
