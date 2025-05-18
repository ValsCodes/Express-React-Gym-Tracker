import express = require('express');
import {muscleGroupRoutes, exerciseRoutes, workingSetRoutes, workoutRoutes} from "./routes";

const cors = require('cors');

const app = express();

app.use(cors())
app.use(express.json());

app.use(muscleGroupRoutes, exerciseRoutes, workingSetRoutes, workoutRoutes);

app.listen(3001, () => {
    console.log('Server started')
})