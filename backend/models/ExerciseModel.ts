import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Database } from "./Database";
import { Exercise, CreateExerciseDTO, UpdateExerciseDTO } from "../common/interfaces/index";
import { ExerciseMapper } from "../common/mappers/exercise.mapper";

export class ExerciseModel {
  db: Pool;

  constructor() {
    this.db = new Database().conn;
  }

  async getAll(): Promise<Exercise[]> {
    try {
      const [rows] = await this.db.query<Exercise[] & RowDataPacket[]>(
        "SELECT * FROM exercise"
      );
      return rows;
    } catch (e) {
      throw new Error("Error fetching Exercises");
    }
  }

  async getById(id: number): Promise<Exercise | null> {
    try {
      const result = await this.db.execute<Exercise[] & RowDataPacket[]>(
        `SELECT * FROM exercise WHERE id = ?`,
        [id]
      );
      return result[0][0];
    } catch (e) {
      throw new Error(`Error failed to fetch Exercise ${id}`);
    }
  }

  async create(exercise: CreateExerciseDTO): Promise<number> {
    try {
      const dbExercise = ExerciseMapper.toDBModel(exercise);

      const [result] = await this.db.execute<ResultSetHeader>(
        `INSERT INTO exercise(muscle_group_id, name) VALUES (?, ?)`,
        [dbExercise.muscle_group_id, dbExercise.name]
      );

      return result.insertId;
    } catch (e) {
      throw new Error(`Error failed to create a new Exercise`);
    }
  }

  async update(id: string, exercise: UpdateExerciseDTO): Promise<boolean> {
    try {
      const dbExercise = ExerciseMapper.toUpdateDBModel(exercise);
      const fields = Object.keys(dbExercise);
      if (fields.length === 0) {
        return false;
      }
      const setClause = Object.keys(exercise).map((key) => `${key} = ?`).join(",");

      const values = [...Object.values(dbExercise), id];
      const idNumber = Number(id);
      values.push(idNumber);
      const [result] = await this.db.execute<ResultSetHeader>(`UPDATE exercise SET ${setClause} WHERE id = ?`,values);
      return result.affectedRows > 0;
    } catch (e) {
      throw new Error(`Error failed to update Exercise ${id}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const [rows] = await this.db.execute<ResultSetHeader>(
        `DELETE FROM exercise WHERE id = ?`,
        [id]
      );
      return rows.affectedRows > 0;
    } catch (e) {
      throw new Error(`Error failed to delete Exercise ${id}`);
    }
  }
}
