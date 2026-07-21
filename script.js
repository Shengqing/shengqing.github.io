const data = window.siteData;

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

document.querySelectorAll("[data-content]").forEach((element) => {
  const value = data[element.dataset.content];
  if (value) element.textContent = value;
});

document.querySelectorAll("[data-link]").forEach((element) => {
  const value = data.links[element.dataset.link];
  if (value) element.href = value;
});

document.querySelector('meta[name="description"]').content = data.intro;
document.querySelector('meta[property="og:description"]').content = data.intro;
document.querySelector('meta[property="og:title"]').content = `${data.name} | Graduate Researcher`;

const researchList = document.querySelector("#research-list");
data.research.forEach((item) => {
  const section = createElement("section", "topic-item");
  section.append(createElement("h3", "", item.title));
  section.append(createElement("p", "", item.description));

  const tags = createElement("ul", "inline-list");
  item.tags.forEach((tag) => tags.append(createElement("li", "", tag)));
  section.append(tags);
  researchList.append(section);
});

const projectList = document.querySelector("#project-list");
data.projects.forEach((project) => {
  const article = createElement("article", "project-item");
  const heading = createElement("div", "project-heading");
  heading.append(createElement("h3", "", project.title));
  heading.append(createElement("p", "project-meta", `${project.type} / ${project.year}`));
  article.append(heading);
  article.append(createElement("p", "", project.description));

  const footer = createElement("div", "project-footer");
  const tags = createElement("ul", "inline-list");
  project.tags.forEach((tag) => tags.append(createElement("li", "", tag)));
  footer.append(tags);

  const link = createElement("a", "small-link", `${project.linkLabel} \u2197`);
  link.href = project.link;
  if (project.link === "#") {
    link.setAttribute("aria-disabled", "true");
    link.title = "Add this link in site-data.js";
    link.addEventListener("click", (event) => event.preventDefault());
  } else if (project.link.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  footer.append(link);
  article.append(footer);
  projectList.append(article);
});

const publicationList = document.querySelector("#publication-list");
data.publications.forEach((publication) => {
  const item = createElement("li", "publication-item");
  const citation = createElement("p");
  citation.append(`${publication.authors}. `);

  const title = createElement("a", "publication-title", publication.title);
  title.href = publication.url;
  if (publication.url === "#") {
    title.setAttribute("aria-disabled", "true");
    title.title = "Add this link in site-data.js";
    title.addEventListener("click", (event) => event.preventDefault());
  } else if (publication.url.startsWith("http")) {
    title.target = "_blank";
    title.rel = "noreferrer";
  }

  citation.append(title, `. ${publication.venue} (${publication.year}).`);
  item.append(citation);
  item.append(createElement("span", "publication-note", publication.note));
  publicationList.append(item);
});

const aboutCopy = document.querySelector("#about-copy");
data.about.forEach((paragraph) => aboutCopy.append(createElement("p", "", paragraph)));

const renderTimeline = (selector, items) => {
  const container = document.querySelector(selector);
  items.forEach((item) => {
    const article = createElement("article", "timeline-item");
    article.append(createElement("p", "timeline-period", item.period));
    const body = createElement("div");
    body.append(createElement("h3", "", item.title));
    body.append(createElement("p", "timeline-org", item.organization));
    body.append(createElement("p", "timeline-detail", item.detail));
    article.append(body);
    container.append(article);
  });
};

renderTimeline("#experience-list", data.experience);
renderTimeline("#education-list", data.education);

const sidebarSocials = document.querySelector("#sidebar-socials");
data.socials.forEach((social) => {
  const link = createElement("a", "", social.label);
  link.href = social.linkKey ? data.links[social.linkKey] : social.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  sidebarSocials.append(link);
});

const cvLink = createElement("a", "", "CV");
cvLink.href = data.links.cv;
sidebarSocials.append(cvLink);

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
  link.setAttribute("aria-disabled", "true");
  link.title = "Add this link in site-data.js";
});

const routeTitles = {
  research: `Research | ${data.name}`,
  about: `About | ${data.name}`,
};

const getRoute = () => {
  const route = window.location.hash.replace(/^#\/(\.\/)?/, "").split("/")[0];
  return route === "about" ? "about" : "research";
};

const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebarScrim = document.querySelector(".sidebar-scrim");

const closeSidebar = () => {
  document.body.classList.remove("sidebar-open");
  sidebarToggle.setAttribute("aria-expanded", "false");
};

const renderRoute = () => {
  const route = getRoute();
  document.body.className = `route-${route}`;
  document.querySelectorAll("[data-route]").forEach((view) => {
    view.hidden = view.dataset.route !== route;
  });
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    const active = link.dataset.routeLink === route;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.title = routeTitles[route];
  closeSidebar();
  window.scrollTo(0, 0);
};

sidebarToggle.addEventListener("click", () => {
  const open = !document.body.classList.contains("sidebar-open");
  document.body.classList.toggle("sidebar-open", open);
  sidebarToggle.setAttribute("aria-expanded", String(open));
});

sidebarScrim.addEventListener("click", closeSidebar);
window.addEventListener("hashchange", renderRoute);
renderRoute();
