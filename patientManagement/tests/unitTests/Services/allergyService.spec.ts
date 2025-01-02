import { Container } from 'typedi';
import AllergyService from '../../../src/Services/AllergyService';
import IAllergyRepo from '../../../src/Services/IRepos/IAllergyRepo';
import { Result } from '../../../src/core/logic/Result';
import { IAllergyDTO } from '../../../src/dto/IAllergyDTO';
import { Allergy } from '../../../src/Domain/allergy/allergy';
import { AllergyMap } from '../../../src/mappers/allergyMapper';
import sinon from 'sinon';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { expect } from 'chai';

describe('AllergyService', () => {
    let allergyService: AllergyService;
    let mockAllergyRepo: sinon.SinonStubbedInstance<IAllergyRepo>;
    let mockLogger: sinon.SinonStubbedInstance<any>;

    beforeEach(() => {
        mockAllergyRepo = {
            save: sinon.stub(),
            findByDomainId: sinon.stub(),
            getAllAllergies: sinon.stub(),
        } as unknown as sinon.SinonStubbedInstance<IAllergyRepo>;

        mockLogger = {
            error: sinon.stub(),
        };

        allergyService = new AllergyService(mockAllergyRepo, mockLogger);
    });

    afterEach(() => {
        sinon.restore();
    });


    describe('createAllergy', () => {
        it('should create and return a new allergy on success', async () => {
            const allergyDTO = { id: '1', name: 'Pollen', description: 'Pollen allergy' };
            sinon.stub(Allergy, 'create').resolves({
                isFailure: false,
                getValue: () => allergyDTO,
            });
            sinon.stub(AllergyMap, 'toDTO').returns(allergyDTO);

            mockAllergyRepo.save.resolves();

            const result = await allergyService.createAllergy(allergyDTO);

            expect(result.isSuccess).to.be.true;
            expect(result.getValue()).to.eql(allergyDTO);
            sinon.assert.calledWith(mockAllergyRepo.save, sinon.match(allergyDTO));
        });

        it('should fail if creating allergy fails', async () => {
            sinon.stub(Allergy, 'create').resolves({
                isFailure: true,
                errorValue: () => 'Invalid data',
            });

            const result = await allergyService.createAllergy({ id: '', name: '', description: '' });

            expect(result.isFailure).to.be.true;
            expect(result.errorValue()).to.equal('Invalid data');
        });


        describe('getAllergy', () => {
            it('should return an allergy by ID', async () => {
                const allergyDTO = { id: '1', name: 'Dust', description: 'Dust allergy' };
                mockAllergyRepo.findByDomainId.resolves(allergyDTO);
                sinon.stub(AllergyMap, 'toDTO').returns(allergyDTO);

                const result = await allergyService.getAllergy('1');

                expect(result.isSuccess).to.be.true;
                expect(result.getValue()).to.eql(allergyDTO);
            });

            it('should return a failure if allergy is not found', async () => {
                mockAllergyRepo.findByDomainId.resolves(null);

                const result = await allergyService.getAllergy('1');

                expect(result.isFailure).to.be.true;
                expect(result.errorValue()).to.equal('Allergy not found');
            });
        });

        describe('updateAllergy', () => {
            it('should update and return the allergy', async () => {
                const allergyDTO: Partial<IAllergyDTO> = { name: 'Updated Allergy' };
                const existingAllergy = { id: '1', name: 'Old Allergy', description: 'Old Description' };

                mockAllergyRepo.findByDomainId.resolves(existingAllergy);
                mockAllergyRepo.save.resolves();
                sinon.stub(AllergyMap, 'toDTO').returns({ ...existingAllergy, ...allergyDTO });

                const result = await allergyService.updateAllergy('1', allergyDTO);

                expect(result.isSuccess).to.be.true; // Fixed: Replaced `toBe(true)` with `.to.be.true`
                expect(result.getValue()).to.eql({ id: '1', ...allergyDTO, description: 'Old Description' }); // Fixed: Replaced `toBe` with `to.eql()`
                sinon.assert.calledWith(mockAllergyRepo.save, sinon.match({ ...existingAllergy, ...allergyDTO }));
            });

            it('should fail if allergy is not found', async () => {
                mockAllergyRepo.findByDomainId.resolves(null);

                const result = await allergyService.updateAllergy('1', { name: 'Nonexistent Allergy' });

                expect(result.isFailure).to.be.true; // Fixed: Replaced `toBe(true)` with `.to.be.true`
                expect(result.errorValue()).to.equal('Allergy not found'); // Fixed: Replaced `toBe` with `to.equal()`
            });

        });

        describe('getAllAllergies', () => {
            it('should return all allergies', async () => {
                const allergies = [
                    { id: '1', name: 'Dust', description: 'Dust allergy' },
                    { id: '2', name: 'Pollen', description: 'Pollen allergy' },
                ];

                mockAllergyRepo.getAllAllergies.resolves(allergies);
                sinon.stub(AllergyMap, 'toDTO').callsFake((allergy) => allergy);

                const result = await allergyService.getAllAllergies();

                expect(result).to.eql(allergies);
                sinon.assert.calledOnce(mockAllergyRepo.getAllAllergies);
            });
        });
    });
});
