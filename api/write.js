// api/write.js
import fs from 'fs';
import path from 'path';

const SECRET_KEY = "mc-kaikai114541mcjavacckaikai";

export default function handler(req, res) {
    console.log("📥 收到请求, 方法:", req.method);

    if (req.method !== 'POST') {
        console.log("❌ 方法不允许");
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const authToken = req.headers['x-auth-token'];
    console.log("🔑 收到密钥:", authToken);

    if (authToken !== SECRET_KEY) {
        console.log("❌ 密钥不匹配");
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, hash } = req.body;
    console.log("📝 收到数据:", name, hash);

    if (!name || !hash) {
        console.log("❌ 缺少参数");
        return res.status(400).json({ error: 'Missing name or hash' });
    }

    // 🔴 这里已经改成 data 文件夹了
    const filePath = path.join(process.cwd(), 'data', 'accounts.json');
    console.log("📁 文件路径:", filePath);

    let accounts = [];

    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            accounts = JSON.parse(data);
            console.log("📖 读取成功，当前条数:", accounts.length);
        } catch (e) {
            console.log("⚠️ 读取失败，重置为空:", e.message);
            accounts = [];
        }
    } else {
        console.log("📂 文件不存在，从头开始");
    }

    let found = false;
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].名称 === name) {
            accounts[i].内容 = hash;
            found = true;
            console.log("🔄 更新玩家:", name);
            break;
        }
    }
    if (!found) {
        accounts.push({ 名称: name, 内容: hash });
        console.log("➕ 新增玩家:", name);
    }

    try {
        fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2), 'utf8');
        console.log("💾 写入成功");
        res.status(200).json({ success: true });
    } catch (e) {
        console.log("❌ 写入失败:", e.message);
        res.status(500).json({ error: 'Write failed: ' + e.message });
    }
}
