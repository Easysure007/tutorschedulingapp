import mysql from 'serverless-mysql';

interface ExecuteQueryFunctionParams{
  query: string,
  values?: Array<any>
}


const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: typeof process.env.MYSQL_PORT === 'number' ? parseInt(process.env.MYSQL_PORT) : 3306,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

export default async function executeQuery<T>({ query, values = [] }: ExecuteQueryFunctionParams): Promise<T>  {
  try {
    const results: T = await db.query(query, values);
    await db.end();
    return results;
  } catch (error: unknown) {
    throw { error };
  }
}