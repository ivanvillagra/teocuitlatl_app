const routes = {
  "/": () => "<h1>Home</h1>",
  "/about": () => "<h1>About</h1>"
};

function router() {
  const path = location.hash.slice(1) || "/";
  const view = routes[path] || (() => "<h1>404</h1>");
  document.getElementById("app").innerHTML = view();
}