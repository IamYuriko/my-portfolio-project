/* Informationボタンをクリックしたときの動作 */
const btnOpen = document.querySelector("#btn-open");
const panel = document.querySelector("#panel");

btnOpen.addEventListener("click", () => {
  if (btnOpen.innerHTML === 'INFORMATION') {
    btnOpen.innerHTML = 'CLOSE'; // ボタンのテキストを 'CLOSE' に変更
    panel.classList.remove('u-hide'); // パネルを表示
  } else {
    btnOpen.innerHTML = 'INFORMATION'; // ボタンのテキストを 'INFORMATION' に変更
    panel.classList.add('u-hide'); // パネルを非表示
  }
});


/* 現在時刻を取得 */
const currentTime = document.querySelector("#currentTime");

const getTokyoTime = () => {
  const now = new Date();

  const tokyoTime = now.toLocaleTimeString("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return tokyoTime;
};

const updateTime = () => {
  currentTime.innerHTML = getTokyoTime();
};

window.addEventListener("load", () => {
  updateTime();
  setInterval(updateTime, 1000); // 毎秒更新
});


/* 最終更新日を取得 */
const updatedDate = document.querySelector("#updatedDate");
let date, year, month, day;

const getUpdatedDate = () => {
  date = new Date(document.lastModified);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  day = date.getDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
};

window.addEventListener("load", () => {
  getUpdatedDate();
  updatedDate.innerHTML = `Updated: ${year}.${month}.${day}`;
});


// カーソル
const cursor = document.querySelector("#cursor");

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  cursor.style.translate = `${x}px ${y}px`;
});

const hoverTargets = document.querySelectorAll(".cursor-large");

hoverTargets.forEach((hoverTarget) => {
  hoverTarget.addEventListener("mouseover", () => {
    cursor.classList.add("clicked");
  });
  hoverTarget.addEventListener("mouseout", () => {
    cursor.classList.remove("clicked");
  });
});


/* ホバー時に写真が表示 */
const data = [
  {
    "img": "../assets/miraini-pharmacy_mockup.jpg",
  },
  {
    "img": "../assets/portfolio_mockup.jpg",
  },
  {
    "img": "../assets/hamburger_mockup.jpg",
  }
];

const items = document.querySelectorAll('.work__item');
const hovering = document.querySelector('#hovering');
const details = document.querySelectorAll('.work');

const resetPhotos = () => {
  hovering.src = ''; // 画像をリセット
  hovering.style.display = 'none'; // 画像を非表示に
};

items.forEach((item, index) => {
  const detail = details[index]; // 対応する <details> 要素を取得

  // 画像を表示する処理
  item.addEventListener('mouseover', () => {
    if (!detail.open) { // 対応する <details> が開いていないときにのみ画像を表示
      hovering.style.display = 'block'; // 画像を表示
      hovering.src = data[index].img; // 対応する画像を設定
      hovering.animate({ opacity: [0, 1] }, 500); // アニメーションを実行
    }
  });

  // 画像を非表示にする処理
  item.addEventListener('mouseout', () => {
    if (!detail.open) {
      resetPhotos(); // ホバーを外したときに画像を非表示に
    }
  });

  // <details> が開かれたときと閉じられたときの処理
  detail.addEventListener("toggle", () => {
    if (detail.open) {
      resetPhotos();
    } else {
      resetPhotos();
    }
  });
});


/* メールアドレスをコピー */
const copyBtn = document.querySelector('#btn-copy');

copyBtn.addEventListener('click', () => {
  const email = document.querySelector('#email').textContent;
  const success = document.querySelector('#success');
  
  navigator.clipboard.writeText(email)
    .then(() => {
      if (success) {
        success.style.display = 'block';

        setTimeout(() => {
          success.style.display = 'none';
        }, 3000);
      }
    })
    .catch(() => {
      alert('コピーができませんでした');
    });
});


/* 動的に高さを取得 */
/* 古いiOSバージョンや古いブラウザでsvhが効かない場合のフォールバックとして */
const setHeight = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setHeight();
window.addEventListener('resize', setHeight);