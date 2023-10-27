document.addEventListener("DOMContentLoaded", () => {
    const commentsContainer = document.getElementById("comments");
    const commentForm = document.getElementById("commentForm");
    const commentText = document.getElementById("commentText");

    // 페이지 로드 시, 댓글을 불러와서 표시
    fetch("/comments")
        .then((response) => response.json())
        .then((comments) => {
            comments.forEach((comment) => {
                const commentDiv = document.createElement("div");
                commentDiv.innerText = comment.text;
                commentsContainer.appendChild(commentDiv);
            });
        });

    // 댓글 작성 폼 제출 시, 새 댓글을 서버에 전송
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const commentTextValue = commentText.value;

        fetch("/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: commentTextValue }),
        })
            .then((response) => response.json())
            .then((newComment) => {
                const commentDiv = document.createElement("div");
                commentDiv.innerText = newComment.text;
                commentsContainer.appendChild(commentDiv);
                commentText.value = "";
            });
    });
});
