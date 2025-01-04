import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import { Result } from "../core/logic/Result";
import config from "../../config";
import IMedicalRecordService from '../Services/IServices/IMedicalRecordService';
import { IMedicalRecordDTO } from '../dto/IMedicalRecordDTO';
import IMedicalRecordController from './IControllers/IMedicalRecordController';
import { createEncryptedZip } from '../utils/ZipHelper';
import { sendEmailWithAttachmentUsingGmailApi} from '../utils/EmailService';

@Service()
export default class MedicalRecordController implements IMedicalRecordController {
  constructor(
    @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance: IMedicalRecordService
  ) { }


  public async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.createMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;

      if (medicalRecordOrError.isFailure) {
        return res.status(409).json({ message: medicalRecordOrError.errorValue() });
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.status(201).json(medicalRecordDTO);
    }
    catch (e) {
      return next(e);
    }
  };

  public async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.updateMedicalRecord(req.params.id, req.body as Partial<IMedicalRecordDTO>) as Result<IMedicalRecordDTO>;

      if (medicalRecordOrError.isFailure) {
        return res.status(404).json({ message: medicalRecordOrError.errorValue() });
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.status(201).json(medicalRecordDTO);
    }
    catch (e) {
      return next(e);
    }
  };

  public async getMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const domainId = req.params.id;
      const medicalRecord = await this.medicalRecordServiceInstance.getMedicalRecord(domainId);

      if (medicalRecord.isFailure) {
        return res.status(500).json('Medical Record not found: ' + medicalRecord.error);
      }

      return res.status(200).json(medicalRecord.getValue());
    } catch (e) {
      return res.status(500).json(e.message);
    }

  }

  public async getAllMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('getAllMedicalRecords');
      const medicalRecords = await this.medicalRecordServiceInstance.getAllMedicalRecords();
      return res.status(200).json(medicalRecords);
    } catch (e) {
      return next(e);
    }
  };

  public async getMedicalRecordByPatientId(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.params.patientId;
      const medicalRecord = await this.medicalRecordServiceInstance.getMedicalRecordByPatientId(patientId);

      if (!medicalRecord) {
        res.status(404).json({ message: 'Medical Record not found' });
        return;
      }

      res.status(200).json(medicalRecord);
    } catch (error: any) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };

  public async sendEncryptedData(req: Request, res: Response, next: NextFunction) {
    try {
       // Retrieve params
      const patientId = req.params.id;
      const email = req.params.email;

      const medicalRecordData = (await this.medicalRecordServiceInstance.getMedicalRecordByPatientId(patientId)).getValue();

      const data ={
        allergies: medicalRecordData.allergies,
        medicalConditions: medicalRecordData.medicalConditions,
        freeText: medicalRecordData.freeText
      }

      console.log(data);
    
      if (!medicalRecordData) return res.status(404).json({ message: 'Medical record not found' });

      if (!email) {
        return res.status(400).json({ message: 'Recipient email is required' });
    }

     // Generate encrypted ZIP
     const password = Math.random().toString(36).slice(-8); // Generate a random password

       // Prepare email content
        const subject = 'Your Encrypted Medical Record';
        const htmlBody = `<p>Hello,</p>
                          <p>Attached is your encrypted medical record. The password is ${password}</p>
                          <p>Thank you!</p>`;

        const attachment = await createEncryptedZip(JSON.stringify(data), password);
        const attachmentFileName = 'MedicalRecord.zip';

        // Send the email with attachment
        await sendEmailWithAttachmentUsingGmailApi(email.toString(), subject, htmlBody, attachment, attachmentFileName);

        // Respond with success
        return res.status(200).json({ message: 'Email sent successfully!', password });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while sending your data.' });
    }
  }
}
