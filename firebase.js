import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLicIUlQwBrAM3PBpIjmnFwOKZsmHUOAM",
  authDomain: "dxdartworks.firebaseapp.com",
  projectId: "dxdartworks",
  storageBucket: "dxdartworks.appspot.com",
  messagingSenderId: "574010878524",
  appId: "1:574010878524:web:bca8c895758a5a3ccb3139",
  measurementId: "G-0PV0J5L46L"
};
// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const commentsCollection = collection(db, 'comments');
const query = query(commentsCollection, orderBy('timestamp', 'desc'));


// 댓글 추가 함수
function addComment(userName, commentText) {
  const newComment = {
    user: userName,
    text: commentText,
    timestamp: new Date() // 현재 시간 사용
  };

  addDoc(commentsCollection, newComment)
    .then((docRef) => {
      console.log('댓글이 추가되었습니다. Document ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('댓글 추가 중 오류 발생: ', error);
    });
}

// 댓글 불러오기 함수
function loadComments() {
  const queryComments = query(commentsCollection, orderBy('timestamp', 'desc'));

  onSnapshot(queryComments, (snapshot) => {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = ''; // 기존 댓글 삭제

    snapshot.forEach((doc) => {
      const commentData = doc.data();
      const commentItem = document.createElement('li');
      commentItem.textContent = `${commentData.user}: ${commentData.text}`;
      commentsList.appendChild(commentItem);
    });
  });
}

// 댓글 작성 버튼 클릭 시 이벤트
const postCommentButton = document.getElementById('post-comment');
postCommentButton.addEventListener('click', () => {
  const userName = document.getElementById('user-name').value;
  const commentText = document.getElementById('comment-text').value;

  if (userName && commentText) {
    addComment(userName, commentText);
  }
});


// 페이지 로드 시 댓글 불러오기
loadComments();