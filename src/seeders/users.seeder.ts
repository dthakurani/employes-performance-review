import { DataSource } from 'typeorm';
import { Designation } from '../modules/designations/designations.interface';
import { User } from '../modules/users/user.interface';
import { Role } from '../modules/users/users.enum';
import * as bcrypt from 'bcrypt';

let users = [
  {
    name: 'John Doe',
    email: 'john.doe@mailinator.com',
    phone: '123-456-7890',
    dob: '1990-01-01',
    dateOfJoining: '2020-01-01',
    address: '123 Main St, City, Country',
    role: Role.ADMIN,
    designation: 'CEO',
  },
];

const seeder = async (db: DataSource) => {
  const usersRepository = db.manager.getRepository('users');
  const designationsRepository = db.manager.getRepository('designations');
  const existingUsers = await usersRepository.find();
  const designations = await designationsRepository.find();

  if (existingUsers.length > 0) {
    users = users.filter((user) =>
      existingUsers.every(
        (existingUser: User) =>
          !(
            user.email
              .toLowerCase()
              .includes(existingUser.email.toLowerCase()) ||
            user.phone.toLowerCase().includes(existingUser.phone.toLowerCase())
          ),
      ),
    );
  }

  const hashedPassword = await bcrypt.hash('John@123', 10);

  const usersToSave = await Promise.all(
    users.map(async (user) => {
      const { designation, ...userWithoutDesignation } = user;

      const userDesignation = designations.find(
        (designation: Designation) =>
          designation.title.toLowerCase() === user.designation.toLowerCase(),
      );

      if (userDesignation) {
        return usersRepository.create({
          ...userWithoutDesignation,
          designationId: userDesignation.id,
          password: hashedPassword,
        });
      }
    }),
  );

  await usersRepository.save(usersToSave);
};

export { seeder };
