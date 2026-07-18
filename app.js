// PrepMaster - Study Planner Application Engine

class StudyPlannerApp {
  constructor() {
    this.initDatabase();
    this.initCalendarState();
    this.bindEvents();
    
    // Initial Render
    this.switchTab("dashboard");
    this.renderDSATopics();
    this.renderMERNRoadmap();
    this.updateCalendar();
    this.renderSystemDesign();
    this.renderBehavioralCards();
    this.renderMockHistory();
    this.renderNotesSidebar();
    
    // Run initial stat recalculation
    this.updateStats();
    this.checkStreak();
  }

  // State initialization and database fallback
  initDatabase() {
    // Retrieve or set default local storage data
    this.state = {
      dsaSolved: JSON.parse(localStorage.getItem("sp_dsa_solved")) || {},
      dsaNotes: JSON.parse(localStorage.getItem("sp_dsa_notes")) || {},
      mernMilestones: JSON.parse(localStorage.getItem("sp_mern_milestones")) || {},
      loggedHours: JSON.parse(localStorage.getItem("sp_logged_hours")) || {},
      calendarEvents: JSON.parse(localStorage.getItem("sp_calendar_events")) || {},
      starBehaviors: JSON.parse(localStorage.getItem("sp_star_behaviors")) || [],
      mockHistory: JSON.parse(localStorage.getItem("sp_mock_history")) || [],
      generalNotes: JSON.parse(localStorage.getItem("sp_general_notes")) || {},
      streak: parseInt(localStorage.getItem("sp_streak")) || 0,
      lastActiveDate: localStorage.getItem("sp_last_active_date") || ""
    };
    
    // Core database from data.js
    this.data = window.STUDY_PLANNER_DATA || { dsa: [], mern: [], systemDesign: [], mockInterviews: [] };
    
    // Active states
    this.activeTab = "dashboard";
    this.activeDSATopic = this.data.dsa[0] ? this.data.dsa[0].id : null;
    this.activeNoteTopic = "general";
    
    // Mock simulation state
    this.mockTimerInterval = null;
    this.mockSecondsRemaining = 0;
    this.activeMockSession = null;
  }

