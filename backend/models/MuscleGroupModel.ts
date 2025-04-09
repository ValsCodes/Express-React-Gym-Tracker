import {Pool, RowDataPacket} from "mysql2/promise";
import {Database} from "./Database";
import {MuscleGroup, CreateMuscleGroup} from "../common/interfaces";

export class MuscleGroupModel {
    db: Pool;

    constructor() {
        this.db = new Database().conn;
    }

    async getAll() {
        const [rows] = await this.db.query("SELECT * FROM muscle_group");
        return rows;
    }

        async getById(id: number) {
        const result = await this.db.execute<MuscleGroup[] & RowDataPacket[]>(`SELECT * FROM muscle_group WHERE id = ?`, [id]);
        return result[0][0];
    }

    async create(muscleGroup: CreateMuscleGroup) {
        const [result] = await this.db.execute(`INSERT INTO muscle_group(name) VALUES (?)`, [
            muscleGroup.name
        ]);

        return `Muscle Group created`;
    }

    async update(id: number, muscleGroup: any) {
       const fields = Object.keys(muscleGroup).map(key => `${key} = ?`).join(',');
       const values = Object.values(muscleGroup);
       values.push(id);
       const result = await this.db.execute(`UPDATE muscle_group SET ${fields} WHERE id = ?`, values)
        return `Updated muscle Group ${id}`
    }

    async delete(id: number) {
        const [rows] = await this.db.execute(`DELETE FROM muscle_group WHERE id = ?`, [id]);
        return rows;
    }
}