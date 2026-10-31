import { UMAMI_SCRIPT_SRC, UMAMI_WEBSITE_ID } from "./config.js";

const id = (UMAMI_WEBSITE_ID || "").trim();
if (!id || id === "YOUR_WEBSITE_ID") {
  // No id yet. Skip the script so the page does not request a bad tracker URL.
} else {
  const script = document.createElement("script");
  script.defer = true;
  script.src = UMAMI_SCRIPT_SRC;
  script.dataset.websiteId = id;
  document.head.appendChild(script);
}
