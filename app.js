import {
  db,
  auth,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onAuthStateChanged,
  signOut,
} from "./firebase.js";
console.log("Firebase Connected");
console.log(db);
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  userEmailElement.textContent = user.email;

  console.log("UID:", user.uid);
  console.log("EMAIL:", user.email);
});
const userEmailElement = document.getElementById("userEmail");

const logoutBtn = document.getElementById("logoutBtn");
// Modal Elements
const addJobBtn = document.getElementById("addJobBtn");
const jobModal = document.getElementById("jobModal");
const closeModal = document.getElementById("closeModal");
const totalJobsElement = document.getElementById("totalJobs");
const appliedJobsElement = document.getElementById("appliedJobs");
const pendingJobsElement = document.getElementById("pendingJobs");
const viewModal = document.getElementById("viewModal");
const closeViewModal = document.getElementById("closeViewModal");
const jobDetails = document.getElementById("jobDetails");
// Form Elements
const jobForm = document.getElementById("jobForm");
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const jobTableBody = document.getElementById("jobTableBody");
const jobLinkInput = document.getElementById("jobLink");
const addedByInput = document.getElementById("addedBy");
const statusInput = document.getElementById("status");
const notesInput = document.getElementById("notes");
const resumeInput = document.getElementById("resume");
const saveJobBtn = document.getElementById("saveJobBtn");
// Jobs Array
let jobs = [];
const jobsCollection = collection(db, "jobs");
async function loadJobsFromFirebase() {
  try {
    const snapshot = await getDocs(jobsCollection);

    jobs = [];

    snapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    renderJobs();
    updateDashboard();

    console.log("Jobs Loaded:", jobs);
  } catch (error) {
    console.error("Error loading jobs:", error);
  }
}
async function saveJobToFirebase(job) {
  try {
    await addDoc(jobsCollection, job);

    await loadJobsFromFirebase();

    console.log("Job saved to Firebase");
  } catch (error) {
    console.error("Firebase Error:", error);
  }
}
async function deleteJobFromFirebase(jobId) {
  try {
    await deleteDoc(doc(db, "jobs", jobId));

    await loadJobsFromFirebase();

    console.log("Job deleted");
  } catch (error) {
    console.error(error);
  }
}
async function updateJobStatus(jobId, newStatus) {
  try {
    const jobRef = doc(db, "jobs", jobId);

    await updateDoc(jobRef, {
      status: newStatus,
    });

    await loadJobsFromFirebase();

    console.log("Status Updated");
  } catch (error) {
    console.error(error);
  }
}
async function updateJobInFirebase(jobId, updatedJob) {
  try {
    const jobRef = doc(db, "jobs", jobId);

    await updateDoc(jobRef, updatedJob);

    await loadJobsFromFirebase();

    console.log("Job Updated");
  } catch (error) {
    console.error(error);
  }
}
// Open Modal
addJobBtn.addEventListener("click", () => {
  jobModal.classList.remove("hidden");
  jobModal.classList.add("flex");
});

// Close Modal
closeModal.addEventListener("click", () => {
  jobModal.classList.add("hidden");
  jobModal.classList.remove("flex");
});

