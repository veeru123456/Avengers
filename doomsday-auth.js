/* Operation Doomsday — shared auth + progress helper.
   No real backend: this stores a callsign in localStorage and
   namespaces checklist progress under that name, in this browser only. */
(function () {
  const AGENT_KEY = "doomsday_agent";

  function getAgent() {
    return localStorage.getItem(AGENT_KEY);
  }

  function setAgent(name) {
    localStorage.setItem(AGENT_KEY, name);
  }

  function requireAgent() {
    const agent = getAgent();
    if (!agent) {
      window.location.href = "login.html";
      return null;
    }
    return agent;
  }

  function logout() {
    localStorage.removeItem(AGENT_KEY);
    window.location.href = "login.html";
  }

  function progressKey(pageKey) {
    const agent = getAgent() || "guest";
    return `doomsday_progress_${agent}_${pageKey}`;
  }

  function loadProgress(pageKey) {
    try {
      return JSON.parse(localStorage.getItem(progressKey(pageKey)) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveProgress(pageKey, itemId, checked) {
    const data = loadProgress(pageKey);
    data[itemId] = checked;
    localStorage.setItem(progressKey(pageKey), JSON.stringify(data));
  }

  function renderAgentBadge(mountEl) {
    const agent = getAgent();
    if (!agent || !mountEl) return;
    mountEl.innerHTML = `
      <span class="agent-name">AGENT: ${agent.toUpperCase()}</span>
      <button class="agent-logout" type="button">Log out</button>
    `;
    mountEl.querySelector(".agent-logout").addEventListener("click", logout);
  }

  window.DoomsdayAuth = {
    getAgent,
    setAgent,
    requireAgent,
    logout,
    loadProgress,
    saveProgress,
    renderAgentBadge,
  };
})();
