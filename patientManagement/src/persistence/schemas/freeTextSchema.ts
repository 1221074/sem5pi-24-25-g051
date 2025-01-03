import { IFreeTextPersistence } from '../../DataSchema/IFreeTextPersistence';
import mongoose from 'mongoose';

const FreeTextSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      required: [true, 'Please enter Id'],
    },
    medicalRecordID: {
      type: String,
      required: [true, 'Please enter name'],
      maxlength: [100, 'name can not be more than 100 characters']
    },
    freeText: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IFreeTextPersistence & mongoose.Document>('FreeText', FreeTextSchema);
