import {Pool, RowDataPacket} from "mysql2/promise";
import {Database} from "./Database";
import {WorkingSet, CreateWorkingSet} from "../common/interfaces";

export class WorkingSetModel {
    db: Pool;

    constructor() {
        this.db = new Database().conn;
    }

    async getAll() {
        const [rows] = await this.db.query("SELECT * FROM working_set");
        return rows;
    }

        async getById(id: number) {
            const result = await this.db.execute<WorkingSet[] & RowDataPacket[]>(`SELECT * FROM muscle_group WHERE id = ?`, [id]);
            return result[0][0];
        }
    
        async create(workingSet: CreateWorkingSet) {
            const [result] = await this.db.execute(`INSERT INTO working_set(name) VALUES (?)`, [
                workingSet.exercise_id, workingSet.weight, workingSet.repetitions, workingSet.workout_id, workingSet.comment
            ]);
    
            return `Muscle Group created`;
        }
    
        async update(id: number, workingSet: any) {
           const fields = Object.keys(workingSet).map(key => `${key} = ?`).join(',');
           const values = Object.values(workingSet);
           values.push(id);
           const result = await this.db.execute(`UPDATE working_set SET ${fields} WHERE id = ?`, values)
            return `Updated working Set ${id}`
        }
    
        async delete(id: number) {
            const [rows] = await this.db.execute(`DELETE FROM working_set WHERE id = ?`, [id]);
            return rows;
        }
}