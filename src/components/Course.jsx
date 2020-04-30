import React from 'react';

const Header = ({ course }) => {
    return <h1>{course.name}</h1>;
};

const Total = ({ course }) => {
    const sum = course.parts.reduce((acc, curr) => {
        return (acc += curr.exercises);
    }, 0);
    return <h3>Number of exercises {sum}</h3>;
};

const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    );
};

const Content = ({ course }) => {
    return (
        <div>
            {course.parts.map((part) => (
                <Part key={part.id} part={part} />
            ))}
            <Total course={course} />
        </div>
    );
};

const Course = ({ course }) => {
    return (
        <>
            <Header course={course} />
            <Content course={course} />
        </>
    );
};

export default Course;
