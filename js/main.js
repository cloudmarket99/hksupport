document.addEventListener('DOMContentLoaded', () => {
  // Initialize counter animations
  initCounters();

  // Initialize Tax Refund Calculator
  initCalculator();

  // Initialize FAQ Accordion
  initAccordion();

  // Initialize Consultation Modal
  initModal();

  // Initialize Inline Lead Application Form
  initInlineLeadForm();

  // Initialize Sticky Bottom Bar scroll handler
  initFloatingBar();

  // Initialize Mobile Menu
  initMobileMenu();
});

/* Animated Counters */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target], .analytics-value[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetAttr = entry.target.getAttribute('data-target');
        const target = parseFloat(targetAttr);
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const isDecimal = targetAttr.includes('.');
        animateValue(entry.target, 0, target, 2000, prefix, suffix, isDecimal);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(num => observer.observe(num));
}

function animateValue(element, start, end, duration, prefix, suffix, isDecimal) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = easeOutProgress * (end - start) + start;
    const formattedValue = isDecimal ? currentValue.toFixed(1) : Math.floor(currentValue).toLocaleString();
    element.textContent = `${prefix}${formattedValue}${suffix}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/* Tax Refund Calculator Logic */
function initCalculator() {
  const bizTypeSelect = document.getElementById('calc-biz-type');
  const employeesInput = document.getElementById('calc-employees');
  const yearsSelect = document.getElementById('calc-years');
  const resultAmountEl = document.getElementById('calc-result-amount');

  if (!bizTypeSelect || !employeesInput || !yearsSelect || !resultAmountEl) return;

  function calculateTaxRefund() {
    const bizType = bizTypeSelect.value;
    const employees = parseInt(employeesInput.value) || 1;
    const years = parseInt(yearsSelect.value) || 1;

    let baseRatePerEmployee = bizType === 'corp' ? 750 : 550; // 만원 단위 (750만원/명)
    
    // 계산식: 고용인원 * 5년간 환급가능율 * 사업기간 감안
    let estimatedRefund = employees * baseRatePerEmployee * Math.min(years, 5) * 0.85;

    // 만원 -> 억/만원 포맷팅
    if (estimatedRefund >= 10000) {
      const eok = (estimatedRefund / 10000).toFixed(1);
      resultAmountEl.textContent = `약 ${eok} 억 원`;
    } else {
      const man = Math.round(estimatedRefund);
      resultAmountEl.textContent = `약 ${man.toLocaleString()} 만 원`;
    }
  }

  bizTypeSelect.addEventListener('change', calculateTaxRefund);
  employeesInput.addEventListener('input', calculateTaxRefund);
  yearsSelect.addEventListener('change', calculateTaxRefund);

  calculateTaxRefund();
}

/* FAQ Accordion Toggle */
function initAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* Modal Window & Lead Capture Logic */
function initModal() {
  const modalOverlay = document.getElementById('consulting-modal');
  const openButtons = document.querySelectorAll('.btn-open-modal');
  const closeButton = document.querySelector('.modal-close');
  const leadForm = document.getElementById('lead-form');

  if (!modalOverlay) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const companyName = document.getElementById('input-company').value;
      const phone = document.getElementById('input-phone').value;

      if (!companyName || !phone) {
        showToast('⚠ 대표자명(기업명)과 연락처를 입력해 주세요.', 'warning');
        return;
      }

      closeModal();
      showToast(`🎉 ${companyName} 대표님, 1:1 세무·법률·회계 무상진단이 정상 신청되었습니다! 곧 담당 전문가가 연락드립니다.`, 'success');
      leadForm.reset();
    });
  }
}

/* Main Inline Lead Application Form Handler */
function initInlineLeadForm() {
  const mainLeadForm = document.getElementById('main-lead-form');
  if (!mainLeadForm) return;

  mainLeadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const companyName = document.getElementById('main-input-company').value;
    const phone = document.getElementById('main-input-phone').value;

    if (!companyName || !phone) {
      showToast('⚠ 대표자명(기업명)과 연락처를 입력해 주세요.', 'warning');
      return;
    }

    showToast(`🎉 ${companyName} 대표님, 1:1 세무·법률·회계 무상진단이 정상 신청되었습니다! 곧 담당 전문가가 연락드립니다.`, 'success');
    mainLeadForm.reset();
  });
}

/* Floating Bottom Consultation Bar Handler - PERMANENTLY VISIBLE WHEN SCROLLED */
function initFloatingBar() {
  const floatingBar = document.getElementById('floating-bar');
  if (!floatingBar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      floatingBar.style.opacity = '1';
      floatingBar.style.pointerEvents = 'auto';
    } else {
      floatingBar.style.opacity = '0';
      floatingBar.style.pointerEvents = 'none';
    }
  });
}

/* Mobile Menu Drawer */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isVisible = navMenu.style.display === 'flex';
    navMenu.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '84px';
      navMenu.style.left = '0';
      navMenu.style.right = '0';
      navMenu.style.backgroundColor = '#ffffff';
      navMenu.style.padding = '24px';
      navMenu.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    }
  });
}

/* Global Toast Notification System */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<div>${message}</div>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
