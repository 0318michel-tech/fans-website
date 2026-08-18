// FANS site — shared JS
// 统一管理所有页面的交互

// ================ NAV ================
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      links.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove('open');
      }
    });
  }
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.style.background = 'rgba(0,0,0,0.92)';
    } else {
      nav.style.background = 'rgba(0,0,0,0.72)';
    }
  });
}

// ================ REVEAL ON SCROLL ================
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
}

// ================ CASE MODAL ================
function openCase(caseId) {
  const modal = document.getElementById('case-modal-' + caseId);
  if (!modal) { console.error('Modal not found for case', caseId); return; }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { modal.scrollTop = 0; }, 30);
}
function closeCase(caseId) {
  const modal = document.getElementById('case-modal-' + caseId);
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}
function closeAllCases() {
  document.querySelectorAll('.case-modal.open').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllCases(); });

// ================ CATEGORY ORDERS (for reordering within each filter) ================
const CATEGORY_ORDERS = {
  "科技与智造": [1,46,3,2,4,5,6,7],
  "企业与公共": [46,8,9,12,13,14,52,15,48,10,11,16,17,18,19,75,73,74,20,21,22,23,27,25,26],
  "企业":       [46,19,8,75,9,15,48,10,11,14],
  "公共事业":   [13,12,52,16,17,18,64,68,66],
  "企业与商业": [46,8,75,9,15,48,12,13,10,11,14,19,73,74,20,21,22,23,27,25,26,16],
  "商业与产业": [19,73,74,72,75,20,21,22,70,23,24,69,25,26,62,61,27,46,8,9,15,48,10,11,14],
  "商业与企业": [19,73,74,72,75,20,21,22,70,23,24,69,25,26,46,8,9,15,48,10,11,14],
  "文旅与商业": [23,62,19,73,74,72,75,20,21,22,70,24,69,25,26,61],
  "酒管与商业": [27,19,73,74,72,75,20,21,22,70,23,24,69,25,26,61],
  "消费与生活": [29,30,50,28,27,54,51,32,33,56,34,57,35,36,38,39,71,37,55,53,60,58,31,59,14,52],
  "茶饮":       [29,50,34,39,30,51,54,53,71,32,33,31],
  "生活方式":   [34,33,50,54,14,52],
  "时尚":       [36,57,35,52],
  "文化与公益": [52,40,41,42,63,64,68,66,49,65,67,44,45,16,17,18],
  "教育与公益": [16,64,68,66,52,41,17,18,65,49],
};

// 子分类 → 所属大类
const SUB_TO_PARENT = {
  "企业": "企业与公共", "公共事业": "企业与公共", "企业与商业": "企业与公共",
  "商业与企业": "商业与产业", "文旅与商业": "商业与产业", "酒管与商业": "商业与产业",
  "茶饮": "消费与生活", "生活方式": "消费与生活", "时尚": "消费与生活",
  "教育与公益": "文化与公益",
};

// URL param aliases → category
const URL_ALIASES = {
  'tea': '茶饮', '茶饮': '茶饮',
  'consumer': '消费与生活', 'food': '茶饮', 'fashion': '时尚',
  'lifestyle': '生活方式',
  'culture': '文化与公益', 'education': '教育与公益',
  'commerce': '商业与产业', 'business': '商业与企业',
  'commerce-culture': '文旅与商业', 'hotel': '酒管与商业',
  'tech': '科技与智造',
  'public': '企业与公共', 'medical': '企业与公共', 'hospital': '企业与公共',
  'enterprise': '企业', 'utilities': '公共事业', 'energy': '企业',
  'enterprise-commerce': '企业与商业',
};

