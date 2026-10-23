import {
  entropyBits,
  constrainedEntropy,
  generatePassword,
  generatePassphrase,
} from "./password.js";
import { SET_NAMES, validateSettings } from "./settings.js";
import { SCENARIOS, modelAttack } from "./threat-model.js";
import { EFF_WORDS } from "./wordlist.js";
const $ = (selector) => document.querySelector(selector);
const copy = {
  ru: {
    skip: "Перейти к генератору",
    local: "Только на устройстве",
    eyebrow: "Без аккаунта и облака",
    heading: "Генератор\nпаролей",
    intro:
      "Задайте длину и набор символов. Стойкость к подбору оценим сразу.",
    mechanism:
      "Работает на вашем устройстве. Без отправки результата в сеть.",
    noStorage: "Без сохранения",
    downloadOffline: "Скачать офлайн",
    password: "Новый пароль",
    phrase: "Новая парольная фраза",
    copy: "Скопировать",
    show: "Показать",
    hide: "Скрыть",
    estimate: "энтропия генерации",
    length: "Длина",
    words: "Слов",
    lengthLabel: "Длина пароля",
    wordsLabel: "Количество слов",
    characters: "Разрешённые символы",
    generate: "Новый пароль",
    generatePhrase: "Новая фраза",
    footer: "Пароли не сохраняются",
    how: "О проекте и безопасности",
    close: "Закрыть",
    aboutLocal:
      "NYQVRA создаёт пароли на вашем устройстве с помощью криптографического источника случайности Web Crypto. Отбрасывание неподходящих случайных значений устраняет смещение выбора. Пароли не отправляются и не сохраняются.",
    aboutTypes:
      "Выбранные наборы разрешены, но не обязаны встретиться в результате. Опция «Хотя бы один…» включает равномерный выбор только среди паролей с каждым выбранным набором.",
    aboutSave:
      "После копирования сохраните пароль в своём менеджере паролей. Истории и восстановления в NYQVRA нет.",
    aboutClipboard:
      "Пароль остаётся в системном буфере обмена. История и синхронизация буфера управляются вашей системой.",
    aboutAudit:
      "Это модель безопасности, не независимый аудит и не гарантия защиты аккаунта. NYQVRA не создаёт seed-фразы и приватные ключи.",
    invalid: "Введите целое число от 8 до 128.",
    invalidPhrase: "Выберите от 4 до 10 слов.",
    empty: "Выберите хотя бы один набор символов.",
    crypto: "Криптографическая генерация недоступна. Новый пароль не создан.",
    pending: "Настройки изменены. Создайте новый результат.",
    generated: "Новый пароль готов.",
    generatedPhrase: "Новая фраза готова.",
    copied:
      "Скопировано. Сохраните в менеджере паролей — NYQVRA не хранит историю.",
    copiedPrevious:
      "Предыдущий пароль скопирован. Сохраните его в менеджере паролей.",
    copyError:
      "Не удалось скопировать. Выделите результат и скопируйте вручную.",
    low: "Рассмотрите большую длину",
    bits: "бит",
    generator: "генератор паролей",
    types: [
      "Заглавные латинские буквы",
      "Строчные латинские буквы",
      "Цифры",
      "Специальные символы",
    ],
    threatTitle: "Один пароль · разные условия атаки",
    modelLabel: "Модель, не прогноз",
    onlineTitle: "Вход на сервис",
    slowTitle: "Утечка · медленная проверка",
    fastTitle: "Утечка · быстрая проверка",
    modelCaption:
      "Среднее время нахождения при переборе. Скорости условные — это не прогноз взлома.",
    modelDetails: "На чём основана оценка",
    modelAssumptions:
      "Перебор без повторов и без знания пароля. При утечке скорость зависит от алгоритма хранения, его настроек и оборудования. При входе — от ограничений сервиса; блокировки и MFA в расчёт не включены.",
    modelLimits:
      "Модель не учитывает фишинг, вредоносное ПО, повторное использование и утечку самого пароля. Она не гарантирует безопасность аккаунта.",
    rateLabel: "Своя скорость, попыток/с",
    periodLabel: "Период",
    hour: "1 час",
    day: "1 день",
    year: "1 год",
    rateUnit: "попыток/с",
    lessSecond: "менее секунды",
    seconds: "с",
    minutes: "мин",
    hours: "ч",
    days: "дн.",
    years: "лет",
    average: "Среднее время",
    chance: "Вероятность нахождения за выбранный период",
    invalidRate: "Введите скорость от 1 до 10¹⁵ попыток/с.",
    format: "Формат",
    formatPassword: "Пароль",
    formatPhrase: "Парольная фраза",
    requireEach: "Хотя бы один символ из каждого выбранного набора",
    phraseNote:
      "Английские слова из списка EFF. Фиксированный пробел между словами не добавляет энтропии.",
  },
  en: {
    skip: "Skip to generator",
    local: "On your device only",
    eyebrow: "No account. No cloud.",
    heading: "Password\ngenerator",
    intro:
      "Choose the length and characters. See guessing resistance at a glance.",
    mechanism:
      "Runs on your device. Results are never sent online.",
    noStorage: "Never stored",
    downloadOffline: "Download offline",
    password: "New password",
    phrase: "New passphrase",
    copy: "Copy password",
    show: "Show",
    hide: "Hide",
    estimate: "generation entropy",
    length: "Length",
    words: "Words",
    lengthLabel: "Password length",
    wordsLabel: "Number of words",
    characters: "Allowed characters",
    generate: "New password",
    generatePhrase: "New passphrase",
    footer: "Passwords are never stored",
    how: "About & security",
    close: "Close",
    aboutLocal:
      "NYQVRA generates passwords on your device using Web Crypto, a cryptographic random source. Rejection sampling removes selection bias. Passwords are not sent or saved.",
    aboutTypes:
      "Selected sets are allowed, not guaranteed. The “At least one…” option samples uniformly only from passwords containing every selected set.",
    aboutSave:
      "After copying, save the password in your password manager. NYQVRA has no history or recovery.",
    aboutClipboard:
      "Copied passwords remain on the system clipboard. Clipboard history and sync are managed by your operating system.",
    aboutAudit:
      "This is a security model, not an independent audit or an account protection guarantee. NYQVRA does not create seed phrases or private keys.",
    invalid: "Enter a whole number from 8 to 128.",
    invalidPhrase: "Choose 4 to 10 words.",
    empty: "Choose at least one character set.",
    crypto:
      "Cryptographic generation is unavailable. No new password was created.",
    pending: "Settings changed. Generate a new result.",
    generated: "Your new password is ready.",
    generatedPhrase: "Your new passphrase is ready.",
    copied: "Copied. Save it in your password manager — NYQVRA has no history.",
    copiedPrevious:
      "Previous password copied. Save it in your password manager.",
    copyError: "Could not copy. Select the result and copy it manually.",
    low: "Consider a longer password",
    bits: "bits",
    generator: "password generator",
    types: [
      "Uppercase Latin letters",
      "Lowercase Latin letters",
      "Digits",
      "Special characters",
    ],
    threatTitle: "One password · different attack conditions",
    modelLabel: "Model, not a forecast",
    onlineTitle: "Service login",
    slowTitle: "Leak · slow verification",
    fastTitle: "Leak · fast verification",
    modelCaption:
      "Average exhaustive-search time. Rates are illustrative — this is not a cracking forecast.",
    modelDetails: "What the estimate is based on",
    modelAssumptions:
      "Search without repeated guesses or knowledge of the password. After a hash leak, rates depend on the storage algorithm, its parameters and hardware. Login rates depend on the service; lockouts and MFA are not included.",
    modelLimits:
      "This model does not cover phishing, malware, password reuse or plaintext disclosure. It does not guarantee account security.",
    rateLabel: "Custom rate, guesses/s",
    periodLabel: "Period",
    hour: "1 hour",
    day: "1 day",
    year: "1 year",
    rateUnit: "guesses/s",
    lessSecond: "under a second",
    seconds: "s",
    minutes: "min",
    hours: "h",
    days: "days",
    years: "years",
    average: "Average time",
    chance: "Chance of finding it within the selected period",
    invalidRate: "Enter a rate between 1 and 10¹⁵ guesses/s.",
    format: "Format",
    formatPassword: "Password",
    formatPhrase: "Passphrase",
    requireEach: "At least one character from every selected set",
    phraseNote:
      "English words from the EFF list. The fixed “-” separator adds no entropy.",
  },
};
Object.assign(copy.ru, {
  why: "Почему такая оценка?",
  modelLead:
    "Длина увеличивает число вариантов. Криптографическая случайность делает каждый из них равновероятным.",
  large: "Большой запас для перебора",
  moderate: "Есть запас для перебора",
  low: "Лучше увеличить длину",
  modelDetails: "Допущения и свой сценарий",
  millionYears: "более 1 млн лет",
  ratingRule:
    "«Большой запас» означает вероятность нахождения менее 1 к триллиону за сутки при условных 10 млрд попыток/с. «Есть запас» — менее 1 к миллиону. Это правила интерфейса, не стандарт безопасности.",
});
Object.assign(copy.en, {
  why: "Why this estimate?",
  modelLead:
    "Length increases the search space. Cryptographic randomness makes each possibility equally likely.",
  large: "Large exhaustive-search margin",
  moderate: "Some exhaustive-search margin",
  low: "Consider a longer password",
  modelDetails: "Assumptions & custom scenario",
  millionYears: "over 1 million years",
  ratingRule:
    "“Large margin” means a finding probability below 1 in a trillion over one day at an illustrative 10 billion guesses/s. “Some margin” means below 1 in a million. These are UI thresholds, not a security standard.",
  phraseNote:
    "English words from the EFF list. Fixed spaces between words add no entropy.",
});
Object.assign(copy.ru, {
  optionsTitle: "Настройки генерации",
  optionsLabel: "Дополнительные настройки",
  optionsNote:
    "Изменения применятся при следующей генерации. Текущий результат не изменится.",
});
Object.assign(copy.en, {
  optionsTitle: "Generation settings",
  optionsLabel: "Additional settings",
  optionsNote:
    "Changes apply to your next generation. The current result stays unchanged.",
});
Object.assign(copy.ru, {
  factorLength: "Длина",
  factorMethod: "Способ создания",
  randomSelection: "Случайный выбор",
  onlineTitle: "Через форму входа",
  slowTitle: "При медленном подборе",
  fastTitle: "При быстром подборе",
  onlineHelp: "Попытки зависят от ограничений сервиса.",
  slowHelp: "Например, когда способ хранения замедляет проверку.",
  fastHelp: "Более жёсткий сценарий после утечки базы.",
  scenarioNote: "Условные сценарии, а не проверка конкретного сайта.",
  plainLimit:
    "Оценка касается подбора пароля. Она не защищает от фишинга, вирусов или повторного использования пароля.",
  methodLink: "Методика расчёта ↓",
  marginLarge: "Большой запас",
  marginModerate: "Есть запас",
  marginLow: "Нужно усилить",
});
Object.assign(copy.en, {
  factorLength: "Length",
  factorMethod: "Generation method",
  randomSelection: "Random selection",
  onlineTitle: "Through a login form",
  slowTitle: "Slow guessing",
  fastTitle: "Fast guessing",
  onlineHelp: "Attempts depend on the service’s limits.",
  slowHelp: "For example, when password storage slows verification.",
  fastHelp: "A harsher scenario after a database leak.",
  scenarioNote: "Illustrative scenarios, not a test of a particular site.",
  plainLimit:
    "This estimate concerns password guessing. It does not protect against phishing, malware or password reuse.",
  methodLink: "Calculation method ↓",
  marginLarge: "Large margin",
  marginModerate: "Some margin",
  marginLow: "Needs improvement",
});
Object.assign(copy.ru, {
  copied: "Скопировано. Сохраните пароль.",
  copiedPrevious: "Предыдущий пароль скопирован.",
  copiedLabel: "Скопировано",
});
Object.assign(copy.en, {
  copied: "Copied. Save your password.",
  copiedPrevious: "Previous password copied.",
  copiedLabel: "Copied",
});
Object.assign(copy.ru, {
  highTitle: "Надёжный пароль",
  highPhrase: "Надёжная фраза",
  mediumTitle: "Средняя стойкость",
  lowTitle: "Слабый пароль",
  lowPhrase: "Слабая фраза",
  highAction: "Высокая стойкость к подбору в рассматриваемых условиях.",
  mediumAction: "При быстром подборе запас меньше. Увеличьте длину.",
  lowAction: "Подбор в некоторых условиях слишком прост. Увеличьте длину.",
  marginLarge: "Высокая",
  marginModerate: "Средняя",
  marginLow: "Низкая",
  threatTitle: "Стойкость при разных условиях",
  ratingScope: "Оценка стойкости к подбору, не гарантия защиты аккаунта.",
});
Object.assign(copy.en, {
  highTitle: "Strong password",
  highPhrase: "Strong passphrase",
  mediumTitle: "Moderate resistance",
  lowTitle: "Weak password",
  lowPhrase: "Weak passphrase",
  highAction: "High guessing resistance under the modeled assumptions.",
  mediumAction: "Less margin against fast guessing. Increase the length.",
  lowAction: "Too easy to guess under some assumptions. Increase the length.",
  marginLarge: "High",
  marginModerate: "Moderate",
  marginLow: "Low",
  threatTitle: "Resistance under different assumptions",
  ratingScope:
    "An estimate of guessing resistance, not an account protection guarantee.",
});
copy.ru.footer = copy.en.footer = 'NYQVRA · 0.2.0';
let lang = "ru",
  secret = "",
  visible = true,
  bits = 0,
  resultSignature = "",
  notice = "",
  generationError = "",
  format = "password",
  resultMeta = null,
  renderFrame = 0;
