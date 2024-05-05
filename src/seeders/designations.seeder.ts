import { DataSource } from 'typeorm';

let designations = [
  {
    title: 'Junior Software Developer',
    level: 'Entry level',
    technology: 'NodeJs',
    specialization: 'Backend',
  },
  {
    title: 'Junior Software Developer',
    level: 'Entry level',
    technology: 'Go',
    specialization: 'Backend',
  },
  {
    title: 'Junior Software Developer',
    level: 'Entry level',
    technology: 'Rust',
    specialization: 'Backend',
  },
  {
    title: 'Junior Software Developer',
    level: 'Entry level',
    technology: 'Python',
    specialization: 'Backend',
  },
  {
    title: 'Junior Software Developer',
    level: 'Entry level',
    technology: 'React',
    specialization: 'Frontend',
  },
  {
    title: 'Junior Software Developer',
    level: 'Entry level',
    technology: 'Angular',
    specialization: 'Frontend',
  },
  {
    title: 'Junior Software Developer',
    level: 'Entry level',
    technology: 'React Native',
    specialization: 'Mobile',
  },
  {
    title: 'Software Developer',
    level: 'Mid level',
    technology: 'NodeJs',
    specialization: 'Backend',
  },
  {
    title: 'Software Developer',
    level: 'Mid level',
    technology: 'Go',
    specialization: 'Backend',
  },
  {
    title: 'Software Developer',
    level: 'Mid level',
    technology: 'Rust',
    specialization: 'Backend',
  },
  {
    title: 'Software Developer',
    level: 'Mid level',
    technology: 'Python',
    specialization: 'Backend',
  },
  {
    title: 'Software Developer',
    level: 'Mid level',
    technology: 'React',
    specialization: 'Frontend',
  },
  {
    title: 'Software Developer',
    level: 'Mid level',
    technology: 'Angular',
    specialization: 'Frontend',
  },
  {
    title: 'Software Developer',
    level: 'Mid level',
    technology: 'React Native',
    specialization: 'Mobile',
  },
  {
    title: 'Senior Software Developer',
    level: 'Senior level',
    technology: 'NodeJs',
    specialization: 'Backend',
  },
  {
    title: 'Senior Software Developer',
    level: 'Senior level',
    technology: 'Go',
    specialization: 'Backend',
  },
  {
    title: 'Senior Software Developer',
    level: 'Senior level',
    technology: 'Rust',
    specialization: 'Backend',
  },
  {
    title: 'Senior Software Developer',
    level: 'Senior level',
    technology: 'Python',
    specialization: 'Backend',
  },
  {
    title: 'Senior Software Developer',
    level: 'Senior level',
    technology: 'React',
    specialization: 'Frontend',
  },
  {
    title: 'Senior Software Developer',
    level: 'Senior level',
    technology: 'Angular',
    specialization: 'Frontend',
  },
  {
    title: 'Senior Software Developer',
    level: 'Senior level',
    technology: 'React Native',
    specialization: 'Mobile',
  },
  {
    title: 'Full Stack Lead',
    level: 'Director',
    technology: '',
    specialization: 'Full Stack',
  },
  {
    title: 'Backend Lead',
    level: 'Director',
    technology: '',
    specialization: 'Backend',
  },
  {
    title: 'Frontend Lead',
    level: 'Director',
    technology: '',
    specialization: 'Frontend',
  },
  {
    title: 'Mobile Lead',
    level: 'Director',
    technology: '',
    specialization: 'Mobile',
  },
  {
    title: 'Data Scientist',
    level: 'Mid level',
    technology: '',
    specialization: 'Data Science',
  },
  {
    title: 'Senior Data Scientist',
    level: 'Senior level',
    technology: '',
    specialization: 'Data Science',
  },
  {
    title: 'Junior Data Scientist',
    level: 'Entry level',
    technology: '',
    specialization: 'Data Science',
  },
  {
    title: 'Junior DevOps',
    level: 'Entry level',
    technology: '',
    specialization: 'DevOps',
  },
  {
    title: 'DevOps',
    level: 'Mid level',
    technology: '',
    specialization: 'DevOps',
  },
  {
    title: 'Senior DevOps',
    level: 'Senior level',
    technology: '',
    specialization: 'DevOps',
  },
  {
    title: 'Junior UI/UX Designer',
    level: 'Entry level',
    technology: '',
    specialization: 'UI/UX',
  },
  {
    title: 'UI/UX Designer',
    level: 'Mid level',
    technology: '',
    specialization: 'UI/UX',
  },
  {
    title: 'Senior UI/UX Designer',
    level: 'Senior level',
    technology: '',
    specialization: 'UI/UX',
  },
  {
    title: 'HR Manager',
    level: 'Director',
    technology: '',
    specialization: 'HR',
  },
  {
    title: 'Recruiter',
    level: 'Associate',
    technology: '',
    specialization: 'Recruitment',
  },
  {
    title: 'SEO Manager',
    level: 'Director',
    technology: '',
    specialization: 'SEO',
  },
  {
    title: 'Content Manager',
    level: 'Director',
    technology: '',
    specialization: 'Content Management',
  },
  {
    title: 'Content Strategist',
    level: 'Director',
    technology: '',
    specialization: 'Content Strategy',
  },
  {
    title: 'Digital Marketing Manager',
    level: 'Director',
    technology: '',
    specialization: 'Digital Marketing',
  },
  {
    title: 'Social Media Marketing Manager',
    level: 'Director',
    technology: '',
    specialization: 'Social Media Marketing',
  },
  { title: 'CEO', level: 'Executive', technology: '', specialization: 'CEO' },
];

const seeder = async (db: DataSource) => {
  const designationsRepository = db.manager.getRepository('designations');
  const existingDesignations = await designationsRepository.find();

  if (existingDesignations.length > 0) {
    designations = designations.filter((designation) =>
      existingDesignations.every(
        (existingDesignation) =>
          !(
            designation.title
              .toLowerCase()
              .includes(existingDesignation.title.toLowerCase()) &&
            designation.level
              .toLowerCase()
              .includes(existingDesignation.level.toLowerCase()) &&
            designation.technology
              .toLowerCase()
              .includes(existingDesignation.technology.toLowerCase()) &&
            designation.specialization
              .toLowerCase()
              .includes(existingDesignation.specialization.toLowerCase())
          ),
      ),
    );
  }

  const designationsToSave = await Promise.all(
    designations.map((designation) =>
      designationsRepository.create({
        title: designation.title,
        level: designation.level,
        technology: designation.technology,
        specialization: designation.specialization,
      }),
    ),
  );

  await designationsRepository.save(designationsToSave);
};

export { seeder };
