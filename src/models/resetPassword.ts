import mongoose, { Schema, Model, Document } from 'mongoose';

export interface resetPassword {
  title: string;
}

export interface resetPasswordDocument extends Document, resetPassword {}

export type resetPasswordModel = Model<resetPasswordDocument>;

const resetPasswordSchema = new Schema<resetPasswordDocument, resetPasswordModel>(
  {
    idUser: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, expires: '60m', default: Date.now },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('resetPassword', resetPasswordSchema);
