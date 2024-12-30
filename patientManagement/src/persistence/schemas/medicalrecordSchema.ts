import { IMedicalRecordPersistence } from '../../DataSchema/IMedicalRecordPersistence';
import mongoose from 'mongoose';

//falta mudar para o correto 
const MedicalRecordSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      required: [true, 'Please enter Id'],
    },
    patientId: {
      type: String,
      required: [true, 'Please enter name'],
      maxlength: [100, 'name can not be more than 100 characters']
    }, 
    allergies: [{
      type: mongoose.Schema.Types.String,
      ref: 'Allergy',
      required: true
    }],
    medicalConditions: [{
      type: mongoose.Schema.Types.String,
      ref: 'MedicalCondition',
      required: true
    }],
    freeText: {
      type: String,
      maxlength: [2048, 'description can not be more than 2048 characters']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>('MedicalRecord', MedicalRecordSchema);
