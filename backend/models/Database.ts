import mysql, { Pool } from "mysql2/promise";

export class Database {
  conn: Pool;

  constructor() {
    this.conn = mysql.createPool({
      host: "127.0.0.1",
      port: 3307,
      database: "db_gym_tracker2",
      user: "root",
      password: "",
    });
  }
}
