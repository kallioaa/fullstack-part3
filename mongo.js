const mongoose = require('mongoose');

if (process.argv.length < 4 && process.argv.length !== 3) {
  console.log('give only password or password, name, and number as arguments');
  process.exit(1);
}

// Creating a connection
const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@fullstack-cluster.iydtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

// Schema and model
const personSchema = new mongoose.Schema({ name: String, number: String });
const Person = mongoose.model('Person', personSchema);

// Printing the persons in a phonebook
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook: ');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({ name, number });

  person.save().then((response) => {
    console.log(response);
  });
}
