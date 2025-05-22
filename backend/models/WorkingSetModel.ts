// models/WorkingSetModel.ts
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Database } from "./Database";
import {
  WorkingSet,
  CreateWorkingSetDTO,
  UpdateWorkingSetDTO,
} from "../common/interfaces/working-set";
import { WorkingSetMapper } from "../common/mappers/working-set.mapper";

export class WorkingSetModel {
  private db: Pool;

  constructor() {
    this.db = new Database().conn;
  }

  async getAll(): Promise<WorkingSet[]> {
    try {
      const [rows] = await this.db.query<WorkingSet[] & RowDataPacket[]>(
        "SELECT * FROM working_set"
      );
      return rows;
    } catch (err) {
      throw new Error("Error fetching working sets");
    }
  }

  async getById(id: number): Promise<WorkingSet | null> {
    try {
      const [rows] = await this.db.execute<
        WorkingSet[] & RowDataPacket[]
      >("SELECT * FROM working_set WHERE id = ?", [id]);
      return rows[0] ?? null;
    } catch (err) {
      throw new Error(`Error fetching working set ${id}`);
    }
  }

   async getByWorkoutId(workoutId: number): Promise<WorkingSet[]> {
    try {
      const [rows] = await this.db.query<WorkingSet[] & RowDataPacket[]>(
        `SELECT * FROM working_set where workout_id = ?`, [workoutId] 
      );
      return rows;
    } catch (err) {
      throw new Error(`Error fetching working sets for workout id ${workoutId}`);
    }
  }

  async create(dto: CreateWorkingSetDTO): Promise<number> {
    try {
      const dbModel = WorkingSetMapper.toDBModel(dto);
      const [result] = await this.db.execute<ResultSetHeader>(
        `INSERT INTO working_set
           (exercise_id, weight, repetitions, workout_id, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [
          dbModel.exercise_id,
          dbModel.weight,
          dbModel.repetitions,
          dbModel.workout_id,
          dbModel.comment ?? null
        ]
      );
      return result.insertId;
    } catch (err) {
      throw new Error("Error creating working set");
    }
  }


  async update(
    id: number,
    dto: UpdateWorkingSetDTO
  ): Promise<boolean> {
    try {
      const dbModel = WorkingSetMapper.toUpdateDBModel(dto);
      const fields = Object.keys(dbModel);
      if (fields.length === 0) {
        return false; // nothing to update
      }

      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = fields.map((f) => (dbModel as any)[f]);
      values.push(id);

      const [result] = await this.db.execute<ResultSetHeader>(
        `UPDATE working_set SET ${setClause} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error(`Error updating working set ${id}`);
    }
  }

  /** Delete by ID; return true if a row was deleted */
  async delete(id: number): Promise<boolean> {
    try {
      const [result] = await this.db.execute<ResultSetHeader>(
        "DELETE FROM working_set WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error(`Error deleting working set ${id}`);
    }
  }
}
