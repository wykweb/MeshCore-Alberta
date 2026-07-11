(() => {
  const form = document.getElementById("community-submission-form");
  if (!form) return;

  const preview = document.getElementById("submission-preview");
  const status = document.getElementById("submission-status");
  const copyButton = document.getElementById("copy-submission");
  const githubLink = document.getElementById("open-github-submission");
  const issueEndpoint = "https://github.com/MeshCore-ca/MeshCore-Canada/issues/new";
  let preparedText = "";

  const fieldValue = (id) => document.getElementById(id).value.trim();

  const optionalSection = (heading, value, fallback = "Not provided") =>
    `## ${heading}\n\n${value || fallback}`;

  function submissionData() {
    return {
      category: fieldValue("submission-category"),
      experience: fieldValue("submission-experience"),
      summary: fieldValue("submission-summary"),
      region: fieldValue("submission-region"),
      need: fieldValue("submission-need"),
      idea: fieldValue("submission-idea"),
      context: fieldValue("submission-context"),
      followUp: fieldValue("submission-follow-up")
    };
  }

  function buildSubmission(data) {
    return [
      `# ${data.summary}`,
      optionalSection("Contribution type", data.category),
      optionalSection("MeshCore experience", data.experience),
      optionalSection("City or broad region", data.region),
      optionalSection("What I am trying to do / what is difficult", data.need),
      optionalSection("What would make it better", data.idea),
      optionalSection("Additional context", data.context),
      optionalSection("Public follow-up contact", data.followUp, "Please reply in the submission thread."),
      "---\n\n_Prepared with the MeshCore Canada community submission helper._"
    ].join("\n\n");
  }

  function buildGithubUrl(data) {
    const params = new URLSearchParams({
      template: "community_idea.yml",
      title: `[Community idea] ${data.summary}`,
      category: data.category,
      experience: data.experience,
      summary: data.summary,
      region: data.region,
      need: data.need,
      idea: data.idea,
      context: data.context,
      follow_up: data.followUp
    });

    return `${issueEndpoint}?${params.toString()}`;
  }

  function markUnprepared() {
    preparedText = "";
    copyButton.disabled = true;
    githubLink.href = "#";
    githubLink.classList.add("is-disabled");
    githubLink.setAttribute("aria-disabled", "true");
    preview.hidden = true;
    status.textContent = "Changes have not been prepared yet.";
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand("copy");
    helper.remove();
    if (!copied) throw new Error("Browser copy command failed");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = submissionData();
    preparedText = buildSubmission(data);
    preview.textContent = preparedText;
    preview.hidden = false;

    copyButton.disabled = false;
    githubLink.href = buildGithubUrl(data);
    githubLink.classList.remove("is-disabled");
    githubLink.setAttribute("aria-disabled", "false");
    status.textContent = "Submission prepared. Review it below, then copy it or continue on GitHub.";
    preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  form.addEventListener("input", () => {
    if (preparedText) markUnprepared();
  });

  copyButton.addEventListener("click", async () => {
    if (!preparedText) return;
    try {
      await copyText(preparedText);
      status.textContent = "Copied. You can paste the submission into the forum or Discord.";
    } catch (_error) {
      status.textContent = "Copy was blocked by the browser. Select the preview text and copy it manually.";
    }
  });

  githubLink.addEventListener("click", (event) => {
    if (githubLink.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      status.textContent = "Prepare the submission before continuing to GitHub.";
    }
  });
})();
