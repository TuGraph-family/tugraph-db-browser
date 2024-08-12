/* 查询系统信息 */
export const getSystemInfo= ()=>{
    return 'CALL dbms.system.info()'
}

/* 获取数据库信息 */
export const getDatabaseInfo =( )=>{
    return 'CALL dbms.config.list()'
}