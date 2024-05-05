import { DataSource } from 'typeorm';

let performanceReviewTopics = [
  {
    topic: 'Quality of Work',
    description:
      'The overall quality of work produced by the employee, including accuracy, attention to detail, and meeting standards.',
  },
  {
    topic: 'Attendance and Punctuality',
    description:
      'Regular attendance and being punctual for work-related activities, meetings, and deadlines.',
  },
  {
    topic: 'Reliability/Dependability',
    description:
      'The extent to which the employee can be relied upon to consistently perform tasks and fulfill responsibilities.',
  },
  {
    topic: 'Communication/Listening Skills',
    description:
      'Ability to effectively convey information and ideas, as well as actively listen to others.',
  },
  {
    topic: 'Productivity',
    description:
      'The quantity and efficiency of work completed within a given timeframe.',
  },
  {
    topic: 'Work Consistency',
    description:
      'Consistency in performance and output over time, avoiding fluctuations in quality or effort.',
  },
  {
    topic: 'Takes Initiative',
    description:
      'Proactively identifying and addressing tasks or opportunities without needing to be prompted.',
  },
  {
    topic: 'Group Work',
    description:
      'Collaboration and cooperation with team members to achieve common goals.',
  },
  {
    topic: 'Creativity',
    description:
      'Ability to think innovatively and generate new ideas or solutions.',
  },
  {
    topic: 'Honesty',
    description: 'Truthfulness and transparency in communication and actions.',
  },
  {
    topic: 'Integrity',
    description:
      'Adherence to moral and ethical principles, including honesty, fairness, and trustworthiness.',
  },
  {
    topic: 'Coworker Relations',
    description:
      'Interactions and relationships with colleagues, fostering a positive and respectful work environment.',
  },
  {
    topic: 'Client Relations',
    description:
      'Interactions and relationships with clients or customers, ensuring satisfaction and meeting their needs.',
  },
  {
    topic: 'Technical Skills',
    description:
      'Proficiency in specific technical areas relevant to the job role.',
  },
  {
    topic: 'Ability to Accomplish Responsibilities',
    description:
      'Capacity to fulfill assigned duties and responsibilities effectively.',
  },
  {
    topic: 'Goal Achievements',
    description:
      'Success in meeting or exceeding predefined objectives and targets.',
  },
  {
    topic: 'Suggested Areas of Improvement',
    description:
      'Identification of areas where the employee can enhance their performance or skills.',
  },
  {
    topic: 'Additional Comments',
    description:
      'Any other relevant feedback or comments not covered by the above points.',
  },
  {
    topic: 'Adaptability/Flexibility',
    description:
      'Ability to adjust to changing circumstances, priorities, or assignments.',
  },
  {
    topic: 'Leadership/Management Skills',
    description:
      'Capability to lead, motivate, and manage individuals or teams effectively.',
  },
  {
    topic: 'Problem-Solving/Decision Making',
    description:
      'Aptitude for identifying issues, analyzing options, and making sound decisions.',
  },
  {
    topic: 'Time Management/Organization',
    description:
      'Skill in managing time efficiently and organizing tasks effectively.',
  },
  {
    topic: 'Initiative/Proactivity',
    description:
      'Willingness to take proactive steps and show initiative in addressing challenges or opportunities.',
  },
  {
    topic: 'Feedback Receptiveness',
    description:
      'Openness to receiving constructive feedback and willingness to act on it for improvement.',
  },
  {
    topic: 'Resilience/Handling Pressure',
    description:
      'Capacity to handle stress, setbacks, or pressure situations while maintaining composure and performance.',
  },
  {
    topic: 'Professional Development',
    description:
      'Commitment to continuous learning and development to enhance job-related skills and knowledge.',
  },
  {
    topic: 'Empathy/Interpersonal Skills',
    description:
      'Ability to understand and relate to the feelings and perspectives of others, fostering positive relationships.',
  },
  {
    topic: 'Conflict Resolution',
    description:
      'Skill in resolving conflicts or disagreements constructively and diplomatically.',
  },
  {
    topic: 'Team Player',
    description:
      'Demonstrated ability to collaborate effectively with others and contribute to team success.',
  },
  {
    topic: 'Attention to Detail',
    description:
      'Thoroughness and precision in completing tasks with accuracy and attention to detail.',
  },
  {
    topic: 'Innovation/Problem-Solving',
    description:
      'Creativity and ability to generate innovative solutions to challenges or problems.',
  },
  {
    topic: 'Customer Service Orientation',
    description:
      'Focus on meeting the needs and exceeding the expectations of internal or external customers.',
  },
  {
    topic: 'Ethical Behavior',
    description:
      'Adherence to ethical standards and principles in all aspects of work.',
  },
  {
    topic: 'Initiative/Self-Motivation',
    description:
      'Capacity to take initiative and drive tasks or projects forward without constant supervision.',
  },
  {
    topic: 'Conflict Management',
    description:
      'Skill in managing and resolving conflicts or disagreements among team members.',
  },
  {
    topic: 'Risk Management',
    description:
      'Ability to identify potential risks and take appropriate measures to mitigate them.',
  },
  {
    topic: 'Collaboration/Teamwork',
    description:
      "Willingness to work collaboratively with others and contribute to the team's success.",
  },
  {
    topic: 'Adherence to Company Policies/Procedures',
    description:
      'Consistency in following company policies, procedures, and guidelines.',
  },
];

const seeder = async (db: DataSource) => {
  const performanceReviewTopicsRepository = db.manager.getRepository(
    'performance_review_topics',
  );
  const existingPerformanceReviewTopics =
    await performanceReviewTopicsRepository.find();

  if (existingPerformanceReviewTopics.length > 0) {
    performanceReviewTopics = performanceReviewTopics.filter(
      (performanceReviewTopic) =>
        existingPerformanceReviewTopics.every(
          (existingPerformanceReviewTopic) =>
            !performanceReviewTopic.topic
              .toLowerCase()
              .includes(existingPerformanceReviewTopic.topic.toLowerCase()),
        ),
    );
  }

  const performanceReviewTopicsToSave = await Promise.all(
    performanceReviewTopics.map((performanceReviewTopic) =>
      performanceReviewTopicsRepository.create({
        ...performanceReviewTopic,
      }),
    ),
  );

  await performanceReviewTopicsRepository.save(performanceReviewTopicsToSave);
};

export { seeder };
