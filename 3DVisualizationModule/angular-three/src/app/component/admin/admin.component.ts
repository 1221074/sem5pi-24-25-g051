import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor() { }

  onClickToRegisterUser(): void {
    console.log('Register User button clicked');
    // Adicione a lógica para registrar um usuário
  }

  onClickToInformationSyncBackoffice(): void {
    console.log('Information Sync Backoffice button clicked');
    // Adicione a lógica para sincronizar informações com o backoffice
  }

  onClickToInformationSyncPlanning(): void {
    console.log('Information Sync Planning button clicked');
    // Adicione a lógica para sincronizar informações com o planejamento
  }

  onClickToCreatePatientProfile(): void {
    console.log('Create Patient Profile button clicked');
    // Adicione a lógica para criar um perfil de paciente
  }

  onClickToEditPatientProfile(): void {
    console.log('Edit Patient Profile button clicked');
    // Adicione a lógica para editar um perfil de paciente existente
  }

  onClickToDeletePatientProfile(): void {
    console.log('Delete Patient Profile button clicked');
    // Adicione a lógica para deletar um perfil de paciente
  }

  onClickToListSearchPatients(): void {
    console.log('List/Search Patients button clicked');
    // Adicione a lógica para listar/pesquisar perfis de pacientes
  }

  onClickToCreatStaffProfile(): void {
    console.log('Create Staff Profile button clicked');
    // Adicione a lógica para criar um perfil de funcionário
  }

  onClickToEditStaff(): void {
    console.log('Edit Staff Profile button clicked');
    // Adicione a lógica para editar um perfil de funcionário
  }

  onClickToDeactivateStaff(): void {
    console.log('Deactivate Staff Profile button clicked');
    // Adicione a lógica para desativar um perfil de funcionário
  }

  onClickToListSearchStaff(): void {
    console.log('List/Search Staff Profiles button clicked');
    // Adicione a lógica para listar/pesquisar perfis de funcionários
  }

  onClickToAddOperationType(): void {
    console.log('Add Operation Type button clicked');
    // Adicione a lógica para adicionar tipos de operação
  }

  onClickToEditOperationType(): void {
    console.log('Edit Operation Type button clicked');
    // Adicione a lógica para editar tipos de operação existentes
  }

  onClickToRemoveOperationType(): void {
    console.log('Remove Operation Type button clicked');
    // Adicione a lógica para remover tipos de operação obsoletos
  }

  onClickToListSearchOperationType(): void {
    console.log('List/Search Operation Types button clicked');
    // Adicione a lógica para listar/pesquisar perfis de tipos de operação
  }
}
