// ==================== ABES Semester Data ====================
const semesterData = {
  1: {
    totalCredits: 23,
    groupA: {
      name: 'Group A',
      theory: [
        { name: 'Applied Physics', credits: 3 },
        { name: 'Basics of Electrical Engg', credits: 3 },
        { name: 'Fundamentals of Linear Algebra & Statistics', credits: 3 },
        { name: 'Programming in C++', credits: 3 },
        { name: 'Environment & Sustainability', credits: 2 },
        { name: 'Essentials of AI', credits: 2 },
      ],
      practical: [
        { name: 'Physics Lab', credits: 1 },
        { name: 'Programming Lab in C++', credits: 1 },
        { name: 'CAD Lab', credits: 1 },
        { name: 'Web Designing Workshop-1', credits: 2 },
        { name: 'Holistic Skill & Innovation-I', credits: 1 },
        { name: 'Basic Electrical Engg Lab', credits: 1 },
      ],
    },
    groupB: {
      name: 'Group B',
      theory: [
        { name: 'Basics of Mechanical & Automation Engg', credits: 3 },
        { name: 'Basics of Electronics Engg', credits: 3 },
        { name: 'Fundamentals of Linear Algebra & Statistics', credits: 3 },
        { name: 'Programming in C++', credits: 3 },
        { name: 'Soft Skills', credits: 2 },
        { name: 'Design Thinking', credits: 2 },
      ],
      practical: [
        { name: 'Professional Communication Lab', credits: 1 },
        { name: 'Programming Lab in C++', credits: 1 },
        { name: 'Digital Manufacturing Lab', credits: 1 },
        { name: 'Web Designing Workshop-1', credits: 2 },
        { name: 'Holistic Skill & Innovation-I', credits: 1 },
        { name: 'Electronics Workshop', credits: 1 },
      ],
    },
  },
};

const state = {
  marks: [],
  cgpaSgpas: [],
};

// ==================== Utility ====================
function getActiveSubjects() {
  const semester = Number(semesterSelect.value);
  if (semester !== 1) return [];
  const group = groupSelect.value;
  const data = semesterData[1][group];
  return [...data.theory, ...data.practical];
}

function convertMarksToGrade(mark) {
  if (mark >= 90) return { grade: 'O', point: 10 };
  if (mark >= 80) return { grade: 'A+', point: 9 };
  if (mark >= 70) return { grade: 'A', point: 8 };
  if (mark >= 60) return { grade: 'B+', point: 7 };
  if (mark >= 50) return { grade: 'B', point: 6 };
  if (mark >= 40) return { grade: 'C', point: 5 };
  return { grade: 'F', point: 0 };
}

function classifyScore(score, hasFail = false) {
  if (hasFail) return 'Fail';
  if (score >= 8.5) return 'Honors';
  if (score >= 7) return 'First Division';
  if (score >= 6) return 'Second Division';
  return 'Pass';
}

// ==================== Refs ====================
const semesterSelect = document.getElementById('semesterSelect');
const groupSelect = document.getElementById('groupSelect');
const groupControlWrap = document.getElementById('groupControlWrap');
const subjectsContainer = document.getElementById('subjectsContainer');
const subjectSummary = document.getElementById('subjectSummary');
const creditInfo = document.getElementById('creditInfo');
const sgpaValueEl = document.getElementById('sgpaValue');
const sgpaClassEl = document.getElementById('sgpaClass');
const sgpaProgressEl = document.getElementById('sgpaProgress');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const pdfBtn = document.getElementById('pdfBtn');
const addSgpaBtn = document.getElementById('addSgpaBtn');
const semesterSgpaInput = document.getElementById('semesterSgpaInput');
const cgpaList = document.getElementById('cgpaList');
const cgpaValueEl = document.getElementById('cgpaValue');
const cgpaDivisionEl = document.getElementById('cgpaDivision');
const themeToggle = document.getElementById('themeToggle');

