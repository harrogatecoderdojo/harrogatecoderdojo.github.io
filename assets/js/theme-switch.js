const themeButtons = document.querySelectorAll("[data-theme-choice]");

function currentThemeChoice() {
  return document.documentElement.dataset.theme || "system";
}

function showSelectedTheme() {
  const selected = currentThemeChoice();
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === selected));
  });
}

function chooseTheme(choice) {
  if (choice === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = choice;
  }
  try {
    localStorage.setItem("theme", choice);
  } catch (error) {}
  showSelectedTheme();
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => chooseTheme(button.dataset.themeChoice));
});

showSelectedTheme();