// Form Submit
jobForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const company = companyInput.value.trim();
  const role = roleInput.value.trim();
  const jobLink = jobLinkInput.value.trim();
  const addedBy = addedByInput.value;
  const status = statusInput.value;
  const notes = notesInput.value.trim();
  const resume = resumeInput.files[0];
  if (!company || !role) {
    alert("Please fill all fields");
    return;
  }
  const job = {
    company,
    role,
    jobLink,
    addedBy,
    status,
    notes,
    resumeName: resume ? resume.name : "No Resume",
    resumeUrl: resume ? URL.createObjectURL(resume) : "",
  };
  if (editIndex !== null) {
    updateJobInFirebase(editJobId, job);

    editIndex = null;
    editJobId = null;

    saveJobBtn.textContent = "Save Job";
  } else {
    jobs.push(job);
    saveJobToFirebase(job);
  }
  // localStorage.setItem("jobs", JSON.stringify(jobs));
  console.log(jobs);
  renderJobs();
  updateDashboard();
  // saveToLocalStorage();
  jobForm.reset();
  jobModal.classList.add("hidden");
  jobModal.classList.remove("flex");
});
closeViewModal.addEventListener("click", () => {
  viewModal.classList.add("hidden");
  viewModal.classList.remove("flex");
});
// Render Jobs
function renderJobs() {
  jobTableBody.innerHTML = "";

  jobs.forEach((job, index) => {
    const row = document.createElement("tr");

    row.className = "border-t text-sm";

    row.innerHTML = `
      <td class="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        ${job.company}
      </td>

      <td class="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        ${job.role}
      </td>

      <td class="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        ${job.addedBy}
      </td>

      <td class="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        ${
          job.resumeUrl
            ? `<a href="${job.resumeUrl}" target="_blank"
                 class="text-blue-600 hover:underline">
                 ${job.resumeName}
               </a>`
            : "No Resume"
        }
      </td>

      <td class="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <span class="${
          job.status === "Applied"
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-600"
        } px-3 py-1 rounded-full text-sm font-medium">
          ${job.status}
        </span>
      </td>

      <td class="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <a
          href="${job.jobLink}"
          target="_blank"
          class="text-blue-600 hover:underline"
        >
          Open
        </a>
      </td>

      <td class="px-2 sm:px-6 py-3 sm:py-4">
        <div class="flex flex-col sm:flex-row gap-2">
          <button
            onclick="viewJob(${index})"
            class="text-blue-600 hover:underline"
          >
            View
          </button>

          <button
            onclick="editJob(${index})"
            class="text-yellow-600 hover:underline"
          >
            Edit
          </button>

          <button
            onclick="toggleStatus(${index})"
            class="text-green-600 hover:underline"
          >
            Status
          </button>

          <button
            onclick="deleteJob(${index})"
            class="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </td>
    `;

    jobTableBody.appendChild(row);
  });
}
function updateDashboard() {
  console.log("Dashboard Running");
  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter((job) => job.status === "Applied").length;
  const pendingJobs = jobs.filter((job) => job.status === "Pending").length;
  totalJobsElement.textContent = totalJobs;
  appliedJobsElement.textContent = appliedJobs;
  pendingJobsElement.textContent = pendingJobs;
}
function viewJob(index) {
  const job = jobs[index];
  jobDetails.innerHTML = `
    <p><strong>Company:</strong> ${job.company}</p>
    <p><strong>Role:</strong> ${job.role}</p>
    <p><strong>Added By:</strong> ${job.addedBy}</p>
    <p><strong>Status:</strong> ${job.status}</p>
    <p><strong>Resume:</strong> ${job.resumeName}</p>
    <p>
      <strong>Job Link:</strong>
      <a
        href="${job.jobLink}"
        target="_blank"
        class="text-blue-600 underline"
      >
        Open Job
      </a>
    </p>
    <p>
      <strong>Additional Info:</strong>
      ${job.notes || "No Notes"}
    </p>
  `;
  viewModal.classList.remove("hidden");
  viewModal.classList.add("flex");
}
function saveToLocalStorage() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}
async function deleteJob(index) {
  const confirmDelete = confirm("Are you sure you want to delete this job?");

  if (!confirmDelete) return;

  const job = jobs[index];

  await deleteJobFromFirebase(job.id);
}
async function toggleStatus(index) {
  const job = jobs[index];

  const newStatus = job.status === "Pending" ? "Applied" : "Pending";

  await updateJobStatus(job.id, newStatus);
}
let editIndex = null;
let editJobId = null;
function editJob(index) {
  const job = jobs[index];

  companyInput.value = job.company;
  roleInput.value = job.role;
  jobLinkInput.value = job.jobLink;
  addedByInput.value = job.addedBy;
  statusInput.value = job.status;
  notesInput.value = job.notes;

  editIndex = index;
  editJobId = job.id;
  saveJobBtn.textContent = "Update Job";

  jobModal.classList.remove("hidden");
  jobModal.classList.add("flex");
}
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);

    window.location.href = "./login.html";
  } catch (error) {
    console.error(error);
  }
});
loadJobsFromFirebase();
window.viewJob = viewJob;
window.editJob = editJob;
window.toggleStatus = toggleStatus;
window.deleteJob = deleteJob;