  initCalendarState() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth(); // 0-indexed
    this.selectedDateStr = this.formatDateStr(today);
  }

  // Event bindings
  bindEvents() {
    // Sidebar Tabs
    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", () => {
        this.switchTab(item.dataset.tab);
      });
    });

    // DSA Search & Filters
    document.getElementById("dsa-search-input").addEventListener("input", () => this.renderDSAProblems());
    document.getElementById("dsa-difficulty-filter").addEventListener("change", () => this.renderDSAProblems());
    document.getElementById("dsa-status-filter").addEventListener("change", () => this.renderDSAProblems());

    // Calendar navigation
    document.getElementById("prev-month-btn").addEventListener("click", () => this.changeMonth(-1));
    document.getElementById("next-month-btn").addEventListener("click", () => this.changeMonth(1));

    // Calendar events
    document.getElementById("open-event-modal-btn").addEventListener("click", () => this.toggleModal("add-event-modal", true));
    document.getElementById("close-event-modal-btn").addEventListener("click", () => this.toggleModal("add-event-modal", false));
    document.getElementById("add-event-form").addEventListener("submit", (e) => this.handleSaveEvent(e));
    
    // Hour Logger
    document.getElementById("log-hours-submit-btn").addEventListener("click", () => this.handleLogHours());

    // Prep Hub sub-tabs
    document.querySelectorAll(".prep-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".prep-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".prep-subpanel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(`subtab-${btn.dataset.subtab}`).classList.add("active");
      });
    });

    // Behavioral Form
    document.getElementById("star-builder-form").addEventListener("submit", (e) => this.handleSaveBehavior(e));

    // Mock Simulator
    document.getElementById("mock-start-session-btn").addEventListener("click", () => this.startMockInterview());
    document.getElementById("mock-end-session-btn").addEventListener("click", () => this.endMockInterview());
    document.getElementById("mock-rubric-toggle").addEventListener("click", () => {
      document.getElementById("mock-active-rubric-accordion").classList.toggle("expanded");
    });

    // Notes Scratchpad Autosave
    const noteArea = document.getElementById("notes-content-textarea");
    noteArea.addEventListener("input", () => {
      this.showAutosaveStatus("Saving...");
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        this.saveActiveNote(noteArea.value);
      }, 500);
    });

    // Problem Notes Modals
    document.getElementById("close-problem-note-btn").addEventListener("click", () => this.toggleModal("problem-note-modal", false));
    document.getElementById("save-problem-note-btn").addEventListener("click", () => this.saveProblemNote());
  }

  // Routing
  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    document.querySelectorAll(".tab-panel").forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    // Update Top Header Text
    const headerTitles = {
      dashboard: "System Architecture & Stats",
      dsa: "Elite DSA Curriculum Tracker",
      mern: "MERN Dev Roadmap",
      planner: "Weekly Sprints & Logs",
      "prep-hub": "Elite Interview Prep Hub",
      notes: "Dev Notes & Cheatsheets"
    };
    document.getElementById("header-title-text").textContent = headerTitles[tabId] || "PrepMaster Dashboard";
  }

  // Persistence helpers
  saveState(key, data) {
    this.state[key] = data;
    localStorage.setItem(`sp_${key}`, JSON.stringify(data));
    this.updateStats();
  }

  // DSA Logic
  renderDSATopics() {
    const listContainer = document.getElementById("dsa-topic-list");
    listContainer.innerHTML = "";

    this.data.dsa.forEach(topic => {
      const solvedCount = topic.problems.filter(p => this.state.dsaSolved[p.id]).length;
      const totalCount = topic.problems.length;
      
      const btn = document.createElement("button");
      btn.className = `topic-button ${topic.id === this.activeDSATopic ? "active" : ""}`;
      btn.innerHTML = `
        <span>${topic.name}</span>
        <span class="topic-progress-badge">${solvedCount}/${totalCount}</span>
      `;
      btn.addEventListener("click", () => {
        this.activeDSATopic = topic.id;
        document.querySelectorAll(".topic-button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.renderDSAProblems();
      });
      listContainer.appendChild(btn);
    });

    this.renderDSAProblems();
  }

  renderDSAProblems() {
    const tbody = document.getElementById("dsa-problems-body");
    tbody.innerHTML = "";

    const activeTopic = this.data.dsa.find(t => t.id === this.activeDSATopic);
    if (!activeTopic) return;

    const searchQuery = document.getElementById("dsa-search-input").value.toLowerCase();
    const diffFilter = document.getElementById("dsa-difficulty-filter").value;
    const statusFilter = document.getElementById("dsa-status-filter").value;

    const filteredProblems = activeTopic.problems.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.pattern.toLowerCase().includes(searchQuery);
      const matchesDiff = diffFilter === "all" || p.difficulty === diffFilter;
      const isSolved = !!this.state.dsaSolved[p.id];
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "solved" && isSolved) || 
                           (statusFilter === "unsolved" && !isSolved);
      return matchesSearch && matchesDiff && matchesStatus;
    });

    if (filteredProblems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted); padding: 40px 0;">No problems found matching active filters.</td></tr>`;
      return;
    }

    filteredProblems.forEach(prob => {
      const tr = document.createElement("tr");
      const isSolved = !!this.state.dsaSolved[prob.id];
      const hasNote = !!this.state.dsaNotes[prob.id];

      tr.innerHTML = `
        <td>
          <div class="task-checkbox ${isSolved ? "checked" : ""}" data-pid="${prob.id}">
            <i class="fa-solid fa-check"></i>
          </div>
        </td>
        <td>
          <div class="problem-title-cell">
            <a href="${prob.link}" target="_blank" class="task-title" style="color:var(--text-primary); text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
              ${prob.name} <i class="fa-solid fa-arrow-up-right-from-square problem-link-icon"></i>
            </a>
          </div>
        </td>
        <td><span style="color:var(--text-secondary); font-size: 13px;">${prob.pattern}</span></td>
        <td><span class="difficulty-badge ${prob.difficulty.toLowerCase()}">${prob.difficulty}</span></td>
        <td style="text-align: right;">
          <button class="action-btn ${hasNote ? "active" : ""}" data-note-pid="${prob.id}">
            <i class="fa-solid fa-pen-to-square"></i> ${hasNote ? "Notes Saved" : "Add Note"}
          </button>
        </td>
      `;

      // Checkbox event
      tr.querySelector(".task-checkbox").addEventListener("click", (e) => {
        const checkbox = e.currentTarget;
        const pid = checkbox.dataset.pid;
        const newState = !checkbox.classList.contains("checked");
        
        checkbox.classList.toggle("checked", newState);
        
        const solvedCopy = { ...this.state.dsaSolved };
        if (newState) {
          solvedCopy[pid] = true;
          this.logActivityHour(1); // Auto-log 1 hour for coding challenge!
        } else {
          delete solvedCopy[pid];
        }
        this.saveState("dsaSolved", solvedCopy);
        
        // Re-render topics to update counts
        this.renderDSATopics();
        this.updateDashboardTasks();
      });

      // Quick notes event
      tr.querySelector(".action-btn").addEventListener("click", (e) => {
        const pid = e.currentTarget.dataset.notePid;
        this.openProblemNoteModal(pid, prob.name, prob.hint);
      });

      tbody.appendChild(tr);
    });
  }

  openProblemNoteModal(pid, name, hint) {
    this.activeProblemNoteId = pid;
    document.getElementById("problem-note-modal-title").textContent = `Notes on ${name}`;
    document.getElementById("problem-note-modal-hint").textContent = hint;
    document.getElementById("problem-note-modal-textarea").value = this.state.dsaNotes[pid] || "";
    this.toggleModal("problem-note-modal", true);
  }

  saveProblemNote() {
    const pid = this.activeProblemNoteId;
    if (!pid) return;
    
    const noteText = document.getElementById("problem-note-modal-textarea").value.trim();
    const notesCopy = { ...this.state.dsaNotes };
    
    if (noteText) {
      notesCopy[pid] = noteText;
    } else {
      delete notesCopy[pid];
    }
    
    this.saveState("dsaNotes", notesCopy);
    this.toggleModal("problem-note-modal", false);
    this.renderDSAProblems();
  }

  // MERN Roadmap Logic
  renderMERNRoadmap() {
    const container = document.getElementById("mern-roadmap-body");
    container.innerHTML = "";

    this.data.mern.forEach((phase, index) => {
      const milestonesChecked = phase.milestones.filter(m => this.state.mernMilestones[m.id]).length;
      const totalMilestones = phase.milestones.length;
      const pct = totalMilestones > 0 ? Math.round((milestonesChecked / totalMilestones) * 100) : 0;
      
      const card = document.createElement("div");
      card.className = `glass-card mern-phase-card ${index === 0 ? "expanded" : ""}`;
      
      card.innerHTML = `
        <div class="mern-phase-header">
          <div class="mern-phase-header-left">
            <div class="mern-phase-num">${index + 1}</div>
            <div class="mern-phase-title-text">
              <h3>${phase.name}</h3>
              <p>${phase.description}</p>
            </div>
          </div>
          <div class="mern-phase-header-right">
            <div class="mern-phase-progress-bar-container">
              <div class="mern-phase-progress-bar" style="width: ${pct}%"></div>
            </div>
            <div class="mern-phase-percent">${pct}%</div>
            <i class="fa-solid fa-chevron-down mern-phase-arrow"></i>
          </div>
        </div>
        <div class="mern-phase-body">
          <div class="mern-milestones-grid">
            <!-- Checkbox items -->
          </div>
        </div>
      `;

      const grid = card.querySelector(".mern-milestones-grid");
      phase.milestones.forEach(milestone => {
        const isChecked = !!this.state.mernMilestones[milestone.id];
        const item = document.createElement("div");
        item.className = `milestone-item ${isChecked ? "checked" : ""}`;
        item.innerHTML = `
          <div class="task-checkbox ${isChecked ? "checked" : ""}" data-mid="${milestone.id}">
            <i class="fa-solid fa-check"></i>
          </div>
          <div class="milestone-text">${milestone.text}</div>
        `;
        
        item.querySelector(".task-checkbox").addEventListener("click", (e) => {
          const checkbox = e.currentTarget;
          const mid = checkbox.dataset.mid;
          const newState = !checkbox.classList.contains("checked");
          
          checkbox.classList.toggle("checked", newState);
          item.classList.toggle("checked", newState);
          
          const milestonesCopy = { ...this.state.mernMilestones };
          if (newState) {
            milestonesCopy[mid] = true;
            this.logActivityHour(2); // Auto log 2 hours for MERN dev milestone!
          } else {
            delete milestonesCopy[mid];
          }
          
          this.saveState("mernMilestones", milestonesCopy);
          
          // Update phase progress bar
          const updatedChecked = phase.milestones.filter(m => milestonesCopy[m.id]).length;
          const updatedPct = Math.round((updatedChecked / totalMilestones) * 100);
          card.querySelector(".mern-phase-progress-bar").style.width = `${updatedPct}%`;
          card.querySelector(".mern-phase-percent").textContent = `${updatedPct}%`;
          
          this.updateDashboardTasks();
        });

        grid.appendChild(item);
      });

      // Expand/Collapse toggle
      card.querySelector(".mern-phase-header").addEventListener("click", (e) => {
        if (e.target.closest(".task-checkbox")) return; // Don't collapse if clicking checked box
        card.classList.toggle("expanded");
      });

      container.appendChild(card);
    });

    this.updateDashboardTasks();
  }

  // Calendar & Scheduler Logic
  changeMonth(dir) {
    this.currentMonth += dir;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.updateCalendar();
  }

  updateCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById("calendar-month-year").textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

    const grid = document.getElementById("calendar-days-grid");
    grid.innerHTML = "";

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    // Print empty cells for offset
    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement("div");
      cell.className = "calendar-day empty";
      grid.appendChild(cell);
    }

    const today = new Date();
    const todayStr = this.formatDateStr(today);

    // Print actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dateStr = this.formatDateStr(date);
      
      cell.className = "calendar-day";
      if (dateStr === todayStr) cell.classList.add("today");
      if (dateStr === this.selectedDateStr) cell.style.borderColor = "var(--primary)";

      cell.innerHTML = `
        <span class="day-number">${day}</span>
        <div class="day-events-dots"></div>
      `;

      // Render dots if day has events
      const dotsContainer = cell.querySelector(".day-events-dots");
      const events = this.state.calendarEvents[dateStr] || [];
      const typesAdded = new Set();
      
      events.forEach(ev => {
        if (!typesAdded.has(ev.type)) {
          typesAdded.add(ev.type);
          const dot = document.createElement("span");
          dot.className = `event-dot ${ev.type}`;
          dotsContainer.appendChild(dot);
        }
      });

      cell.addEventListener("click", () => {
        this.selectedDateStr = dateStr;
        this.updateCalendar(); // Redraw selection borders
        this.renderScheduleList();
      });

      grid.appendChild(cell);
    }

    this.renderScheduleList();
  }

  renderScheduleList() {
    const formattedTitleDate = new Date(this.selectedDateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    document.getElementById("planner-selected-date").textContent = `Schedule: ${formattedTitleDate}`;

    const list = document.getElementById("planner-schedule-list");
    list.innerHTML = "";

    const events = this.state.calendarEvents[this.selectedDateStr] || [];

    if (events.length === 0) {
      list.innerHTML = `<div style="text-align:center; color: var(--text-muted); font-size: 13.5px; padding: 32px 0;">No sprints scheduled for this day. Click 'Add Event' to plan.</div>`;
      return;
    }

    events.forEach((ev, index) => {
      const item = document.createElement("div");
      item.className = "schedule-item";
      item.innerHTML = `
        <div class="schedule-item-type-line ${ev.type}"></div>
        <div class="schedule-item-info">
          <div class="schedule-item-title">${ev.title}</div>
          <div class="schedule-item-time"><i class="fa-regular fa-clock"></i> ${ev.time}</div>
        </div>
        <button class="delete-schedule-btn" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
      `;

      item.querySelector(".delete-schedule-btn").addEventListener("click", () => {
        const eventsCopy = { ...this.state.calendarEvents };
        eventsCopy[this.selectedDateStr].splice(index, 1);
        
        if (eventsCopy[this.selectedDateStr].length === 0) {
          delete eventsCopy[this.selectedDateStr];
        }
        
        this.saveState("calendarEvents", eventsCopy);
        this.updateCalendar();
      });

      list.appendChild(item);
    });
  }

  handleSaveEvent(e) {
    e.preventDefault();
    const title = document.getElementById("modal-event-title").value.trim();
    const time = document.getElementById("modal-event-time").value;
    const type = document.getElementById("modal-event-type").value;

    if (!title || !time) return;

    const eventsCopy = { ...this.state.calendarEvents };
    if (!eventsCopy[this.selectedDateStr]) {
      eventsCopy[this.selectedDateStr] = [];
    }

    eventsCopy[this.selectedDateStr].push({ title, time, type });
    // Sort events by time
    eventsCopy[this.selectedDateStr].sort((a, b) => a.time.localeCompare(b.time));

    this.saveState("calendarEvents", eventsCopy);
    this.toggleModal("add-event-modal", false);
    
    // Clear inputs
    document.getElementById("add-event-form").reset();
    
    this.updateCalendar();
  }

  handleLogHours() {
    const hoursVal = parseInt(document.getElementById("study-hours-input").value);
    if (!hoursVal || hoursVal < 1 || hoursVal > 24) {
      alert("Please enter a valid amount of hours between 1 and 24.");
      return;
    }

    const todayStr = this.formatDateStr(new Date());
    const loggedCopy = { ...this.state.loggedHours };
    
    loggedCopy[todayStr] = (loggedCopy[todayStr] || 0) + hoursVal;
    this.saveState("loggedHours", loggedCopy);
    this.logActivityStreak();

    document.getElementById("study-hours-input").value = "";
    
    // Update visuals
    this.updateStats();
    this.renderActivityChart();
  }

  // Logger helper to add hours automatically when ticking items
  logActivityHour(hours) {
    const todayStr = this.formatDateStr(new Date());
    const loggedCopy = { ...this.state.loggedHours };
    loggedCopy[todayStr] = (loggedCopy[todayStr] || 0) + hours;
    this.saveState("loggedHours", loggedCopy);
    this.logActivityStreak();
  }

  // Interview Prep Hub: System Design Core
  renderSystemDesign() {
    const container = document.getElementById("system-design-cards");
    container.innerHTML = "";

    this.data.systemDesign.forEach((topic, index) => {
      const card = document.createElement("div");
      card.className = `glass-card sd-card ${index === 0 ? "expanded" : ""}`;
      
      card.innerHTML = `
        <div class="sd-card-header">
          <h4>${topic.title}</h4>
          <i class="fa-solid fa-chevron-down" style="color:var(--text-secondary); transition: var(--transition);"></i>
        </div>
        <div class="sd-card-body">
          <ul>
            ${topic.content.map(bullet => `<li>${bullet}</li>`).join("")}
          </ul>
        </div>
      `;

      card.querySelector(".sd-card-header").addEventListener("click", () => {
        card.classList.toggle("expanded");
      });

      container.appendChild(card);
    });
  }

  // Interview Prep Hub: STAR Behavioral
  renderBehavioralCards() {
    const container = document.getElementById("behavioral-cards-container");
    container.innerHTML = "";

    if (this.state.starBehaviors.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px 0;">
          <i class="fa-solid fa-folder-open" style="font-size: 32px; color: var(--text-muted); margin-bottom: 12px; display: block;"></i>
          No STAR behavior scenarios saved. Construct a card to start preparing.
        </div>
      `;
      return;
    }

    this.state.starBehaviors.forEach((card, index) => {
      const el = document.createElement("div");
      el.className = "glass-card star-card";
      el.innerHTML = `
        <div class="star-card-header">
          <span class="star-card-lp" title="${card.principle}">${card.principle}</span>
          <button class="star-card-delete" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="star-card-title">${card.title}</div>
        <div class="star-card-section">
          <strong>Situation</strong>
          <p>${card.situation}</p>
        </div>
        <div class="star-card-section">
          <strong>Task</strong>
          <p>${card.task}</p>
        </div>
        <div class="star-card-section">
          <strong>Action</strong>
          <p>${card.action}</p>
        </div>
        <div class="star-card-section">
          <strong>Result</strong>
          <p>${card.result}</p>
        </div>
      `;

      el.querySelector(".star-card-delete").addEventListener("click", () => {
        const behaviorsCopy = [...this.state.starBehaviors];
        behaviorsCopy.splice(index, 1);
        this.saveState("starBehaviors", behaviorsCopy);
        this.renderBehavioralCards();
      });

      container.appendChild(el);
    });
  }

  handleSaveBehavior(e) {
    e.preventDefault();
    const title = document.getElementById("star-title").value.trim();
    const principle = document.getElementById("star-principle").value.trim();
    const situation = document.getElementById("star-situation").value.trim();
    const task = document.getElementById("star-task").value.trim();
    const action = document.getElementById("star-action").value.trim();
    const result = document.getElementById("star-result").value.trim();

    if (!title || !principle || !situation || !task || !action || !result) return;

    const newCard = { id: "star-" + Date.now(), title, principle, situation, task, action, result };
    const behaviorsCopy = [newCard, ...this.state.starBehaviors];

    this.saveState("starBehaviors", behaviorsCopy);
    this.renderBehavioralCards();

    // Reset Form
    document.getElementById("star-builder-form").reset();
  }

  // Interview Prep Hub: Mock Interview Simulator
  renderMockHistory() {
    const tbody = document.getElementById("mock-history-tbody");
    tbody.innerHTML = "";

    if (this.state.mockHistory.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 20px 0;">No mocks logged yet. Complete a simulator sprint.</td></tr>`;
      return;
    }

    this.state.mockHistory.forEach(mock => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${mock.title}</strong></td>
        <td><span class="mock-type-badge">${mock.type}</span></td>
        <td><span class="difficulty-badge ${mock.grade === 'Fail' ? 'hard' : (mock.grade === 'Borderline' ? 'medium' : 'easy')}">${mock.grade}</span></td>
        <td style="color:var(--text-secondary); max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${mock.feedback}">${mock.feedback}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  startMockInterview() {
    const selectType = document.getElementById("mock-select-type").value;
    const pool = this.data.mockInterviews.filter(mock => {
      return (selectType === "dsa" && mock.type.includes("DSA")) ||
             (selectType === "system" && mock.type.includes("System"));
    });

    if (pool.length === 0) return;

    // Pick a random interview prompt
    const mockSelected = pool[Math.floor(Math.random() * pool.length)];
    this.activeMockSession = mockSelected;

    // Show simulation screen
    document.getElementById("mock-active-simulator").style.display = "block";
    document.getElementById("mock-active-title").textContent = mockSelected.title;
    document.getElementById("mock-active-type").textContent = mockSelected.type;
    
    const diffBadge = document.getElementById("mock-active-diff");
    diffBadge.textContent = mockSelected.difficulty;
    diffBadge.className = `difficulty-badge ${mockSelected.difficulty.toLowerCase()}`;

    document.getElementById("mock-active-desc").textContent = mockSelected.description;

    // Fill Rubrics
    const rubricBody = document.getElementById("mock-active-rubric-body");
    rubricBody.innerHTML = `
      <ol>
        ${mockSelected.rubric.map(item => `<li>${item}</li>`).join("")}
      </ol>
    `;

    // Start Timer
    clearInterval(this.mockTimerInterval);
    this.mockSecondsRemaining = mockSelected.duration * 60;
    this.updateMockTimerDisplay();
    
    this.mockTimerInterval = setInterval(() => {
      this.mockSecondsRemaining--;
      this.updateMockTimerDisplay();

      if (this.mockSecondsRemaining <= 0) {
        clearInterval(this.mockTimerInterval);
        this.triggerBeepSound();
        alert("Mock Interview time is up! Log your grade.");
      }
    }, 1000);

    // Scroll to active screen
    document.getElementById("mock-active-simulator").scrollIntoView({ behavior: "smooth" });
  }

  updateMockTimerDisplay() {
    const timerBox = document.getElementById("mock-active-timer");
    const minutes = Math.floor(this.mockSecondsRemaining / 60);
    const seconds = this.mockSecondsRemaining % 60;
    
    timerBox.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Add alert warning when timer is below 5 minutes
    if (this.mockSecondsRemaining < 300) {
      timerBox.classList.add("timer-warning");
    } else {
      timerBox.classList.remove("timer-warning");
    }
  }

  endMockInterview() {
    if (!this.activeMockSession) return;

    clearInterval(this.mockTimerInterval);

    const grade = document.getElementById("mock-eval-grade").value;
    const feedback = document.getElementById("mock-eval-feedback").value.trim() || "No detailed feedback logged.";

    const historyRecord = {
      id: "mock-" + Date.now(),
      title: this.activeMockSession.title,
      type: this.activeMockSession.type,
      grade: grade,
      feedback: feedback
    };

    const historyCopy = [historyRecord, ...this.state.mockHistory];
    this.saveState("mockHistory", historyCopy);
    this.logActivityHour(2); // Auto log 2 hours for a completed mock interview!

    // Reset simulator screen
    document.getElementById("mock-active-simulator").style.display = "none";
    document.getElementById("mock-eval-feedback").value = "";
    this.activeMockSession = null;

    this.renderMockHistory();
    this.updateStats();
    
    alert("Mock Interview evaluated and logged successfully!");
  }

  triggerBeepSound() {
    // Generate synthetic timer-alert beep via Web Audio API (safe, zero dependencies)
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.value = 523.25; // C5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.2); // Beep for 1.2s
    } catch(e) {
      // Audio context might be blocked or unsupported; fail silently
    }
  }

  // Notes/Scratchpad
  renderNotesSidebar() {
    const list = document.getElementById("notes-sidebar-list");
    list.innerHTML = "";

    // General Notes btn
    const generalBtn = document.createElement("button");
    generalBtn.className = `note-topic-btn ${this.activeNoteTopic === "general" ? "active" : ""}`;
    generalBtn.innerHTML = `<span><i class="fa-solid fa-book-bookmark"></i> General Notes</span>`;
    generalBtn.addEventListener("click", () => this.switchNoteTopic("general"));
    list.appendChild(generalBtn);

    // List categories for each DSA Topic
    this.data.dsa.forEach(topic => {
      const btn = document.createElement("button");
      btn.className = `note-topic-btn ${this.activeNoteTopic === topic.id ? "active" : ""}`;
      btn.innerHTML = `
        <span><i class="fa-solid fa-code"></i> ${topic.name}</span>
        <i class="fa-solid fa-chevron-right" style="font-size:10px; color: var(--text-muted);"></i>
      `;
      btn.addEventListener("click", () => this.switchNoteTopic(topic.id));
      list.appendChild(btn);
    });

    this.loadActiveNote();
  }

  switchNoteTopic(topicId) {
    this.activeNoteTopic = topicId;
    document.querySelectorAll(".note-topic-btn").forEach(btn => {
      // Simplistic active check
      if (btn.textContent.includes(topicId === "general" ? "General Notes" : this.data.dsa.find(t => t.id === topicId).name)) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    this.renderNotesSidebar(); // Re-render to correctly place active styles
  }

  loadActiveNote() {
    const noteArea = document.getElementById("notes-content-textarea");
    const activeTitle = document.getElementById("notes-active-title");
    
    if (this.activeNoteTopic === "general") {
      activeTitle.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> General Notes`;
      noteArea.value = this.state.generalNotes["general"] || "";
    } else {
      const topicObj = this.data.dsa.find(t => t.id === this.activeNoteTopic);
      activeTitle.innerHTML = `<i class="fa-solid fa-code"></i> ${topicObj.name} Notes`;
      noteArea.value = this.state.generalNotes[this.activeNoteTopic] || "";
    }
    
    this.showAutosaveStatus("All changes saved offline");
  }

  saveActiveNote(val) {
    const notesCopy = { ...this.state.generalNotes };
    notesCopy[this.activeNoteTopic] = val;
    this.saveState("generalNotes", notesCopy);
    this.showAutosaveStatus("All changes saved offline", true);
  }

  showAutosaveStatus(msg, isSuccess = false) {
    const indicator = document.getElementById("autosave-status");
    const icon = indicator.previousElementSibling;
    
    indicator.textContent = msg;
    if (msg === "Saving...") {
      icon.className = "fa-solid fa-spinner fa-spin";
      icon.style.color = "var(--primary)";
    } else {
      icon.className = "fa-solid fa-circle-check";
      icon.style.color = "var(--success)";
    }
  }

  // Dashboard Stats update
  updateStats() {
    // 1. Solved counts
    const dsaSolvedTotal = Object.keys(this.state.dsaSolved).length;
    const dsaTotalCount = this.data.dsa.reduce((acc, t) => acc + t.problems.length, 0);
    document.getElementById("stats-dsa-count").textContent = `${dsaSolvedTotal}/${dsaTotalCount}`;

    // 2. MERN milestones counts
    const mernCompletedTotal = Object.keys(this.state.mernMilestones).length;
    const mernTotalCount = this.data.mern.reduce((acc, p) => acc + p.milestones.length, 0);
    document.getElementById("stats-mern-count").textContent = `${mernCompletedTotal}/${mernTotalCount}`;

    // 3. Prep counts
    document.getElementById("stats-star-count").textContent = this.state.starBehaviors.length;
    document.getElementById("stats-mocks-count").textContent = this.state.mockHistory.length;

    // 4. Streak
    document.getElementById("streak-days-count").textContent = this.state.streak;

    // 5. Percentages & Circles
    const dsaPct = dsaTotalCount > 0 ? Math.round((dsaSolvedTotal / dsaTotalCount) * 100) : 0;
    const mernPct = mernTotalCount > 0 ? Math.round((mernCompletedTotal / mernTotalCount) * 100) : 0;
    
    document.getElementById("legend-dsa-pct").textContent = `${dsaPct}%`;
    document.getElementById("legend-mern-pct").textContent = `${mernPct}%`;

    const overallPct = Math.round((dsaPct + mernPct) / 2);
    document.getElementById("overall-progress-percent").textContent = `${overallPct}%`;

    // Animate SVG Ring
    const circle = document.getElementById("overall-progress-circle");
    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius; // approx 439.8
      const offset = circumference - (overallPct / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    // Render bar chart
    this.renderActivityChart();
  }

  renderActivityChart() {
    const chartContainer = document.getElementById("dashboard-bars-chart");
    chartContainer.innerHTML = "";

    // Generate dates for the last 7 days (ending today)
    const days = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDateStr(date);
      const hours = this.state.loggedHours[dateStr] || 0;
      days.push({
        label: weekdays[date.getDay()],
        hours: hours,
        dateStr: dateStr
      });
    }

    // Find max value to scale chart (min max scale of 8 hours)
    const maxHours = Math.max(...days.map(d => d.hours), 8);

    days.forEach(day => {
      const pct = (day.hours / maxHours) * 100;
      
      const barWrapper = document.createElement("div");
      barWrapper.className = "chart-bar-wrapper";
      barWrapper.innerHTML = `
        <div class="chart-bar" style="height: ${pct}%;">
          <div class="bar-tooltip">${day.hours} hrs</div>
        </div>
        <span class="chart-label">${day.label}</span>
      `;
      chartContainer.appendChild(barWrapper);
    });
  }

  updateDashboardTasks() {
    const container = document.getElementById("dashboard-recent-tasks");
    container.innerHTML = "";

    const items = [];
    
    // Find uncompleted DSA problems (limit 3)
    this.data.dsa.forEach(topic => {
      topic.problems.forEach(prob => {
        if (!this.state.dsaSolved[prob.id] && items.length < 3) {
          items.push({
            id: prob.id,
            title: `DSA: ${prob.name} (${prob.pattern})`,
            type: "dsa",
            tag: prob.difficulty,
            tagClass: prob.difficulty.toLowerCase()
          });
        }
      });
    });

    // Find uncompleted MERN milestones (limit 3)
    this.data.mern.forEach(phase => {
      phase.milestones.forEach(milestone => {
        if (!this.state.mernMilestones[milestone.id] && items.length < 6) {
          items.push({
            id: milestone.id,
            title: milestone.text.substring(0, 50) + "...",
            type: "mern",
            tag: "MERN Milestone",
            tagClass: "easy"
          });
        }
      });
    });

    if (items.length === 0) {
      container.innerHTML = `<div style="text-align:center; color: var(--text-muted); font-size: 13.5px; padding: 20px 0;">All milestones clear! Masterful progress.</div>`;
      return;
    }

    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "task-item";
      div.innerHTML = `
        <div class="task-details-left">
          <div class="task-checkbox" data-dash-id="${item.id}" data-dash-type="${item.type}">
            <i class="fa-solid fa-check"></i>
          </div>
          <span class="task-title">${item.title}</span>
        </div>
        <span class="task-tag difficulty-badge ${item.tagClass}">${item.tag}</span>
      `;

      div.querySelector(".task-checkbox").addEventListener("click", (e) => {
        const checkbox = e.currentTarget;
        const id = checkbox.dataset.dashId;
        const type = checkbox.dataset.dashType;
        
        checkbox.classList.add("checked");
        
        setTimeout(() => {
          if (type === "dsa") {
            const solvedCopy = { ...this.state.dsaSolved };
            solvedCopy[id] = true;
            this.saveState("dsaSolved", solvedCopy);
            this.logActivityHour(1);
            this.renderDSATopics();
          } else {
            const milestonesCopy = { ...this.state.mernMilestones };
            milestonesCopy[id] = true;
            this.saveState("mernMilestones", milestonesCopy);
            this.logActivityHour(2);
            this.renderMERNRoadmap();
          }
          this.updateDashboardTasks();
        }, 300);
      });

      container.appendChild(div);
    });
  }

  // Streak logic
  checkStreak() {
    const todayStr = this.formatDateStr(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this.formatDateStr(yesterday);

    if (this.state.lastActiveDate === "") {
      // New user
      this.state.streak = 0;
      localStorage.setItem("sp_streak", "0");
    } else if (this.state.lastActiveDate !== todayStr && this.state.lastActiveDate !== yesterdayStr) {
      // Streak broken (more than 1 day since last activity)
      this.state.streak = 0;
      localStorage.setItem("sp_streak", "0");
      this.updateStats();
    }
  }

  logActivityStreak() {
    const todayStr = this.formatDateStr(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this.formatDateStr(yesterday);

    if (this.state.lastActiveDate === yesterdayStr) {
      // Increment streak
      this.state.streak += 1;
      this.state.lastActiveDate = todayStr;
    } else if (this.state.lastActiveDate !== todayStr) {
      // Fresh active or streak reset previously
      this.state.streak = 1;
      this.state.lastActiveDate = todayStr;
    }
    
    localStorage.setItem("sp_streak", this.state.streak.toString());
    localStorage.setItem("sp_last_active_date", todayStr);
    this.updateStats();
  }

  // Modal helpers
  toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (show) {
      modal.classList.add("active");
    } else {
      modal.classList.remove("active");
    }
  }

  // Date helper
  formatDateStr(dateObj) {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// Instantiate App
document.addEventListener("DOMContentLoaded", () => {
  window.app = new StudyPlannerApp();
});
