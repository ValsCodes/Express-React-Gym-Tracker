import {Pool, RowDataPacket} from "mysql2/promise";
import {Database} from "./Database";
import {Exercise, CreateExercise} from "../common/interfaces";

export class ExerciseModel {
    db: Pool;

    constructor() {
        this.db = new Database().conn;
    }

    async getAll() {
        const [rows] = await this.db.query("SELECT * FROM exercise");
        return rows;
    }

    async getById(id: number) {
        const result = await this.db.execute<Exercise[] & RowDataPacket[]>(`SELECT * FROM exercise WHERE id = ?`, [id]);
        return result[0][0];
    }

    async create(exercise: CreateExercise) {
        const [result] = await this.db.execute(`INSERT INTO exercise(muscle_group_id, name) VALUES (?, ?)`, [
            exercise.muscle_group_id, exercise.name
        ]);
        return `Exercise with id created`;
    }

    async update(id: string, user: any) {
       const fields = Object.keys(user).map(key => `${key} = ?`).join(',');
       const values = Object.values(user);
       const idNumber = Number(id);
       values.push(idNumber);
       const result = await this.db.execute(`UPDATE exercise SET ${fields} WHERE id = ?`, values)
        return `Updated exercise ${id}`
    }

    async delete(id: number) {
        const [rows] = await this.db.execute(`DELETE FROM exercise WHERE id = ?`, [id]);
        return rows;
    }
}