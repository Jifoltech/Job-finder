// document.body.style.opacity = 0;
(function ($) {
  "use strict";

  // Spinner+
  let spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".sticky-top").css("top", "0px");
    } else {
      $(".sticky-top").css("top", "-100px");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Header carousel
  $(".header-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    items: 1,
    dots: true,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    margin: 24,
    dots: true,
    loop: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
})(jQuery);

// cleanUp modals
function forceCloseAllModals() {
  // Hide all visible modals manually
  document.querySelectorAll(".modal.show").forEach((modalEl) => {
    const instance = bootstrap.Modal.getInstance(modalEl);
    instance?.hide();
  });

  // Remove backdrops
  document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

  // Remove scroll-locking class
  document.body.classList.remove("modal-open");

  // Clear inline styles added by Bootstrap (which may block scroll)
  document.body.style = "";

  window.scrollTo(0, 0);
}

// Toggle the login and signup modals for Job Seekers
let loginModal;
let signupModal;
const loginModalElement = document.getElementById("loginModal");
if (loginModalElement) {
  loginModal = new bootstrap.Modal(loginModalElement);
}
const signupModalElement = document.getElementById("signupModal");
if (signupModalElement) {
  signupModal = new bootstrap.Modal(signupModalElement);
}

document.getElementById("switchToSignup")?.addEventListener("click", (e) => {
  e.preventDefault();
  loginModal.hide();
  signupModal.show();
});

document.getElementById("switchToLogin")?.addEventListener("click", (e) => {
  e.preventDefault();
  signupModal.hide();
  loginModal.show();
});

// Toggle the login and signup modals for Employers
let recruiterSignupModal;
let recruiterLoginModal;
const recruiterSignupModalElement = document.getElementById(
  "recruiterSignupModal"
);
if (recruiterSignupModalElement) {
  recruiterSignupModal = new bootstrap.Modal(recruiterSignupModalElement);
}

const recruiterLoginModalElement = document.getElementById(
  "recruiterLoginModal"
);
if (recruiterLoginModalElement) {
  recruiterLoginModal = new bootstrap.Modal(recruiterLoginModalElement);
}

document
  .getElementById("switchToRecruiterLogin")
  ?.addEventListener("click", function (e) {
    e.preventDefault();
    recruiterSignupModal.hide();
    recruiterLoginModal.show();
  });

document
  .getElementById("switchToRecruiterSignup")
  ?.addEventListener("click", function (e) {
    e.preventDefault();
    recruiterLoginModal.hide();
    recruiterSignupModal.show();
  });

document.querySelectorAll(".modal").forEach((modalEl) => {
  modalEl.addEventListener("hidden.bs.modal", () => {
    const anyOpen = document.querySelectorAll(".model.show");
    if (!anyOpen) {
      forceCloseAllModals();
    }
  });
});

document.querySelectorAll(".btn-cancel").forEach((btn) => {
  btn.addEventListener("click", () => {
    forceCloseAllModals();
  });
});
