const firebaseConfig = {
  apiKey: "AIzaSyDyGzfdBBCpUUNZGeCHmsfHg4wm6Os_rO8",
  authDomain: "warmwhite-9409e.firebaseapp.com",
  projectId: "warmwhite-9409e",
  storageBucket: "warmwhite-9409e.appspot.com",
  messagingSenderId: "996857193254",
  appId: "1:996857193254:web:3a2c04960fc61e585557e7",
  measurementId: "G-PSDVPNVPKT",
  databaseURL: "https://warmwhite-9409e-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig); 
firebase.analytics();
var db = firebase.firestore();

function writeUserData(uid,title,text,chk) {
  let strDate=new Date().toLocaleString();
  db.collection("board").add({
    date: strDate,
    title: title,
    text: text,
    uid:uid,
    chk:chk
  })
  .then((docRef) => {
    writeList(uid,docRef.id,strDate,title);
    console.log("Document written with ID: ", docRef.id);
    location.href='/';
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
}
function updateUserData(uid,title,text,chk,key) {
  console.log(uid+"/"+title+"/"+text+"/"+chk+"/"+key);
  let strDate=new Date().toLocaleString();
  db.collection("board").doc(key).set({
    date: strDate,
    title: title,
    text: text,
    uid:uid,
    chk:chk
  })
  .then((docRef) => {
    location.href='/';
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
}

function writeUser(uid,strNickname) {
  db.collection("users").doc(uid).set({
    nickname:strNickname
  })
  .then((doc)=>{
    location.href="/login.html";
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
}

function writeList(strUid,strKey,strTime,strTitle) {
  db.collection("list").add({
    key:strKey,
    title:strTitle,
    timestamp:strTime,
    uid:strUid
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
}

function createAuth(){
  let email=document.getElementById("strId").value;
  let nickname=document.getElementById("nickname").value;
  let password1=document.getElementById("strPw1").value;
  let password2=document.getElementById("strPw2").value;
  if(password1==password2 && nickname !=""){
    const info=document.getElementById("info");
    firebase.auth().createUserWithEmailAndPassword(email, password1)
    .then((userCredential) => {
      var user = userCredential.user;
      writeUser(user.uid,nickname);
      info.style.display='block';
      info.style.color='tomato';
      info.innerHTML="Congratulations on joining! Sign in!";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      info.style.display='block';
      info.style.color='tomato';
      info.innerHTML=errorCode+' : '+errorMessage;
    });
  }
  else{
    alert("비밀번호가 다릅니다.");
  }
  
}

function loginAuth(){
  const email=document.getElementById("strId").value;
  const password=document.getElementById("strPw").value;
  const info=document.getElementById("info");
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      const strUid=JSON.stringify(user.uid).replace(/"/gi, ""); 
      const strEmail=JSON.stringify(user.email).replace(/"/gi, ""); 
      location.href="/index.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      info.style.display='block';
      info.style.color='tomato';
      info.innerHTML=errorCode+' : '+errorMessage;
    });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    info.style.display='block';
    info.style.color='tomato';
    info.innerHTML=errorCode+' : '+errorMessage;
  });
}

function getNickname(uid){
  db.collection("users").doc(uid.replace(/"/gi, ""))
  .get().then((docRef) => {
    return docRef.data().nickname;
  }).catch((error) => {
    return false;
  });
}

function removeData(key){
  console.log()
  db.collection("list").where("key","==",key).get().then((getQuery) => {
    getQuery.forEach((doc) => {
      db.collection("list").doc(doc.id).delete().then((deleteQuery) => {
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
    })
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
  db.collection("board").doc(key).delete().then(() => {
    location.href="/";
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
}


function logout(){
  firebase.auth().signOut().then(function() {
     window.location.href = "/";
  }).catch(function(error) {
    if(error){
        alert("로그인 실패");
    }
  });
}