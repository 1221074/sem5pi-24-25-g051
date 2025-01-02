import { expect } from 'chai';
import sinon from 'sinon';
import MedicalRecordService from '../../../src/Services/MedicalRecordService';
import IMedicalRecordRepo from '../../../src/Services/IRepos/IMedicalRecordRepo';
import { Result } from '../../../src/core/logic/Result';
import { MedicalRecordMap } from '../../../src/mappers/medicalrecordMapper';
import { MedicalRecord } from '../../../src/Domain/medicalrecord/medicalrecord';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { IMedicalRecordDTO } from '../../../src/dto/IMedicalRecordDTO';

describe('MedicalRecordService', () => {
  let medicalRecordService: MedicalRecordService;
  let mockMedicalRecordRepo: sinon.SinonStubbedInstance<IMedicalRecordRepo>;
  let mockLogger: sinon.SinonStubbedInstance<any>;

  beforeEach(() => {
    mockMedicalRecordRepo = {
      save: sinon.stub(),
      findByPatientId: sinon.stub(),
      getAllMedicalRecords: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<IMedicalRecordRepo>;

    mockLogger = {
      error: sinon.stub(),
    };

    medicalRecordService = new MedicalRecordService(mockMedicalRecordRepo, mockLogger);
  });

  afterEach(() => {
    sinon.restore(); // Restore stubs after each test
  });

  describe('createMedicalRecord', () => {
    it('should create and return a new medical record on success', async () => {
        const medicalRecordDTO = {
          id: '1',
          patientId: 'patient1',
          allergies: ['Dust'],
          medicalConditions: ['Asthma'],
          freeText: 'Chronic condition',
        };
      
        sinon.stub(MedicalRecord, 'create').resolves({
          isFailure: false,
          getValue: () => medicalRecordDTO,
        });
      
        sinon.stub(MedicalRecordMap, 'toDTO').returns(medicalRecordDTO);
      
        mockMedicalRecordRepo.save.resolves();
      
        const result = await medicalRecordService.createMedicalRecord(medicalRecordDTO);
      
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.eql(medicalRecordDTO);
        sinon.assert.calledWith(mockMedicalRecordRepo.save, sinon.match(medicalRecordDTO));
      });

      it('should fail if creating medical record fails', async () => {
        const invalidMedicalRecordDTO = {
          id: '',
          patientId: '',
          allergies: [],
          medicalConditions: [],
          freeText: '',
        }; // Replace 'diagnosis' with the correct properties from IMedicalRecordDTO
      
        sinon.stub(MedicalRecord, 'create').resolves({
          isFailure: true,
          errorValue: () => 'Invalid data',
        });
      
        const result = await medicalRecordService.createMedicalRecord(invalidMedicalRecordDTO);
      
        expect(result.isFailure).to.be.true;
        expect(result.errorValue()).to.equal('Invalid data');
      });
      
  });

  describe('getMedicalRecord', () => {
    it('should return a medical record by ID', async () => {
      const medicalRecordDTO = { id: '1', patientId: '123', diagnosis: 'Hypertension' };
      mockMedicalRecordRepo.findByPatientId.resolves(medicalRecordDTO);
      sinon.stub(MedicalRecordMap, 'toDTO').returns(medicalRecordDTO);

      const result = await medicalRecordService.getMedicalRecord('1');

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql(medicalRecordDTO);
    });

    it('should return a failure if medical record is not found', async () => {
      mockMedicalRecordRepo.findByPatientId.resolves(null);

      const result = await medicalRecordService.getMedicalRecord('1');

      expect(result.isFailure).to.be.true;
      expect(result.errorValue()).to.equal('Medical record not found');
    });
  });

  describe('updateMedicalRecord', () => {
    it('should update and return the medical record', async () => {
        const medicalRecordDTO: Partial<IMedicalRecordDTO> = { freeText: 'Updated free text' };
        const existingRecord = {
          id: '1',
          patientId: 'patient1',
          allergies: ['Dust'],
          medicalConditions: ['Asthma'],
          freeText: 'Old free text',
        };
      
        mockMedicalRecordRepo.findByPatientId.resolves(existingRecord);
        mockMedicalRecordRepo.save.resolves();
        sinon.stub(MedicalRecordMap, 'toDTO').returns({ ...existingRecord, ...medicalRecordDTO });
      
        const result = await medicalRecordService.updateMedicalRecord('1', medicalRecordDTO);
      
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.eql({ id: '1', ...medicalRecordDTO, patientId: 'patient1', allergies: ['Dust'], medicalConditions: ['Asthma'] });
        sinon.assert.calledWith(mockMedicalRecordRepo.save, sinon.match({ ...existingRecord, ...medicalRecordDTO }));
      });
      
      

      it('should fail if creating medical record fails', async () => {
        sinon.stub(MedicalRecord, 'create').resolves({
          isFailure: true,
          errorValue: () => 'Invalid data',
        });
      
        const result = await medicalRecordService.createMedicalRecord({
          id: '',
          patientId: '',
          allergies: [],
          medicalConditions: [],
          freeText: '',
        });
      
        expect(result.isFailure).to.be.true;
        expect(result.errorValue()).to.equal('Invalid data');
      });
      
  });

  describe('getAllMedicalRecords', () => {
    it('should return all medical records', async () => {
      const records = [
        { id: '1', patientId: '123', diagnosis: 'Asthma' },
        { id: '2', patientId: '456', diagnosis: 'Diabetes' },
      ];

      mockMedicalRecordRepo.getAllMedicalRecords.resolves(records);
      sinon.stub(MedicalRecordMap, 'toDTO').callsFake((record) => record);

      const result = await medicalRecordService.getAllMedicalRecords();

      expect(result).to.eql(records);
      sinon.assert.calledOnce(mockMedicalRecordRepo.getAllMedicalRecords);
    });

    it('should throw an error if fetching medical records fails', async () => {
      const error = new Error('Database error');
      mockMedicalRecordRepo.getAllMedicalRecords.rejects(error);

      try {
        await medicalRecordService.getAllMedicalRecords();
        throw new Error('Expected method to throw.');
      } catch (err) {
        expect(err.message).to.equal('Error fetching medical records: Database error');
      }
    });
  });

  describe('getMedicalRecordByPatientId', () => {
    it('should return a medical record by patient ID', async () => {
      const medicalRecordDTO = { id: '1', patientId: '123', diagnosis: 'Chronic Condition' };
      mockMedicalRecordRepo.findByPatientId.resolves(medicalRecordDTO);
      sinon.stub(MedicalRecordMap, 'toDTO').returns(medicalRecordDTO);

      const result = await medicalRecordService.getMedicalRecordByPatientId('123');

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.eql(medicalRecordDTO);
    });

    it('should return a failure if medical record is not found for patient ID', async () => {
      mockMedicalRecordRepo.findByPatientId.resolves(null);

      const result = await medicalRecordService.getMedicalRecordByPatientId('123');

      expect(result.isFailure).to.be.true;
      expect(result.errorValue()).to.equal('Medical Record not found for the patient id given.');
    });
  });
});
