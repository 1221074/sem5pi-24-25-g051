import { IMedicalConditionPersistence } from '../../DataSchema/IMedicalConditionPersistence';
import mongoose from 'mongoose';

const MedicalConditionSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      required: [true, 'Please enter Id'],
    },
    name: {
      type: String,
      required: [true, 'Please enter name'],
      maxlength: [100, 'name can not be more than 100 characters']
    }, 
    description: {
      type: String,
      maxlength: [2048, 'description can not be more than 2048 characters']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalConditionSchema);
