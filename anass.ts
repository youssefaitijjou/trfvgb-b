/* --------------------------
   MATCH DATA (DEMO CONTENT)
---------------------------*/

const matches = [
  {
    id: 1,
    league: "Champions League",
    homeTeam: "Man City",
    awayTeam: "Real Madrid",
    homeShort: "MC",
    awayShort: "RM",
    homeAvatar: "orange",
    awayAvatar: "blue",
    score: "2-1",
    minute: "63'",
    kickoff: "20:00",
    tags: ["4K", "Multi-Audio"],
    live: true
  },
  {
    id: 2,
    league: "Premier League",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    homeShort: "ARS",
    awayShort: "LIV",
    score: "-",
    minute: "-",
    kickoff: "22:30",
    tags: ["HD"],
    live: false
  },
  {
    id: 3,
    league: "La Liga",
    homeTeam: "Barcelona",
    awayTeam: "Atletico",
    homeShort: "BAR",
    awayShort: "ATL",
    score: "1-0",
    minute: "45'",
    kickoff: "19:00",
    tags: ["HD", "No Ads"],
    live: true
  },
  {
    id: 4,
    league: "Serie A",
    homeTeam: "Juventus",
    awayTeam: "Inter",
    homeShort: "JUV",
    awayShort: "INT",
    score: "-",
    minute: "-",
    kickoff: "21:15",
    tags: ["4K"],
    live: false
  },
  {
    id: 5,
    league: "Bundesliga",
    homeTeam: "Dortmund",
    awayTeam: "Bayern",
    homeShort: "BVB",
    awayShort: "FCB",
    score: "0-2",
    minute: "71'",
    kickoff: "18:00",
    tags: ["4K", "Multi-Audio"],
    live: true
  }
];


/* --------------------------
   DOM REFERENCES
---------------------------*/

const matchesGrid = document.querySelector("[data-matches]");
const leagueFilter = document.getElementById("leagueFilter");
const searchFilter = document.getElementById("searchFilter");
const liveOnlyToggle = document.getElementById("liveOnlyToggle");

const playerTitle = document.getElementById("playerTitle");
const playerSubtitle = document.getElementById("playerSubtitle");
const playerScore = document.getElementById("playerScore");
const playerTeams = document.getElementById("playerTeams");
const playerMeta = document.getElementById("playerMeta");
const playerBadge = document.getElementById("playerBadge");
const playerTime = document.getElementById("playerTime");

/* --------------------------
   RENDER MATCH CARDS
---------------------------*/

function renderMatches() {
  matchesGrid.innerHTML = "";

  const leagueValue = leagueFilter.value;
  const searchValue = searchFilter.value.toLowerCase();
  const liveOnly = liveOnlyToggle.dataset.active === "true";

  const filtered = matches.filter(m => {
    const matchLeague = leagueValue === "all" || m.league === leagueValue;
    const searchMatch =
      m.homeTeam.toLowerCase().includes(searchValue) ||
      m.awayTeam.toLowerCase().includes(searchValue);

    const liveMatch = !liveOnly || m.live;

    return matchLeague && searchMatch && liveMatch;
  });

  filtered.forEach(match => {
    const card = document.createElement("div");
    card.className = "match-card";
    card.dataset.id = match.id;

    const liveTag = match.live
      ? `<span style="color:#ef4444; font-weight:700;">LIVE</span>`
      : "";

    card.innerHTML = `
      <div class="match-header-row">
        <div class="match-league">
          <span>${match.league}</span>
        </div>
        <div class="match-kickoff">
          ${match.kickoff} <small>${liveTag}</small>
        </div>
      </div>

      <div class="match-main">
        <div class="match-team">
          <div class="match-team-avatar">${match.homeShort}</div>
          <div class="match-team-name">${match.homeTeam}</div>
        </div>

        <div class="match-score-box">
          <div class="match-score">${match.score}</div>
          <div class="match-minute">${match.minute}</div>
        </div>

        <div class="match-team">
          <div class="match-team-avatar match-team-avatar-alt">${match.awayShort}</div>
          <div class="match-team-name">${match.awayTeam}</div>
        </div>
      </div>

      <div class="match-footer">
        <div class="match-tags">
          ${match.tags
            .map(tag => `<div class="match-tag"><strong>${tag}</strong></div>`)
            .join("")}
        </div>

        <button class="match-watch-btn">WATCH</button>
      </div>
    `;

    // Add click event to load match into player
    card.addEventListener("click", () => selectMatch(match.id));

    matchesGrid.appendChild(card);
  });
}

renderMatches();

/* --------------------------
   FILTER FUNCTIONALITY
---------------------------*/

leagueFilter.addEventListener("change", renderMatches);
searchFilter.addEventListener("input", renderMatches);

liveOnlyToggle.addEventListener("click", () => {
  const active = liveOnlyToggle.dataset.active === "true";
  liveOnlyToggle.dataset.active = active ? "false" : "true";
  renderMatches();
});

/* --------------------------
   SELECT MATCH ? Load into Player
---------------------------*/

function selectMatch(id) {
  const selected = matches.find(m => m.id === id);
  if (!selected) return;

  // Remove highlight from other cards
  document
    .querySelectorAll(".match-card")
    .forEach(c => c.removeAttribute("data-selected"));

  // Highlight selected card
  const selectedCard = document.querySelector(`.match-card[data-id="${id}"]`);
  if (selectedCard) selectedCard.dataset.selected = "true";

  // Update player display
  playerTitle.textContent = `${selected.homeTeam} vs ${selected.awayTeam}`;
  playerSubtitle.textContent = `${selected.league} � Kickoff at ${selected.kickoff}`;
  playerScore.textContent = selected.score;
  playerTime.textContent = selected.minute;
  playerMeta.textContent = selected.live ? "Live Now" : "Starting Soon";

  playerTeams.innerHTML = `
    <div class="player-info-team-box">
      <span>Home</span> <strong>${selected.homeTeam}</strong>
    </div>
    <span class="player-info-vs">VS</span>
    <div class="player-info-team-box">
      <span>Away</span> <strong>${selected.awayTeam}</strong>
    </div>
  `;

  playerBadge.innerHTML = selected.live
    ? `<strong>LIVE</strong> � Match Centre`
    : `<strong>UPCOMING</strong> � Preview`;
}

/* --------------------------
   THEME SWITCHER
---------------------------*/

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  themeToggle.textContent =
    document.body.classList.contains("dark-theme") ? "?" : "?";
});

/* --------------------------
   WATCH NOW BUTTON (scroll to player)
---------------------------*/

document.getElementById("ctaWatchNow").addEventListener("click", () => {
  document.getElementById("live").scrollIntoView({ behavior: "smooth" });
});

/* --------------------------
   BURGER MENU (mobile)
---------------------------*/

const burger = document.getElementById("burgerMenu");
const navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  navLinks.style.display =
    navLinks.style.display === "flex" ? "none" : "flex";
});

/* --------------------------
   EXTRA: DYNAMIC RIGHT SIDEBAR
---------------------------*/

const todayList = document.getElementById("todayList");

function renderSidebar() {
  todayList.innerHTML = "";
  matches.forEach(m => {
    const box = document.createElement("div");
    box.className = "today-item";
    box.innerHTML = `
      <div class="today-item-left">
        <strong>${m.homeTeam} vs ${m.awayTeam}</strong>
        <span>${m.league}</span>
      </div>
      <div class="today-item-right">
        <span>${m.kickoff}</span>
        <small>${m.live ? "Live Now" : "Scheduled"}</small>
      </div>
    `;
    todayList.appendChild(box);
  });
}

renderSidebar();

