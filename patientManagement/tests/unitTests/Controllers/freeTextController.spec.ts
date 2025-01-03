import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import FreeTextController from '../../../src/controllers/FreeTextController';
import IFreeTextService from '../../../src/Services/IServices/IFreeTextService';
import { Result } from '../../../src/core/logic/Result';
import sinon from 'sinon';
import { beforeEach, describe, it } from "node:test";

describe('FreeTextController', () => {
  let mockFreeTextService: sinon.SinonStubbedInstance<IFreeTextService>;
  let freeTextController: FreeTextController;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let nextFunction: sinon.SinonStub;

  beforeEach(() => {
    mockFreeTextService = {
      createFreeText: sinon.stub(),
      updateFreeText: sinon.stub(),
      getFreeTextsFromMedicalRecord: sinon.stub(),
      getAllFreeTexts: sinon.stub(),
      getFreeText: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<IFreeTextService>;

    Container.set('freeTextService', mockFreeTextService);
    freeTextController = new FreeTextController(mockFreeTextService);

    mockResponse = {
      status: sinon.stub().returnsThis(), // Enables method chaining
      send: sinon.stub(),
      json: sinon.stub(),
    };

    mockRequest = {};
    nextFunction = sinon.stub();
  });

  describe('createFreeText', () => {
    it('should return 201 and the created free text on success', async () => {
      const freeTextDTO = {
        id: '1',
        medicalRecordID: 'MedicalRecord1',
        freeText: 'Chronic condition',
      };
      mockRequest.body = freeTextDTO;
      mockFreeTextService.createFreeText.resolves(Result.ok(freeTextDTO));

      await freeTextController.createFreeText(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, freeTextDTO);
      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 201);
    });

    it('should return 409 and error message on failure', async () => {
      const errorMessage = 'Duplicate record';
      mockRequest.body = { medicalRecordID: '123' };
      mockFreeTextService.createFreeText.resolves(Result.fail(errorMessage));

      await freeTextController.createFreeText(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 409);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, { message: errorMessage });
    });
  });

  describe('updateFreeText', () => {
    it('should return 201 and updated free text on success', async () => {
      const freeTextDTO = {
        id: '1',
        medicalRecordID: 'MedicalRecord1',
        freeText: 'freetext',
      };
      mockRequest.params = { id: '1' };
      mockRequest.body = { freeText: 'Updated freetext' };
      mockFreeTextService.updateFreeText.resolves({
        isSuccess: true,
        getValue: () => freeTextDTO,
      });

      await freeTextController.updateFreeText(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 201);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, freeTextDTO);
    });

    it('should return 404 if free text is not found', async () => {
      const errorMessage = 'Record not found';
      mockRequest.params = { id: '1' };
      mockRequest.body = { freeText: 'Updated details' };
      mockFreeTextService.updateFreeText.resolves(Result.fail(errorMessage));

      await freeTextController.updateFreeText(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 404);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, { message: errorMessage });
    });
  });

  describe('getFreeText', () => {
    it('should return 200 and free text data on success', async () => {
      const freeTextDTO = {
        id: '1',
        medicalRecordID: 'MedicalRecord1',
        freeText: 'freetext',
      };
      mockRequest.params = { id: '1' };
      mockFreeTextService.getFreeText.resolves(Result.ok(freeTextDTO));

      await freeTextController.getFreeText(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, freeTextDTO);
    });

    it('should return 500 if free text is not found', async () => {
      const errorMessage = "Free Text not found";
      mockRequest.params = { id: '1' };
      mockFreeTextService.getFreeText.resolves(Result.fail(errorMessage));

      await freeTextController.getFreeText(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 500);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, {message: errorMessage});
    });
  });

  describe('getAllFreeTexts', () => {
    it('should return 200 and list of free texts', async () => {
      const freeTexts = [
        { id: '1', medicalRecordID: 'MedicalRecord1', freeText: 'FreeText1' },
        { id: '2', medicalRecordID: 'MedicalRecord2', freeText: 'FreeText2' },
      ];
      mockFreeTextService.getAllFreeTexts.resolves(freeTexts);

      await freeTextController.getAllFreeTexts(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, freeTexts);
    });
  });

  describe('getFreeTextsFromMedicalRecord', () => {
    it('should return 200 and the free text from a specific medical record', async () => {
      const freeTexts = [
        { id: '1', medicalRecordID: 'MedicalRecord1', freeText: 'FreeText1' },
        { id: '2', medicalRecordID: 'MedicalRecord1', freeText: 'FreeText2' },
      ];      
      mockRequest.params = { medicalRecordID: 'MedicalRecord1' };
      mockFreeTextService.getFreeTextsFromMedicalRecord.resolves(freeTexts);

      await freeTextController.getFreeTextsFromMedicalRecord(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, freeTexts);
    });

    it('should return 404 if free text from a specific medical record is not found', async () => {
      mockRequest.params = { medicalRecordID: 'MedicalRecord2' };
      mockFreeTextService.getFreeTextsFromMedicalRecord.resolves(null);

      await freeTextController.getFreeTextsFromMedicalRecord(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 404);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, { message: 'Free Texts not found' });
    });
  });
});