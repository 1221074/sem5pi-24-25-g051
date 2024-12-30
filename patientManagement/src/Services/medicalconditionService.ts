import { Container, Service, Inject } from 'typedi';

import { Result } from "../core/logic/Result";
import config from '../../config';
import { MedicalConditionMap } from "../mappers/medicalconditionMapper";
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import IMedicalConditionService from './IServices/IMedicalConditionService';
import IMedicalConditionRepo from './IRepos/IMedicalConditionRepo';
import { MedicalCondition } from '../Domain/medicalcondition/medicalcondition';
import { Description } from '../Domain/shared/description';


@Service()
export default class MedicalConditionService implements IMedicalConditionService {
  constructor(
    @Inject(config.repos.medicalCondition.name) private medicalConditionRepo: IMedicalConditionRepo,
    @Inject('logger') private logger
  ) {}
   
  /**
   * Creates and saves a new allergy.
   * @param medicalconditionDTO IMedicalConditionDTO
   * @returns Result<{ medicalconditionDTO: IMedicalConditionDTO }>
   */
  public async createMedicalCondition(medicalconditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
    try {
      const medicalconditionOrError = await MedicalCondition.create(medicalconditionDTO);

      if (medicalconditionOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(medicalconditionOrError.errorValue());
      }

      const medicalconditionResult = medicalconditionOrError.getValue();

      await this.medicalConditionRepo.save(medicalconditionResult);

      const medicalconditionDTOResult = MedicalConditionMap.toDTO(medicalconditionResult) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>(medicalconditionDTOResult);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Fetches an allergy by ID.
   * @param id string
   * @returns Result<{ medicalconditionDTO: IMedicalConditionDTO }>
   */
  public async getMedicalCondition(id: string): Promise<Result<IMedicalConditionDTO>> {
    try {
      const medicalCondition = await this.medicalConditionRepo.findByDomainId(id);

      if (medicalCondition === null) {
        return Result.fail<IMedicalConditionDTO>('Allergy not found');
      } else {
        const medicalconditionDTOResult = MedicalConditionMap.toDTO(medicalCondition) as IMedicalConditionDTO;
        return Result.ok<IMedicalConditionDTO>(medicalconditionDTOResult);
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }


  public async updateMedicalCondition(id: string, medicalconditionDTO: Partial<IMedicalConditionDTO>): Promise<Result<IMedicalConditionDTO>> {
    try {

      const medicalcondition = await this.medicalConditionRepo.findByDomainId(id);

      if (!medicalcondition) {
        return Result.fail<IMedicalConditionDTO>('medical condition not found');
      }

      Object.keys(medicalconditionDTO).forEach(key => {
        if (medicalconditionDTO[key] !== undefined) {
            medicalcondition[key] = medicalconditionDTO[key];
        }
      });

      await this.medicalConditionRepo.save(medicalcondition);

      const allergyDTOResult = MedicalConditionMap.toDTO(medicalcondition) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>(allergyDTOResult);
    } catch (e) {
      throw e;
    }
  }

  public async getAllMedicalConditions(): Promise<IMedicalConditionDTO[]> {
    try {
       
      const medicalcondition = await this.medicalConditionRepo.getAllMedicalConditions();
     
      return medicalcondition.map((medicalcondition) => {
        return MedicalConditionMap.toDTO(medicalcondition) as IMedicalConditionDTO;
      });
    } catch (error) {
      throw new Error(`Error fetching medical condition: ${error.message}`);
    }
  }
}