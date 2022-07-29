import './scss/styles.scss';
// eslint-disable-next-line
import favicon from './favicon.ico';
// eslint-disable-next-line
import * as bootstrap from 'bootstrap';

const resultAlertMap = new Map([
  ['sent', 'Заявка успешно отправлена!'],
  ['exist', 'Заявка уже отправлялась, дождитесь её рассмотрения'],
]);
const calcIframesHeight = (iframes) => iframes.forEach((iframe) => {
  iframe.height = `${(parseFloat(iframe.clientWidth) / 16) * 9}px`;
});

document.addEventListener('DOMContentLoaded', () => {
  const iframes = document.querySelectorAll('iframe');
  const url = new URL(window.location.href);
  const { result = '' } = Object.fromEntries(url.searchParams);
  if (result && resultAlertMap.has(result)) {
    document.querySelector('.alerts').innerHTML = (`
      <div class="alert alert-success" role="alert">
        ${resultAlertMap.get(result)}
      </div>
    `);
    window.history.replaceState(null, null, window.location.pathname);
  }
  window.addEventListener('resize', () => calcIframesHeight(iframes));
  calcIframesHeight(iframes);
});
