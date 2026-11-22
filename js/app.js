// localStorage に保存するときのキー
const STORAGE_KEY = "bookMemos";

// 画面の要素を取得
const titleInput = document.getElementById("title");
const memoInput = document.getElementById("memo");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const list = document.getElementById("list");
const count = document.getElementById("count");
const empty = document.getElementById("empty");
const error = document.getElementById("error");

// メモのデータ（配列）
let memos = loadMemos();

// ① localStorage から読み込む
function loadMemos() {
  const data = localStorage.getItem(STORAGE_KEY);
  // まだ何も保存されていなければ空の配列を返す
  return data ? JSON.parse(data) : [];
}

// ② localStorage に保存する
function saveMemos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

// ③ 一覧を表示する
function render() {
  list.innerHTML = "";

  memos.forEach((m) => {
    const li = document.createElement("li");
    li.className = "card item";

    const body = document.createElement("div");

    const title = document.createElement("p");
    title.className = "item-title";
    title.textContent = m.title;

    const memo = document.createElement("p");
    memo.className = "item-memo";
    memo.textContent = m.memo;

    const date = document.createElement("p");
    date.className = "item-date";
    date.textContent = m.date;

    body.append(title, memo, date);

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "🗑";
    del.setAttribute("aria-label", "削除");
    del.addEventListener("click", () => deleteMemo(m.id));

    li.append(body, del);
    list.appendChild(li);
  });

  count.textContent = memos.length;
  empty.style.display = memos.length === 0 ? "block" : "none";
}

// ④ 追加
function addMemo() {
  const title = titleInput.value.trim();
  const memo = memoInput.value.trim();

  if (title === "") {
    error.textContent = "本のタイトルを入力してください";
    return;
  }

  const newMemo = {
    id: Date.now(),
    title: title,
    memo: memo,
    date: new Date().toLocaleDateString("ja-JP"),
  };

  memos.unshift(newMemo); // 新しいものを一番上に
  saveMemos();
  render();

  // 入力欄をリセット
  titleInput.value = "";
  memoInput.value = "";
  error.textContent = "";
}

// ⑤ 1件削除
function deleteMemo(id) {
  memos = memos.filter((m) => m.id !== id);
  saveMemos();
  render();
}

// ⑥ すべて削除
function clearAll() {
  if (memos.length === 0) return;
  if (!confirm("すべてのメモを削除しますか？")) return;
  memos = [];
  localStorage.removeItem(STORAGE_KEY);
  render();
}

// ボタンにイベントを登録
saveBtn.addEventListener("click", addMemo);
clearBtn.addEventListener("click", clearAll);
titleInput.addEventListener("input", () => (error.textContent = ""));

// ページを開いたときに表示
render();
