const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    // retry to connect once every one seconds
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
    if (index < 2) return 1;
    return fib(index -1) + fib(index -2);
}

sub.on('message', (channel, message) => {
    // 新しい値を受け取るとRedisを走らせる
    // フィボナッチ関数で処理した値をハッシュに挿入する
    redisClient.hset('values', message, fib(parseInt(message)));
});