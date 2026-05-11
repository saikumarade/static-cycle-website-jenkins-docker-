/**
 * contact.js — "Send Message" feature for Cycle Store
 * Hooks into the existing contact form without modifying contact.html.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Locate the SEND button/link on every page ── */
  var sendBtns = document.querySelectorAll('.send_btn a');

  sendBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      // Find nearest form
      var section = btn.closest('.contact_main') || document.querySelector('.contact_main');
      if (!section) return;

      var nameEl    = section.querySelector('input[placeholder="Name"]');
      var emailEl   = section.querySelector('input[placeholder="Email"]');
      var phoneEl   = section.querySelector('input[placeholder="Phone Numbar"]') ||
                      section.querySelector('input[type="tel"]');
      var messageEl = section.querySelector('textarea');

      var name    = nameEl    ? nameEl.value.trim()    : '';
      var email   = emailEl   ? emailEl.value.trim()   : '';
      var phone   = phoneEl   ? phoneEl.value.trim()   : '';
      var message = messageEl ? messageEl.value.trim() : '';

      // ── Validation ────────────────────────────────
      clearErrors(section);

      var valid = true;

      if (!name) {
        showError(nameEl, 'Please enter your name.');
        valid = false;
      }
      if (!email || !isValidEmail(email)) {
        showError(emailEl, 'Please enter a valid email address.');
        valid = false;
      }
      if (!message) {
        showError(messageEl, 'Please enter a message.');
        valid = false;
      }

      if (!valid) return;

      // ── Simulate send (replace with real fetch/ajax if needed) ────────
      btn.textContent = 'Sending…';
      btn.style.pointerEvents = 'none';

      setTimeout(function () {
        btn.textContent = 'SEND';
        btn.style.pointerEvents = '';

        // Clear fields
        if (nameEl)    nameEl.value    = '';
        if (emailEl)   emailEl.value   = '';
        if (phoneEl)   phoneEl.value   = '';
        if (messageEl) messageEl.value = '';

        showMessageToast('Message sent! We\'ll get back to you soon.');
      }, 1200);
    });
  });

  // ── Helpers ─────────────────────────────────────────────────────────────

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(el, msg) {
    if (!el) return;
    el.classList.add('input-error');
    var err = document.createElement('span');
    err.className = 'field-error-msg';
    err.textContent = msg;
    el.parentNode.appendChild(err);
  }

  function clearErrors(section) {
    section.querySelectorAll('.input-error').forEach(function (el) {
      el.classList.remove('input-error');
    });
    section.querySelectorAll('.field-error-msg').forEach(function (el) {
      el.remove();
    });
  }

  function showMessageToast(msg) {
    var toast = document.getElementById('msg-send-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'msg-send-toast';
      toast.className = 'cart-toast msg-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="fa fa-check-circle"></i> ' + msg;
    toast.classList.add('cart-toast--show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('cart-toast--show');
    }, 3500);
  }
});
