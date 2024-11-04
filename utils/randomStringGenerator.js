const crypto = require('crypto');

const randomStringGenerator = () => {
    const randomString = Array.from(Array(10), () => Math.floor(Math.random() * 36).toString(36)).join("");
    
    // 현재 타임스탬프를 가져옵니다.
    const timestamp = Date.now().toString();
    
    // SHA-256 해시 값을 생성합니다.
    const hash = crypto.createHash('sha256').update(timestamp).digest('hex');
    
    // 랜덤 문자열과 해시 값을 결합합니다.
    const result = randomString.toUpperCase() + hash;
    
    return result;
}

module.exports = {randomStringGenerator}; 
 