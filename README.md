# westargram

## 📆 기간

- 2023.02.04 ~ 2023.02.09

## ✈️ 목적

- 소셜 네트워크 서비스 사이트를 모델링한 프로젝트입니다.
- [하나의 파일로 구현했던 RESTful API](https://github.com/Gyelanjjim/39-backend-westagram-refactoring.git)를 Layered pattern 으로 구조화하고 각 기능의 고도화, 개인 정보 보호 및 적절한 서비스 로직을 구체화하는 것을 목적으로 합니다.

## 🟦 DB 다이어그램

![Westagram](https://user-images.githubusercontent.com/108852943/217701858-f4b77e32-6f8f-45f8-84d1-8fb1cb76d113.png)

- [🔗참조](https://support.microsoft.com/ko-kr/topic/internet-explorer%EC%9D%98-%EC%B5%9C%EB%8C%80-url-%EA%B8%B8%EC%9D%B4%EB%8A%94-2-083%EC%9E%90%EC%9E%85%EB%8B%88%EB%8B%A4-174e7c8a-6666-f4e0-6fd6-908b53c12246) Internet Explorer의 최대 URL 길이는 2,083자로 규정되어 있으므로 이미지URL이 저장될 users table의 profile_image, posts table의 image 컬럼의 type 크기는 VARCHAR(2083) 으로 설정.

## 🏓 API List

### 1. **health check**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>res.body</th>
  <tr>
    <td>GET</td>
    <td>/ping</td>
    <td>{ "message": "pong" }</td>
  </tr>
</table>

- 서버의 정상 동작 여부를 확인하기 위한 가장 단순한 API 구현.

### 2. **회원 가입**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.body</th>
  <tr>
    <td>POST</td>
    <td>/users/signup</td>
    <td>email, password, name, username, image</td>
  </tr>
</table>

- Middleware 에서
  <p> 'image' 는 AWS S3 버킷에 1개의 파일만 전송할 수 있도록 multer-s3의 single() 메서드를 사용하였고, 입력받은 파일명이 중복되어도 서로 다른 파일로 인식되도록 Date.now() 메서드를 사용해 파일명을 재설정함.</p>
- Presentation layer 에서
  <p> 'email', 'password', 'name', 'username' 값이 존재해야 하므로 undefined 로 입력 받았을 때 key error를 반환하여 클라이언트가 올바른 값을 입력하도록 유도함.</p>
- Business layer 에서

  <p>'email'은 '@'를 기준으로 앞뒤에 '영소/대문자,숫자,dash,밑줄,마침표'를 쓸 수 있도록 정규표현식을 사용해 이메일 유효성 검사를 수행.</p> 
  <p>'email'은 유일해야 하므로 email로 user정보 조회하여 중복 검사를 수행.</p>
  <p>'password'는 '영소/대문자,숫자,특수문자'를 사용하여 최소 6자, 최대 16자로 작성할 수 있도록 정규표현식을 사용해 비밀번호 유효성 검사를 수행.</p> 
  <p>'password'는 악의적 사용자에 의한 DB정보 탈취를 방지하기 위해 bcrypt.hash() 메서드를 사용하여 암호화.</p>
  <p>'username'은 '영소문자,숫자,밑줄,마침표'를 사용하여 최소 4자 최대 20자로 작성할 수 있도록 정규표현식을 사용해 사용자명 유효성 검사를 수행</p> 
  <p>'username'은 유일해야 하므로 username으로 user정보 조회하여 중복 검사를 수행</p>

- Persistance layer 에서
  <p>TypeORM의 pooling 기능과 SQL query를 사용해 주어진 값을 INSERT하도록 수행</p>

### 3. **로그인**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.body</th>
  <th>res.body</th>
  <tr>
    <td>POST</td>
    <td>/users/signin</td>
    <td>email, password</td>
    <td>accessToken</td>
  </tr>
</table>

- Presentation layer 에서
  <p> 'email', 'password' 값이 존재해야 하므로 undefined 로 입력 받았을 때 key error를 반환하여 클라이언트가 올바른 값을 입력하도록 유도함.</p>
  <p> 서버에서 사용자의 식별값을 관리하지 않아도 사용자를 인증할 수 있도록 'email', 'password'를 하위 레이어에 전달하고, 반환된 accessToken 을 res.body에 담아 클라이언트에 반환</p>
- Business layer 에서
  <p>상기된 규칙에 맞게 입력된 'password'인지 비밀번호 유효성 검사를 수행</p>
  <p>'email'은 DB에 저장되어 있어야 하므로 email로 user정보 존재여부를 조회하고 존재하면 bcrypt.compare() 메서드를 사용하여 'password'와 DB에 저장된 암호화된 비밀번호를 비교 검증을 수행</p>
  <p>향후 사용자 인증 후 맞춤형 서비스 로직에서 사용할 수 있도록 jwt.sign() 메서드를 사용해 userId와 JWT 시크릿키로 암호화한 accessToken을 상위 레이어에 반환</p>
  <p></p>

### **4. userId로 회원 정보 조회**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.params</th>
  <th>req.headers.authorization</th>
  <tr>
    <td>GET</td>
    <td>/users/:userId</td>
    <td>userId</td>
    <td>(accessToken)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자의 인증인가를 위해 jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>

- Business layer 에서
  <p>조회하려는 사용자의 userId로 사용자정보를 조회하고 개인정보 보호를 위해 반환된 객체에서 비밀번호와 수정날짜를 삭제함.</p>
  <p>userId 와 accessToken을 해독하여 받은 myId를 비교하여 같으면 본인 계정이라는 의미로 isMine 키에 true 값을 할당. 다르면 본인 계정이 false 값을 할당하고 개인정보 보호를 위해 email 정보를 삭제함. </p>

### **5. accessToken으로 회원 정보 수정**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.params</th>
  <th>req.body</th>
  <th>req.header.authorization</th>
  <tr>
    <td>PUT</td>
    <td>/users/:userId</td>
    <td>userId</td>
    <td>password, name, username, image</td>
    <td>(accessToken)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자의 인증인가를 위해 jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>
  <p> 'image' 는 AWS S3 버킷에 1개의 파일만 전송할 수 있도록 multer-s3의 single() 메서드를 사용하였고, 입력받은 파일명이 중복되어도 서로 다른 파일로 인식되도록 Date.now() 메서드를 사용해 파일명을 재설정함.</p>

- Presentation layer 에서
  <p>'email' 은 변경할 수 없으므로 변경하려고 시도할 경우 적절한 상태코드와 에러메시지를 반환</p>

- Business layer 에서
  <p>'username'은 유일해야 하므로 입력받았다면 username으로 user정보 조회하여 중복 검사를 수행</p>
  <p>'password'는 암호화해서 저장해야하므로 입력받았다면 비밀번호 유효성검사를 수행하고 bcrypt.hash() 메서드로 암호화를 수행</p>
  <p>어떤 키와 값을 입력받아도 유연하게 SQL query를 생성하는 SetClause 함수를 선언하여 수행한 결과를 userId와 함께 하위 레이어에 전달.</p>

- Persistance layer 에서
  <p>userId가 일치하는 rows의 정보를 수정할 수 있도록 UPDATE를 수행.</p>

### **6. 게시글 등록**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.body</th>
  <th>req.header.authorization</th>
  <tr>
    <td>POST</td>
    <td>/posts</td>
    <td>image, title, content</td>
    <td>(access Token)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자의 인증인가를 위해 jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>
  <p> 'image' 는 AWS S3 버킷에 5개의 파일만 전송할 수 있도록 multer-s3의 array() 메서드를 사용하였고, 입력받은 파일명이 중복되어도 서로 다른 파일로 인식되도록 Date.now() 메서드를 사용해 파일명을 재설정함.</p>

- Presentation layer 에서
  <p>게시글 등록 시 title, content, image가 모두 필요하므로 하나라도 입력되지 않았을 때 키 에러를 반환.</p>

- Persistance layer 에서
  <p>userId, title, content는 posts 테이블에 INSERT한 뒤 생성된 posts.id를 참조하여 post_images 테이블에 image URL들을 저장해야 하므로, 하나의 트랜잭션이 정상적으로 완료 시 commit연산, 비정상적으로 종료되는 경우에는 rollback연산을 수행하도록 구현</p>
  <p>한번에 여러 이미지URL을 INSERT하기위해 입력된 파라미터를 map() 연산하여 Bulk INSERT 구문을 생성하고 할당.</p>

### **7. 모든 게시글 조회**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.header.authorization</th>
  <tr>
    <td>GET</td>
    <td>/posts</td>
    <td>(access Token)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자만 게시글 조회를 이용할 수 있도록, jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독하고, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>
- Persistance layer 에서
  <p>게시글id(postId), 게시글 제목(title), 게시글 이미지(images), 게시글 작성일(created_at), 게시글 수정일(updated_at), 게시글 작성자id(authorId), 게시글 작성자의 username, 게시글 좋아요 수(likeCount), 좋아요 누른 사람id(liker.id), 좋아요 누른 사람의 username(liker.username), 댓글id(cm.id), 댓글작성자id(cm.userId), 댓글작성자의 username(cm.username), 댓글 내용(cm.content) 를 SELECT하는 SQL query를 구현. </p>

### **8. userId로 특정 사용자가 작성한 게시글 조회**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.params</th>
  <th>req.header.authorization</th>
  <tr>
    <td>GET</td>
    <td>/posts/:userId</td>
    <td>userId</td>
    <td>(access Token)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자만 게시글 조회를 이용할 수 있도록, jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독하고, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>
- Presentation layer 에서
  <p>accessToken을 해독한 myId와 특정 사용자가 작성한 게시글을 조회하기 위해 path파라미터로 받은 userId를 하위 레이어에 전달하고, 그로부터 반환된 조회 결과와 적절한 상태코드(200)을 클라이언트에게 반환</p>
- Business layer 에서
  <p>클라이언트로 하여금 로그인한 사용자에게 게시글 수정 권한이 있는지 판단할 수 있게 하기위해서 userId로 조회한 결과값의 'isMine' 키에 myId와 userId를 비교하여 같으면 true를, 다르면 false를 할당하고 상위 레이어에 반환한다.</p>

- Persistance layer 에서
  <p>posts 테이블의 user_id 컬럼에 대해 userId가 일치하는 조건 하에; 게시글id(postId), 게시글 제목(title), 게시글 이미지(images), 게시글 작성일(created_at), 게시글 수정일(updated_at), 게시글 작성자id(authorId), 게시글 작성자의 username, 게시글 좋아요 수(likeCount), 좋아요 누른 사람id(liker.id), 좋아요 누른 사람의 username(liker.username), 댓글id(cm.id), 댓글작성자id(cm.userId), 댓글작성자의 username(cm.username), 댓글 내용(cm.content) 를 SELECT 하는 SQL query를 구현. </p>

### **9. 좋아요 등록/삭제**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.body</th>
  <th>req.header.authorization</th>
  <tr>
    <td>POST</td>
    <td>/likes</td>
    <td>postId</td>
    <td>(access Token)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자만 좋아요 등록/삭제를 이용할 수 있도록, jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독하고, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>
- Presentation layer 에서
  <p>특정 게시글을 등록/삭제하기 위해 requst.body 로 받은 postId와 accessToken에서 해독한 userId를 하위 레이어에 전달한다. 반환된 값이 1 이면 좋아요가 생성되었다는 적절한 메시지와 상태코드(201)을, 0이면 좋아요가 삭제되었다는 상태코드(204)를 반환한다.</p>
- Business layer 에서
  <p>DB에 좋아요 가 있는지 여부를 확인하기 위해 userId, postId를 하위 레이어에 전달하고 반환된 값이 '1' 이면 존재하므로 삭제를, '0' 이면 없으므로 등록을 수행한다. </p>
- Persistance layer 에서
  <p>likes 테이블에 대하여 userId, postId의 존재여부를 반환하도록 EXISTS() 쿼리로 확인</p>
  <p>likes 테이블에 대하여 userId, postId를 기준으로 INSERT, DELETE 하는 쿼리를 각각 구현 </p>

### **10. accessToken으로 본인이 누른 좋아요 리스트 조회**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.header.authorization</th>
  <tr>
    <td>GET</td>
    <td>/likes/my</td>
    <td>(access Token)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자만 본인이 좋아요를 누른 리스트를 조회할 수 있도록, jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독하고, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>

### **11. 댓글 등록**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.body</th>
  <th>req.header.authorization</th>
  <tr>
    <td>POST</td>
    <td>/comments</td>
    <td>postId, content</td>
    <td>(access Token)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자만 댓글을 등록할 수 있도록, jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독하고, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>
- Presentation layer 에서
  <p>특정 게시글에 댓글을 생성하기 위해 postId와 content를 request.body로 받고 accessToken에서 해독한 userId를 하위 레이어에 전달하여 성공적으로 등록되면 적절한 상태코드(201)와 메시지를 클라이언트에게 반환한다.</p>

### **12. accessToken으로 자신이 작성한 댓글 조회**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.header.authorization</th>
  <tr>
    <td>GET</td>
    <td>/comments</td>
    <td>(access Token)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자만 자신이 작성한 댓글을 조회할 수 있도록, jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독하고, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>
- Presentation layer 에서
  <p>본인이 작성한 댓글 리스트를 조회하기 위해 'accessToken'에서 해독한 userId를 하위 레이어에 전달하고 반환받은 data를 클라이언트에 전달. </p>

- Persistance layer 에서
  <p>사용자로 하여금 본인이 어떤 게시글에 언제 댓글을 작성하고 수정했는지 조회할 수 있도록, 댓글 작성한 userId를 기준으로 댓글 작성자id(commenterId), 댓글id(comment.id), 댓글이 작성된 게시글 id(comment.post_id), 댓글이 작성된 게시글 제목(comment.title), 댓글 작성 날짜(comment.created_at), 댓글 수정 날짜(comment.updated_at), 댓글 내용(comment.content)을 조회하여 객체 형태로 반환.</p>

### **13. commentId로 특정 댓글 삭제**

<table>
  <th>HTTP</th>
  <th>Endpoint</th>
  <th>req.params</th>
  <th>req.header.authorization</th>
  <tr>
    <td>DELETE</td>
    <td>/comments/:commentId</td>
    <td>commentId</td>
    <td>(access Token)</td>
  </tr>
</table>

- Middleware 에서
  <p>'accessToken' 이 없으면 클라이언트에 로그인을 요청하도록 에러메시지와 상태코드를 반환 </p>
  <p>로그인한 사용자만 댓글 삭제를 이용할 수 있도록, jwt.verify() 메서드와 jwt시크릿키로 토큰을 해독하고, userId로 DB에 저장된 기존 user 정보를 조회하고, 다음 레이어에서 이용할 수 있게 req.user에 담아 넘김</p>
- Presentation layer 에서
  <p>특정 댓글을 삭제하기 위해 구분자인 commentId를 path파라미터로 받고 accessToken에서 해독한 userId와 함께 하위 레이어에 전달. 성공적으로 삭제 요청이 완료되면 적절한 상태코드(204)를 반환.</p>
- Business layer 에서
  <p>해당 댓글이 로그인한 사용자 본인이 작성한 댓글인지 판단하기 위해 userId와 commentId를 기준으로 일치하는 row가 있는지 조회. 없으면 자신이 작성한 댓글이 아니므로 삭제할 수 있는 권한이 없어 적절한 에러 메시지와 상태코드(403)를 클라이언트에게 반환. </p>
- Persistance layer 에서
  <p>특정 댓글을 구분하는 commentId를 기준으로 comments 테이블에서 row를 삭제하도록 SQL query를 구현</p>

## 🛠️ Skills

Platforms & Languages

![MYSQL](https://img.shields.io/badge/MYSQL-4479A1.svg?&style=for-the-badge&logo=MYSQL&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933.svg?&style=for-the-badge&logo=Node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000.svg?&style=for-the-badge&logo=Express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?&style=for-the-badge&logo=JavaScript&logoColor=white)

Tools

![Git](https://img.shields.io/badge/Git-F05032.svg?&style=for-the-badge&logo=Git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37.svg?&style=for-the-badge&logo=Postman&logoColor=white)
