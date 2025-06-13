const supabaseUrl = "https://xggkazgrvukinslmcxmn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZ2themdydnVraW5zbG1jeG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjQ5OTUsImV4cCI6MjA2Mzg0MDk5NX0.dyfDeUsmAz2tIA6R1_CrrWfg_LuJwmwRvbVIX3Y62YY";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// handling User login
const loginElement = document.getElementById("login-form");
if (loginElement) {
  loginElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/job-list.html";
    }
  });
}

// handling User signup
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "job_seeker",
        },
      },
    });

    if (error) {
      alert("Sign-up failed: " + error.message);
    } else {
      alert("Account created! Please check your email to confirm.");
      signupModal.hide();
      loginModal.show();
    }
  });
}

// check if Recruiter already signed in
// document.getElementById("postJobBtn")?.addEventListener("click", async (e) => {
//   e.preventDefault();
//   const {
//     data: { user },
//     error,
//   } = await supabaseClient.auth.getUser();
//   if (error || !user) {
//     recruiterLoginModal?.show();
//   }
// });

// handling Recruiter signup logic
const recruiterSignupForm = document.getElementById("recruiter-signup-form");
if (recruiterSignupForm) {
  recruiterSignupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("recruiterEmail").value;
    const password = document.getElementById("recruiterPassword").value;
    const company = document.getElementById("company").value;

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { role: "recruiter", company },
      },
    });

    if (error) {
      alert("Signup error: " + error.message);
    } else {
      const userId = data.user?.id;
      if (userId) {
        const { error: insertError } = await supabaseClient
          .from("recruiters")
          .insert([{ id: userId, email, company, role: "recruiter" }]);
      }

      alert("Account created successfully.");
      recruiterSignupModal.hide();
      recruiterLoginModal.show();
    }
  });
}

// If still logged In
document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await supabaseClient.auth.getUser();

  const user = data?.user;

  // Only redirect if logged in as recruiter and not coming from logout
  if (user && user.user_metadata?.role === "recruiter") {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes("recruiter-login");

    // Prevent redirect loop
    if (isLoginPage) {
      window.location.href = "/recruiter-dashboard.html";
    }
  }
});

//   handling Recruiter login form
const recruiterLoginForm = document.getElementById("recruiter-login-form");
if (recruiterLoginForm) {
  recruiterLoginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("recruiterLoginEmail").value;
    const password = document.getElementById("recruiterLoginPassword").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login error: " + error.message);
      return;
    }

    const user = data.user;
    if (user.user_metadata.role !== "recruiter") {
      alert("Access denied. You're not a recruiter.");
      await supabaseClient.auth.signOut();
      return;
    }

    // Now check if recruiter record already exists
    try {
      const { data: recruiterRecord, error: checkError } = await supabaseClient
        .from("recruiters")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking recruiter:", checkError.message);
        return;
      }

      // Only insert if not found
      if (!recruiterRecord) {
        const { error: insertError } = await supabaseClient
          .from("recruiters")
          .insert([
            {
              id: user.id,
              email: user.email,
              company: user.user_metadata?.company || "Unknown",
              role: "recruiter",
            },
          ]);

        if (insertError) {
          if (insertError.code === "23505") {
            console.warn("Recruiter already exists. Skipping insert.");
          } else {
            console.error("Insert recruiter failed:", insertError.message);
            alert("Something went wrong setting up your recruiter account.");
            return;
          }
        }
      }
    } catch (e) {
      console.error("Unexpected error during recruiter insert:", e.message);
      return;
    }

    recruiterLoginModal.hide();
    window.location.href = "/recruiter-dashboard.html";
  });
}

// Directing recruiter to post job page
document.addEventListener("DOMContentLoaded", () => {
  const postJobBtn = document.getElementById("postJobBtn");

  if (postJobBtn) {
    postJobBtn.addEventListener("click", () => {
      window.location.href = "/postJob.html";
    });
  }
});

