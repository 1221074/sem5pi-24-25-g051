import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import MedicalRecordController from '../../../src/controllers/MedicalRecordController';
import IMedicalRecordService from '../../../src/Services/IServices/IMedicalRecordService';
import { Result } from '../../../src/core/logic/Result';
import sinon from 'sinon';
import { beforeEach, describe, it } from "node:test";

describe('MedicalRecordController', () => {
  let mockMedicalRecordService: sinon.SinonStubbedInstance<IMedicalRecordService>;
  let medicalRecordController: MedicalRecordController;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let nextFunction: sinon.SinonStub;

  beforeEach(() => {
    mockMedicalRecordService = {
      createMedicalRecord: sinon.stub(),
      updateMedicalRecord: sinon.stub(),
      getMedicalRecord: sinon.stub(),
      getAllMedicalRecords: sinon.stub(),
      getMedicalRecordByPatientId: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<IMedicalRecordService>;

    Container.set('medicalRecordService', mockMedicalRecordService);
    medicalRecordController = new MedicalRecordController(mockMedicalRecordService);

    mockResponse = {
      status: sinon.stub().returnsThis(), // Enables method chaining
      send: sinon.stub(),
      json: sinon.stub(),
    };

    mockRequest = {};
    nextFunction = sinon.stub();
  });

  describe('createMedicalRecord', () => {
    it('should return 201 and the created medical record on success', async () => {
      const medicalRecordDTO = { id: '1', patientId: '123', details: 'Some details' };
      mockRequest.body = medicalRecordDTO;
      mockMedicalRecordService.createMedicalRecord.resolves(Result.ok(medicalRecordDTO));

      await medicalRecordController.createMedicalRecord(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 201);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, medicalRecordDTO);
    });

    it('should return 409 and error message on failure', async () => {
      const errorMessage = 'Duplicate record';
      mockRequest.body = { patientId: '123' };
      mockMedicalRecordService.createMedicalRecord.resolves(Result.fail(errorMessage));

      await medicalRecordController.createMedicalRecord(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 409);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, { message: errorMessage });
    });
  });

  describe('updateMedicalRecord', () => {
    it('should return 201 and updated medical record on success', async () => {
      const medicalRecordDTO = { id: '1', details: 'Updated details' };
      mockRequest.params = { id: '1' };
      mockRequest.body = { details: 'Updated details' };
      mockMedicalRecordService.updateMedicalRecord.resolves(Result.ok(medicalRecordDTO));

      await medicalRecordController.updateMedicalRecord(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 201);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, medicalRecordDTO);
    });

    it('should return 404 if medical record is not found', async () => {
      const errorMessage = 'Record not found';
      mockRequest.params = { id: '1' };
      mockRequest.body = { details: 'Updated details' };
      mockMedicalRecordService.updateMedicalRecord.resolves(Result.fail(errorMessage));

      await medicalRecordController.updateMedicalRecord(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 404);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, { message: errorMessage });
    });
  });

  describe('getMedicalRecord', () => {
    it('should return 200 and medical record data on success', async () => {
      const medicalRecordDTO = { id: '1', details: 'Some details' };
      mockRequest.params = { id: '1' };
      mockMedicalRecordService.getMedicalRecord.resolves(Result.ok(medicalRecordDTO));

      await medicalRecordController.getMedicalRecord(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, medicalRecordDTO);
    });

    it('should return 500 if medical record is not found', async () => {
      const errorMessage = 'Record not found';
      mockRequest.params = { id: '1' };
      mockMedicalRecordService.getMedicalRecord.resolves(Result.fail(errorMessage));

      await medicalRecordController.getMedicalRecord(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 500);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, 'Medical Record not found: ' + errorMessage);
    });
  });

  describe('getAllMedicalRecords', () => {
    it('should return 200 and list of medical records', async () => {
      const records = [{ id: '1', details: 'Details 1' }, { id: '2', details: 'Details 2' }];
      mockMedicalRecordService.getAllMedicalRecords.resolves(records);

      await medicalRecordController.getAllMedicalRecords(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, records);
    });
  });

  describe('getMedicalRecordByPatientId', () => {
    it('should return 200 and the medical record for a patient', async () => {
      const record = { id: '1', patientId: '123', details: 'Details for patient' };
      mockRequest.params = { patientId: '123' };
      mockMedicalRecordService.getMedicalRecordByPatientId.resolves(record);

      await medicalRecordController.getMedicalRecordByPatientId(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, record);
    });

    it('should return 404 if medical record for patient is not found', async () => {
      mockRequest.params = { patientId: '123' };
      mockMedicalRecordService.getMedicalRecordByPatientId.resolves(null);

      await medicalRecordController.getMedicalRecordByPatientId(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 404);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, { message: 'Medical Record not found' });
    });
  });
});
