import { expect } from 'chai';
import sinon from 'sinon';
import FreeTextService from '../../../src/Services/freeTextService';
import IFreeTExtRepo from '../../../src/Services/IRepos/IFreeTextRepo';
import { Result } from '../../../src/core/logic/Result';
import { FreeTextMap } from '../../../src/mappers/freeTextMapper';
import { FreeText } from '../../../src/Domain/freetext/FreeText';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { IfreeTextDTO } from '../../../src/dto/IFreeTextDTO';

describe('FreeTextService', () => {
  let freeTextService: FreeTextService;
  let mockFreeTextRepo: sinon.SinonStubbedInstance<IFreeTExtRepo>;
  let mockLogger: sinon.SinonStubbedInstance<any>;

  beforeEach(() => {
    mockFreeTextRepo = {
      save: sinon.stub(),
      findByMedicalRecordID: sinon.stub(),
      getAllFreeTexts: sinon.stub(),
      findByDomainId: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<IFreeTExtRepo>;

    mockLogger = {
      error: sinon.stub(),
    };

    freeTextService = new FreeTextService(mockFreeTextRepo, mockLogger);
  });

  afterEach(() => {
    sinon.restore(); // Restore stubs after each test
  });

  describe('createFreeText', () => {
    it('should create and return a new free text entry on success', async () => {
        const freeTextDTO = {
          id: '1',
          medicalRecordID: 'MedicalRecord1',
          freeText: 'Chronic condition',
        };
      
        sinon.stub(FreeText, 'create').resolves({
          isFailure: false,
          getValue: () => freeTextDTO,
        });
      
        sinon.stub(FreeTextMap, 'toDTO').returns(freeTextDTO);
      
        mockFreeTextRepo.save.resolves();
      
        const result = await freeTextService.createFreeText(freeTextDTO);
      
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.eql(freeTextDTO);
        sinon.assert.calledWith(mockFreeTextRepo.save, sinon.match(freeTextDTO));
      });

      it('should fail if creating medical record fails', async () => {
        const invalidFreeTextDTO = {
          id: '',
          medicalRecordID: '',
          freeText: '',
        }; // Replace 'diagnosis' with the correct properties from IMedicalRecordDTO
      
        sinon.stub(FreeText, 'create').resolves({
          isFailure: true,
          errorValue: () => 'Invalid data',
        });
      
        const result = await freeTextService.createFreeText(invalidFreeTextDTO);
      
        expect(result.isFailure).to.be.true;
        expect(result.errorValue()).to.equal('Invalid data');
      });
      
  });

  describe('getFreeText', () => {
    it('should return a free text entry by ID', async () => {
      const freeTextDTO = {
        id: '1',
        medicalRecordID: 'MedicalRecord1',
        freeText: 'Chronic condition',
      };
      mockFreeTextRepo.findByDomainId.resolves(freeTextDTO);
      sinon.stub(FreeTextMap, 'toDTO').returns(freeTextDTO);

      const result = await freeTextService.getFreeText('1');

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql(freeTextDTO);
    });

    it('should return a failure if Free Text Entry is not found', async () => {
      mockFreeTextRepo.findByDomainId.resolves(null);

      try {
        await freeTextService.getFreeText('1');
      } catch (error) {
        expect(error.message).to.equal('Free Text not found');
      }
    });
  });

  describe('updateFreeText', () => {
    it('should update and return the Free Text Entry', async () => {
        const freeTextDTO: Partial<IfreeTextDTO> = { freeText: 'Updated free text' };
        const existingFreeText = {
          id: '1',
        medicalRecordID: 'MedicalRecord1',
        freeText: 'old Free Text',
        };
      
        mockFreeTextRepo.findByDomainId.resolves(existingFreeText);
        mockFreeTextRepo.save.resolves();
        sinon.stub(FreeTextMap, 'toDTO').returns({ ...existingFreeText, ...freeTextDTO });
      
        const result = await freeTextService.updateFreeText('1', freeTextDTO);
      
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.eql({ id: '1', ...freeTextDTO, medicalRecordID: 'MedicalRecord1'});
        sinon.assert.calledWith(mockFreeTextRepo.save, sinon.match({ ...existingFreeText, ...freeTextDTO }));
      });
      
      

      it('should fail if creating Free Text Entry fails', async () => {
        sinon.stub(FreeText, 'create').resolves({
          isFailure: true,
          errorValue: () => 'Invalid data',
        });
      
        const result = await freeTextService.createFreeText({
          id: '',
          medicalRecordID: '',
          freeText: '',
        });
      
        expect(result.isFailure).to.be.true;
        expect(result.errorValue()).to.equal('Invalid data');
      });
      
  });

  describe('getAllFreeTexts', () => {
    it('should return all Free Text Entries', async () => {
      const freeTexts = [
        { id: '1', medicalRecordID: 'MedicalRecord1', freeText: 'FreeText1' },
        { id: '2', medicalRecordID: 'MedicalRecord2', freeText: 'FreeText2' },
      ];

      mockFreeTextRepo.getAllFreeTexts.resolves(freeTexts);
      sinon.stub(FreeTextMap, 'toDTO').callsFake((freeText) => freeText);

      const result = await freeTextService.getAllFreeTexts();

      expect(result).to.eql(freeTexts);
      sinon.assert.calledOnce(mockFreeTextRepo.getAllFreeTexts);
    });

    it('should throw an error if fetching medical records fails', async () => {
      const error = new Error('Database error');
      mockFreeTextRepo.getAllFreeTexts.rejects(error);

      try {
        await freeTextService.getAllFreeTexts();
        throw new Error('Expected method to throw.');
      } catch (err) {
        expect(err.message).to.equal('Error fetching free texts: Database error');
      }
    });
  });

  describe('getFreeTextsFromMedicalRecord', () => {
    it('should return free text entry by MedicalRecordID', async () => {
      const freeTextDTOs = [
        {
          id: '1',
          medicalRecordID: 'MedicalRecord1',
          freeText: 'Chronic condition',
        },
      ];
    
      mockFreeTextRepo.findByMedicalRecordID.resolves(freeTextDTOs);
    
      const result = await freeTextService.getFreeTextsFromMedicalRecord('MedicalRecord1');
    
      expect(result).to.eql(freeTextDTOs);
    });

    it('should return a failure if free text entry is not found for MedicalRecordID', async () => {
      const error = new Error('Database error');
      mockFreeTextRepo.findByMedicalRecordID.rejects(error);

      try {
        await freeTextService.getFreeTextsFromMedicalRecord('123');
        throw new Error('Expected method to throw.');
      } catch (err) {
        expect(err.message).to.equal('Error fetching free texts: Database error');
      }
    });
    });
  });
