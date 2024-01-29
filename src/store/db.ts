import Dexie from 'dexie';

// 单词表数据接口
interface Vocabulary {
    id?: number;
    name: string
    english: string;
    chinese: string;
    phoneticSymbol?: string;
    date: string;
    newDate?: string
};

// 定义 Dexie 数据库类
class MyDatabase extends Dexie {
    vocabularys: Dexie.Table<Vocabulary, number>; // 单词表数据表
    constructor() {
        super('MyDatabase');
        this.version(3).stores({ vocabularys: '++id, name, english, chinese, date, newDate', }); // 定义数据库版本和数据表结构
        this.vocabularys = this.table('vocabularys'); // 获取单词表数据表实例
    };
};

// 创建数据库实例
const db = new MyDatabase();

export default db;
