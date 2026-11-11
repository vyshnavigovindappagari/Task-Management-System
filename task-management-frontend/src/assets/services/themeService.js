
export const getSavedTheme = () => {
  return localStorage.getItem("taskflow-theme") || "light";
};

export const saveTheme = (theme) => {
  localStorage.setItem("taskflow-theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
};
