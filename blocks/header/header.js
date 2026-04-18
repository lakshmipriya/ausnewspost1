import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-drop').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

export default async function decorate(block) {

  // 🔥 CLEAR DEFAULT CONTENT
  block.textContent = '';

  // ===== CREATE NAV ROOT =====
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // ===== YOUR AUSTRALIA POST HEADER =====
  nav.innerHTML = `
    <header>
      <div class="centraliser">
        <a href="/" id="logo">
          <img src="/assets/img/logo.png" alt="Australia Post Newsroom">
        </a>

        <div class="contact">
          <a href="tel:+61391066666" class="phone">
            <img src="/assets/img/icon-phone.svg">
            <span>+61 3 9106 6666 (24/7 National Media Line)</span>
          </a>

          <a href="mailto:media@auspost.com.au" class="email">
            <img src="/assets/img/icon-email.svg">
            <span>media@auspost.com.au</span>
          </a>
        </div>
      </div>
    </header>

    <div class="nav-sections">
      <div class="centraliser">

        <ul>
          <li><a href="/">Home</a></li>

          <li class="nav-drop" aria-expanded="false">
            <a href="/section/news">News</a>
            <ul>
              <li><a href="/section/news/general">General</a></li>
              <li><a href="/section/news/executives">Executives</a></li>
              <li><a href="/section/news/speeches">Speeches</a></li>
              <li><a href="/archive/news">News Archive</a></li>
            </ul>
          </li>

          <li class="nav-drop" aria-expanded="false">
            <a href="/section/stamps">Stamps</a>
            <ul>
              <li><a href="/section/stamps/royal">Royal</a></li>
              <li><a href="/section/stamps/sport">Sport</a></li>
              <li><a href="/section/stamps/arts%20and%20culture/">Arts</a></li>
              <li><a href="/section/stamps/history">History</a></li>
            </ul>
          </li>

          <li><a href="/section/video">Video</a></li>
          <li><a href="/photos">Photos</a></li>
        </ul>

      </div>
    </div>
  `;

  // ===== DROPDOWN CLICK =====
  const navSections = nav.querySelector('.nav-sections');

  nav.querySelectorAll('.nav-drop').forEach((item) => {
    item.addEventListener('click', () => {
      if (isDesktop.matches) {
        const expanded = item.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);
        item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      }
    });
  });

  // ===== HAMBURGER =====
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');

  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;

  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  // ===== FINAL APPEND =====
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  navWrapper.append(nav);
  block.append(navWrapper);
}
