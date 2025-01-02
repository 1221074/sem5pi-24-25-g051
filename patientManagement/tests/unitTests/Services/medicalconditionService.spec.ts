import { expect } from 'chai';
import sinon from 'sinon';
import MedicalConditionService from '../../../src/Services/MedicalConditionService';
import IMedicalConditionRepo from '../../../src/Services/IRepos/IMedicalConditionRepo';
import { MedicalConditionMap } from '../../../src/mappers/medicalconditionMapper';
import { MedicalCondition } from '../../../src/Domain/medicalcondition/medicalcondition';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { IMedicalConditionDTO } from '../../../src/dto/IMedicalConditionDTO';
import chaiAsPromised from 'chai-as-promised';

describe('MedicalConditionService', () => {
  let medicalConditionService: MedicalConditionService;
  let mockMedicalConditionRepo: sinon.SinonStubbedInstance<IMedicalConditionRepo>;
  let mockLogger: sinon.SinonStubbedInstance<any>;

  beforeEach(() => {
    mockMedicalConditionRepo = {
      save: sinon.stub(),
      findByDomainId: sinon.stub(),
      getAllMedicalConditions: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<IMedicalConditionRepo>;

    mockLogger = {
      error: sinon.stub(),
    };

    medicalConditionService = new MedicalConditionService(mockMedicalConditionRepo, mockLogger);
  });

  afterEach(() => {
    sinon.restore(); // Restore stubs after each test
  });

  describe('createMedicalCondition', () => {
    it('should create and return a new medical condition on success', async () => {
      const medicalConditionDTO = { id: '1', name: 'Hypertension', description: 'Chronic condition' };
      sinon.stub(MedicalCondition, 'create').resolves({
        isFailure: false,
        getValue: () => medicalConditionDTO,
      });
      sinon.stub(MedicalConditionMap, 'toDTO').returns(medicalConditionDTO);

      mockMedicalConditionRepo.save.resolves();

      const result = await medicalConditionService.createMedicalCondition(medicalConditionDTO);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql(medicalConditionDTO);
      sinon.assert.calledWith(mockMedicalConditionRepo.save, sinon.match(medicalConditionDTO));
    });

    it('should fail if creating medical condition fails', async () => {
      sinon.stub(MedicalCondition, 'create').resolves({
        isFailure: true,
        errorValue: () => 'Invalid data',
      });

      const result = await medicalConditionService.createMedicalCondition({ id: '', name: '', description: '' });

      expect(result.isFailure).to.be.true;
      expect(result.errorValue()).to.equal('Invalid data');
    });
  });

  describe('getMedicalCondition', () => {
    it('should return a medical condition by ID', async () => {
      const medicalConditionDTO = { id: '1', name: 'Asthma', description: 'Chronic respiratory condition' };
      mockMedicalConditionRepo.findByDomainId.resolves(medicalConditionDTO);
      sinon.stub(MedicalConditionMap, 'toDTO').returns(medicalConditionDTO);

      const result = await medicalConditionService.getMedicalCondition('1');

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql(medicalConditionDTO);
    });

    it('should return a failure if medical condition is not found', async () => {
      mockMedicalConditionRepo.findByDomainId.resolves(null);

      const result = await medicalConditionService.getMedicalCondition('1');

      expect(result.isFailure).to.be.true;
      expect(result.errorValue()).to.equal('Allergy not found');
    });
  });

  describe('updateMedicalCondition', () => {
    it('should update and return the medical condition', async () => {
      const medicalConditionDTO: Partial<IMedicalConditionDTO> = { name: 'Updated Name' };
      const existingCondition = { id: '1', name: 'Old Name', description: 'Old Description' };

      mockMedicalConditionRepo.findByDomainId.resolves(existingCondition);
      mockMedicalConditionRepo.save.resolves();
      sinon.stub(MedicalConditionMap, 'toDTO').returns({ ...existingCondition, ...medicalConditionDTO });

      const result = await medicalConditionService.updateMedicalCondition('1', medicalConditionDTO);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql({ id: '1', ...medicalConditionDTO, description: 'Old Description' });
      sinon.assert.calledWith(mockMedicalConditionRepo.save, sinon.match({ ...existingCondition, ...medicalConditionDTO }));
    });

    it('should fail if medical condition is not found', async () => {
      mockMedicalConditionRepo.findByDomainId.resolves(null);

      const result = await medicalConditionService.updateMedicalCondition('1', { name: 'Updated Name' });

      expect(result.isFailure).to.be.true;
      expect(result.errorValue()).to.equal('medical condition not found');
    });
  });

  describe('getAllMedicalConditions', () => {
    it('should return all medical conditions', async () => {
      const conditions = [
        { id: '1', name: 'Asthma', description: 'Chronic respiratory condition' },
        { id: '2', name: 'Diabetes', description: 'Chronic metabolic disorder' },
      ];

      mockMedicalConditionRepo.getAllMedicalConditions.resolves(conditions);
      sinon.stub(MedicalConditionMap, 'toDTO').callsFake((condition) => condition);

      const result = await medicalConditionService.getAllMedicalConditions();

      expect(result).to.eql(conditions);
      sinon.assert.calledOnce(mockMedicalConditionRepo.getAllMedicalConditions);
    });
  });
});