import {Pool, RowDataPacket} from "mysql2/promise";
import {Database} from "./Database";
import {Workout, CreateWorkout} from "../common/interfaces";

export class WorkoutModel {
    db: Pool;

    constructor() {
        this.db = new Database().conn;
    }

    async getAll() {
        const [rows] = await this.db.query("SELECT * FROM workout");
        return rows;
    }

        async getById(id: number) {
            const result = await this.db.execute<Workout[] & RowDataPacket[]>(`SELECT * FROM workout WHERE id = ?`, [id]);
            return result[0][0];
        }
    
        async create(workout: CreateWorkout) {
            const [result] = await this.db.execute(`INSERT INTO workout(description, date_added) VALUES (?, ?)`, [
                workout.description, workout.date_added
            ]);
    
            return `Muscle Group created`;
        }
    
        async update(id: number, workout: any) {
           const fields = Object.keys(workout).map(key => `${key} = ?`).join(',');
           const values = Object.values(workout);
           values.push(id);
           const result = await this.db.execute(`UPDATE workout SET ${fields} WHERE id = ?`, values)
            return `Updated workout ${id}`
        }
    
        async delete(id: number) {
            const [rows] = await this.db.execute(`DELETE FROM workout WHERE id = ?`, [id]);
            return rows;
        }
}