// ==================== Render ====================
function renderSubjects() {
  const semester = Number(semesterSelect.value);
  subjectsContainer.innerHTML = '';
  groupControlWrap.style.display = semester === 1 ? 'block' : 'none';

  if (semester !== 1) {
    subjectSummary.textContent = 'Semester 1 has complete ABES autonomous mapping with two groups.';
    creditInfo.textContent = 'Total Credits: -';
    state.marks = [];
    calculateSgpa();
    return;
  }

  const activeGroup = semesterData[1][groupSelect.value];
  const subjects = [...activeGroup.theory, ...activeGroup.practical];
  const totalCredits = semesterData[1].totalCredits;

  if (state.marks.length !== subjects.length) {
    state.marks = new Array(subjects.length).fill('');
  }

  subjectSummary.textContent = `${activeGroup.name}: 6 Theory + 6 Practical subjects (Total Credits ${totalCredits})`;
  creditInfo.textContent = `Total Credits: ${totalCredits}`;

  subjects.forEach((subject, index) => {
    const card = document.createElement('article');
    const isTheory = index < 6;
    card.className = 'subject-card';
    card.innerHTML = `
      <h4>${subject.name}</h4>
      <div class="meta">${isTheory ? 'Theory' : 'Practical'} • Credits: ${subject.credits}</div>
      <input type="number" min="0" max="100" placeholder="Enter marks (0-100)" value="${state.marks[index]}" data-index="${index}" />
      <div class="grade-chip" id="grade-${index}">Grade: -</div>
    `;
    subjectsContainer.appendChild(card);
  });

  subjectsContainer.querySelectorAll('input').forEach((input) => input.addEventListener('input', onMarksInput));
}

function onMarksInput(e) {
  const index = Number(e.target.dataset.index);
  const value = e.target.value;

  if (value === '') {
    state.marks[index] = '';
    calculateSgpa();
    return;
  }

  const numeric = Number(value);
  const clamped = Math.max(0, Math.min(100, numeric));
  if (numeric !== clamped) e.target.value = clamped;

  state.marks[index] = clamped;
  calculateSgpa();
}

// ==================== SGPA / CGPA ====================
function calculateSgpa() {
  const semester = Number(semesterSelect.value);
  if (semester !== 1) {
    sgpaValueEl.textContent = '0.00';
    sgpaClassEl.textContent = 'Pass';
    sgpaProgressEl.style.width = '0%';
    return;
  }

  const subjects = getActiveSubjects();
  const totalCredits = semesterData[1].totalCredits;
  let weighted = 0;
  let hasFail = false;

  subjects.forEach((subject, index) => {
    const mark = state.marks[index];
    const gradeEl = document.getElementById(`grade-${index}`);

    if (mark === '') {
      if (gradeEl) gradeEl.textContent = 'Grade: -';
      return;
    }

    const { grade, point } = convertMarksToGrade(Number(mark));
    if (gradeEl) gradeEl.textContent = `Grade: ${grade} (${point})`;
    if (point === 0) hasFail = true;
    weighted += subject.credits * point;
  });

  const sgpa = weighted / totalCredits;
  animateNumber(sgpaValueEl, sgpa);
  const classification = classifyScore(sgpa, hasFail);
  sgpaClassEl.textContent = classification;
  sgpaClassEl.classList.toggle('fail', classification === 'Fail');
  sgpaProgressEl.style.width = `${Math.max(0, Math.min(100, (sgpa / 10) * 100))}%`;
}

