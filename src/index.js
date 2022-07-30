import './scss/styles.scss';
// eslint-disable-next-line
import favicon from './favicon.ico';
// eslint-disable-next-line
import * as bootstrap from 'bootstrap';

const sendRequest = ({ hexlet, slack }) => {
  const body = {
    user: slack,
    team_domain: 'hexlet-students',
    badge_url: 'hexlet',
    badge_type: 'questions',
    answers: [
      {
        question: 'hexlet',
        require: true,
        answer: hexlet,
      },
    ],
    newsletter_checked: false,
  };

  // return Promise.reject(new Error('ААААаааааААааааА!!!1!'));
  return Promise.resolve({
    code: Math.round(Math.random()),
    body,
  });

  // return fetch('https://communityinviter.com/api/questions-invite', {
  //   method: 'POST',
  //   body: JSON.stringify(body),
  //   headers: {
  //     'Content-Type': 'application/json; charset=UTF-8',
  //   },
  // })
  //   .then((res) => {
  //     if (res.ok) {
  //       return res.json();
  //     }
  //
  //     return res
  //       .json()
  //       .then(({ message }) => {
  //         res.message = message || `Ошибка ${res.status}`;
  //         return Promise.reject(res);
  //       });
  //   })
  //   .catch((err) => {
  //     // eslint-disable-next-line
  //     console.error(err);
  //     throw new Error(`Ошибка отправки инвайта: ${err.message}`);
  //   });
};

const rusEmailBlockList = [
  'rambler.ru',
  // 'mail.ru',
  // 'yandex.ru',
  // 'ya.ru',
  // 'bk.ru',
];
const classNameHiddenElement = 'd-none';
const checkRusEmail = (email) => rusEmailBlockList
  .some((domain) => email.endsWith(`@${domain}`));
const emailRegex = /^.+@.+\..+$/i;
const checkEmail = (email) => emailRegex.test(email);

const state = {
  formState: 'filling',
  formSendResult: '',
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

  if (!state.isRusEmailHexlet && !state.enabledSlackEmail) {
    el.form.slack.value = state.hexlet;
  } else {
    el.form.slack.value = state.slack;
  }

  switch (state.formState) {
    case 'sending': {
      Array.from(el.form.elements)
        .forEach((element) => element.setAttribute('disabled', 'disabled'));

      if (!(checkEmail(state.hexlet) && checkEmail(state.slack))) {
        // eslint-disable-next-line
        alert('Почта не прошла проверку на корректность. Она должна быть вида: name@domain.com');
        state.formState = 'failed';
        render(el);

        break;
      }

      sendRequest(state)
        .then((res) => {
          state.formState = 'sent';
          const code = (res.code !== undefined) ? parseFloat(res.code) : -1;
          if (code === 1 || code === 0) {
            state.formSendResult = (code === 1) ? 'sent' : 'exist';
          }
          render(el);
        })
        .catch((err) => {
          state.formState = 'failed';
          // eslint-disable-next-line
          alert(err);
          render(el);
        });

      break;
    }
    case 'failed':
      Array.from(el.form.elements)
        .forEach((element) => element.removeAttribute('disabled'));
      break;
    case 'sent':
      el.form.classList.add(classNameHiddenElement);
      window.location.href = `instruction.html?result=${state.formSendResult}`;
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
