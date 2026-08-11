// api/write.js
import fs from 'fs';
import path from 'path';

// 🔴 这是你设置的秘钥，记得换成你自己的一串随机字符！
const SECRET_KEY = "my_secret_key_2026"; 

export default function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 🔴 检查请求头里是否包含正确的秘钥
    const authToken = req.headers['x-auth-token'];
    if (authToken !== SECRET_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, hash } = req.body;

    if (!name || !hash) {
        return res.status(400).json({ error: 'Missing name or hash' });
    }

    const filePath = path.join(process.cwd(), 'public', 'accounts.json');
    let accounts = [];

    // 读取现有数据
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            accounts = JSON.parse(data);
        } catch (e) {
            accounts = [];
        }
    }

    // 追加或更新玩家
    let found = false;
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].名称 === name) {
            accounts[i].内容 = hash;
            found = true;
            break;
        }
    }
    if (!found) {
        accounts.push({ 名称: name, 内容: hash });
    }

    fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2), 'utf8');

    res.status(200).json({ success: true });
}
