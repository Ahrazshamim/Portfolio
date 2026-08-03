/* Ahraz Shamim — portfolio interactions */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- year ---- */
  var y = new Date().getFullYear();
  Array.prototype.forEach.call(document.querySelectorAll('.yr'), function (el) { el.textContent = y; });

  /* ---- scroll progress bar ---- */
  var bar = document.getElementById('progress');
  if (bar) {
    var tick = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    tick();
  }

  /* ---- scroll reveal (also triggers SVG animations via .in) ---- */
  var targets = document.querySelectorAll('.reveal, .fig');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    Array.prototype.forEach.call(targets, function (el, i) {
      if (el.classList.contains('reveal')) {
        el.style.transitionDelay = (Math.min(i % 5, 4) * 60) + 'ms';
      }
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
  }

  /* ---- animated counters ---- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    var dur = 1400, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window && !reduced) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
    } else {
      Array.prototype.forEach.call(counters, function (el) {
        el.textContent = parseFloat(el.dataset.count).toFixed(parseInt(el.dataset.dec || '0', 10));
      });
    }
  }

  /* ---- typewriter role line ---- */
  var tw = document.getElementById('typewriter');
  if (tw) {
    var roles = JSON.parse(tw.dataset.roles || '[]');
    if (reduced) {
      tw.textContent = roles[0] || '';
    } else if (roles.length) {
      var ri = 0, ci = 0, deleting = false;
      (function loop() {
        var word = roles[ri];
        tw.textContent = word.substring(0, ci);
        if (!deleting && ci < word.length) { ci++; setTimeout(loop, 55); }
        else if (!deleting) { deleting = true; setTimeout(loop, 1900); }
        else if (ci > 0) { ci--; setTimeout(loop, 28); }
        else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(loop, 340); }
      })();
    }
  }

  /* ---- image lightbox ---- */
  var zoomables = document.querySelectorAll('.fig-img.zoomable img');
  if (zoomables.length) {
    var lbx = document.createElement('div');
    lbx.className = 'lbx';
    lbx.innerHTML = '<button class="lbx-close" aria-label="Close">✕</button>' +
                    '<img alt=""><div class="lbx-hint">click anywhere or press Esc to close</div>';
    document.body.appendChild(lbx);
    var lbxImg = lbx.querySelector('img');
    function close() { lbx.classList.remove('open'); document.body.style.overflow = ''; }
    Array.prototype.forEach.call(zoomables, function (im) {
      im.addEventListener('click', function () {
        lbxImg.src = im.src;
        lbxImg.alt = im.alt || '';
        lbx.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lbx.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---- inline PDF viewer ---- */
  var docOpeners = document.querySelectorAll('[data-pdf]');
  if (docOpeners.length) {
    var px = document.createElement('div');
    px.className = 'pdfx';
    px.innerHTML =
      '<div class="pdfx-bar">' +
        '<span class="pdfx-title"></span>' +
        '<span class="pdfx-acts">' +
          '<a class="pdfx-new" target="_blank" rel="noopener">Open in new tab ↗</a>' +
          '<a class="pdfx-dl" download>Download ↓</a>' +
          '<button class="pdfx-close" aria-label="Close">Close ✕</button>' +
        '</span>' +
      '</div><iframe title="Document preview"></iframe>';
    document.body.appendChild(px);
    var pxFrame = px.querySelector('iframe');
    var pxTitle = px.querySelector('.pdfx-title');
    var pxNew = px.querySelector('.pdfx-new');
    var pxDl = px.querySelector('.pdfx-dl');

    function closePdf() {
      px.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(function () { pxFrame.src = 'about:blank'; }, 300);
    }
    px.querySelector('.pdfx-close').addEventListener('click', closePdf);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePdf(); });

    Array.prototype.forEach.call(docOpeners, function (el) {
      el.addEventListener('click', function (ev) {
        ev.preventDefault();
        var pdf = el.dataset.pdf;
        var dl = el.dataset.download || pdf;
        pxTitle.textContent = el.dataset.title || 'Document';
        pxNew.href = pdf;
        pxDl.href = dl;
        pxFrame.src = pdf + '#view=FitH';
        px.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  /* ---- recommendations (Supabase, approved only) ---- */
  var recWrap = document.getElementById('rec-list');
  if (recWrap) {
    var CFG = window.SUPABASE_CONFIG || {};
    var configured = CFG.url && CFG.anonKey &&
                     CFG.url.indexOf('YOUR_PROJECT') === -1 &&
                     CFG.anonKey.indexOf('YOUR_ANON_KEY') === -1;

    function initials(name) {
      return (name || '?').trim().split(/\s+/).slice(0, 2)
        .map(function (w) { return w[0]; }).join('').toUpperCase();
    }
    function esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function render(rows) {
      if (!rows || !rows.length) {
        recWrap.innerHTML = '<div class="rec-empty">No recommendations published yet — ' +
          'if we’ve worked together, yours could be the first.</div>';
        return;
      }
      recWrap.innerHTML = rows.map(function (r) {
        return '<div class="rec reveal in">' +
          '<p class="rec-body">' + esc(r.message) + '</p>' +
          '<div class="rec-who"><div class="rec-av">' + esc(initials(r.name)) + '</div><div>' +
          '<div class="rec-nm">' + esc(r.name) + '</div>' +
          '<div class="rec-rl">' + esc(r.role || '') + '</div>' +
          '</div></div></div>';
      }).join('');
    }

    if (configured) {
      fetch(CFG.url + '/rest/v1/recommendations?select=name,role,message&approved=eq.true&order=created_at.desc', {
        headers: { apikey: CFG.anonKey, Authorization: 'Bearer ' + CFG.anonKey }
      })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('fetch failed')); })
        .then(render)
        .catch(function () { render(window.SEED_RECOMMENDATIONS || []); });
    } else {
      render(window.SEED_RECOMMENDATIONS || []);
    }

    /* submission */
    var recForm = document.getElementById('rec-form');
    if (recForm) {
      var recNote = document.getElementById('rec-note');
      recForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var btn = recForm.querySelector('button[type=submit]');
        var payload = {
          name: recForm.name.value.trim(),
          role: recForm.role.value.trim(),
          message: recForm.message.value.trim(),
          approved: false
        };
        if (!configured) {
          recNote.textContent = 'Submissions aren’t connected yet — please email shamimahraz@gmail.com and I’ll add it.';
          recNote.style.color = 'var(--c3)';
          return;
        }
        btn.disabled = true; btn.textContent = 'Sending…';
        fetch(CFG.url + '/rest/v1/recommendations', {
          method: 'POST',
          headers: {
            apikey: CFG.anonKey,
            Authorization: 'Bearer ' + CFG.anonKey,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          },
          body: JSON.stringify(payload)
        })
          .then(function (r) {
            if (!r.ok) throw new Error('bad');
            recForm.reset();
            btn.textContent = 'Submitted ✓';
            recNote.textContent = 'Thank you — it’s with me for a quick review and will appear here shortly.';
            recNote.style.color = 'var(--c6)';
          })
          .catch(function () {
            btn.disabled = false; btn.textContent = 'Submit recommendation';
            recNote.textContent = 'Something went wrong. Please email shamimahraz@gmail.com instead.';
            recNote.style.color = 'var(--c5)';
          });
      });
    }
  }

  /* ---- contact form ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    var note = document.getElementById('form-note');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        note.textContent = 'Form not connected yet — email shamimahraz@gmail.com directly.';
        note.style.color = 'var(--accent)';
        return;
      }
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad');
          form.reset();
          btn.textContent = 'Message sent ✓';
          note.textContent = 'Thanks — I got it. I’ll reply soon.';
          note.style.color = 'var(--c6)';
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Send message';
          note.textContent = 'Something went wrong. Please email shamimahraz@gmail.com instead.';
          note.style.color = 'var(--c5)';
        });
    });
  }
})();
