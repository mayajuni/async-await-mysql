/**
 * Created by mayaj on 2016-05-10.
 */
const promiseMysql = require('promise-mysql');

const pool = promiseMysql.createPool({
    connectionLimit : 10,
    host: 'your_db_host',
    user: 'your_db_user',
    password: 'your_db_password',
    database: 'your_db'
});

export module mysql {
    /**
     * 일반 커넥트
     * 
     * @param fn
     */
    export const connect = fn => async (...args) => {
        /* DB 커넥션을 한다. */
        let con: any = await pool.getConnection();
        /* 비지니스 로직에 con을 넘겨준다. */
        const result = await fn(con, ...args).catch(error => {
            /* 에러시 con을 닫아준다. */
            con.connection.release();
            throw error;
        });
        /* con을 닫아준다. */
        con.connection.release();
        return result;
    };

    /**
     * 트렌젝션 처리시 사용
     * 
     * @param fn
     */
    export const transaction = fn => async (...args) => {
        /* DB 커넥션을 한다. */
        let con: any = await pool.getConnection();
        /* 트렌젝션 시작 */
        await con.connection.beginTransaction();
        /* 비지니스 로직에 con을 넘겨준다. */
        const result = await fn(con, ...args).catch(async (error) => {
            /* rollback을 진행한다. */
             await con.rollback();
            /* 에러시 con을 닫아준다. */
            con.connection.release();
            throw error;
        });
        /* commit을 해준다. */
        await con.commit();
        /* con을 닫아준다. */
        con.connection.release();
        return result;
    }
}







