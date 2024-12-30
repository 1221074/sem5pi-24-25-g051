import { Container, Service, Inject } from 'typedi';

import { Result } from "../core/logic/Result";
import config from '../../config';
import { AllergyMap } from "../mappers/allergyMapper";
import { IAllergyDTO } from '../dto/IAllergyDTO';
import IAllergyService from './IServices/IAllergyService';
import IAllergyRepo from './IRepos/IAllergyRepo';
import { Allergy } from '../Domain/allergy/allergy';
import { Description } from '../Domain/shared/description';


@Service()
export default class AllergyService implements IAllergyService {
  constructor(
    @Inject(config.repos.allergy.name) private allergyRepo: IAllergyRepo,
    @Inject('logger') private logger
  ) {}
   
  /**
   * Creates and saves a new allergy.
   * @param allergyDTO IAllergyDTO
   * @returns Result<{ allergyDTO: IAllergyDTO }>
   */
  public async createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
    try {
      const allergyOrError = await Allergy.create(allergyDTO);

      if (allergyOrError.isFailure) {
        return Result.fail<IAllergyDTO>(allergyOrError.errorValue());
      }

      const allergyResult = allergyOrError.getValue();

      await this.allergyRepo.save(allergyResult);

      const allergyDTOResult = AllergyMap.toDTO(allergyResult) as IAllergyDTO;
      return Result.ok<IAllergyDTO>(allergyDTOResult);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Fetches an allergy by ID.
   * @param id string
   * @returns Result<{ allergyDTO: IAllergyDTO }>
   */
  public async getAllergy(id: string): Promise<Result<IAllergyDTO>> {
    try {
      const allergy = await this.allergyRepo.findByDomainId(id);

      if (allergy === null) {
        return Result.fail<IAllergyDTO>('Allergy not found');
      } else {
        const allergiesDTOResult = AllergyMap.toDTO(allergy) as IAllergyDTO;
        return Result.ok<IAllergyDTO>(allergiesDTOResult);
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }


  public async updateAllergy(id: string, allergyDTO: Partial<IAllergyDTO>): Promise<Result<IAllergyDTO>> {
    try {

      const allergy = await this.allergyRepo.findByDomainId(id);

      if (!allergy) {
        return Result.fail<IAllergyDTO>('Allergy not found');
      }

      Object.keys(allergyDTO).forEach(key => {
        if (allergyDTO[key] !== undefined) {
          allergy[key] = allergyDTO[key];
        }
      });

      await this.allergyRepo.save(allergy);

      const allergyDTOResult = AllergyMap.toDTO(allergy) as IAllergyDTO;
      return Result.ok<IAllergyDTO>(allergyDTOResult);
    } catch (e) {
      throw e;
    }
  }

  public async getAllAllergies(): Promise<IAllergyDTO[]> {
    try {
       
      const allergy = await this.allergyRepo.getAllAllergies();
     
      return allergy.map((allergy) => {
        return AllergyMap.toDTO(allergy) as IAllergyDTO;
      });
    } catch (error) {
      throw new Error(`Error fetching allergy: ${error.message}`);
    }
  }
}