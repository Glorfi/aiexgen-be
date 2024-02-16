import { NextFunction, Response } from 'express';
import { IRequest } from '../interfaces/requests/IRequest.js';
import { Exercises, Sentences, Users } from '../db/mongoConnector.js';
import IExercise from '../interfaces/IExerciseSchema.js';
import ISentence from '../interfaces/ISentence.js';
import IUser from '../interfaces/IUserSchema.js';
import { NotFound } from '../errors/NotFound.js';
import { any } from 'joi';

export const getUserExercises = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user;
  Exercises.find({ owner: _id })
    .populate('sentenceList')
    .then((exs: IExercise[]) => {
      res.send(exs);
    });
};
export const createExercise = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { _id: owner } = req.user;
  const { skill, type, sentenceList } = req.body;
  Exercises.create({ owner, skill, type })
    .then((ex: any) => {
      Users.findById(owner).then((user: any | null) => {
        if (!user) {
          throw new NotFound("User's not found");
        }
        user.exercises?.push(ex._id);
        return user.save();
      });
      const sentencePromises = sentenceList.map((item: ISentence) => {
        const exId = ex._id;
        const { sentence, answer, hint, options } = item;
        return Sentences.create({
          sentence,
          answer,
          hint,
          options,
          exercise: exId,
        });
      });
      return Promise.all(sentencePromises)
        .then((sentences) => {
          ex.sentenceList = sentences.map((sentence) => sentence._id);
          return ex.save();
        })
        .then(() =>
          ex.populate('sentenceList').then((newEx: any) => res.send(newEx))
        )
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

export const deleteExercise = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let removedEx: IExercise;
  Exercises.findByIdAndDelete(req.params.id)
    .then((removedData: IExercise | null) => {
      if (removedData) {
        removedEx = removedData;
      } else {
        throw new NotFound('Exercise not found');
      }
    })
    .then(() => {
      Sentences.find({ exercise: req.params.id }).then(
        (sentenceList: ISentence[]) => {
          const sentenceIdList = sentenceList.map((sentence) => {
            return sentence._id;
          });
          Sentences.deleteMany({ _id: { $in: sentenceIdList } }).then(() => {
            res.send(removedEx);
          });
        }
      );
    })
    .catch((err) => next(err));
};
