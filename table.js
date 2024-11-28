class Timetable {
    constructor(id, name, type = 'user') { // type: 'user' or 'friend'
        this.id = id;
        this.name = name;
        this.type = type;
        this.apiUrl = 'http://127.0.0.1:5001/get_timetable';
        this.tableBody = document.getElementById('timetableBody');
        this.container = document.getElementById('timetableContainer');
        this.userInfoDiv = document.getElementById('userInfo');
    }

    displayUserInfo() {
        this.userInfoDiv.textContent = `현재 ${this.type === 'user' ? '사용자' : '친구'}: ID - ${this.id}, 이름 - ${this.name}`;
    }

    fetchTimetable() {
        fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                this.renderTimetable(data.timetable);
            } else {
                this.displayNoTimetableMessage();
            }
        })
        .catch(error => console.error('Error:', error));
    }

    renderTimetable(timetable) {
        this.tableBody.innerHTML = ''; // 초기화
        const timeSlots = Array.from({ length: 30 }, (_, i) => {
            const hours = 7 + Math.floor(i / 2); // 07:00부터 시작
            const minutes = i % 2 === 0 ? '00' : '30';
            return `${hours}:${minutes}`;
        });
    
        timeSlots.forEach((slot, index) => {
            const row = document.createElement('tr');
            const timeCell = document.createElement('td');
            timeCell.textContent = slot;
            row.appendChild(timeCell);
    
            for (let day = 1; day <= 5; day++) {
                const cell = document.createElement('td');
    
                // 해당 시간과 요일에 맞는 시간표 항목 검색
                const entries = timetable.filter(entry => {
                    const [startTime, endTime] = entry.time.split('-');
                    const startIndex = timeSlots.indexOf(startTime);
                    const endIndex = timeSlots.indexOf(endTime);
                    return day === entry.day && index >= startIndex && index < endIndex;
                });
    
                if (entries.length > 0) {
                    const entry = entries[0];
                    cell.textContent = `${entry.class_name} (${entry.location})`;
                    cell.style.backgroundColor = '#d3d3d3'; // 블록 배경색
                    cell.rowSpan = 1; // 추가 구현 가능
                }
    
                row.appendChild(cell);
            }
    
            this.tableBody.appendChild(row);
        });
    }
    

    displayNoTimetableMessage() {
        // 기존 콘텐츠 초기화
        this.container.innerHTML = '';

        // 메시지 생성
        const message = document.createElement('p');
        if (this.type === 'friend') {
            message.textContent = "등록된 친구의 시간표가 없습니다.";
        } else {
            message.textContent = "시간표가 없습니다!";
            const uploadButton = document.createElement('button');
            uploadButton.textContent = '이미지 업로드 페이지로 이동';
            uploadButton.style.marginTop = '20px';
            uploadButton.style.padding = '10px 20px';
            uploadButton.style.backgroundColor = '#b93234';
            uploadButton.style.color = 'white';
            uploadButton.style.border = 'none';
            uploadButton.style.borderRadius = '5px';
            uploadButton.style.cursor = 'pointer';
            uploadButton.style.fontFamily = 'Arial, sans-serif';

            // 버튼 클릭 이벤트
            uploadButton.addEventListener('click', () => {
                window.location.href = 'imageUpload.html';
            });

            this.container.appendChild(uploadButton);
        }

        message.style.fontSize = '18px';
        message.style.color = 'red';
        message.style.textAlign = 'center';
        this.container.appendChild(message);
    }
}
