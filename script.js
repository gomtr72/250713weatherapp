// API 키 설정
const API_KEY = '03504d612ed045a596721144251307';
const BASE_URL = 'https://api.weatherapi.com/v1';

// DOM 요소 선택
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const locationName = document.getElementById('location-name');
const localTime = document.getElementById('local-time');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const precipitation = document.getElementById('precipitation');
const forecast = document.getElementById('forecast');
const errorMessage = document.getElementById('error-message');
const weatherInfo = document.getElementById('weather-info');

// 한글 도시명과 영문 도시명 매핑
const cityMapping = {
    '서울': 'Seoul',
    '부산': 'Busan',
    '인천': 'Incheon',
    '대구': 'Daegu',
    '대전': 'Daejeon',
    '광주': 'Gwangju',
    '울산': 'Ulsan',
    '세종': 'Sejong',
    '수원': 'Suwon',
    '제주': 'Jeju',
    '전주': 'Jeonju',
    '청주': 'Cheongju',
    '포항': 'Pohang',
    '창원': 'Changwon',
    '고양': 'Goyang',
    '용인': 'Yongin',
    '성남': 'Seongnam',
    '안양': 'Anyang',
    '안산': 'Ansan',
    '천안': 'Cheonan',
    '김해': 'Gimhae',
    '평택': 'Pyeongtaek',
    '진주': 'Jinju',
    '경주': 'Gyeongju',
    '구미': 'Gumi',
    '원주': 'Wonju',
    '익산': 'Iksan',
    '춘천': 'Chuncheon',
    '여수': 'Yeosu',
    '순천': 'Suncheon',
    '강릉': 'Gangneung',
    '군산': 'Gunsan',
    '목포': 'Mokpo',
    '속초': 'Sokcho',
    '양산': 'Yangsan',
    '충주': 'Chungju',
    '거제': 'Geoje',
    '김천': 'Gimcheon',
    '남양주': 'Namyangju',
    '통영': 'Tongyeong',
    '서귀포': 'Seogwipo',
    '도쿄': 'Tokyo',
    '오사카': 'Osaka',
    '베이징': 'Beijing',
    '상하이': 'Shanghai',
    '홍콩': 'Hong Kong',
    '타이페이': 'Taipei',
    '방콕': 'Bangkok',
    '싱가포르': 'Singapore',
    '뉴욕': 'New York',
    '로스앤젤레스': 'Los Angeles',
    '시카고': 'Chicago',
    '토론토': 'Toronto',
    '런던': 'London',
    '파리': 'Paris',
    '베를린': 'Berlin',
    '로마': 'Rome',
    '마드리드': 'Madrid',
    '시드니': 'Sydney',
    '멜버른': 'Melbourne'
};

// 페이지 로드 시 서울 날씨 표시
document.addEventListener('DOMContentLoaded', () => {
    getWeather('서울');
});

// 검색 버튼 클릭 이벤트
searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        getWeather(location);
    } else {
        showError('도시 이름을 입력해주세요.');
    }
});

// 엔터 키 이벤트
locationInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) {
            getWeather(location);
        } else {
            showError('도시 이름을 입력해주세요.');
        }
    }
});

// 한글 도시명을 영문으로 변환
function translateCityName(koreanName) {
    // 정확히 일치하는 도시명이 있는지 확인
    if (cityMapping[koreanName]) {
        return cityMapping[koreanName];
    }
    
    // 부분 일치하는 도시명이 있는지 확인
    for (const [kor, eng] of Object.entries(cityMapping)) {
        if (koreanName.includes(kor)) {
            return eng;
        }
    }
    
    // 변환할 수 없는 경우 원래 이름 반환
    return koreanName;
}

// 날씨 데이터 가져오기
async function getWeather(location) {
    try {
        // 로딩 표시
        showLoading();
        
        // 한글 도시명을 영문으로 변환
        const translatedLocation = translateCityName(location);
        
        // URL 인코딩 적용
        const encodedLocation = encodeURIComponent(translatedLocation);
        
        // API 호출
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodedLocation}&days=3&aqi=no&alerts=no&lang=ko`);
        
        // 응답 확인
        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error && errorData.error.code === 1006) {
                throw new Error('입력하신 도시를 찾을 수 없습니다. 다른 도시 이름을 입력해보세요.');
            } else {
                throw new Error(errorData.error.message || '날씨 정보를 가져오는 데 실패했습니다.');
            }
        }
        
        const data = await response.json();
        
        // 날씨 정보 표시
        displayWeather(data);
        
        // 에러 메시지 숨기기
        hideError();
        
        // 날씨 정보 표시
        weatherInfo.style.display = 'block';
    } catch (error) {
        console.error('날씨 정보 조회 오류:', error);
        showError(error.message || '날씨 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.');
    }
}

// 날씨 정보 표시
function displayWeather(data) {
    // 현재 날씨 정보
    const current = data.current;
    const location = data.location;
    
    // 위치 및 시간 정보
    locationName.textContent = `${location.name}, ${location.country}`;
    
    // 현지 시간 포맷팅
    const dateTime = new Date(location.localtime);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    };
    localTime.textContent = dateTime.toLocaleString('ko-KR', options);
    
    // 날씨 아이콘
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.alt = current.condition.text;
    
    // 온도 및 날씨 상태
    temperature.textContent = `${current.temp_c}°C`;
    condition.textContent = current.condition.text;
    
    // 추가 정보
    wind.textContent = `${current.wind_kph} km/h`;
    humidity.textContent = `${current.humidity}%`;
    precipitation.textContent = `${current.precip_mm} mm`;
    
    // 일기 예보 표시
    displayForecast(data.forecast.forecastday);
}

// 일기 예보 표시
function displayForecast(forecastData) {
    // 기존 예보 초기화
    forecast.innerHTML = '';
    
    // 각 일자별 예보 추가
    forecastData.forEach((day, index) => {
        // 첫 번째 날(오늘)은 건너뛰기
        if (index === 0) return;
        
        const date = new Date(day.date);
        const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        forecastItem.innerHTML = `
            <div class="forecast-date">
                <div>${dayOfWeek}</div>
                <div>${monthDay}</div>
            </div>
            <div class="forecast-icon">
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            </div>
            <div class="forecast-temp">
                <span class="max">${day.day.maxtemp_c}°</span> / 
                <span class="min">${day.day.mintemp_c}°</span>
            </div>
        `;
        
        forecast.appendChild(forecastItem);
    });
}

// 로딩 표시
function showLoading() {
    locationName.textContent = '로딩 중...';
    temperature.textContent = '--°C';
    condition.textContent = '날씨 정보를 가져오는 중입니다';
    wind.textContent = '-- km/h';
    humidity.textContent = '--%';
    precipitation.textContent = '-- mm';
}

// 에러 메시지 표시
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.style.display = 'none';
}

// 에러 메시지 숨기기
function hideError() {
    errorMessage.style.display = 'none';
}