function animateNumber(el, target) {
  const start = Number(el.textContent) || 0;
  const delta = target - start;
  const duration = 280;
  const startTime = performance.now();

  function tick(now) {
    const p = Math.min((now - startTime) / duration, 1);
    el.textContent = (start + delta * p).toFixed(2);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function refreshCgpaUI() {
  cgpaList.innerHTML = '';
  state.cgpaSgpas.forEach((v, i) => {
    const li = document.createElement('li');
    li.textContent = `Semester ${i + 1}: ${v.toFixed(2)}`;
    cgpaList.appendChild(li);
  });

  if (!state.cgpaSgpas.length) {
    cgpaValueEl.textContent = '0.00';
    cgpaDivisionEl.textContent = 'Pass';
    return;
  }

  const cgpa = state.cgpaSgpas.reduce((a, b) => a + b, 0) / state.cgpaSgpas.length;
  cgpaValueEl.textContent = cgpa.toFixed(2);
  cgpaDivisionEl.textContent = classifyScore(cgpa);
}

// ==================== Persistence / Export ====================
function saveToLocalStorage() {
  const payload = {
    branch: document.getElementById('branchSelect').value,
    semester: semesterSelect.value,
    group: groupSelect.value,
    marks: state.marks,
    cgpaSgpas: state.cgpaSgpas,
    theme: document.body.classList.contains('dark') ? 'dark' : 'light',
  };
  localStorage.setItem('abesSgpaData', JSON.stringify(payload));
  alert('Result saved locally.');
}

function restoreFromLocalStorage() {
  const raw = localStorage.getItem('abesSgpaData');
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    document.getElementById('branchSelect').value = data.branch || 'CSE';
    semesterSelect.value = data.semester || '1';
    groupSelect.value = data.group || 'groupA';
    state.marks = Array.isArray(data.marks) ? data.marks : [];
    state.cgpaSgpas = Array.isArray(data.cgpaSgpas) ? data.cgpaSgpas : [];
    document.body.classList.toggle('dark', data.theme === 'dark');
  } catch {
    // ignore corrupted values
  }
}

function downloadPdf() {
  if (!window.jspdf) {
    alert('PDF library still loading. Please try again.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('ABES Autonomous SGPA & CGPA Report', 14, 18);
  doc.setFontSize(11);
  doc.text('Developed by Rohit Dixit', 14, 26);
  doc.text(`Branch: ${document.getElementById('branchSelect').value}`, 14, 34);
  doc.text(`Semester: ${semesterSelect.value}`, 14, 42);
  doc.text(`Group: ${groupSelect.options[groupSelect.selectedIndex].text}`, 14, 50);
  doc.text(`SGPA: ${sgpaValueEl.textContent} (${sgpaClassEl.textContent})`, 14, 58);
  doc.text(`CGPA: ${cgpaValueEl.textContent} (${cgpaDivisionEl.textContent})`, 14, 66);
  doc.save('abes-sgpa-cgpa-result.pdf');
}

function resetAll() {
  state.marks = [];
  state.cgpaSgpas = [];
  renderSubjects();
  calculateSgpa();
  refreshCgpaUI();
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('abesTheme');
  if (savedTheme) {
    document.body.classList.toggle('dark', savedTheme === 'dark');
  }
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

// ==================== Events ====================
semesterSelect.addEventListener('change', () => {
  state.marks = [];
  renderSubjects();
  calculateSgpa();
});

groupSelect.addEventListener('change', () => {
  state.marks = [];
  renderSubjects();
  calculateSgpa();
});

resetBtn.addEventListener('click', resetAll);
saveBtn.addEventListener('click', saveToLocalStorage);
pdfBtn.addEventListener('click', downloadPdf);

addSgpaBtn.addEventListener('click', () => {
  const value = Number(semesterSgpaInput.value);
  if (Number.isNaN(value) || value < 0 || value > 10) {
    alert('Please enter SGPA between 0 and 10.');
    return;
  }
  state.cgpaSgpas.push(value);
  semesterSgpaInput.value = '';
  refreshCgpaUI();
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('abesTheme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// ==================== Boot ====================
restoreFromLocalStorage();
initializeTheme();
renderSubjects();
calculateSgpa();
refreshCgpaUI();
