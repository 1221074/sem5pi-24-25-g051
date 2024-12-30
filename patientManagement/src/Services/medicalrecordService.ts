import { Service, Inject } from 'typedi';

import { Result } from "../core/logic/Result";
import config from '../../config';
import { MedicalRecordMap } from "../mappers/medicalrecordMapper";
import { IMedicalRecordDTO } from '../dto/IMedicalRecordDTO';
import IMedicalRecordService from './IServices/IMedicalRecordService';
import IMedicalRecordRepo from './IRepos/IMedicalRecordRepo';
import { MedicalRecord } from '../Domain/medicalrecord/medicalrecord';

@Service()
export default class MedicalRecordService implements IMedicalRecordService {
  constructor(
    @Inject(config.repos.medicalRecord.name) private medicalRecordRepo: IMedicalRecordRepo,
    @Inject('logger') private logger
  ) { }

  /**
   * Creates and saves a new medical record.
   * @param medicalRecordDTO IMedicalRecordDTO
   * @returns Result<{ medicalRecordDTO: IMedicalRecordDTO }>
   */
  public async createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecordOrError = await MedicalRecord.create(medicalRecordDTO);

      if (medicalRecordOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(medicalRecordOrError.errorValue());
      }

      const medicalRecordResult = medicalRecordOrError.getValue();

      await this.medicalRecordRepo.save(medicalRecordResult);

      const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecordResult) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
    } catch (e) {
      this.logger.error(e);
      return Result.fail<IMedicalRecordDTO>('Error creating medical record');
    }
  }

  /**
   * Fetches a medical record by ID.
   * @param id string
   * @returns Result<{ medicalRecordDTO: IMedicalRecordDTO }>
   */
  public async getMedicalRecord(id: string): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByPatientId(id);

      if (medicalRecord === null) {
        return Result.fail<IMedicalRecordDTO>('Medical record not found');
      } else {
        const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
        return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
      }
    } catch (e) {
      this.logger.error(e);
      return Result.fail<IMedicalRecordDTO>('Error fetching medical record');
    }
  }

  /**
   * Updates an existing medical record.
   * @param id string
   * @param medicalRecordDTO Partial<IMedicalRecordDTO>
   * @returns Result<{ medicalRecordDTO: IMedicalRecordDTO }>
   */
  public async updateMedicalRecord(id: string, medicalRecordDTO: Partial<IMedicalRecordDTO>): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByDomainId(id);

      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>('Medical record not found');
      }

      Object.keys(medicalRecordDTO).forEach(key => {
        if (medicalRecordDTO[key] !== undefined) {
          medicalRecord[key] = medicalRecordDTO[key];
        }
      });

      await this.medicalRecordRepo.save(medicalRecord);

      const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult);
    } catch (e) {
      this.logger.error(e);
      return Result.fail<IMedicalRecordDTO>('Error updating medical record');
    }
  }

  /**
   * Fetches all medical records.
   * @returns Promise<IMedicalRecordDTO[]>
   */
  public async getAllMedicalRecords(): Promise<IMedicalRecordDTO[]> {
    try {
      const medicalRecords = await this.medicalRecordRepo.getAllMedicalRecords();

      return medicalRecords.map((medicalRecord) => {
        return MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
      });
    } catch (error) {
      this.logger.error(`Error fetching medical records: ${error.message}`);
      throw new Error(`Error fetching medical records: ${error.message}`);
    }
  }

  /**
   * Fetches a medical record by patient ID.
   * @param patientId string
   * @returns Promise<IMedicalRecordDTO>
   */
  public async getMedicalRecordByPatientId(patientId: string):  Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByPatientId(patientId);

      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>('Medical Record not found for the patient id given.');
      }

      const medicalRecordDTO = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTO);
    } catch (error: any) {
      this.logger.error(`Error in obtaining the medical record of the patient: ${error.message}`);
      return Result.fail<IMedicalRecordDTO>('Internal error in retriving the medical record.');
    }
  }
}