function draft() {
  if (format === "phrase") {
    const count = Number($("#length-number").value);
    return Number.isInteger(count) && count >= 4 && count <= 10
      ? { length: count, signature: `phrase:${count}` }
      : { error: "invalidPhrase" };
  }
  return validateSettings(
    $("#length-number").value,
    Object.fromEntries(
      SET_NAMES.map((name) => [name, $("#form").elements[name].checked]),
    ),
    $("#require-each").checked,
  );
}
function fitPassword() {
  const f = $("#password");
  f.style.height = "0px";
  f.style.height = Math.max(54, f.scrollHeight + 2) + "px";
}
function resultLength(n) {
  if (lang === "en") return n + " characters";
  return (
    n +
    " " +
    (n % 10 === 1 && n % 100 !== 11
      ? "символ"
      : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)
        ? "символа"
        : "символов")
  );
}
function renderModels() {
  const t = copy[lang];
  for (const [key, s] of Object.entries(SCENARIOS)) {
    const p = secret ? modelAttack(bits, s.rate).probability : 1;
    $("#rating-" + key).textContent = secret
      ? t[p < 1e-12 ? "marginLarge" : p < 1e-6 ? "marginModerate" : "marginLow"]
      : "—";
    $("#rating-" + key).dataset.level =
      p < 1e-12 ? "high" : p < 1e-6 ? "medium" : "low";
  }
  $("#model-length").textContent = resultMeta
    ? resultMeta.kind === "phrase"
      ? resultMeta.length + (lang === "ru" ? " слов" : " words")
      : resultLength(resultMeta.length)
    : "—";
  $("#model-explanation").textContent =
    lang === "ru"
      ? resultMeta?.kind === "phrase"
        ? "Слова выбраны случайно. Чем их больше, тем труднее подобрать всю фразу."
        : "Пароль создан случайно, без придуманного человеком шаблона. Чем он длиннее, тем больше вариантов придётся проверить."
      : resultMeta?.kind === "phrase"
        ? "Words are selected at random. More words make the whole phrase harder to guess."
        : "The password is randomly generated, not based on a human-made pattern. More length means more possibilities to try.";
}
function render() {
  const t = copy[lang],
    settings = draft(),
    error = settings.error || generationError,
    pending =
      !settings.error && secret && settings.signature !== resultSignature;
  document.documentElement.lang = lang;
  document.title = "NYQVRA — " + t.generator;
  document.querySelector('meta[name="description"]').content = t.intro;
  document.querySelectorAll("[data-t]").forEach((el) => {
    el.textContent = t[el.dataset.t];
  });
  $("#panel-title label").textContent =
    t[resultMeta?.kind === "phrase" ? "phrase" : "password"];
  $("#visibility-label").textContent = t[visible ? "hide" : "show"];
  $("#visibility-icon").src =
    "src/assets/icons/" + (visible ? "eye-off" : "eye") + ".svg";
  $("#visibility").setAttribute("aria-pressed", String(visible));
  $("#password").value = visible ? secret : "•".repeat(secret.length);
  $("#password").dataset.kind = resultMeta?.kind || "password";
  $("#result-length").textContent = secret ? resultLength(secret.length) : "—";
  $("#copy").disabled = !secret;
  $("#visibility").disabled = !secret;
  $("#generate").disabled = Boolean(settings.error);
  $("#visibility").title = t[visible ? "hide" : "show"];
  $("#visibility").setAttribute("aria-label", t[visible ? "hide" : "show"]);
  $("#copy").title = notice.startsWith("copied") ? t.copiedLabel : t.copy;
  $("#copy").setAttribute(
    "aria-label",
    notice.startsWith("copied") ? t.copiedLabel : t.copy,
  );
  $("#copy-icon").src =
    "src/assets/icons/" +
    (notice.startsWith("copied") ? "check" : "copy") +
    ".svg";
  const probability = secret
    ? modelAttack(bits, SCENARIOS.fast.rate).probability
    : 1;
  const level =
    probability < 1e-12 ? "high" : probability < 1e-6 ? "medium" : "low";
  const titleKey =
    level === "medium"
      ? "mediumTitle"
      : level + (resultMeta?.kind === "phrase" ? "Phrase" : "Title");
  $("#strength").textContent = secret ? t[titleKey] : "";
  $("#model-open").title = t.why;
  $("#model-open").setAttribute("aria-label", (secret ? t[titleKey] + ". " : "") + t.why);
  $("#strength").dataset.level = level;
  $("#strength").title = t.ratingScope;
  $(".rating-inline").dataset.level = level;
  const statusIcon =
    level === "high"
      ? "shield-check"
      : level === "medium"
        ? "alert-triangle"
        : "shield-x";
  $("#rating-icon").src = "src/assets/icons/" + statusIcon + ".svg";
  $("#verdict-icon").src = "src/assets/icons/" + statusIcon + ".svg";
  $("#rating-verdict").dataset.level = level;
  $("#verdict-title").textContent = secret ? t[titleKey] : "";
  $("#verdict-action").textContent = t[level + "Action"];
  $("#resistance-basis").textContent = resultMeta
    ? lang === "ru"
      ? resultMeta.kind === "phrase"
        ? `${resultMeta.length} случайных слов`
        : resultLength(resultMeta.length) + " · случайный выбор"
      : resultMeta.kind === "phrase"
        ? `${resultMeta.length} random words`
        : `${resultMeta.length} characters · random selection`
    : "";
  $("#error").textContent = error ? t[error] : "";
  $("#length-number").setAttribute(
    "aria-invalid",
    String(["invalid", "invalidPhrase"].includes(settings.error)),
  );
  for (const el of [$("#length"), $("#length-number")])
    el.setAttribute(
      "aria-label",
      t[format === "phrase" ? "wordsLabel" : "lengthLabel"],
    );
  $(".length-label label").textContent =
    t[format === "phrase" ? "words" : "length"];
  $("#generate-label").textContent =
    t[format === "phrase" ? "generatePhrase" : "generate"];
  $("#status").textContent = notice ? t[notice] : pending ? t.pending : "";
  $("#status").dataset.state = notice.startsWith("copied")
    ? "copied"
    : pending
      ? "pending"
      : "";
  $("#about-close").setAttribute("aria-label", t.close);
  $("#models-close").setAttribute("aria-label", t.close);
  $("#options-close").setAttribute("aria-label", t.close);
  $("#options-open").setAttribute("aria-label", t.optionsLabel);
  $("#options").dataset.format = format;
  SET_NAMES.forEach((name, i) =>
    $("#form").elements[name].setAttribute("aria-label", t.types[i]),
  );
  document
    .querySelectorAll("[data-lang]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang)),
    );
  document
    .querySelectorAll("[data-format]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.format === format)),
    );
  $("#form").dataset.format = format;
  $("#phrase-note").hidden = format !== "phrase";
  renderModels();
  cancelAnimationFrame(renderFrame);
  renderFrame = requestAnimationFrame(fitPassword);
}
function generate(initial = false) {
  const settings = draft();
  if (settings.error) {
    render();
    return;
  }
  try {
    const phrase = format === "phrase";
    const next = phrase
      ? generatePassphrase(settings.length, EFF_WORDS)
      : generatePassword(
          settings.length,
          settings.pool,
          globalThis.crypto,
          settings.requiredSets,
        );
    const nextBits = phrase
      ? entropyBits(settings.length, EFF_WORDS.length)
      : constrainedEntropy(
          settings.length,
          settings.pool.length,
          settings.requiredSets.map((s) => s.length),
        );
    secret = next;
    bits = nextBits;
    resultSignature = settings.signature;
    resultMeta = {
      kind: format,
      length: settings.length,
      poolSize: settings.pool?.length,
      required: Boolean(settings.requiredSets?.length),
    };
    generationError = "";
    notice = initial ? "" : phrase ? "generatedPhrase" : "generated";
    render();
    if (!initial) document.dispatchEvent(new Event("nyqvra:generated"));
  } catch {
    generationError = "crypto";
    notice = "";
    render();
  }
}
function stageSettings() {
  notice = "";
  generationError = "";
  render();
}
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  generate();
});
$("#length").addEventListener("input", () => {
  $("#length-number").value = $("#length").value;
  stageSettings();
});
$("#length-number").addEventListener("input", () => {
  const n = Number($("#length-number").value);
  if (
    Number.isInteger(n) &&
    n >= Number($("#length").min) &&
    n <= Number($("#length").max)
  )
    $("#length").value = String(n);
  stageSettings();
});
SET_NAMES.forEach((name) =>
  $("#form").elements[name].addEventListener("change", stageSettings),
);
$("#require-each").addEventListener("change", stageSettings);
const rememberedLengths = { password: 24, phrase: 6 };
document.querySelectorAll("[data-format]").forEach((b) =>
  b.addEventListener("click", () => {
    const n = Number($("#length-number").value);
    if (!draft().error) rememberedLengths[format] = n;
    format = b.dataset.format;
    for (const el of [$("#length"), $("#length-number")]) {
      el.min = format === "phrase" ? "4" : "8";
      el.max = format === "phrase" ? "10" : "128";
      el.value = String(rememberedLengths[format]);
    }
    $(".range-caption").firstElementChild.textContent = $("#length").min;
    $(".range-caption").lastElementChild.textContent = $("#length").max;
    stageSettings();
  }),
);
document.querySelectorAll("[data-lang]").forEach((b) =>
  b.addEventListener("click", () => {
    lang = b.dataset.lang;
    render();
  }),
);
$("#visibility").addEventListener("click", () => {
  visible = !visible;
  render();
});
$("#copy").addEventListener("click", async () => {
  if (!secret) return;
  const snapshot = secret;
  try {
    await navigator.clipboard.writeText(snapshot);
    notice = snapshot === secret ? "copied" : "copiedPrevious";
  } catch {
    notice = "copyError";
    visible = true;
    render();
    $("#password").focus();
    $("#password").select();
  }
  render();
});
$("#about-open").addEventListener("click", () => $("#about").showModal());
$("#about-close").addEventListener("click", () => $("#about").close());
$("#about").addEventListener("click", (e) => {
  if (e.target !== $("#about")) return;
  const r = $("#about").getBoundingClientRect();
  if (
    e.clientX < r.left ||
    e.clientX > r.right ||
    e.clientY < r.top ||
    e.clientY > r.bottom
  )
    $("#about").close();
});
$("#model-open").addEventListener("click", () => $("#models").showModal());
$("#models-close").addEventListener("click", () => $("#models").close());
$("#models").addEventListener("click", (e) => {
  if (e.target !== $("#models")) return;
  const r = $("#models").getBoundingClientRect();
  if (
    e.clientX < r.left ||
    e.clientX > r.right ||
    e.clientY < r.top ||
    e.clientY > r.bottom
  )
    $("#models").close();
});
$("#options-open").addEventListener("click", () => $("#options").showModal());
$("#options-close").addEventListener("click", () => $("#options").close());
$("#options").addEventListener("click", (e) => {
  if (e.target !== $("#options")) return;
  const r = $("#options").getBoundingClientRect();
  if (
    e.clientX < r.left ||
    e.clientX > r.right ||
    e.clientY < r.top ||
    e.clientY > r.bottom
  )
    $("#options").close();
});
window.addEventListener("resize", fitPassword);
if (document.fonts) document.fonts.ready.then(fitPassword);
if ("ResizeObserver" in window)
  new ResizeObserver(fitPassword).observe($(".panel"));
generate(true);
