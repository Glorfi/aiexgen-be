import mongoose from 'mongoose';
import userSchema from './models/userSchema.js';
import exerciseSchema from './models/exerciseSchema.js';
import sentenceSchema from './models/sentenceSchema.js';

mongoose
  .connect('mongodb://127.0.0.1:27017/exsdb', {})
  .then(() => {
    console.log('DataBase is Connected');
  })
  .catch((err) => {
    console.log(err);
  });

const db = mongoose.connection;
db.on('error', () => {
  console.error('Failed to connect to DB');
});
db.once('open', () => {
  console.log('Connected to DB');
});

const Users = mongoose.model('Users', userSchema);
const Exercises = mongoose.model('Exercises', exerciseSchema);
const Sentences = mongoose.model('Sentences', sentenceSchema);

export { Users, Exercises, Sentences };