// Job posting form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("jobForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const jobData = {
        title: document.getElementById("jobTitle").value,
        description: document.getElementById("jobDescription").value,
        job_type: document.getElementById("jobType").value,
        location: document.getElementById("location").value,
        salary: document.getElementById("salary").value,
        requirements: document.getElementById("requirements").value,
        category: document.getElementById("category").value,
      };

      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (userError || !user) {
        alert("User not logged in: " + error.message);
        return;
      }

      const { data, error } = await supabaseClient.from("jobs").insert([
        {
          title: jobData.title,
          description: jobData.description,
          job_type: jobData.job_type,
          location: jobData.location,
          salary: jobData.salary,
          requirements: jobData.requirements,
          category: jobData.category,
          recruiter_id: user.id,
          company: user.user_metadata?.company,
        },
      ]);

      if (error) {
        console.error("Error posting job:", error.message);
      } else {
        alert("Job posted successfully!");
        form.reset();
        window.location.href = "/job-list.html";
      }
    });
  }
});

// Rendering latest job
async function fetchJobs() {
  const { data: jobs, error } = await supabaseClient.from("jobs").select("*");

  if (error) {
    console.error("Error fetching jobs:", error);
    return;
  }

  const container = document.getElementById("jobList");
  container.innerHTML = "";

  jobs.forEach((job) => {
    const postedAt = job.created_at
      ? new Date(job.created_at).toLocaleDateString()
      : "Unknown";

    container.innerHTML += `
      <div class="job-item p-4 mb-4">
        <div class="row g-4">
          <div class="col-sm-12 col-md-8 d-flex align-items-center">
            <div class="text-start ps-4">
              <h5 class="mb-3">${job.title}</h5>
              <span class="text-truncate me-3">
                <i class="fa fa-map-marker-alt text-primary me-2"></i>${job.location}
              </span>
              <span class="text-truncate me-3">
                <i class="far fa-clock text-primary me-2"></i>${job.job_type}
              </span>
              <span class="text-truncate me-0">
                <i class="far fa-money-bill-alt text-primary me-2"></i>${job.salary}
              </span>
            </div>
          </div>
          <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
            <div class="d-flex mb-3">
              <a class="btn btn-light btn-square me-3" href="#">
                <i class="far fa-heart text-primary"></i>
              </a>
              <a class="btn btn-primary" href="job-detail.html?job_id=${job.id}">
                Apply Now
              </a>
            </div>
            <small class="text-truncate">
              <i class="far fa-calendar-alt text-primary me-2"></i>
              Posted on: ${postedAt}
            </small>
          </div>
        </div>
      </div>
    `;
  });
}
document.addEventListener("DOMContentLoaded", fetchJobs);

// Fetching job details
async function fetchJobDetails() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("job_id");
  console.log("Job Id from Url:", jobId);

  if (!jobId) {
    console.error("Job ID not found in URL");
    return;
  }

  const { data: job, error } = await supabaseClient
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();
  console.log("job fetched:", job);

  if (error || !job) {
    console.error("Job not found", error);
    return;
  }

  document.getElementById("jobTitle").textContent = job.title || "N/A";
  document.getElementById("jobLocation").textContent = job.location || "N/A";
  document.getElementById("jobType").textContent = job.job_type || "N/A";
  document.getElementById("jobSalary").textContent = job.salary || "N/A";
  document.getElementById("jobDescription").textContent =
    job.description || "No description available";
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("job-detail.html")) {
    fetchJobDetails();
  }
});

// Handling form submission for job applications
const applyForm = document.getElementById("applyForm");

