"use strict";

import { async } from "regenerator-runtime";
import * as model from "../model/model.js";
import * as view from "../views/exerciseView.js";

const cardFront = document.querySelector(".flashcard__card-content-front");
const answerSection = document.querySelector(".answer");
const answerBox = document.querySelector(".answer__box");

////////////////////////////////
// get parameter from url
const newPageUrl = new URL(window.location.href);

////////////////////////////////
// get category from parameter
const category = newPageUrl.searchParams.get("category");
const currentCategory = model.category.filter((d) => d.nameEn === category);

////////////////////////////////
// display title
document.querySelector(".page__title-en").textContent = category;
document.querySelector(".page__title-ja").textContent =
  currentCategory[0]["nameJa"];

////////////////////////////////
// display content in the flachcard
const currentCategoryData = model.data[`${currentCategory[0]["nameEn"]}`];
let currentPage = 1;
//  shuffle data
const shuffle = function (array, num) {
  // 空のオブジェクトを作成する
  let newArray = {};

  // 受け取った配列を繰り返す
  for (let i = 0; i < array.length; i++) {
    // ランダムな数値を生成する ※配列の数より少ないと永久ループする
    let rand = Math.floor(Math.random() * num);

    // 同じキー名がないか判別する
    if (!newArray[rand]) {
      // 同じキー名がない場合にobjに追加する
      newArray[rand] = array[i];
    } else {
      // 同じキー名ある場合、やり直す
      i--;
    }
  }

  // 作成したオブジェクトの値から配列を作成して返す
  return Object.values(newArray);
};
const newData = shuffle(currentCategoryData, 10);
const currentData = newData[currentPage - 1];

const newFeatures = function () {
  console.log("aaa");
};

//display
const initCard = async function () {
  if (currentPage < 11) {
    cardFront.textContent = newData[currentPage - 1].en;
    // cardFront.textContent = currentData.en;
    makeAnswerData();
    changePageNumber(currentPage);
    btnControl();
    displayAnswer();
    await addSmallResult();
    newFeatures();

    console.log("OK...?");
  }
};

////////////////////////////////
// display answer alternatives

const answerAllList = [];
const correctAnswers = [];

const makeAnswerData = function () {
  const answerList = [];

  for (let i = 1; i < 11; i++) {
    const answerData = shuffle(currentCategoryData, 10);
    const dataSub = [];
    dataSub.push(answerData.find((d) => d.en === newData[i - 1].en));
    correctAnswers.push(answerData.find((d) => d.en === newData[i - 1].en));
    answerData.forEach((data) =>
      data !== newData[i - 1] && dataSub.length < 4 ? dataSub.push(data) : ""
    );
    const answerMixedList = shuffle(dataSub, 4);
    answerList.push(answerMixedList);
  }

  answerAllList.push(answerList);
};

//result data
const userAnswerData = {
  category: category,
  results: [],
};

////////////////////////////////
// CHECK IF IT IS ALREADY DONE AND IF SO, ADD SMALL ◯ OR ×
const addSmallResult = function () {
  const clickedresult = userAnswerData.results[currentPage - 1]?.clicked;

  document
    .querySelectorAll(".answer__box-item")
    .forEach((el) =>
      el.classList.remove(
        "answer__mini-correct",
        "answer__mini-incorrect",
        "answer__colour",
        "answer__dark"
      )
    );

  if (userAnswerData.results[currentPage - 1]?.lastResult) {
    if (clickedresult.length >= 2) {
      document
        .querySelectorAll(".answer__box-item")
        .forEach((el) => el.classList.add("answer__dark"));

      for (let i = 0; i < clickedresult.length - 1; i++) {
        document
          .getElementById(`answer__box-${Number(clickedresult[i])}`)
          .classList.add("answer__mini-incorrect");
      }

      const clickedResultEl = document.getElementById(
        `answer__box-${Number(clickedresult[clickedresult.length - 1])}`
      );

      clickedResultEl.classList.remove("answer__dark");

      clickedResultEl.classList.add("answer__colour", "answer__mini-correct");
    }

    const clickedResultEl = document.getElementById(
      `answer__box-${Number(clickedresult[clickedresult.length - 1])}`
    );

    document
      .querySelectorAll(".answer__box-item")
      .forEach((el) => el.classList.add("answer__dark"));

    clickedResultEl.classList.remove("answer__dark");

    clickedResultEl.classList.add("answer__colour");
  } else if (clickedresult) {
    for (let i = 0; i < clickedresult.length; i++) {
      document
        .getElementById(`answer__box-${Number(clickedresult[i])}`)
        .classList.add("answer__mini-incorrect");

      document
        .getElementById(`answer__box-${Number(clickedresult[i])}`)
        .classList.add("answer__dark");
    }
  }
};

const displayAnswer = function () {
  // display answer in the box
  for (let i = 1; i < 5; i++) {
    let el = document.getElementById(`answer__box-${i}`);
    el.innerHTML = "";
    el.insertAdjacentHTML(
      "afterbegin",
      `<button class="answer__box-btn"><p class="asnwer__box-text"><ruby class="asnwer__box-answer">${
        answerAllList[0][currentPage - 1][i - 1].ja
      }<rt class="asnwer__box-ruby">${
        answerAllList[0][currentPage - 1][i - 1].jaHiragana
      }</rt></ruby></p></button>`
    );
  }
};

