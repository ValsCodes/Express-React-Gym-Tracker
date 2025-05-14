// models/MuscleGroupModel.ts
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Database } from "./Database";
import {
  MuscleGroup,
  CreateMuscleGroupDTO,
  UpdateMuscleGroupDTO,
} from "../common/interfaces/muscle-group";
import { MuscleGroupMapper } from "../common/mappers/muscle-group.mapper";

export class MuscleGroupModel {
  private db: Pool;

  constructor() {
    this.db = new Database().conn;
  }

  async getAll(): Promise<MuscleGroup[]> {
    try {
      const [rows] = await this.db.query<MuscleGroup[] & RowDataPacket[]>(
        "SELECT * FROM muscle_group"
      );
      return rows;
    } catch (err) {
      throw new Error("Error fetching muscle groups");
    }
  }

  async getById(id: number): Promise<MuscleGroup | null> {
    try {
      const [rows] = await this.db.execute<
        MuscleGroup[] & RowDataPacket[]
      >("SELECT * FROM muscle_group WHERE id = ?", [id]);
      return rows[0] ?? null;
    } catch (err) {
      throw new Error(`Error fetching muscle group ${id}`);
    }
  }

  async create(dto: CreateMuscleGroupDTO): Promise<number> {
    try {
      const dbModel = MuscleGroupMapper.toDBModel(dto);
      const [result] = await this.db.execute<ResultSetHeader>(
        "INSERT INTO muscle_group (name) VALUES (?)",
        [dbModel.name]
      );
      return result.insertId;
    } catch (err) {
      throw new Error("Error creating muscle group");
    }
  }

  async update(
    id: number,
    dto: UpdateMuscleGroupDTO
  ): Promise<boolean> {
    try {
      const dbModel = MuscleGroupMapper.toUpdateDBModel(dto);
      const fields = Object.keys(dbModel);
      if (fields.length === 0) {
        return false;
      }

      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = fields.map((f) => (dbModel as any)[f]);
      values.push(id);

      const [result] = await this.db.execute<ResultSetHeader>(
        `UPDATE muscle_group SET ${setClause} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error(`Error updating muscle group ${id}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const [result] = await this.db.execute<ResultSetHeader>(
        "DELETE FROM muscle_group WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error(`Error deleting muscle group ${id}`);
    }
  }
}
