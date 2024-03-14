/*
    Name: findAvailableSeats
    Input : connection object of the database,category, round, branch
    Output: Number of seats yet to be booked in a particular category.
    Functionality: Finds the number of seats yet to be booked in a particular category. 
*/

async function findAvailableSeats(con, category, round, branch) {
  var availableSeats = 0;
  var availablePWDSeats = [{ SeatsAllocated: 0, seatsTaken: 0 }];

  // Define the table names with the branch prefix
  const mtechapplTable = `${branch}_mtechappl`;
  const applicationstatusTable = `${branch}_applicationstatus`;
  const seatmatrixTable = `${branch}_seatmatrix`;

  /*
    Querying the database to find total number of seats allocated from seat matrix and total number of accepted and retained seats
    from applicationstatus table for a particular category.
    */
  try {
    [availableSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM ${applicationstatusTable} WHERE (accepted='Y' OR accepted='R') AND offercat='${category}') 
        AS SeatsTaken FROM ${seatmatrixTable} WHERE category='${category}';`);

    [availablePWDSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM ${applicationstatusTable} WHERE (accepted='Y' OR accepted='R' OR OfferedRound='${round}') AND offercat='${
      category + "_PWD"
    }') 
        AS SeatsTaken FROM ${seatmatrixTable} WHERE category='${
      category + "_PWD"
    }';`);
  } catch (error) {
    throw error;
  }

  var seatsAvailable =
    availablePWDSeats[0].SeatsAllocated -
    availablePWDSeats[0].SeatsTaken +
    Math.max(
      0,
      availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken
    );
  console.log("Seats available for\t", category, "\tis:\t", seatsAvailable);
  //returning the value(seats allocated - seats booked (accepted+rejected))
  return seatsAvailable;
}

/*
    Name: findAvailableSeatsPWD
    Input : connection object of the database,category, round, branch
    Output: Number of seats yet to be booked in a particular category.
    Functionality: Finds the number of seats yet to be booked in a particular category. 
*/

async function findAvailableSeatsPWD(con, category, round, branch) {
  var availableSeats = 0;

  // Define the table names with the branch prefix
  const applicationstatusTable = `${branch}_applicationstatus`;
  const seatmatrixTable = `${branch}_seatmatrix`;

  /*
    Querying the database to find total number of seats allocated from seat matrix and total number of accepted and retained seats
    from applicationstatus table for a particular category.
    */
  try {
    [availableSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM ${applicationstatusTable} WHERE (accepted='Y' OR accepted='R') AND offercat='${category}') 
        AS SeatsTaken FROM ${seatmatrixTable} WHERE category='${category}';`);
  } catch (error) {
    throw error;
  }

  console.log(
    "Seats available for\t",
    category,
    "\tis:\t",
    Math.max(0, availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken)
  );
  //returning the value(seats allocated - seats booked (accepted+rejected))
  return Math.max(
    0,
    availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken
  );
}

/*
    Name: findAvailableSeatsCommonPWD
    Input : connection object of the database, round, branch
    Output: Number of seats yet to be booked in a particular category.
    Functionality: Finds the number of seats yet to be booked in a particular category. 
*/

async function findAvailableSeatsCommonPWD(con, round, branch) {
  var availableSeats = 0;

  // Define the table names with the branch prefix
  const applicationstatusTable = `${branch}_applicationstatus`;
  const seatmatrixTable = `${branch}_seatmatrix`;

  /*
    Querying the database to find total number of seats allocated from seat matrix and total number of accepted and retained seats
    from applicationstatus table for a particular category.
    */
  try {
    [availableSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM ${applicationstatusTable} WHERE (accepted='Y' OR accepted='R') AND offercat REGEXP 'PWD$')
        AS SeatsTaken FROM ${seatmatrixTable} WHERE category REGEXP 'COMMON_PWD';`);
  } catch (error) {
    throw error;
  }

  console.log(
    "Seats available for\t",
    "common_PWD",
    "\tis:\t",
    Math.max(0, availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken)
  );
  //returning the value(seats allocated - seats booked (accepted+rejected))
  return Math.max(
    0,
    availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken
  );
}

/*
    Name: findAvailableSeatsGeneral
    Input : connection object of the database, category, round, branch
    Output: Number of seats yet to be booked in a particular category.
    Functionality: Finds the number of seats yet to be booked in a particular category. 
*/

async function findAvailableSeatsGeneral(con, category, round, branch) {
  var availableSeats = 0;
  var availablePWDSeats = [{ SeatsAllocated: 0, seatsTaken: 0 }];

  // Define the table names with the branch prefix
  const applicationstatusTable = `${branch}_applicationstatus`;
  const seatmatrixTable = `${branch}_seatmatrix`;

  /*
    Querying the database to find total number of seats allocated from seat matrix and total number of accepted and retained seats
    from applicationstatus table for a particular category.
    */
  try {
    [availableSeats] = await con.query(
      `SELECT SeatsAllocated FROM ${seatmatrixTable} WHERE category='${category}';`
    );

    [availablePWDSeats] = await con.query(`SELECT SeatsAllocated,
        (SELECT COUNT(*) FROM ${applicationstatusTable} WHERE (accepted='Y' OR accepted='R' OR OfferedRound='${round}') AND offercat='${
      category + "_PWD"
    }') 
        AS SeatsTaken FROM ${seatmatrixTable} WHERE category='${
      category + "_PWD"
    }';`);
  } catch (error) {
    throw error;
  }

  var seatsAvailable =
    availablePWDSeats[0].SeatsAllocated -
    availablePWDSeats[0].SeatsTaken +
    Math.max(0, availableSeats[0].SeatsAllocated);
  console.log("Seats available for\t", category, "\tis:\t", seatsAvailable);
  //returning the value(seats allocated - seats booked (accepted+rejected))
  return Math.max(0, seatsAvailable);
}

module.exports = {
  findAvailableSeats,
  findAvailableSeatsPWD,
  findAvailableSeatsCommonPWD,
  findAvailableSeatsGeneral,
};
