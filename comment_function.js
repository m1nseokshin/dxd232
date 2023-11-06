//상호작용할 엘레먼트 불러오기
const inputBar = document.querySelector("#comment-input");
const rootDiv = document.querySelector("#comments");
const btn = document.querySelector("#submit");
const mainCommentCount = document.querySelector('#count');
const submitButton = document.querySelector("#submit");

// 좋아요 싫어요 초기화
let idOrVoteCountList = [];

// 타임스템프 만들기
function generateTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const wDate = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    const time = year + '-' + month + '-' + wDate + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

// 이름칸의 데이터를 가저오는 함수
function generateUserName() {
    const inputName = document.querySelector("#username").value;
    return inputName;
}



let canVote = true; // 클릭 가능 여부를 나타내는 변수

function numberCount(event) {
    if (canVote) { // 클릭 가능한 상태인 경우만 실행
        canVote = false; // 클릭 처리 중에는 클릭 비활성화

        if (event.target && event.target.parentNode && event.target.parentNode.id) {
            const commentId = event.target.parentNode.id;
            const isVoteUp = event.target.className === "voteUp";

            // 서버로 투표 요청을 보냄
            fetch(isVoteUp ? `/vote-up/${commentId}` : `/vote-down/${commentId}`, {
                method: "PUT"
            })
                .then((response) => {
                    if (response.ok) {
                        // 좋아요나 싫어요 카운트 화면에 업데이트.
                        const index = idOrVoteCountList.findIndex(item => item.commentId.toString() === commentId);
                        if (index >= 0) {
                            idOrVoteCountList[index][isVoteUp ? "voteUpCount" : "voteDownCount"]++;
                            event.target.innerHTML = isVoteUp ? `👍 ${idOrVoteCountList[index].voteUpCount}` : `👎 ${idOrVoteCountList[index].voteDownCount}`;
                        }
                    } else {
                        console.error("투표를 서버로 전송하지 못했습니다.");
                    }
                })
                .finally(() => {
                    canVote = true; // 클릭 처리가 완료되면 클릭 가능하도록 설정
                });
        }
    }
}

//JSON데이터를 클라이언트로 보여주는 함수
function showComment(comment) {
    const userName = document.createElement('div');
    const inputValue = document.createElement('span');
    const showTime = document.createElement('div');
    const voteDiv = document.createElement('div');
    const countSpan = document.createElement('span');
    const voteUp = document.createElement('button');
    const voteDown = document.createElement('button');
    const commentList = document.createElement('div');
    const spacer = document.createElement('div');
    const newId = comment.id;

    spacer.className = "spacer";
    commentList.className = "eachComment";
    userName.className = "name";
    userName.id = newId;
    inputValue.className = "inputValue";
    showTime.className = "time";
    voteDiv.className = "voteDiv";
    voteUp.className = "voteUp";
    voteDown.className = "voteDown";
    voteDiv.id = newId;

    userName.innerHTML = comment.userName;
    inputValue.innerText = comment.text;
    showTime.innerHTML = comment.time;
    countSpan.innerHTML = 0;
    voteUp.innerHTML = "👍" + comment.voteUpCount;
    voteDown.innerHTML = "👎" + comment.voteDownCount;

    voteDiv.appendChild(voteUp);
    voteDiv.appendChild(voteDown);
    userName.appendChild(spacer);
    commentList.appendChild(userName);
    commentList.appendChild(inputValue);
    commentList.appendChild(showTime);
    commentList.appendChild(voteDiv);
    rootDiv.prepend(commentList);

    //좋아요 싫어요 이벤트리스너
    voteUp.addEventListener("click", numberCount);
    voteDown.addEventListener("click", numberCount);
}

//서버에서 데이터를 가저옴
async function loadComments() {
    const response = await fetch("/get-comments");
    if (response.ok) {
        const data = await response.json();
        rootDiv.innerHTML = "";
        data.forEach((comment) => {
            showComment(comment);
        });
    }
}

//로드해주는 함수
loadComments();

// 작성한 데이터를 서버로 넘기기 위한 코드
submitButton.addEventListener("click", () => {
    const currentVal = inputBar.value;
    const username = generateUserName(); // 사용자 이름 가져오기

    if (!username) {
        alert("이름을 입력해주세요!"); // 이름이 비어 있으면 알림 표시
    } else if (!currentVal) {
        alert("댓글을 입력해주세요!"); // 댓글이 비어 있으면 알림 표시
    } else {
        const confirmation = confirm("댓글을 등록하시겠습니까? 한번 등록한 댓글은 삭제할 수 없습니다."); // 힌반 더 확인

        if (confirmation) {
            submitButton.disabled = true;

            const commentData = {
                text: currentVal,
                userName: username,
                time: generateTime(),
                voteUpCount: 0,
                voteDownCount: 0
            };

            fetch("/add-comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(commentData)
            })
            .then((response) => {
                if (response.ok) {
                    return response.json(); //성공시 데이터 전달
                } else {
                    throw new Error("댓글을 서버로 전송하지 못했습니다."); //실패시
                }
            })
            .then((newComment) => {
                showComment(newComment);

                // 데이터가 전해지면 입력했던 정보 초기화시키기
                inputBar.value = ""; // 댓글 입력란 초기화
                document.querySelector("#username").value = ""; // 이름 입력란 초기화

                // 댓글 등록 성공 알림
                alert("댓글이 등록되었습니다!");
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                submitButton.disabled = false; // 알림 창 이후 버튼을 다시 활성화
            });
        }
    }
});

//데이터를 계속해서 클라이언트 사용자 화면에 보내는 함수
async function updateComments() {
    try {
        const response = await fetch("/get-comments");
        if (response.ok) {
            const data = await response.json();
            rootDiv.innerHTML = "";
            data.forEach((comment) => {
                showComment(comment);
            });
        } else {
            throw new Error("서버가 에러 상태를 반환했습니다: " + response.status);
        }
    } catch (error) {
        console.error(error);
    }
}

//함수 실행
updateComments();

//서버와 클라이언트를 동기화 하는 딜레이 설정 (즉 0.5초 마다 동기화)
setInterval(updateComments, 500);
