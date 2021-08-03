import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    student(id: Int!): Student
    students: [Student]
  }

  type Student @key(fields: "id") {
    id: Int!
    name: String!
    courses: [Course]
  }

  extend type Course @key(fields: "id") {
    id: Int! @external 
  }
`;

const students = {
  1: { name: 'John', courses: [1, 3] },
  2: { name: 'Jane', courses: [1, 3, 5] },
  3: { name: 'Bob', courses: [1, 2] },
  4: { name: 'Sally', courses: [1, 2, 5] },
  5: { name: 'Tim', courses: [1, 3] },
  6: { name: 'Tom', courses: [1, 2, 3] },
  7: { name: 'Sam', courses: [3, 4] },
  8: { name: 'Ben', courses: [3, 4] },
  9: { name: 'Sue', courses: [1, 2, 4] },
  10: { name: 'Ann', courses: [2, 4, 5] },
};

export const resolvers = {
  Student: {
    courses(student) {
      return student.courses.map(id => ({ __typename: 'Course', id }));
    },
    __resolveReference(ref) {
      const student = students[ref.id];
      if (student === undefined) throw new Error(`Student ${ref.id} not found`);
      return { id: ref.id, name: student.name, students: student.courses };
    },
  },

  Query: {
    student: async (_, { id }, context) => {
      const student = students[id];
      if (student === undefined) throw new Error(`Student ${id} not found`);
      return { id, name: student.name, courses: student.courses };
    },
    students: async (_, { }, context) => {
      return Object.entries(students).map((x) => {
        const v = x[1];
        return { id: x[0], name: v.name, courses: v.courses };
      });
    },
  },
};
