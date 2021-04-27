const mongoose = require('mongoose');

if (process.argv.length < 4 && process.argv.length !== 3) {
  console.log('give password, name, and number as arguments');
  process.exit(1);
}

// Schema and model
const personSchema = new mongoose.Schema({ name: String, number: Number });
const Person = mongoose.model('Person', personSchema);

// Creating a connection
const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@fullstack-cluster.iydtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

// Printing the persons in a phonebook
if (process.argv.length === 3) {
  console.log('phonebook: ');
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
  process.exit(1);
}

const name = process.argv[3];
const number = process.argv[4];
const person = new Person({ name, number });

person.save().then((response) => {
  console.log(`added ${name} number ${number}`);
  mongoose.connection.close();
});
