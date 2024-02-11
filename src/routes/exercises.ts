import express from 'express';
import { createExercise, deleteExercise, getUserExercises } from '../controllers/exercises.js';

const exsRouter = express.Router();

exsRouter.get('/', getUserExercises);
exsRouter.post('/', createExercise);
exsRouter.delete('/:id', deleteExercise);

export default exsRouter;
