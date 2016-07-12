# async/await를 이용한 mySql 모듈 만들기
이 코드는 해당 async/await를 이용하여 mysql 모듈에 대한 예제 소스 입니다.
mysql 모듈을 mocha를 이용하여, 테스트 하는 코드까지 함께 있습니다.

module 폴더 안에 mysql.ts 파일이 있는데 이것이 mysql 모듈입니다.
test 폴더 안에 mocha를 이용하여 mysql.ts를 테스트한 파일이 있습니다.
> 이것에 대한 설명은 [저의 블로그](https://mayajuni.github.io/2016/07/12/typescript-nodejs-mysql/)를 보시면 확인 할 수 있습니다.

## 설정
module 폴더 안에 보면 mysql.ts가 있습니다.
해당 폴더 안에 있는 pool 정보를 입력해주셔야 됩니다.
```javascript
const pool = promiseMysql.createPool({
    connectionLimit : 10,
    host: 'your_db_host',
    user: 'your_db_user',
    password: 'your_db_password',
    database: 'your_db'
});
```

## 실행
```bash
npm start
```

