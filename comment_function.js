const inputBar = document.querySelector("#comment-input");
const rootDiv = document.querySelector("#comments");
const btn = document.querySelector("#submit");
const mainCommentCount = document.querySelector('#count');
const submitButton = document.querySelector("#submit");

// idOrVoteCountList 초기화
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

// 유저이름
function generateUserName() {
    const inputName = "디디인";
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var makeUsername = '';
    const randomPartLength = 4;

    for (let i = 0; i < randomPartLength; i++) {
        makeUsername += inputName.charAt(i);
    }
    return makeUsername;
}

function deleteComments(event) {
    const btn = event.target;
    if (btn.parentNode && btn.parentNode.id) {
        const commentId = btn.parentNode.id;
        fetch(`/delete-comment/${commentId}`, {
            method: "DELETE"
        })
        .then((response) => {
            if (response.ok) {
                // UI에서 댓글 제거
                btn.parentNode.parentNode.remove();
            } else {
                console.error("댓글 삭제 실패.");
            }
        });
    }
}

let canVote = true; // 클릭 가능 여부를 나타내는 변수

function numberCount(event) {
    if (canVote) { // 클릭 가능한 상태인 경우만 실행
        canVote = false; // 클릭 처리 중에는 클릭 비활성화

        if (event.target && event.target.parentNode && event.target.parentNode.id) {
            const commentId = event.target.parentNode.id;
            const isVoteUp = event.target.className === "voteUp";

            // 서버로 투표 요청을 보냅니다.
            fetch(isVoteUp ? `/vote-up/${commentId}` : `/vote-down/${commentId}`, {
                method: "PUT"
            })
                .then((response) => {
                    if (response.ok) {
                        // 투표가 성공하면, 화면에 반영하거나 업데이트합니다.
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

    const delBtn = document.createElement('button');
    delBtn.className = "deleteComment";
    delBtn.innerHTML = "삭제";
    commentList.className = "eachComment";
    userName.className = "name";
    userName.id = newId;
    inputValue.className = "inputValue";
    showTime.className = "time";
    voteDiv.className = "voteDiv";
    voteDiv.id = newId;

    userName.innerHTML = comment.userName;
    userName.appendChild(spacer);
    userName.appendChild(delBtn);

    inputValue.innerText = comment.text;
    showTime.innerHTML = comment.time;
    countSpan.innerHTML = 0;

    voteUp.className = "voteUp";
    voteDown.className = "voteDown";
    voteUp.innerHTML = "👍" + comment.voteUpCount;
    voteDown.innerHTML = "👎" + comment.voteDownCount;
    voteDiv.appendChild(voteUp);
    voteDiv.appendChild(voteDown);

    commentList.appendChild(userName);
    commentList.appendChild(inputValue);
    commentList.appendChild(showTime);
    commentList.appendChild(voteDiv);
    rootDiv.prepend(commentList);

    voteUp.addEventListener("click", numberCount);
    voteDown.addEventListener("click", numberCount);
    delBtn.addEventListener("click", deleteComments);
}

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

loadComments();

// 서버 측 통신 코드
submitButton.addEventListener("click", () => {
    submitButton.disabled = true;
    const currentVal = inputBar.value;

    if (!currentVal.length) {
        alert("댓글을 입력해주세요!!");
        submitButton.disabled = false;
    } else {
        const commentData = {
            text: currentVal,
            userName: generateUserName(),
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
                return response.json();
            } else {
                throw new Error("댓글을 서버로 전송하지 못했습니다.");
            }
        })
        .then((newComment) => {
            showComment(newComment);
            submitButton.disabled = false;
        })
        .catch((error) => {
            console.error(error);
            submitButton.disabled = false;
        });
    }
});

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
            throw new Error("댓글 데이터를 가져올 수 없습니다.");
        }
    } catch (error) {
        console.error(error);
    }
}

updateComments();

setInterval(updateComments, 1000);
