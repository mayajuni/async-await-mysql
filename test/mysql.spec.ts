/**
 * Created by mayaj on 2016-07-12.
 */
import {mysql} from '../module/mysql';
const should = require('should');

/**
 * 테스트는 test라는 테이블을 만들고 진행했다.
 *
 * 스키마
 *  id/int/auto_increment
 *  name/varchar(20)
 */
describe('단일 connect', () => {
    it('insert', done => {
        const insert = mysql.connect(async (con: any, done: any) => {
            await con.query(`insert into test (name) values ('test')`);
            done();
        });

        insert(done);
    });
    it('select', done => {
        const todo = mysql.connect(async (con: any, done: any) => {
            const result = await con.query(`select * from test`);
            result.should.be.a.Array();
            result[0].should.have.property('id');
            result[0].should.have.property('name');
            result[0].name.should.equal('test');
            done();
        });

        todo(done);
    });
    it('update', done => {
        const todo = mysql.connect(async (con: any, done: any) => {
            await con.query(`update test set name = 'test2'`);
            const result = await con.query(`select * from test`);
            result.should.be.a.Array();
            result[0].should.have.property('id');
            result[0].should.have.property('name');
            result[0].name.should.equal('test2');
            done();
        });

        todo(done);
    });

    it('delete', done => {
        const todo = mysql.connect(async (con: any, done: any) => {
            await con.query(`delete from test`);
            const result = await con.query(`select * from test`);
            result.should.be.null;
            done();
        });

        todo(done);
    });

    /* catch로 에러를 잡을수 있다. */
    it('에러테스트', done => {
        const todo = mysql.connect(async (con: any, done: any) => {
            await con.query(`delete frosm test`);
            done();
        });

        todo(done).catch((err) => {
            err.should.be.not.null;
            done();
        });
    });
});

describe('트렌젝션 테스트', () => {
    it('다중 insert select update select delete', done => {
        const todo = mysql.transaction(async (con: any, done: any) => {
            await con.query(`insert into test (name) values ('test')`);
            await con.query(`insert into test (name) values ('test2')`);
            await con.query(`insert into test (name) values ('test3')`);
            const result = await con.query(`select * from test`);
            result.should.be.a.Array();
            result.length.should.equal(3);
            await con.query(`update test set name = 'updateTest' where name='test'`);
            const result2 = await con.query(`select * from test where name='updateTest'`);
            result2.should.be.a.Array();
            result2[0].name.should.equal('updateTest');
            await con.query(`delete from test`);
            const result3 = await con.query(`select * from test`);
            result3.should.be.null;
            done();
        });

        todo(done);
    });
    it('오류시 rollback 테스트', done => {
        const todo = mysql.transaction(async (con: any, done: any) => {
            await con.query(`insert into test (name) values ('test')`);
            await con.query(`insert into test (name) values ('test2')`);
            await con.query(`insert into test (name) values ('test3')`);
            const result = await con.query(`select * from test`);
            result.should.be.a.Array();
            result.length.should.equal(3);
            /* 여기에서 에러를 냅니다. */
            await con.query(`update te2st set name = 'updateTest' where name='test'`);
            const result2 = await con.query(`select * from test where name='updateTest'`);
            result2.should.be.a.Array();
            result2[0].name.should.equal('updateTest');
            await con.query(`delete from test`);
            const result3 = await con.query(`select * from test`);
            result3.should.be.null;
            done();
        });

        todo(done).catch(err => {
            /* 당연히 err객체는 존재하고 */
            err.should.be.not.null;
            /* 모든 코드가 rollback이 되었기 때문에 다시 select시 데이터는 아무것도 없어야된다. */
            const todo = mysql.connect(async (con: any, done: any) => {
                const result = await con.query(`select * from test`);
                result.should.be.null;
                done();
            });

            todo(done);
        });
    });
});