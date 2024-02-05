import { Document, Schema } from 'mongoose';

interface IUser extends Document {
  role: 'student' | 'teacher' | 'admin';
  email: string;
  password: string;
  exercises?: Schema.Types.ObjectId[];
}

export default IUser;
