import { Service, Inject } from 'typedi';

import { Result } from "../core/logic/Result";
import config from '../../config';
import { FreeTextMap } from "../mappers/freeTextMapper";
import { IfreeTextDTO } from '../dto/IFreeTextDTO';
import IFreeTextService from './IServices/IFreeTextService';
import IFreeTextRepo from './IRepos/IFreeTextRepo';
import { FreeText } from '../Domain/freetext/FreeText';
import { Console } from 'console';

@Service()
export default class FreeTextService implements IFreeTextService {
  constructor(
    @Inject(config.repos.freeText.name) private freeTextRepo: IFreeTextRepo,
    @Inject('logger') private logger
  ) { }

  /**
   * Creates and saves a new free text for a medical record.
   * @param freeTextDTO IfreeTextDTO
   * @returns Result<{ freeTextDTO: IfreeTextDTO }>
   */
  public async createFreeText(freeTextDTO: IfreeTextDTO): Promise<Result<IfreeTextDTO>> {
    try {
      const FreeTextOrError = await FreeText.create(freeTextDTO);
      if (FreeTextOrError.isFailure) {
        return Result.fail<IfreeTextDTO>(FreeTextOrError.errorValue());
      }
      const freeTextResult = FreeTextOrError.getValue();
      await this.freeTextRepo.save(freeTextResult);
      
      const freeTextDTOResult = FreeTextMap.toDTO(freeTextResult) as IfreeTextDTO;
      return Result.ok<IfreeTextDTO>(freeTextDTOResult);
    } catch (e) {
      this.logger.error(e);
      return Result.fail<IfreeTextDTO>('Error adding free text');
    }
  }

  /**
   * Updates an existing free text.
   * @param id string
   * @param freeTextDTO Partial<IFreeTextDTO>
   * @returns Result<{ freeTextDTO: IFreeTextDTO }>
   */
  public async updateFreeText(id: string, freeTextDTO: Partial<IfreeTextDTO>): Promise<Result<IfreeTextDTO>> {
    try {
      const freeText = await this.freeTextRepo.findByDomainId(id);

      if (!freeText) {
        return Result.fail<IfreeTextDTO>('Free Text not found');
      }

      Object.keys(freeTextDTO).forEach(key => {
        if (freeTextDTO[key] !== undefined) {
          freeText[key] = freeTextDTO[key];
        }
      });
      await this.freeTextRepo.save(freeText);

      const freeTextDTOResult = FreeTextMap.toDTO(freeText) as IfreeTextDTO;
      return Result.ok<IfreeTextDTO>(freeTextDTOResult);
    } catch (e) {
      this.logger.error(e);
      return Result.fail<IfreeTextDTO>('Error updating free text');
    }
  }

  /**
   * Fetches all free texts from a medical record.
   * @param medicalRecordID string
   * @returns Promise<IfreeTextDTO[]>
   */
  public async getFreeTextsFromMedicalRecord(medicalRecordID: string):  Promise<IfreeTextDTO[]> {
    try {
      const freeTextRecords = await this.freeTextRepo.findByMedicalRecordID(medicalRecordID);

      return freeTextRecords.map((freeText) => {
        return FreeTextMap.toDTO(freeText) as IfreeTextDTO;
      });
    } catch (error) {
      this.logger.error(`Error fetching free texts: ${error.message}`);
      throw new Error(`Error fetching free texts: ${error.message}`);
    }
  }
}