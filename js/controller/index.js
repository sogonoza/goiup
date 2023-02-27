"use strict";

import * as model from "../model/model.js";
// import * as view from '../views/view.js';

////////////////////////////////
// TOP PAGE TAB FUNCTION
const tabsContainer = document.querySelector(".tabs__links");
const tabs = document.querySelectorAll(".tabs__link");
const tabContent = document.querySelectorAll(".tabs__content");
const tabItems = document.querySelectorAll(".tabs__item");

tabsContainer?.addEventListener("click", function (e) {
  const clicked = e.target.closest(".tabs__link");

  if (!clicked) return;

  tabs.forEach((t) => t.classList.remove("tabs__link-active"));

  clicked.classList.add("tabs__link-active");

  tabContent.forEach((c) => c.classList.remove("tabs__content-active"));

  document
    .querySelector(`.tabs__content-${clicked.dataset.tab}`)
    .classList.add("tabs__content-active");
});

////////////////////////////////
// TOP PAGE VIEW (DISPLAY)

// Get current URL
const url = String(new URL(window.location.href));
const urlSplited = url.split("/index");
const newURL = urlSplited[0];

// template of insertHTML
const buildListitem = function (category) {
  const id = category.nameEn;
  const tabsListGroup = document.querySelector(`.tabs__list-${category.group}`);
  tabsListGroup.insertAdjacentHTML(
    "beforeend",
    `
              <li class="tabs__item" id="${id}"><a class="tabs__item-link" href="${newURL}/exercise.html?category=${id}">${
      category.nameJa
    } ${category.nameEn ? "(" : ""} ${
      category.nameEn
        ? category.nameEn[0].toUpperCase() + category.nameEn.slice(1)
        : ""
    } ${category.nameEn ? ")" : ""}</a></li>
              `
  );
};

// Display category list with link and parameter
model.category.forEach((c) => {
  buildListitem(c);
});

/*
tabList.addEventListener('click', function (e) {
  e.preventDefault();
  // check current URL
  const url = String(new URL(window.location.href));
  const url2 = url.split('/index');
  console.log(url2);

  // check ID from button clicked
  const clicked = e.target.closest('.tabs__item');
  const clickedId = clicked.id;
  console.log(clicked, clickedId);

  // set a parameter
  const newURL = `${url2[0]}/pages/exercise.html?category=${clickedId}`;
  //   const newURL2 = newURL.searchParams.set('category', `${clickedId}`);
  console.log(newURL);

  clicked.children[0].href = newURL;

  console.log(document.getElementById('color').children[0]);
});
*/

/*
// パラメーターの付与と取得　見本
// 現在のURLからURLオブジェクトを生成（例として、https://example.com上で以下Javascriptを実行しているとする）
const url = new URL(window.location.href);
console.log(url.href); // https://example.com

// キーを指定し、クエリパラメータを付与
url.searchParams.set('addParam', 'test');
console.log(url.href); // https://example.com?addParam=test

// キーを指定し、クエリパラメータを取得
const addParam = url.searchParams.get('addParam');
console.log(addParam); // test

// キーを指定し、クエリパラメータを削除
url.searchParams.delete('addParam');
console.log(url.href); // https://example.com
*/
