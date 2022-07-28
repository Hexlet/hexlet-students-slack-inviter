import favicon from './favicon.ico';
import './scss/styles.scss';
import * as bootstrap from 'bootstrap';

const rusEmailBlockList = [
  'rambler.ru',
  'mail.ru',
  'yandex.ru',
  'ya.ru',
  'bk.ru',
];
const classNameHiddenElement = 'd-none';
const checkRusEmail = (email) => rusEmailBlockList
  .some((domain) => email.includes(domain));

const state = {
  formState: 'filling',
  enabledSlackEmail: false,
  isRusEmailHexlet: false,
  isRusEmailSlack: false,
  hexlet: '',
  slack: '',
};

const render = (el) => {
  if (state.isRusEmailHexlet && !state.enabledSlackEmail) {
    el.containerSlackEmail.classList.remove(classNameHiddenElement);
    state.enabledSlackEmail = true;
  }

  if (state.isRusEmailSlack) {
    el.messageSlackEmail.classList.remove('invisible');
    el.messageSlackEmail.classList.add('visible');
  } else {
    el.messageSlackEmail.classList.remove('visible');
    el.messageSlackEmail.classList.add('invisible');
  }

  if (!state.isRusEmailHexlet) {
    el.form.slack.value = state.hexlet;
  } else {
    el.form.slack.value = state.slack;
  }

  switch (state.formState) {
    case 'sending':
      Array.from(el.form.elements)
        .forEach((element) => element.setAttribute('disabled', 'disabled'));
      state.formState = 'sent';
      render(el);
      break;
    case 'failed':
      Array.from(el.form.elements)
        .forEach((element) => element.removeAttribute('disabled'));
      break;
    case 'sent':
      el.messageRequest.classList.remove(classNameHiddenElement);
      el.form.classList.add(classNameHiddenElement);
      alert(`hexlet=${state.hexlet}\nslack=${state.slack}`);
      break;
    default:
      break;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const el = {
    form: document.forms.email,
    containerSlackEmail: document.querySelector('.slackEmail'),
    messageSlackEmail: document.querySelector('.slackFeedback'),
    messageRequest: document.querySelector('.requestSent'),
  };

  el.form.hexlet.addEventListener('input', (e) => {
    state.isRusEmailHexlet = checkRusEmail(e.target.value);
    state.hexlet = e.target.value;
    render(el);
  });

  el.form.slack.addEventListener('input', (e) => {
    state.isRusEmailSlack = checkRusEmail(e.target.value);
    state.slack = e.target.value;
    render(el);
  });

  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.isRusEmailSlack) return;
    state.hexlet = el.form.hexlet.value;
    state.slack = el.form.slack.value;
    state.formState = 'sending';
    render(el);
  });

  render(el);
});
