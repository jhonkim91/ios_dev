// PWA 설치 프롬프트 처리
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // 설치 버튼 표시
  const installPrompt = document.getElementById('installPrompt');
  if (installPrompt) {
    installPrompt.style.display = 'block';
  }
});

// 설치하기 버튼 클릭
function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA 설치 승인');
      }
      deferredPrompt = null;
    });
  }
}

// 설치 프롬프트 닫기
function dismissInstall() {
  document.getElementById('installPrompt').style.display = 'none';
}

// Service Worker 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW 등록 성공:', registration.scope);
      })
      .catch(err => {
        console.log('SW 등록 실패:', err);
      });
  });
}

// iOS 설치 안내 (iOS는 beforeinstallprompt 미지원)
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.navigator.standalone === true;

if (isIOS && !isStandalone) {
  // iOS 설치 안내 표시
  setTimeout(() => {
    const iosPrompt = document.createElement('div');
    iosPrompt.className = 'ios-install-prompt';
    iosPrompt.innerHTML = `
      <div style="padding: 20px; background: white; border-radius: 16px; text-align: center;">
        <h3 style="margin: 0 0 10px;">📱 홈 화면에 추가</h3>
        <p style="margin: 0 0 10px; color: #666;">
          Safari 하단 공유 버튼을 누른 후<br>
          '홈 화면에 추가'를 선택하세요
        </p>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="padding: 10px 20px; background: #6366f1; color: white; 
                       border: none; border-radius: 8px;">확인</button>
      </div>
    `;
    iosPrompt.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(iosPrompt);
  }, 2000);
}

// 캘린더 기능
let currentDate = new Date();
let selectedDate = null;

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 캘린더 렌더링 로직
  console.log(`${year}년 ${month + 1}월 캘린더 렌더링`);
}

// 업체 데이터 관리
let businesses = JSON.parse(localStorage.getItem('businesses')) || [];

function saveBusiness(data) {
  businesses.push(data);
  localStorage.setItem('businesses', JSON.stringify(businesses));
  renderBusinessList();
}

function renderBusinessList() {
  // 업체 목록 렌더링
  const list = document.getElementById('businessList');
  if (!list) return;
  
  list.innerHTML = businesses.map(b => `
    <div class="business-item">
      <div class="business-name">${b.name}</div>
      <div class="business-info">
        <span>📞 ${b.phone}</span>
        <span>💰 ${b.amount}</span>
      </div>
    </div>
  `).join('');
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderBusinessList();
});