if (applyForm) {
  applyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const jobId = new URLSearchParams(window.location.search).get("job_id");
    const name = document.getElementById("applicantName").value;
    const email = document.getElementById("applicantEmail").value;
    const website = document.getElementById("applicantWebsite").value;
    const coverLetter = document.getElementById("coverLetter").value;
    const cvFile = document.getElementById("cvUpload").files[0];

    if (!cvFile) {
      alert("Please upload a CV");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      alert("Please log in to apply.");
      return;
    }
    // check if recruiter is the one applying for his own job
    const { data: job, error: jobError } = await supabaseClient
      .from("jobs")
      .select("recruiter_id")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      alert("failed to fetch job info");
      return;
    }

    if (job.recruiter_id === user.id) {
      alert("You cannot apply for your own job.");
      return;
    }

    // Upload CV to Supabase Storage
    const filePath = `private/${user.id}/cv-${Date.now()}-${cvFile.name}`;

    const { data: uploadData, error: uploadError } =
      await supabaseClient.storage.from("cv-uploads").upload(filePath, cvFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: cvFile.type,
      });

    if (uploadError) {
      alert("Failed to upload CV: " + uploadError.message);
      return;
    }

    // Get public URL of the uploaded CV
    const { data: publicUrlData } = supabaseClient.storage
      .from("cv-uploads")
      .getPublicUrl(filePath);

    const cv_url = publicUrlData.publicUrl;

    // Insert application into the database
    const { error: insertError } = await supabaseClient
      .from("applications")
      .insert([
        {
          job_id: jobId,
          user_id: user.id,
          name,
          email,
          website,
          cover_letter: coverLetter,
          cv_url,
        },
      ]);

    if (insertError) {
      alert("Application submission failed: " + insertError.message);
      return;
    }

    alert("Application submitted successfully!");

    // Update the Apply Now button
    document.getElementById("applyForm").reset();
    const applyBtn = document.getElementById("applyBtn");
    applyBtn.disabled = true;
    applyBtn.textContent = "Applied";

    setTimeout(() => {
      window.location.href = "job-list.html";
    }, 1500);
  });
}

//Recruiters Dashboard
// fetch authenticated recruiter and their jobs

async function getRecruiterJobs() {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();
  if (error || !user) {
    console.warn("No user found or error retrieving user.");
    return [];
  }

  const role = user.user_metadata?.role;
  if (role !== "recruiter") {
    console.warn("Access denied. Not a recruiter.");
    return [];
  }

  const { data: jobs, error: jobsError } = await supabaseClient
    .from("jobs")
    .select("id, title")
    .eq("recruiter_id", user.id);

  if (jobsError) {
    console.error("Error fetching jobs:", jobsError);
    return;
  }

  return jobs;
}

// fetch Applications linked to jobs
async function getApplicationsForRecruiter() {
  const jobs = await getRecruiterJobs();
  if (!jobs || jobs.length === 0) {
    console.warn("No jobs found for the recruiter.");
    return;
  }

  const jobIds = jobs.map((job) => job.id);
  console.log("Recruiter job IDs:", jobIds);

  const { data: applications, error } = await supabaseClient
    .from("applications")
    .select("id, name, email, cv_url, job_id")
    .in("job_id", jobIds);

  if (error) {
    console.error("Error fetching applications:", error);
    return;
  }
  console.log("Applications fetched:", applications);

  return { applications, jobs };
}

// Rendering recruiter dashboard
async function renderDashboard() {
  const result = await getApplicationsForRecruiter();
  if (!result) return;

  const { applications, jobs } = result;
  const jobTitleMap = Object.fromEntries(
    jobs.map((job) => [job.id, job.title])
  );

  const { publicUrl } = supabaseClient.storage
    .from("cv-uploads")
    .getPublicUrl("app.cv_url").publicUrl;

  const list = document.getElementById("applicationsList");
  list.innerHTML = "";

  applications.forEach((app) => {
    list.innerHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5>${app.name}</h5>
          <p>Email: ${app.email}</p>
          <p>Applied for: ${jobTitleMap[app.job_id]}</p>
          <a href="${publicUrl}" target="_blank">Download Document</a>
        </div>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", renderDashboard);

// handling Recruiter logout
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/index.html";
});
