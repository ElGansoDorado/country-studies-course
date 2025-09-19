const testElements = document.forms.test.elements;
const imgYes = new Image();
const imgNo = new Image();
imgYes.src = "../test/yes.png";
imgNo.src = "../test/no.png";

var regname = "";
var score = 0;
var score0 = 0;
var currentQuestionNmbr = 0;
var attempt = 0;

if (location.search) {
  attempt = parseInt(location.search.substring(1));
}

// ______________________ для оценки результатов:
const resultEstimation = [
  "Ваша оценка 10 баллов!",
  "Ваша оценка 9 баллов!",
  "Ваша оценка 8 баллов!",
  "Ваша оценка 7 баллов!",
  "Ваша оценка 6 баллов!",
  "Ваша оценка 5 баллов!",
  "Ваша оценка 4 балла!",
  "Ваша оценка 3 балла!",
  "Ваша оценка 2 балла!",
  "Ваша оценка 1 балл!",
  "Ваша оценка 0 баллов!",
];

const resultPercent = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
//_____________________________________________________________________

function init() {
  for (let i = 0; i < testElements.length; i += 1) {
    testElements[i].checked = false;
  }
  nmbrOfQuestions = ans0.length;
  ans = new Array(nmbrOfQuestions);
  ansResult = new Array(nmbrOfQuestions);
  answeredQuestions = new Array(nmbrOfQuestions);
}

//_____________________________________________________________________

function checkQuestion(n) {
  ans[n] = "";

  for (let i = 0; i < testElements.length; i += 1) {
    if (parseInt(testElements[i].value) === n)
      if (
        testElements[i].type === "checkbox" ||
        testElements[i].type === "radio"
      ) {
        if (testElements[i].checked) {
          ans[n] += "1";
        } else {
          ans[n] += "0";
        }
      }

    if (parseInt(testElements[i].value) > n) break;
  }

  let el = document.getElementById(`q${n}`);
  el.style.display = "none";

  let m = n + 1;
  el = document.getElementById(`q${m}`);
  el.style.display = "block";

  if (m === nmbrOfQuestions) {
    check();
    showResult();
  }
}

//_____________________________________________________________________

function check() {
  let imgSrc = "";

  for (let i = 0; i < nmbrOfQuestions; i += 1) {
    if (ans0[i] === ans[i]) {
      ansResult[i] = 1;
    } else {
      ansResult[i] = 0;
    }
  }

  maxScore = 0;
  score = 0;
  correctAnswers = 0;
  nmbrOfAnsweredQuestions = 0;
  missedQuestions = "";
  nmbrMissedQuestions = 0;

  for (let i = 0; i < nmbrOfQuestions; i += 1) {
    score += ansResult[i] * ball[i];
    maxScore += ball[i];
    correctAnswers += ansResult[i];

    if (parseInt(ans[i]) > 0) {
      answeredQuestions[i] = 1;
      nmbrOfAnsweredQuestions += 1;

      if (showCorrWrong) {
        if (ansResult[i] === 1) {
          imgSrc = imgYes.src;
        } else {
          imgSrc = imgNo.src;
        }

        document.getElementById(`a${i + 1}`).src = imgSrc;
      }
    } else {
      answeredQuestions[i] = 0;
      missedQuestions = `${missedQuestions} ${i + 1}`;
      nmbrMissedQuestions += 1;
    }
  }
}

//_____________________________________________________________________

function showCorrectAnswers() {
  for (let i = 0; i < nmbrOfQuestions; i += 1) {
    document.getElementById(`q${i}`).style.display = "block";
  }

  for (var i = 0; i < testElements.length; i += 1) {
    if (testElements[i].type === "button") {
      testElements[i].style.display = "none";
    }
  }

  document.getElementById("linkToCorrAnswers").style.display = "none";
}

//_____________________________________________________________________

function showResult() {

  for (let i = 0; i < testElements.length; i += 1) {
    testElements[i].disabled = true;
  }
  //---------------------------- endings
  function ending1(nmbr) {
    // окончания для слов "вопрос" и "балл"
    let ending = "а";
    let a;

    if (nmbr === Math.floor(nmbr)) {
      if (nmbr >= 10 && nmbr <= 19) {
        ending = "ов";
      } else {
        a = nmbr % 10;

        if (a === 1) {
          ending = "";
        } else {
          if (a === 2 || a === 3 || a === 4) {
            ending = "а";
          } else {
            ending = "ов";
          }
        }
      }
    }

    return ending;
  }

  function ending2(nmbr) {
    // окончания для слова "возможн..."
    let ending = "ых";
    let a = nmbr % 10;

    if (nmbr === Math.floor(nmbr) && a === 1 && nmbr !== 11) {
      ending = "ого";
    }

    return ending;
  }

  //---------------------------------------

  attempt += 1;

  let s = `</p>Вы набрали ${score} балл${ending1(
    score
  )} из ${maxScore} возможн${ending2(maxScore)}. `;

  if (nmbrOfAnsweredQuestions > 0) {
    rate = "";

    if (score === maxScore) {
      rate = resultEstimation[0];
    } else {
      for (i = 1; i < resultEstimation.length; i += 1) {
        if (
          score < maxScore * resultPercent[i - 1] &&
          score >= maxScore * resultPercent[i]
        ) {
          rate = resultEstimation[i];
          break;
        }
      }
    }

    s += rate;

    if (nmbrOfAnsweredQuestions < nmbrOfQuestions) {
      s += " Ответы даны не на все вопросы.";
    }
  } else
    s +=
      "Ни на один вопрос не получено ответа! Может быть, Вы забыли, что надо помечать те ответы, которые кажутся правильными?";

  var lessonFirstModulId = parseInt(testName) + 1;

  if (score < maxScore) {
    if (attempt < maxAttempts)
      s += `<p>Можете сразу же сделать <a href="${testName}.html?${attempt}">еще одну попытку</a>. Но лучше сначала внимательно изучите материалы по этой теме и снова пройдите тест. Результат, несомненно, будет&nbsp;лучше.</p>`;
    else s += "<p>&nbsp;</p>";
  }

  if (attempt === maxAttempts && showCorrWrong)
    s +=
      '<p id="linkToCorrAnswers">Можете посмотреть <a href="#" onClick="showCorrectAnswers()">полный список вопросов</a> с пометками, правильный ли дан ответ.</p>';

  document.getElementById("result").innerHTML = s;
}
