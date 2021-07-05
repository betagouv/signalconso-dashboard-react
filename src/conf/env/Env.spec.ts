import {bool, defaultValue, env, int, required} from './Env'

process.env.PORT = '3000';
process.env.IS_PRODUCTION = 'true';
process.env.IS_DEV = 'false';
process.env.API_TOKEN = 'api:token';
process.env.SOME_NUMBER = '0';

describe('Env', function () {
  it('Should parse we no parameter', function () {
    const port = env()('PORT');
    expect(port).toEqual('3000');
  });

  it('Should parse an int', function () {
    const port = env(int)('PORT');
    expect(port).toEqual(3000);
  });

  it('should test required', function () {
    const port = env(required)('PORT');
    expect(port).toEqual(process.env.PORT);

    try {
      env(required)('DB_PORT');
      expect(false).toBe(true);
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  it('should test default value', function () {
    const port = env(defaultValue('100'))('PORT');
    expect(port).toEqual(process.env.PORT);

    const dbPort = env(defaultValue('100'))('DB_PORT');
    expect(dbPort).toEqual('100');
  });

  it('should test bool', function () {
    const res = env(bool)('DB_PORT');
    expect(res).toBe(undefined);

    const res1 = env(bool)('IS_PRODUCTION');
    expect(res1).toBe(true);

    const res2 = env(bool)('IS_DEV');
    expect(res2).toBe(false);
  });

  it('should test compose', function () {
    try {
      const res = env(int, required)('DB_PORT');
      expect(false).toBe(true);
    } catch (e) {
      expect(true).toBe(true);
    }

    const res = env(int, required)('PORT');
    expect(res).toEqual(3000);
  });

  it('should test compose', function () {
    const res = env(int, defaultValue('10'))('SOME_NUMBER');
    expect(res).toEqual(0);
  });
});
