import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../interface/user';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users', async () => {
    const mockUsers: User[] = [
      { nif: '123', name: 'User 1', email: 'user1@mail.com', password: 'password1', role: 'admin' },
      { nif: '456', name: 'User 2', email: 'user2@mail.com', password: 'password2', role: 'user' },
    ];

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockUsers)))
    );

    const users = await service.getAllUsers();

    expect(window.fetch).toHaveBeenCalledWith(service['url']);
    expect(users).toEqual(mockUsers);
  });

  it('should fetch a user by ID', async () => {
    const mockUser: User = { nif: '123', name: 'User 1', email: 'user1@mail.com', password: 'password1', role: 'admin' };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify(mockUser)))
    );

    const user = await service.getUserById('123');

    expect(window.fetch).toHaveBeenCalledWith(`${service['url']}/123`);
    expect(user).toEqual(mockUser);
  });

  it('should handle non-existent user by ID', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response('null', { status: 404, headers: { 'Content-Type': 'application/json' } }))
    );

    const user = await service.getUserById('999');

    expect(window.fetch).toHaveBeenCalledWith(`${service['url']}/999`);
    expect(user?.nif).toBeUndefined();
  });

  it('should create a user successfully', async () => {
    const mockUser = { nif: '123', name: 'User 1', email: 'user1@mail.com', password: 'password1', role: 'admin' };

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 }))
    );

    await expectAsync(service.createUser(mockUser)).toBeResolved();
    expect(window.fetch).toHaveBeenCalledWith(service['url'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockUser),
      credentials: 'include',
    });
  });

  it('should handle errors when creating a user', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(new Response(JSON.stringify({ message: 'Error creating user' }), { status: 400 }))
    );

    const mockUser = { nif: '123', name: 'User 1', email: 'user1@mail.com', password: 'password1', role: 'admin' };

    await expectAsync(service.createUser(mockUser)).toBeRejectedWithError('Error creating user');
    expect(window.fetch).toHaveBeenCalledWith(service['url'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockUser),
      credentials: 'include',
    });
  });
});