////////////////////////////////
// Pagination
// renew current page display
const changePageNumber = function (currentPage) {
  document.querySelector(
    ".flashcard__pagination-text"
  ).textContent = `${currentPage} / ${Object.keys(currentCategoryData).length}`;
};

// arrow btnControl
const btnControl = function () {
  // control back and next btn
  if (currentPage === 1) {
    document.querySelector(".flashcard__pagination-prev").style.visibility =
      "hidden";
  } else if (currentPage === 10) {
    document.querySelector(".flashcard__pagination-next").style.visibility =
      "hidden";
  } else {
    document.querySelector(".flashcard__pagination-prev").style.visibility =
      "visible";
    document.querySelector(".flashcard__pagination-next").style.visibility =
      "visible";
  }
};

////////////////////////////////
// SCORE
const maxScore = Object.keys(currentCategoryData).length;

initCard();

////////////////////////////////
// Event
document
  .querySelector(".flashcard__pagination-prev")
  .addEventListener("click", function () {
    if (currentPage > 1) currentPage--;
    initCard();
  });

document
  .querySelector(".flashcard__pagination-next")
  .addEventListener("click", function () {
    if (currentPage < 10) currentPage++;
    initCard();
  });

// when user clicks an answer
let countClicks = 0;

answerBox.addEventListener("click", function (e) {
  if (!userAnswerData.results[currentPage - 1]?.lastResult) {
    countClicks++;

    if (currentPage < 11) {
      const clickedId = e.target.closest(".answer__box-item").id.slice(-1);
      const clickedAnswer = answerAllList[0][currentPage - 1][clickedId - 1];
      const currentCorrectAnswer = correctAnswers[currentPage - 1];

      // if it is correct
      if (clickedAnswer === currentCorrectAnswer) {
        answerSection.classList.add("answer__correct");
        if (!userAnswerData.results[currentPage - 1]) {
          userAnswerData.results.push({
            pageNum: currentPage,
            challenge: true,
            result: true,
            clicked: [clickedId],
            lastResult: true,
          });
        } else {
          userAnswerData.results[currentPage - 1].clicked.push(clickedId);
          userAnswerData.results[currentPage - 1].lastResult = true;
        }
        countClicks = 0;
        if (currentPage === 10) {
          setTimeout(() => {
            answerSection.classList.remove("answer__correct");
            initModal();
          }, "1500");
        } else {
          setTimeout(() => {
            answerSection.classList.remove("answer__correct");
            currentPage++;

            initCard();
          }, "1500");
        }
      }
      // when user's answer is incorrect
      if (clickedAnswer !== currentCorrectAnswer) {
        answerSection.classList.add("answer__incorrect");
        if (!userAnswerData.results[currentPage - 1]) {
          userAnswerData.results.push({
            pageNum: currentPage,
            challenge: true,
            result: false,
            clicked: [clickedId],
            lastResult: false,
          });
        } else {
          userAnswerData.results[currentPage - 1].clicked.push(clickedId);
        }

        setTimeout(() => {
          answerSection.classList.remove("answer__incorrect");
          addSmallResult();
        }, "1500");
      }
    }
  }
});

////////////////////////////////
// MODAL

// Diplay Modal
const userScoreEl = document.querySelector(".scoremodal__score-user");
const maxScoreEl = document.querySelector(".scoremodal__score-max");

// Get the modal
const scoreModal = document.getElementById("scoremodal");

// Get the button that opens the modal
const btnFin = document.getElementById("buttonFin");

// Get the <span> element that closes the modal
const closeModal = document.getElementsByClassName("scoremodal__close")[0];

// When the user clicks on the button, open the modal
btnFin.addEventListener("click", function () {
  initModal();
});

const finalResults = {
  category: category,
};

const initModal = function () {
  // display user's score
  const score = Object.values(userAnswerData.results).filter(
    (value) => value.result === true
  ).length;
  userScoreEl.textContent = score;
  maxScoreEl.textContent = maxScore;

  // push score to finalResults
  finalResults.score = score;

  //display modal
  scoreModal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function () {
  scoreModal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == scoreModal) {
    scoreModal.style.display = "none";
  }
};

// Store results in a local storage
document
  .querySelector(".scoremodal__buttonBox-again")
  .addEventListener("click", function () {
    if (
      !window.localStorage.getItem(
        `bestOf${category[0].toUpperCase()}${category.slice(1)}`
      ) ||
      finalResults.score >
        JSON.parse(
          window.localStorage.getItem(
            `bestOf${category[0].toUpperCase()}${category.slice(1)}`
          )
        ).score
    ) {
      window.localStorage.setItem(
        `bestOf${category[0].toUpperCase()}${category.slice(1)}`,
        JSON.stringify(finalResults)
      );
    }
  });

document
  .querySelector(".scoremodal__buttonBox-top")
  .addEventListener("click", function () {
    if (
      !window.localStorage.getItem(
        `bestOf${category[0].toUpperCase()}${category.slice(1)}`
      ) ||
      finalResults.score >
        JSON.parse(
          window.localStorage.getItem(
            `bestOf${category[0].toUpperCase()}${category.slice(1)}`
          )
        ).score
    ) {
      window.localStorage.setItem(
        `bestOf${category[0].toUpperCase()}${category.slice(1)}`,
        JSON.stringify(finalResults)
      );
    }
  });

// window.localStorage.clear();
