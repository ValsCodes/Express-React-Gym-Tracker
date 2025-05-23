import express = require('express');
import {muscleGroupRoutes, exerciseRoutes, workingSetRoutes, workoutRoutes} from "./routes";
import {currentDateOfExecution} from "./common/middleware/middlewares";

const cors = require('cors');
// const rateLimit = require('express-rate-limit');

const app = express();

// const limiter = rateLimit({  windowMs: 15 * 60 * 1000,  max: 1000,  message: 'Too many requests, please try again later.'});

// app.use('/workout', limiter);
// app.use('/working-set', limiter);
// app.use('/exercise', limiter);
// app.use('/muscle-group', limiter);

app.use(cors())
app.use(express.json());       

app.use(currentDateOfExecution);

app.use(muscleGroupRoutes, exerciseRoutes, workingSetRoutes, workoutRoutes);

app.listen(3001, () => {
    console.log('Server started')
})