// ================ CASE FILTERS — multi-category + reorder ================
function initCaseFilters() {
  const filters = document.querySelectorAll('.cases-filter');
  const cards = document.querySelectorAll('.cases-grid .case-card');
  const spreadCases = document.querySelectorAll('.cases-spread .spread-case');
  const navItems = document.querySelectorAll('.case-nav-item');
  if (!filters.length) return;

  function getCaseId(el) {
    // Extract from onclick="openCase(XX)" or id="case-XX" or data-target="case-XX"
    const onclick = el.getAttribute('onclick');
    if (onclick) { const m = onclick.match(/openCase\((\d+)\)/); if (m) return parseInt(m[1]); }
    const id = el.id; if (id) { const m = id.match(/case-(\d+)/); if (m) return parseInt(m[1]); }
    const target = el.dataset.target; if (target) { const m = target.match(/case-(\d+)/); if (m) return parseInt(m[1]); }
    return 0;
  }

  function matchesCategory(el, filter) {
    if (filter === 'all') return true;
    const sections = (el.dataset.sections || '').split(',').map(s => s.trim());
    return sections.includes(filter);
  }

  function applyFilter(filter) {
    filters.forEach(b => b.classList.remove('active', 'active-parent'));
    const btn = document.querySelector(`.cases-filter[data-filter="${filter}"]`);
    if (btn) btn.classList.add('active');

    // 父按钮 label 回显：选子分类时显示「大类 · 子类」
    document.querySelectorAll('.cases-filter-group').forEach(g => {
      const label = g.querySelector('.cases-filter-label');
      if (label) label.textContent = g.dataset.label || g.dataset.parent;
    });
    const parentOf = SUB_TO_PARENT[filter];
    if (parentOf) {
      const g = document.querySelector(`.cases-filter-group[data-parent="${parentOf}"]`);
      if (g) {
        const label = g.querySelector('.cases-filter-label');
        if (label) label.textContent = `${g.dataset.label || parentOf} · ${filter}`;
        const pbtn = g.querySelector('.cases-filter-parent');
        if (pbtn) pbtn.classList.add('active-parent');
      }
    }

    // Resolve URL alias
    const actualFilter = URL_ALIASES[filter] || filter;
    const order = CATEGORY_ORDERS[actualFilter];
    const orderMap = {};
    if (order) { order.forEach((cid, idx) => { orderMap[cid] = idx; }); }

    let visible = 0;

    // Grid view — reorder using CSS order
    cards.forEach(card => {
      const ok = matchesCategory(card, actualFilter);
      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible++;
        const cid = getCaseId(card);
        card.style.order = orderMap[cid] !== undefined ? orderMap[cid] : 999;
      }
    });

    // Spread view — reorder using DOM position
    if (spreadCases.length && order) {
      const spreadParent = spreadCases[0].parentElement;
      const sorted = Array.from(spreadCases).filter(sc => matchesCategory(sc, actualFilter));
      sorted.sort((a, b) => {
        const ai = orderMap[getCaseId(a)] ?? 999;
        const bi = orderMap[getCaseId(b)] ?? 999;
        return ai - bi;
      });
      // Hide non-matching, then append matching in order
      spreadCases.forEach(sc => { sc.style.display = 'none'; });
      sorted.forEach(sc => {
        sc.style.display = '';
        spreadParent.appendChild(sc);
      });
    } else {
      spreadCases.forEach(sc => { sc.style.display = matchesCategory(sc, actualFilter) ? '' : 'none'; });
    }

    // Nav items — filter by category
    navItems.forEach(item => {
      item.style.display = matchesCategory(item, actualFilter) ? '' : 'none';
    });

    // Count
    const countEl = document.getElementById('cases-count');
    if (countEl) countEl.textContent = visible;

    // No results
    let noRes = document.querySelector('.no-results');
    const grid = document.querySelector('.cases-grid');
    if (visible === 0 && grid) {
      if (!noRes) {
        noRes = document.createElement('div');
        noRes.className = 'no-results text-center';
        noRes.style.cssText = 'padding:80px 0;color:var(--gray-5);font-size:14px;grid-column:1/-1;';
        noRes.textContent = '该分类暂无案例';
        grid.appendChild(noRes);
      }
    } else if (noRes) noRes.remove();
  }

  filters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // 触屏：父按钮首次点击先展开子菜单，不立即筛选
      if (btn.classList.contains('cases-filter-parent')) {
        const sm = btn.parentElement.querySelector('.cases-filter-submenu');
        const isTouch = window.matchMedia('(hover: none)').matches;
        if (sm && isTouch && !sm.classList.contains('open')) {
          document.querySelectorAll('.cases-filter-submenu.open').forEach(o => o.classList.remove('open'));
          sm.classList.add('open');
          e.stopImmediatePropagation();
          return;
        }
      }
      document.querySelectorAll('.cases-filter-submenu.open').forEach(o => o.classList.remove('open'));
      applyFilter(btn.dataset.filter);
    });
  });
  // 点击页面其他区域关闭触屏子菜单
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.cases-filter-group')) {
      document.querySelectorAll('.cases-filter-submenu.open').forEach(o => o.classList.remove('open'));
    }
  });

  // URL param
  const params = new URLSearchParams(window.location.search);
  const urlIndustry = params.get('industry');
  if (urlIndustry) {
    const resolved = URL_ALIASES[urlIndustry] || urlIndustry;
    if (CATEGORY_ORDERS[resolved] || document.querySelector(`.cases-filter[data-filter="${resolved}"]`)) {
      setTimeout(() => applyFilter(resolved), 100);
    } else {
      applyFilter('all');
    }
  } else {
    applyFilter('all');
  }

  // Hash navigation — 从 client.html 跳转时滚动到对应案例
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    }
  }
}

