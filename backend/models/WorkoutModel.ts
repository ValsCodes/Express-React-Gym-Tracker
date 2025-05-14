// models/WorkoutModel.ts
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Database } from "./Database";
import {
  Workout,
  CreateWorkoutDTO,
  UpdateWorkoutDTO,
} from "../common/interfaces/workout";
import { WorkoutMapper } from "../common/mappers/workout.mapper";

export class WorkoutModel {
  private db: Pool;

  constructor() {
    this.db = new Database().conn;
  }

  /** Fetch all workouts */
  async getAll(): Promise<Workout[]> {
    try {
      const [rows] = await this.db.query<Workout[] & RowDataPacket[]>(
        "SELECT * FROM workout"
      );
      return rows;
    } catch (err) {
      throw new Error("Error fetching workouts");
    }
  }

  /** Fetch one workout by its numeric ID */
  async getById(id: number): Promise<Workout | null> {
    try {
      const [rows] = await this.db.execute<Workout[] & RowDataPacket[]>(
        "SELECT * FROM workout WHERE id = ?",
        [id]
      );
      return rows[0] ?? null;
    } catch (err) {
      throw new Error(`Error fetching workout ${id}`);
    }
  }

  /** Insert a new workout, return its new ID */
  async create(dto: CreateWorkoutDTO): Promise<number> {
    try {
      const dbModel = WorkoutMapper.toDBModel(dto);
      const [result] = await this.db.execute<ResultSetHeader>(
        `INSERT INTO workout (description, date_added)
         VALUES (?, ?)`,
        [dbModel.description, dbModel.date_added]
      );
      return result.insertId;
    } catch (err) {
      throw new Error("Error creating workout");
    }
  }

  /** Update only provided fields; return true if at least one row was changed */
  async update(id: number, dto: UpdateWorkoutDTO): Promise<boolean> {
    try {
      const dbModel = WorkoutMapper.toUpdateDBModel(dto);
      const fields = Object.keys(dbModel);
      if (fields.length === 0) {
        return false; // nothing to update
      }

      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = fields.map((f) => (dbModel as any)[f]);
      values.push(id);

      const [result] = await this.db.execute<ResultSetHeader>(
        `UPDATE workout SET ${setClause} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error(`Error updating workout ${id}`);
    }
  }

  /** Delete by ID; return true if a row was deleted */
  async delete(id: number): Promise<boolean> {
    try {
      const [result] = await this.db.execute<ResultSetHeader>(
        "DELETE FROM workout WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error(`Error deleting workout ${id}`);
    }
  }
}