// ================ VIEW TOGGLE ================
function initViewToggle() {
  const btns = document.querySelectorAll('.view-toggle-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.body.classList.remove('view-grid', 'view-spread');
      document.body.classList.add('view-' + view);
    });
  });
  document.body.classList.add('view-grid');
}

// ================ CASE NAV SIDEBAR ================
function initCaseNavSidebar() {
  const items = document.querySelectorAll('.case-nav-item');
  const cases = document.querySelectorAll('.spread-case[id]');
  if (!items.length || !cases.length) return;

  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.dataset.target;
      const target = document.getElementById(targetId);
      if (target) {
        const navOffset = 60;
        const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
        const id = entry.target.id;
        items.forEach(it => it.classList.remove('active'));
        const active = document.querySelector(`.case-nav-item[data-target="${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: [0.2, 0.5, 0.8] });
  cases.forEach(c => observer.observe(c));
}

// ================ VIDEO HOVER — case-card + spread + modal ================
function initVideoHover() {
  // Case card hover-to-play (muted, loop)
  document.querySelectorAll('.case-card.has-video').forEach(card => {
    const video = card.querySelector('.case-card-video');
    const img = card.querySelector('.case-card-img');
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
      if (img) img.style.opacity = '0';
      video.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      if (img) img.style.opacity = '1';
      video.style.opacity = '0';
    });
  });

  // Spread case video — autoplay when visible (IntersectionObserver)
  document.querySelectorAll('.spread-case-video').forEach(video => {
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(video);
  });

  // Modal video — play when modal opens
  document.querySelectorAll('.case-modal').forEach(modal => {
    const video = modal.querySelector('.case-modal-video');
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    // Observe modal open/close
    const observer = new MutationObserver(() => {
      if (modal.classList.contains('open')) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
  });
}

// ================ ThingsMore PDF CAROUSEL ================
function initPdfCarousel() {
  const track = document.getElementById('tm-pdf-track');
  const prev = document.getElementById('tm-pdf-prev');
  const next = document.getElementById('tm-pdf-next');
  const dotsBox = document.getElementById('tm-pdf-dots');
  if (!track || !prev || !next || !dotsBox) return;

  const slides = track.querySelectorAll('.tm-pdf-slide');
  const total = slides.length;
  if (total === 0) return;

  dotsBox.innerHTML = '';
  slides.forEach((_, idx) => {
    const d = document.createElement('span');
    d.className = 'tm-pdf-dot' + (idx === 0 ? ' active' : '');
    d.dataset.i = idx;
    dotsBox.appendChild(d);
  });
  const dots = dotsBox.querySelectorAll('.tm-pdf-dot');
  let current = 0;

  function goTo(i) {
    current = (i + total) % total;
    track.scrollTo({ left: track.clientWidth * current, behavior: 'smooth' });
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }
  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, idx) => { d.addEventListener('click', () => goTo(idx)); });

  let scrollTimer = null;
  track.addEventListener('scroll', () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const w = track.clientWidth;
      const idx = Math.round(track.scrollLeft / w);
      if (idx !== current) {
        current = idx;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }
    }, 80);
  });
}

// ================ INIT ================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initCaseFilters();
  initViewToggle();
  initVideoHover();
  initCaseNavSidebar();
  initPdfCarousel();
});
